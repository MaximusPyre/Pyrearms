//! Ephemeral P2P rooms: public boards, E2E chatrooms, E2E DMs.
//!
//! Join via pasteable invite (room hash + bootstrap endpoint [+ key]).
//! History is in-memory only — gone when the room hub goes offline.

use std::{
    collections::{HashMap, VecDeque},
    sync::{Arc, Mutex},
};

use anyhow::{bail, Context, Result};
use base64::Engine;
use chacha20poly1305::{
    aead::{Aead, KeyInit},
    XChaCha20Poly1305, XNonce,
};
use iroh::{
    Endpoint, EndpointId,
    endpoint::{Connection, presets},
    protocol::{AcceptError, ProtocolHandler},
};
use rand::RngCore;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tauri::{AppHandle, Emitter};
use tracing::{info, warn};

pub const ROOM_ALPN: &[u8] = b"pyrelink/room/1";
const BACKLOG: usize = 80;
const MAX_TEXT: usize = 4000;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum RoomKind {
    Board,
    Chat,
    Dm,
}

impl RoomKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Board => "board",
            Self::Chat => "chat",
            Self::Dm => "dm",
        }
    }

    pub fn parse(s: &str) -> Result<Self> {
        match s.trim().to_lowercase().as_str() {
            "board" => Ok(Self::Board),
            "chat" => Ok(Self::Chat),
            "dm" => Ok(Self::Dm),
            _ => bail!("kind must be board|chat|dm"),
        }
    }

    pub fn e2e(self) -> bool {
        matches!(self, Self::Chat | Self::Dm)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoomInvite {
    pub kind: RoomKind,
    pub room_id: String,
    pub endpoint: String,
    /// E2E key material (chat/dm). Absent for public boards.
    pub key_b64: Option<String>,
    pub label: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RoomSummary {
    pub room_id: String,
    pub kind: RoomKind,
    pub label: String,
    pub role: String,
    pub endpoint: String,
    pub invite: String,
    pub e2e: bool,
    pub peer_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub room_id: String,
    pub from_nick: String,
    pub from_endpoint: String,
    pub text: String,
    pub ts: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "op", rename_all = "snake_case")]
enum WireIn {
    Join {
        room: String,
        nick: String,
    },
    Send {
        room: String,
        nick: String,
        ts: u64,
        /// Plaintext for boards; ciphertext b64 for E2E rooms.
        body: String,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        nonce: Option<String>,
    },
    Leave {
        room: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "op", rename_all = "snake_case")]
enum WireOut {
    JoinOk {
        room: String,
        kind: String,
        label: String,
        backlog: Vec<WireMsg>,
    },
    Push {
        msg: WireMsg,
    },
    Peer {
        room: String,
        nick: String,
        endpoint: String,
        event: String,
    },
    Err {
        error: String,
    },
    Ack {
        ok: bool,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct WireMsg {
    room: String,
    nick: String,
    endpoint: String,
    ts: u64,
    body: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    nonce: Option<String>,
    /// true when body is ciphertext
    #[serde(default)]
    e2e: bool,
}

fn b64_encode(bytes: &[u8]) -> String {
    base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(bytes)
}

fn b64_decode(s: &str) -> Result<Vec<u8>> {
    base64::engine::general_purpose::URL_SAFE_NO_PAD
        .decode(s.trim())
        .context("base64")
}

fn room_id_from_key(key: &[u8; 32]) -> String {
    let mut h = Sha256::new();
    h.update(b"pyrelink-room-v1:");
    h.update(key);
    hex::encode(h.finalize())
}

fn random_key() -> [u8; 32] {
    let mut key = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut key);
    key
}

fn random_board_id() -> String {
    let mut raw = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut raw);
    let mut h = Sha256::new();
    h.update(b"pyrelink-board-v1:");
    h.update(raw);
    hex::encode(h.finalize())
}

fn encrypt(key: &[u8; 32], plaintext: &str) -> Result<(String, String)> {
    let cipher = XChaCha20Poly1305::new(key.into());
    let mut nonce_bytes = [0u8; 24];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    let nonce = XNonce::from_slice(&nonce_bytes);
    let ct = cipher
        .encrypt(nonce, plaintext.as_bytes())
        .map_err(|e| anyhow::anyhow!("encrypt: {e}"))?;
    Ok((b64_encode(&ct), b64_encode(&nonce_bytes)))
}

fn decrypt(key: &[u8; 32], nonce_b64: &str, body_b64: &str) -> Result<String> {
    let cipher = XChaCha20Poly1305::new(key.into());
    let nonce_bytes = b64_decode(nonce_b64)?;
    if nonce_bytes.len() != 24 {
        bail!("bad nonce");
    }
    let nonce = XNonce::from_slice(&nonce_bytes);
    let ct = b64_decode(body_b64)?;
    let pt = cipher
        .decrypt(nonce, ct.as_ref())
        .map_err(|_| anyhow::anyhow!("decrypt failed — wrong key or corrupt message"))?;
    String::from_utf8(pt).context("utf8")
}

fn now_ts() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

pub fn encode_invite(inv: &RoomInvite) -> String {
    let kind = inv.kind.as_str();
    let ep = inv.endpoint.trim();
    let id = inv.room_id.trim();
    match inv.kind {
        RoomKind::Board => {
            let label = inv
                .label
                .as_deref()
                .unwrap_or("board")
                .replace(':', "_");
            format!("pyrelink:room:1:{kind}:{id}:{ep}:{label}")
        }
        RoomKind::Chat | RoomKind::Dm => {
            let key = inv.key_b64.as_deref().unwrap_or("");
            format!("pyrelink:room:1:{kind}:{id}:{ep}:{key}")
        }
    }
}

pub fn parse_invite(raw: &str) -> Result<RoomInvite> {
    let trimmed = raw.trim().trim_matches(|c: char| {
        matches!(c, '"' | '\'' | '`' | ',' | ';' | '(' | ')' | '[' | ']')
    });
    if trimmed.starts_with("pyrelink:1:") && !trimmed.starts_with("pyrelink:room:") {
        bail!("that’s a file/project share code — open Get and paste it there");
    }
    let s = if let Some(idx) = trimmed.find("pyrelink:room:1:") {
        let line = trimmed[idx..]
            .split(['\n', '\r', '<', '>'])
            .next()
            .unwrap_or(&trimmed[idx..]);
        line.trim_matches(|c: char| matches!(c, '"' | '\'' | '`' | ',' | ';' | '(' | ')'))
            .to_string()
    } else {
        trimmed.to_string()
    };
    let Some(rest) = s.strip_prefix("pyrelink:room:1:") else {
        bail!("not a room invite — expected pyrelink:room:1:…");
    };
    let parts: Vec<&str> = rest.splitn(4, ':').collect();
    if parts.len() < 3 {
        bail!("invite needs kind, room id, endpoint");
    }
    let kind = RoomKind::parse(parts[0])?;
    let room_id = parts[1].trim().to_lowercase();
    let endpoint = parts[2].trim().to_string();
    let tail = parts.get(3).map(|t| t.trim().to_string()).filter(|t| !t.is_empty());
    if room_id.len() < 16 || endpoint.len() < 32 {
        bail!("invalid invite fields");
    }
    match kind {
        RoomKind::Board => Ok(RoomInvite {
            kind,
            room_id,
            endpoint,
            key_b64: None,
            label: tail,
        }),
        RoomKind::Chat | RoomKind::Dm => {
            let key_b64 = tail.context("E2E invite missing key")?;
            let key_bytes = b64_decode(&key_b64)?;
            if key_bytes.len() != 32 {
                bail!("E2E key must be 32 bytes");
            }
            let mut key = [0u8; 32];
            key.copy_from_slice(&key_bytes);
            let expect = room_id_from_key(&key);
            if expect != room_id && !expect.starts_with(&room_id) && !room_id.starts_with(&expect) {
                // Strict equality preferred.
                if expect != room_id {
                    bail!("room id does not match key (tampered invite?)");
                }
            }
            Ok(RoomInvite {
                kind,
                room_id: expect,
                endpoint,
                key_b64: Some(key_b64),
                label: Some(kind.as_str().into()),
            })
        }
    }
}

fn io_err(e: impl ToString) -> std::io::Error {
    std::io::Error::other(e.to_string())
}

async fn write_json(send: &mut iroh::endpoint::SendStream, v: &impl Serialize) -> Result<()> {
    let line = serde_json::to_string(v)? + "\n";
    send.write_all(line.as_bytes()).await?;
    send.finish()?;
    Ok(())
}

async fn read_json_line(recv: &mut iroh::endpoint::RecvStream) -> Result<String> {
    let mut buf = Vec::new();
    let mut tmp = [0u8; 1];
    loop {
        let n = recv.read(&mut tmp).await?.unwrap_or(0);
        if n == 0 {
            bail!("closed");
        }
        buf.push(tmp[0]);
        if tmp[0] == b'\n' {
            break;
        }
        if buf.len() > 256 * 1024 {
            bail!("line too large");
        }
    }
    Ok(String::from_utf8_lossy(&buf).trim().to_string())
}

#[derive(Clone)]
struct Peer {
    nick: String,
    endpoint: String,
    conn: Connection,
}

struct HostedRoom {
    kind: RoomKind,
    label: String,
    key: Option<[u8; 32]>,
    host_nick: String,
    backlog: VecDeque<WireMsg>,
    peers: Vec<Peer>,
}

struct RemoteSession {
    invite: RoomInvite,
    key: Option<[u8; 32]>,
    nick: String,
    conn: Connection,
    endpoint: Endpoint,
}

pub struct RoomHub {
    app: Mutex<Option<AppHandle>>,
    hosted: Mutex<HashMap<String, HostedRoom>>,
    remote: Mutex<HashMap<String, RemoteSession>>,
}

impl std::fmt::Debug for RoomHub {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("RoomHub")
            .field("hosted", &self.hosted.lock().map(|h| h.len()).unwrap_or(0))
            .field("remote", &self.remote.lock().map(|r| r.len()).unwrap_or(0))
            .finish()
    }
}

#[derive(Clone)]
pub struct SharedRooms(pub Arc<RoomHub>);

impl RoomHub {
    pub fn new() -> Self {
        Self {
            app: Mutex::new(None),
            hosted: Mutex::new(HashMap::new()),
            remote: Mutex::new(HashMap::new()),
        }
    }

    pub fn set_app(&self, app: AppHandle) {
        *self.app.lock().unwrap() = Some(app);
    }

    fn emit_message(&self, msg: &ChatMessage) {
        crate::cache::maybe_append(msg);
        if let Some(app) = self.app.lock().unwrap().as_ref() {
            let _ = app.emit("room-message", msg);
        }
    }

    fn emit_meta(&self, event: &str, payload: serde_json::Value) {
        if let Some(app) = self.app.lock().unwrap().as_ref() {
            let _ = app.emit(event, payload);
        }
    }

    pub fn list(&self, our_endpoint: &str) -> Vec<RoomSummary> {
        let mut out = Vec::new();
        {
            let hosted = self.hosted.lock().unwrap();
            for (id, room) in hosted.iter() {
                let inv = RoomInvite {
                    kind: room.kind,
                    room_id: id.clone(),
                    endpoint: our_endpoint.to_string(),
                    key_b64: room.key.map(|k| b64_encode(&k)),
                    label: Some(room.label.clone()),
                };
                out.push(RoomSummary {
                    room_id: id.clone(),
                    kind: room.kind,
                    label: room.label.clone(),
                    role: "host".into(),
                    endpoint: our_endpoint.to_string(),
                    invite: encode_invite(&inv),
                    e2e: room.kind.e2e(),
                    peer_count: room.peers.len() + 1,
                });
            }
        }
        {
            let remote = self.remote.lock().unwrap();
            for (id, sess) in remote.iter() {
                out.push(RoomSummary {
                    room_id: id.clone(),
                    kind: sess.invite.kind,
                    label: sess
                        .invite
                        .label
                        .clone()
                        .unwrap_or_else(|| sess.invite.kind.as_str().into()),
                    role: "peer".into(),
                    endpoint: sess.invite.endpoint.clone(),
                    invite: encode_invite(&sess.invite),
                    e2e: sess.invite.kind.e2e(),
                    peer_count: 0,
                });
            }
        }
        out.sort_by(|a, b| a.label.cmp(&b.label));
        out
    }

    pub fn create_hosted(
        &self,
        kind: RoomKind,
        label: &str,
        nick: &str,
        our_endpoint: &str,
    ) -> Result<RoomSummary> {
        let nick = sanitize_nick(nick);
        let label = {
            let t = label.trim();
            if t.is_empty() {
                kind.as_str().to_string()
            } else {
                t.chars().take(64).collect()
            }
        };

        let (room_id, key) = if kind.e2e() {
            let key = random_key();
            (room_id_from_key(&key), Some(key))
        } else {
            (random_board_id(), None)
        };

        {
            let mut hosted = self.hosted.lock().unwrap();
            if hosted.contains_key(&room_id) {
                bail!("room already exists");
            }
            hosted.insert(
                room_id.clone(),
                HostedRoom {
                    kind,
                    label: label.clone(),
                    key,
                    host_nick: nick,
                    backlog: VecDeque::new(),
                    peers: Vec::new(),
                },
            );
        }

        let inv = RoomInvite {
            kind,
            room_id: room_id.clone(),
            endpoint: our_endpoint.to_string(),
            key_b64: key.map(|k| b64_encode(&k)),
            label: Some(label.clone()),
        };
        let summary = RoomSummary {
            room_id,
            kind,
            label,
            role: "host".into(),
            endpoint: our_endpoint.to_string(),
            invite: encode_invite(&inv),
            e2e: kind.e2e(),
            peer_count: 1,
        };
        self.emit_meta(
            "room-updated",
            serde_json::json!({ "room_id": summary.room_id }),
        );
        Ok(summary)
    }

    pub fn invite_for(&self, room_id: &str, our_endpoint: &str) -> Result<String> {
        if let Some(room) = self.hosted.lock().unwrap().get(room_id) {
            let inv = RoomInvite {
                kind: room.kind,
                room_id: room_id.to_string(),
                endpoint: our_endpoint.to_string(),
                key_b64: room.key.map(|k| b64_encode(&k)),
                label: Some(room.label.clone()),
            };
            return Ok(encode_invite(&inv));
        }
        if let Some(sess) = self.remote.lock().unwrap().get(room_id) {
            return Ok(encode_invite(&sess.invite));
        }
        bail!("room not found");
    }

    pub fn close_room(&self, room_id: &str) {
        self.hosted.lock().unwrap().remove(room_id);
        if let Some(sess) = self.remote.lock().unwrap().remove(room_id) {
            sess.conn.close(0u32.into(), b"leave");
            // endpoint closed by dropping / best-effort
            let _ = sess;
        }
        self.emit_meta("room-closed", serde_json::json!({ "room_id": room_id }));
    }

    pub fn clear_all(&self) {
        let ids: Vec<String> = {
            let mut ids = Vec::new();
            ids.extend(self.hosted.lock().unwrap().keys().cloned());
            ids.extend(self.remote.lock().unwrap().keys().cloned());
            ids
        };
        for id in ids {
            self.close_room(&id);
        }
    }

    fn decode_wire(&self, room_id: &str, wire: &WireMsg) -> Result<ChatMessage> {
        let key = {
            let hosted = self.hosted.lock().unwrap();
            if let Some(r) = hosted.get(room_id) {
                r.key
            } else {
                drop(hosted);
                self.remote
                    .lock()
                    .unwrap()
                    .get(room_id)
                    .and_then(|s| s.key)
            }
        };
        let text = if wire.e2e {
            let key = key.context("missing E2E key")?;
            let nonce = wire.nonce.as_deref().context("missing nonce")?;
            decrypt(&key, nonce, &wire.body)?
        } else {
            wire.body.clone()
        };
        Ok(ChatMessage {
            room_id: room_id.to_string(),
            from_nick: wire.nick.clone(),
            from_endpoint: wire.endpoint.clone(),
            text,
            ts: wire.ts,
        })
    }

    fn push_backlog(room: &mut HostedRoom, wire: WireMsg) {
        room.backlog.push_back(wire);
        while room.backlog.len() > BACKLOG {
            room.backlog.pop_front();
        }
    }

    async fn broadcast(peers: &[Peer], wire: &WireMsg) {
        let payload = WireOut::Push { msg: wire.clone() };
        for peer in peers {
            if let Ok((mut send, _recv)) = peer.conn.open_bi().await {
                let _ = write_json(&mut send, &payload).await;
            }
        }
    }

    pub async fn send_message(
        &self,
        room_id: &str,
        text: &str,
        from_endpoint: &str,
        nick: &str,
    ) -> Result<ChatMessage> {
        let text = text.trim();
        if text.is_empty() {
            bail!("empty message");
        }
        if text.len() > MAX_TEXT {
            bail!("message too long");
        }
        let nick = sanitize_nick(nick);
        let ts = now_ts();

        // Hosted?
        let hosted_wire = {
            let mut hosted = self.hosted.lock().unwrap();
            if let Some(room) = hosted.get_mut(room_id) {
                let (body, nonce, e2e) = if let Some(key) = room.key {
                    let (ct, n) = encrypt(&key, text)?;
                    (ct, Some(n), true)
                } else {
                    (text.to_string(), None, false)
                };
                let wire = WireMsg {
                    room: room_id.to_string(),
                    nick: nick.clone(),
                    endpoint: from_endpoint.to_string(),
                    ts,
                    body,
                    nonce,
                    e2e,
                };
                Self::push_backlog(room, wire.clone());
                let peers = room.peers.clone();
                Some((wire, peers))
            } else {
                None
            }
        };

        if let Some((wire, peers)) = hosted_wire {
            Self::broadcast(&peers, &wire).await;
            let msg = self.decode_wire(room_id, &wire)?;
            self.emit_message(&msg);
            return Ok(msg);
        }

        // Remote peer send
        let (conn, key, kind) = {
            let remote = self.remote.lock().unwrap();
            let sess = remote.get(room_id).context("not in that room")?;
            (sess.conn.clone(), sess.key, sess.invite.kind)
        };
        let (body, nonce, e2e) = if kind.e2e() {
            let key = key.context("missing key")?;
            let (ct, n) = encrypt(&key, text)?;
            (ct, Some(n), true)
        } else {
            (text.to_string(), None, false)
        };
        let req = WireIn::Send {
            room: room_id.to_string(),
            nick: nick.clone(),
            ts,
            body: body.clone(),
            nonce: nonce.clone(),
        };
        let (mut send, mut recv) = conn.open_bi().await.context("open send stream")?;
        write_json(&mut send, &req).await?;
        let line = read_json_line(&mut recv).await?;
        let resp: WireOut = serde_json::from_str(&line).context("parse ack")?;
        match resp {
            WireOut::Ack { ok } if ok => {}
            WireOut::Err { error } => bail!(error),
            _ => bail!("unexpected ack"),
        }
        let wire = WireMsg {
            room: room_id.to_string(),
            nick,
            endpoint: from_endpoint.to_string(),
            ts,
            body,
            nonce,
            e2e,
        };
        let msg = self.decode_wire(room_id, &wire)?;
        self.emit_message(&msg);
        Ok(msg)
    }
}

fn sanitize_nick(nick: &str) -> String {
    let t = nick.trim();
    if t.is_empty() {
        return "anon".into();
    }
    t.chars()
        .filter(|c| !c.is_control())
        .take(24)
        .collect()
}

/// Handler mounted on the host Router for room ALPN.
#[derive(Clone, Debug)]
pub struct RoomHandler {
    pub rooms: Arc<RoomHub>,
}

impl ProtocolHandler for RoomHandler {
    async fn accept(&self, connection: Connection) -> Result<(), AcceptError> {
        let remote = connection.remote_id().to_string();
        info!("room peer connected: {remote}");
        let mut joined_room: Option<String> = None;

        loop {
            let (mut send, mut recv) = match connection.accept_bi().await {
                Ok(s) => s,
                Err(_) => break,
            };
            let line = match read_json_line(&mut recv).await {
                Ok(l) => l,
                Err(_) => {
                    let _ = write_json(
                        &mut send,
                        &WireOut::Err {
                            error: "bad request".into(),
                        },
                    )
                    .await;
                    continue;
                }
            };
            let req: WireIn = match serde_json::from_str(&line) {
                Ok(r) => r,
                Err(_) => {
                    let _ = write_json(
                        &mut send,
                        &WireOut::Err {
                            error: "bad json".into(),
                        },
                    )
                    .await;
                    continue;
                }
            };

            match req {
                WireIn::Join { room, nick } => {
                    let nick = sanitize_nick(&nick);
                    let result = {
                        let mut hosted = self.rooms.hosted.lock().unwrap();
                        match hosted.get_mut(&room) {
                            Some(r) => {
                                r.peers.retain(|p| p.endpoint != remote);
                                r.peers.push(Peer {
                                    nick: nick.clone(),
                                    endpoint: remote.clone(),
                                    conn: connection.clone(),
                                });
                                let backlog: Vec<WireMsg> = r.backlog.iter().cloned().collect();
                                Ok((r.kind.as_str().to_string(), r.label.clone(), backlog))
                            }
                            None => Err("room not hosted here".to_string()),
                        }
                    };
                    match result {
                        Ok((kind, label, backlog)) => {
                            joined_room = Some(room.clone());
                            let _ = write_json(
                                &mut send,
                                &WireOut::JoinOk {
                                    room: room.clone(),
                                    kind,
                                    label,
                                    backlog,
                                },
                            )
                            .await;
                            self.rooms.emit_meta(
                                "room-peer",
                                serde_json::json!({
                                    "room_id": room,
                                    "nick": nick,
                                    "endpoint": remote,
                                    "event": "join"
                                }),
                            );
                        }
                        Err(error) => {
                            let _ = write_json(&mut send, &WireOut::Err { error }).await;
                        }
                    }
                }
                WireIn::Send {
                    room,
                    nick,
                    ts,
                    body,
                    nonce,
                } => {
                    let nick = sanitize_nick(&nick);
                    let outcome = {
                        let mut hosted = self.rooms.hosted.lock().unwrap();
                        match hosted.get_mut(&room) {
                            Some(r) => {
                                let e2e = r.kind.e2e();
                                if e2e && nonce.is_none() {
                                    Err("E2E room requires nonce".into())
                                } else if body.len() > 64 * 1024 {
                                    Err("message too large".into())
                                } else {
                                    let wire = WireMsg {
                                        room: room.clone(),
                                        nick: nick.clone(),
                                        endpoint: remote.clone(),
                                        ts,
                                        body,
                                        nonce,
                                        e2e,
                                    };
                                    RoomHub::push_backlog(r, wire.clone());
                                    let peers: Vec<Peer> = r
                                        .peers
                                        .iter()
                                        .filter(|p| p.endpoint != remote)
                                        .cloned()
                                        .collect();
                                    let key = r.key;
                                    Ok((wire, peers, key, e2e))
                                }
                            }
                            None => Err("room not hosted".into()),
                        }
                    };
                    match outcome {
                        Ok((wire, peers, key, e2e)) => {
                            let _ = write_json(&mut send, &WireOut::Ack { ok: true }).await;
                            RoomHub::broadcast(&peers, &wire).await;
                            // Also show on host UI
                            let text_result = if e2e {
                                key.and_then(|k| {
                                    wire.nonce.as_ref().and_then(|n| decrypt(&k, n, &wire.body).ok())
                                })
                            } else {
                                Some(wire.body.clone())
                            };
                            if let Some(text) = text_result {
                                self.rooms.emit_message(&ChatMessage {
                                    room_id: room,
                                    from_nick: nick,
                                    from_endpoint: remote.clone(),
                                    text,
                                    ts: wire.ts,
                                });
                            }
                        }
                        Err(error) => {
                            let _ = write_json(&mut send, &WireOut::Err { error }).await;
                        }
                    }
                }
                WireIn::Leave { room } => {
                    {
                        let mut hosted = self.rooms.hosted.lock().unwrap();
                        if let Some(r) = hosted.get_mut(&room) {
                            r.peers.retain(|p| p.endpoint != remote);
                        }
                    }
                    let _ = write_json(&mut send, &WireOut::Ack { ok: true }).await;
                    self.rooms.emit_meta(
                        "room-peer",
                        serde_json::json!({
                            "room_id": room,
                            "endpoint": remote,
                            "event": "leave"
                        }),
                    );
                }
            }
        }

        if let Some(room) = joined_room {
            let mut hosted = self.rooms.hosted.lock().unwrap();
            if let Some(r) = hosted.get_mut(&room) {
                r.peers.retain(|p| p.endpoint != remote);
            }
            self.rooms.emit_meta(
                "room-peer",
                serde_json::json!({
                    "room_id": room,
                    "endpoint": remote,
                    "event": "leave"
                }),
            );
        }
        Ok(())
    }
}

/// Join a remote room and spawn push listener on the shared hub.
pub async fn join_remote(hub: Arc<RoomHub>, raw_invite: &str, nick: &str) -> Result<RoomSummary> {
    let invite = parse_invite(raw_invite)?;
    let nick = sanitize_nick(nick);
    if hub.hosted.lock().unwrap().contains_key(&invite.room_id)
        || hub.remote.lock().unwrap().contains_key(&invite.room_id)
    {
        bail!("already in that room");
    }

    let key = if let Some(ref k) = invite.key_b64 {
        let bytes = b64_decode(k)?;
        if bytes.len() != 32 {
            bail!("bad key length");
        }
        let mut arr = [0u8; 32];
        arr.copy_from_slice(&bytes);
        Some(arr)
    } else {
        None
    };

    let endpoint_id: EndpointId = invite.endpoint.parse().context("parse endpoint")?;
    let endpoint = Endpoint::builder(presets::N0)
        .alpns(vec![ROOM_ALPN.to_vec()])
        .bind()
        .await
        .context("bind room client")?;
    endpoint.online().await;
    let conn = endpoint
        .connect(endpoint_id, ROOM_ALPN)
        .await
        .context("dial room hub")?;

    let (mut send, mut recv) = conn.open_bi().await.context("join stream")?;
    write_json(
        &mut send,
        &WireIn::Join {
            room: invite.room_id.clone(),
            nick: nick.clone(),
        },
    )
    .await?;
    let line = read_json_line(&mut recv).await?;
    let resp: WireOut = serde_json::from_str(&line).context("join response")?;
    let (label, backlog) = match resp {
        WireOut::JoinOk {
            label, backlog, ..
        } => (label, backlog),
        WireOut::Err { error } => bail!(error),
        _ => bail!("unexpected join response"),
    };

    for wire in &backlog {
        let text = if wire.e2e {
            match key.as_ref() {
                Some(k) => match wire.nonce.as_ref() {
                    Some(n) => decrypt(k, n, &wire.body).unwrap_or_else(|_| "[undecryptable]".into()),
                    None => "[undecryptable]".into(),
                },
                None => "[undecryptable]".into(),
            }
        } else {
            wire.body.clone()
        };
        hub.emit_message(&ChatMessage {
            room_id: invite.room_id.clone(),
            from_nick: wire.nick.clone(),
            from_endpoint: wire.endpoint.clone(),
            text,
            ts: wire.ts,
        });
    }

    let room_id = invite.room_id.clone();
    let kind = invite.kind;
    let summary = RoomSummary {
        room_id: room_id.clone(),
        kind,
        label: label.clone(),
        role: "peer".into(),
        endpoint: invite.endpoint.clone(),
        invite: encode_invite(&RoomInvite {
            label: Some(label.clone()),
            ..invite.clone()
        }),
        e2e: kind.e2e(),
        peer_count: 0,
    };

    {
        let mut remote = hub.remote.lock().unwrap();
        remote.insert(
            room_id.clone(),
            RemoteSession {
                invite: RoomInvite {
                    label: Some(label),
                    ..invite
                },
                key,
                nick,
                conn: conn.clone(),
                endpoint,
            },
        );
    }

    let hub2 = hub.clone();
    let rid = room_id.clone();
    tokio::spawn(async move {
        loop {
            let (mut _send, mut recv) = match conn.accept_bi().await {
                Ok(s) => s,
                Err(_) => break,
            };
            let line = match read_json_line(&mut recv).await {
                Ok(l) => l,
                Err(_) => continue,
            };
            let Ok(out) = serde_json::from_str::<WireOut>(&line) else {
                continue;
            };
            match out {
                WireOut::Push { msg } => {
                    let key = hub2
                        .remote
                        .lock()
                        .unwrap()
                        .get(&rid)
                        .and_then(|s| s.key);
                    let text = if msg.e2e {
                        match (key.as_ref(), msg.nonce.as_ref()) {
                            (Some(k), Some(n)) => {
                                decrypt(k, n, &msg.body).unwrap_or_else(|_| "[undecryptable]".into())
                            }
                            _ => "[undecryptable]".into(),
                        }
                    } else {
                        msg.body.clone()
                    };
                    hub2.emit_message(&ChatMessage {
                        room_id: rid.clone(),
                        from_nick: msg.nick,
                        from_endpoint: msg.endpoint,
                        text,
                        ts: msg.ts,
                    });
                }
                WireOut::Peer {
                    room,
                    nick,
                    endpoint,
                    event,
                } => {
                    hub2.emit_meta(
                        "room-peer",
                        serde_json::json!({
                            "room_id": room,
                            "nick": nick,
                            "endpoint": endpoint,
                            "event": event
                        }),
                    );
                }
                _ => {}
            }
        }
        hub2.remote.lock().unwrap().remove(&rid);
        hub2.emit_meta("room-closed", serde_json::json!({ "room_id": rid }));
        warn!("room session closed: {rid}");
    });

    hub.emit_meta(
        "room-updated",
        serde_json::json!({ "room_id": room_id }),
    );
    Ok(summary)
}
