use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};

use anyhow::Context;
use iroh::{
    Endpoint,
    endpoint::{Connection, presets},
    protocol::{AcceptError, ProtocolHandler, Router},
};
use tracing::info;

use crate::{
    identity::{hash_file, safe_join, scan_catalog},
    project,
    protocol::{CatalogItem, Request, Response, ALPN},
    room::{RoomHandler, RoomHub, ROOM_ALPN},
};

fn io_err(e: impl ToString) -> std::io::Error {
    std::io::Error::other(e.to_string())
}

async fn send_file(
    send: &mut iroh::endpoint::SendStream,
    path: &std::path::Path,
    name: &str,
) -> Result<(), AcceptError> {
    let size = path.metadata().map(|m| m.len()).unwrap_or(0);
    let sha256 = hash_file(path).unwrap_or_default();
    let meta = Response::GetMeta {
        ok: true,
        name: name.to_string(),
        size,
        sha256,
        error: None,
    };
    let payload = serde_json::to_string(&meta).unwrap() + "\n";
    send.write_all(payload.as_bytes()).await.map_err(io_err)?;
    let mut file = tokio::fs::File::open(path).await?;
    tokio::io::copy(&mut file, send).await?;
    send.finish().map_err(io_err)?;
    Ok(())
}

async fn send_err(send: &mut iroh::endpoint::SendStream, msg: &str) -> Result<(), AcceptError> {
    let err = Response::Err {
        ok: false,
        error: msg.into(),
    };
    let payload = serde_json::to_string(&err).unwrap() + "\n";
    send.write_all(payload.as_bytes()).await.map_err(io_err)?;
    send.finish().map_err(io_err)?;
    Ok(())
}

fn build_catalog(share_dir: &std::path::Path) -> Vec<CatalogItem> {
    let mut items = Vec::new();
    if let Ok(projects) = project::scan_projects(share_dir) {
        for p in projects {
            items.push(project::summary_to_catalog(p));
        }
    }
    // Loose files at share root (not inside project folders).
    if let Ok(files) = scan_catalog(share_dir) {
        for f in files {
            items.push(CatalogItem {
                name: f.name,
                size: f.size,
                sha256: f.sha256,
                kind: "file".into(),
                description: None,
                file_count: None,
                thumbnail_sha256: None,
                thumbnail_data_url: None,
                folder: None,
            });
        }
    }
    items
}

#[derive(Debug, Clone)]
pub struct OracleHandler {
    pub share_dir: PathBuf,
}

impl ProtocolHandler for OracleHandler {
    async fn accept(&self, connection: Connection) -> Result<(), AcceptError> {
        let remote = connection.remote_id();
        info!("peer connected: {remote}");
        loop {
            let (mut send, mut recv) = match connection.accept_bi().await {
                Ok(s) => s,
                Err(_) => break,
            };

            let mut buf = Vec::new();
            let mut tmp = [0u8; 1024];
            let req = loop {
                let n = match recv.read(&mut tmp).await {
                    Ok(Some(n)) => n,
                    Ok(None) | Err(_) => 0,
                };
                if n == 0 {
                    break None;
                }
                buf.extend_from_slice(&tmp[..n]);
                if let Some(idx) = buf.iter().position(|b| *b == b'\n') {
                    let line = String::from_utf8_lossy(&buf[..idx]).trim().to_string();
                    break serde_json::from_str::<Request>(&line).ok();
                }
                if buf.len() > 64 * 1024 {
                    break None;
                }
            };

            let Some(req) = req else {
                let _ = send_err(&mut send, "bad request").await;
                continue;
            };

            match req {
                Request::List => {
                    let items = build_catalog(&self.share_dir);
                    let resp = Response::List {
                        ok: true,
                        items,
                        error: None,
                    };
                    let payload = serde_json::to_string(&resp).unwrap() + "\n";
                    send.write_all(payload.as_bytes())
                        .await
                        .map_err(io_err)?;
                    send.finish().map_err(io_err)?;
                }
                Request::Get { name } => {
                    let path = if let Ok(p) = safe_join(&self.share_dir, &name) {
                        if p.is_file() {
                            Some(p)
                        } else {
                            None
                        }
                    } else {
                        None
                    };
                    let path = path.or_else(|| {
                        if let Some((folder, file)) = name.split_once('/') {
                            let candidate = self.share_dir.join(folder).join(file);
                            if candidate.is_file() {
                                return Some(candidate);
                            }
                        }
                        for entry in std::fs::read_dir(&self.share_dir).ok()?.flatten() {
                            let p = entry.path();
                            if p.is_dir() {
                                let c = p.join(&name);
                                if c.is_file() {
                                    return Some(c);
                                }
                            }
                        }
                        None
                    });
                    match path {
                        Some(path) => {
                            let fname = path
                                .file_name()
                                .map(|s| s.to_string_lossy().to_string())
                                .unwrap_or(name);
                            send_file(&mut send, &path, &fname).await?;
                        }
                        None => send_err(&mut send, "not found").await?,
                    }
                }
                Request::GetByHash { hash } => {
                    match project::find_file_by_hash(&self.share_dir, &hash) {
                        Ok(Some((path, name))) => {
                            send_file(&mut send, &path, &name).await?;
                        }
                        _ => send_err(&mut send, "hash not found").await?,
                    }
                }
            }
        }
        Ok(())
    }
}

pub struct OracleNode {
    pub endpoint_id: String,
    pub share_dir: PathBuf,
    router: Router,
}

impl OracleNode {
    pub async fn start(
        share_dir: PathBuf,
        secret: iroh::SecretKey,
        rooms: Arc<RoomHub>,
    ) -> anyhow::Result<Self> {
        std::fs::create_dir_all(&share_dir)?;
        let endpoint = Endpoint::builder(presets::N0)
            .secret_key(secret)
            .alpns(vec![ALPN.to_vec(), ROOM_ALPN.to_vec()])
            .bind()
            .await
            .context("bind oracle endpoint")?;

        let endpoint_id = endpoint.id().to_string();
        let handler = OracleHandler {
            share_dir: share_dir.clone(),
        };
        let room_handler = RoomHandler { rooms };
        let router = Router::builder(endpoint)
            .accept(ALPN, handler)
            .accept(ROOM_ALPN, room_handler)
            .spawn();
        router.endpoint().online().await;

        info!("oracle online as {endpoint_id} (share + rooms)");
        Ok(Self {
            endpoint_id,
            share_dir,
            router,
        })
    }

    pub async fn shutdown(self) -> anyhow::Result<()> {
        self.router.shutdown().await.context("router shutdown")?;
        Ok(())
    }
}

#[derive(Clone)]
pub struct SharedOracle(pub Arc<Mutex<Option<OracleNode>>>);
