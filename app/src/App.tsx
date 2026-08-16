import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";

type CatalogItem = {
  name: string;
  size: number;
  sha256: string;
  kind?: string;
  description?: string | null;
  file_count?: number | null;
  thumbnail_sha256?: string | null;
  thumbnail_data_url?: string | null;
  folder?: string | null;
};

type ProjectSummary = {
  id: string;
  name: string;
  description: string;
  folder: string;
  file_count: number;
  manifest_sha256: string;
  manifest_size: number;
  thumbnail_sha256?: string | null;
  thumbnail_data_url?: string | null;
};

type FetchOutcome = {
  path: string;
  name: string;
  sha256: string;
  kind: string;
  endpoint: string;
  file_count?: number | null;
  thumbnail_data_url?: string | null;
};

type Status = {
  mode: string;
  oracle_id: string | null;
  share_dir: string | null;
  online: boolean;
};

type RoomSummary = {
  room_id: string;
  kind: "board" | "chat" | "dm";
  label: string;
  role: string;
  endpoint: string;
  invite: string;
  e2e: boolean;
  peer_count: number;
};

type ChatMessage = {
  room_id: string;
  from_nick: string;
  from_endpoint: string;
  text: string;
  ts: number;
};

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function isProject(item: CatalogItem) {
  return (item.kind || "file") === "project";
}

function looksLikeBareHex(raw: string) {
  const t = raw.trim();
  return t.length >= 32 && t.length <= 128 && /^[0-9a-f-]+$/i.test(t) && !t.includes(":");
}

function shareCodeHint(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.startsWith("pyrelink:room:")) {
    return "That’s a room invite — switch to Rooms and paste it there.";
  }
  if (looksLikeBareHex(t)) {
    return "That’s an endpoint ID or file hash, not a share code. Copy a full ticket from Host (pyrelink:1:…).";
  }
  if (!t.includes("pyrelink:1:")) {
    return "Share codes look like pyrelink:1:<endpoint>:<hash> — not a bare hex string.";
  }
  return null;
}

function fallbackExecCopy(text: string): boolean {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.top = "0";
  el.style.left = "0";
  el.style.width = "1px";
  el.style.height = "1px";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.focus();
  el.select();
  el.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(el);
  return ok;
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await writeText(text);
    return true;
  } catch {
    // WebView clipboard permission is often missing on Linux; keep trying.
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fall through
  }
  return fallbackExecCopy(text);
}

function App() {
  const [tab, setTab] = useState<"get" | "host" | "rooms">("get");
  const [status, setStatus] = useState<Status | null>(null);
  const [ticketInput, setTicketInput] = useState("");
  const [alsoMirror, setAlsoMirror] = useState(true);
  const [myEndpointId, setMyEndpointId] = useState("");
  const [shareDir, setShareDir] = useState("");
  const [localItems, setLocalItems] = useState<CatalogItem[]>([]);
  const [libraryItems, setLibraryItems] = useState<CatalogItem[]>([]);
  const [library, setLibrary] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [lastFetched, setLastFetched] = useState<FetchOutcome | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastCopied, setLastCopied] = useState<string | null>(null);
  const [copiedFlash, setCopiedFlash] = useState<string | null>(null);

  const [nick, setNick] = useState("anon");
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [roomMessages, setRoomMessages] = useState<Record<string, ChatMessage[]>>(
    {},
  );
  const [roomDraft, setRoomDraft] = useState("");
  const [roomInviteInput, setRoomInviteInput] = useState("");
  const [newRoomLabel, setNewRoomLabel] = useState("");
  const [cacheMessages, setCacheMessages] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const refreshStatus = useCallback(async () => {
    const s = await invoke<Status>("get_status");
    setStatus(s);
    if (s.share_dir) setShareDir(s.share_dir);
    if (s.oracle_id) setMyEndpointId(s.oracle_id);
  }, []);

  const scanLocal = useCallback(async (dir: string) => {
    if (!dir) return;
    const catalog = await invoke<CatalogItem[]>("refresh_local_catalog", {
      shareDir: dir,
    });
    setLocalItems(catalog);
  }, []);

  const scanLibrary = useCallback(async () => {
    try {
      const items = await invoke<CatalogItem[]>("list_library");
      setLibraryItems(items);
    } catch {
      setLibraryItems([]);
    }
  }, []);

  useEffect(() => {
    if (!message && !copiedFlash) return;
    const t = window.setTimeout(() => {
      setMessage(null);
      setCopiedFlash(null);
    }, 4200);
    return () => window.clearTimeout(t);
  }, [message, copiedFlash]);

  const refreshRooms = useCallback(async () => {
    try {
      const list = await invoke<RoomSummary[]>("list_rooms");
      setRooms(list);
    } catch {
      setRooms([]);
    }
  }, []);

  useEffect(() => {
    refreshStatus().catch(() => undefined);
    invoke<string>("get_default_share_dir")
      .then(async (dir) => {
        setShareDir(dir);
        await scanLocal(dir);
      })
      .catch(() => undefined);
    invoke<string>("library_path")
      .then(setLibrary)
      .catch(() => undefined);
    invoke<string>("get_endpoint_id")
      .then(setMyEndpointId)
      .catch(() => undefined);
    scanLibrary().catch(() => undefined);
    refreshRooms().catch(() => undefined);
    invoke<{ cache_messages: boolean }>("get_cache_settings")
      .then((s) => setCacheMessages(Boolean(s.cache_messages)))
      .catch(() => undefined);
  }, [refreshStatus, scanLocal, scanLibrary, refreshRooms]);

  useEffect(() => {
    let unlistenMsg: (() => void) | undefined;
    let unlistenClosed: (() => void) | undefined;
    let unlistenUpdated: (() => void) | undefined;
    (async () => {
      unlistenMsg = await listen<ChatMessage>("room-message", (event) => {
        const msg = event.payload;
        setRoomMessages((prev) => {
          const list = prev[msg.room_id] || [];
          if (list.some((m) => m.ts === msg.ts && m.from_endpoint === msg.from_endpoint && m.text === msg.text)) {
            return prev;
          }
          return { ...prev, [msg.room_id]: [...list, msg].slice(-200) };
        });
      });
      unlistenClosed = await listen<{ room_id: string }>("room-closed", (event) => {
        const id = event.payload.room_id;
        setRooms((prev) => prev.filter((r) => r.room_id !== id));
        setActiveRoomId((cur) => (cur === id ? null : cur));
      });
      unlistenUpdated = await listen("room-updated", () => {
        refreshRooms().catch(() => undefined);
      });
    })();
    return () => {
      unlistenMsg?.();
      unlistenClosed?.();
      unlistenUpdated?.();
    };
  }, [refreshRooms]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoomId, roomMessages]);

  useEffect(() => {
    if (!activeRoomId) return;
    invoke<ChatMessage[]>("load_cached_messages", { roomId: activeRoomId })
      .then((cached) => {
        if (!cached.length) return;
        setRoomMessages((prev) => {
          const live = prev[activeRoomId] || [];
          const key = (m: ChatMessage) =>
            `${m.ts}|${m.from_endpoint}|${m.text}`;
          const seen = new Set(live.map(key));
          const merged = [...cached.filter((m) => !seen.has(key(m))), ...live];
          merged.sort((a, b) => a.ts - b.ts);
          return { ...prev, [activeRoomId]: merged.slice(-200) };
        });
      })
      .catch(() => undefined);
  }, [activeRoomId]);

  async function toggleMessageCache(enabled: boolean) {
    setCacheMessages(enabled);
    try {
      await invoke("set_cache_settings", { cacheMessages: enabled });
      setMessage(
        enabled
          ? "Local message cache on — stored only on this device, never clearnet."
          : "Local message cache off — new messages won’t be saved to disk.",
      );
    } catch (e) {
      setError(String(e));
    }
  }

  async function clearLocalCache() {
    try {
      if (activeRoomId) {
        await invoke("clear_cached_room", { roomId: activeRoomId });
        setRoomMessages((prev) => ({ ...prev, [activeRoomId]: [] }));
        setMessage("Cleared local cache for this room.");
      } else {
        await invoke("clear_all_cached_messages");
        setRoomMessages({});
        setMessage("Cleared all local message caches.");
      }
    } catch (e) {
      setError(String(e));
    }
  }

  async function copyText(text: string, label = "Copied to clipboard.") {
    const value = text.trim();
    if (!value) return;
    setLastCopied(value);
    setError(null);
    const ok = await writeClipboard(value);
    if (ok) {
      setCopiedFlash(value);
      setMessage(label);
    } else {
      setMessage(null);
      setError("Clipboard blocked — the code is below. Select it and press Ctrl+C.");
    }
  }

  async function copyMyTicket(item: CatalogItem, note?: string) {
    const endpoint = status?.oracle_id || myEndpointId;
    if (!endpoint) {
      setError("Need an endpoint ID — go online on Host once.");
      return;
    }
    const ticket = await invoke<string>("make_share_ticket", {
      endpoint,
      hash: item.sha256,
      name: item.name,
    });
    await copyText(ticket, note || "Share code copied.");
  }

  async function fetchTicket() {
    const raw = ticketInput.trim();
    if (!raw) {
      setError("Paste a share code from social media.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    const hint = shareCodeHint(raw);
    if (hint && (looksLikeBareHex(raw) || raw.trim().startsWith("pyrelink:room:"))) {
      setError(hint);
      setBusy(false);
      return;
    }
    try {
      if (alsoMirror) {
        const dir = shareDir || (await invoke<string>("get_default_share_dir"));
        const [item, outcome] = await invoke<[CatalogItem, FetchOutcome]>(
          "mirror_share_ticket",
          { ticket: raw, shareDir: dir },
        );
        setShareDir(dir);
        setLastFetched(outcome);
        await scanLocal(dir);
        await scanLibrary();
        const endpoint = status?.oracle_id || myEndpointId;
        const label =
          item.kind === "project"
            ? `project “${item.name}” (${item.file_count ?? "?"} files)`
            : `“${item.name}”`;
        if (endpoint && status?.online) {
          const mine = await invoke<string>("make_share_ticket", {
            endpoint,
            hash: item.sha256,
            name: item.name,
          });
          await copyText(
            mine,
            `Mirrored ${label} into your host folder. Share code copied.`,
          );
        } else {
          setMessage(
            `Fetched & mirrored ${label}. Go online on Host to serve it and copy your own share code.`,
          );
        }
      } else {
        const outcome = await invoke<FetchOutcome>("fetch_share_ticket", {
          ticket: raw,
        });
        setLastFetched(outcome);
        await scanLibrary();
        const label =
          outcome.kind === "project"
            ? `project “${outcome.name}” (${outcome.file_count ?? "?"} files)`
            : `“${outcome.name}”`;
        setMessage(`Got ${label} → ${outcome.path}`);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function mirrorLastFetched() {
    if (!lastFetched) return;
    setBusy(true);
    setError(null);
    try {
      const dir = shareDir || (await invoke<string>("get_default_share_dir"));
      const item = await invoke<CatalogItem>("mirror_local_file", {
        sourcePath: lastFetched.path,
        shareDir: dir,
        name: lastFetched.name,
      });
      setShareDir(dir);
      await scanLocal(dir);
      setMessage(`Mirrored “${item.name}” into host folder.`);
      if (status?.online) await copyMyTicket(item);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function mirrorLibraryItem(item: CatalogItem) {
    if (!library) return;
    setBusy(true);
    setError(null);
    try {
      const dir = shareDir || (await invoke<string>("get_default_share_dir"));
      const leaf = isProject(item) ? item.folder || item.name : item.name;
      const sourcePath = `${library.replace(/\/$/, "")}/${leaf}`;
      const mirrored = await invoke<CatalogItem>("mirror_local_file", {
        sourcePath,
        shareDir: dir,
        name: item.name,
      });
      setShareDir(dir);
      await scanLocal(dir);
      setMessage(`Mirrored “${mirrored.name}”.`);
      if (status?.online) await copyMyTicket(mirrored);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function startHost() {
    setBusy(true);
    setError(null);
    try {
      const id = await invoke<string>("start_oracle", {
        shareDir: shareDir || null,
      });
      setMyEndpointId(id);
      setMessage(
        "You’re hosting. Mirror favorites, copy your share codes, stay online.",
      );
      await refreshStatus();
      await scanLocal(shareDir);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function stopHost() {
    setBusy(true);
    try {
      await invoke("stop_oracle");
      await refreshStatus();
      setMessage("Stopped hosting.");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function pickShareDir() {
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected === "string") {
      setShareDir(selected);
      await scanLocal(selected);
    }
  }

  async function copyShareCode(item: CatalogItem) {
    await copyMyTicket(
      item,
      status?.online
        ? "Share code copied."
        : "Share code copied. Go online so peers can fetch it.",
    );
  }

  async function createProject() {
    const name = newProjectName.trim();
    if (!name) {
      setError("Enter a project name.");
      return;
    }
    if (!shareDir) {
      setError("Pick a share folder first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await invoke<ProjectSummary>("create_project", {
        shareDir,
        name,
      });
      setNewProjectName("");
      await scanLocal(shareDir);
      setMessage(`Created project “${name}”. Add files and set a thumbnail.`);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function importProjectFolder() {
    if (!shareDir) {
      setError("Pick a share folder first.");
      return;
    }
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected !== "string") return;
    const leaf = selected.split(/[/\\]/).filter(Boolean).pop() || "project";
    setBusy(true);
    setError(null);
    try {
      await invoke<ProjectSummary>("import_folder_as_project", {
        shareDir,
        sourceFolder: selected,
        name: leaf,
      });
      await scanLocal(shareDir);
      setMessage(`Imported project “${leaf}”. You can set a thumbnail next.`);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  function folderForProject(item: CatalogItem): string | null {
    if (!isProject(item)) return null;
    return item.folder || null;
  }

  async function setThumbFor(item: CatalogItem) {
    const folder = folderForProject(item);
    if (!folder || !shareDir) {
      setError("Project folder unknown — rescan and try again.");
      return;
    }
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: "Images",
          extensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"],
        },
      ],
    });
    if (typeof selected !== "string") return;
    setBusy(true);
    setError(null);
    try {
      await invoke<ProjectSummary>("set_project_thumbnail", {
        shareDir,
        folder,
        imagePath: selected,
      });
      await scanLocal(shareDir);
      setMessage(`Thumbnail set for “${item.name}”.`);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function addFilesTo(item: CatalogItem) {
    const folder = folderForProject(item);
    if (!folder || !shareDir) {
      setError("Project folder unknown — rescan and try again.");
      return;
    }
    const selected = await open({ multiple: true });
    if (!selected) return;
    const paths = Array.isArray(selected) ? selected : [selected];
    setBusy(true);
    setError(null);
    try {
      await invoke<ProjectSummary>("add_files_to_project", {
        shareDir,
        folder,
        paths,
      });
      await scanLocal(shareDir);
      setMessage(`Added files to “${item.name}”.`);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function createRoom(kind: "board" | "chat" | "dm") {
    setBusy(true);
    setError(null);
    try {
      const summary = await invoke<RoomSummary>("create_room", {
        kind,
        label: newRoomLabel.trim() || kind,
        nick,
        shareDir: shareDir || null,
      });
      await refreshStatus();
      await refreshRooms();
      setActiveRoomId(summary.room_id);
      setNewRoomLabel("");
      await copyText(
        summary.invite,
        `Created ${kind} “${summary.label}”. Invite copied — paste it to peers. Hub must stay online.`,
      );
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function joinRoomInvite() {
    const raw = roomInviteInput.trim();
    if (!raw) {
      setError("Paste a room invite.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const summary = await invoke<RoomSummary>("join_room", {
        invite: raw,
        nick,
      });
      await refreshRooms();
      setActiveRoomId(summary.room_id);
      setRoomInviteInput("");
      setMessage(`Joined ${summary.kind} “${summary.label}”.`);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function sendChat() {
    if (!activeRoomId || !roomDraft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await invoke<ChatMessage>("send_room_message", {
        roomId: activeRoomId,
        text: roomDraft,
        nick,
      });
      setRoomDraft("");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function copyInvite(roomId: string) {
    try {
      const invite = await invoke<string>("copy_room_invite", { roomId });
      await copyText(invite);
    } catch (e) {
      setError(String(e));
    }
  }

  async function leaveActiveRoom() {
    if (!activeRoomId) return;
    try {
      await invoke("leave_room", { roomId: activeRoomId });
      setActiveRoomId(null);
      await refreshRooms();
      setMessage("Left room.");
    } catch (e) {
      setError(String(e));
    }
  }

  const projects = localItems.filter(isProject);
  const looseFiles = localItems.filter((i) => !isProject(i));
  const activeRoom = rooms.find((r) => r.room_id === activeRoomId) || null;
  const activeMessages = activeRoomId ? roomMessages[activeRoomId] || [] : [];

  function renderItem(item: CatalogItem, hostActions: boolean) {
    return (
      <li key={`${item.kind || "file"}:${item.sha256}:${item.name}`} className="item">
        {item.thumbnail_data_url ? (
          <img
            className="thumb"
            src={item.thumbnail_data_url}
            alt=""
          />
        ) : (
          <div className={`thumb placeholder ${isProject(item) ? "proj" : ""}`} />
        )}
        <div className="item-body">
          <strong>
            {isProject(item) ? "Project · " : ""}
            {item.name}
          </strong>
          <span>
            {isProject(item)
              ? `${item.file_count ?? 0} files · manifest ${formatBytes(item.size)}`
              : formatBytes(item.size)}{" "}
            · {item.sha256.slice(0, 12)}…
          </span>
          {item.description ? (
            <span className="desc">{item.description}</span>
          ) : null}
        </div>
        <div className="item-actions">
          {hostActions && isProject(item) && (
            <>
              <button type="button" disabled={busy} onClick={() => setThumbFor(item)}>
                Set thumbnail
              </button>
              <button type="button" disabled={busy} onClick={() => addFilesTo(item)}>
                Add files
              </button>
            </>
          )}
          {hostActions ? (
            <button
              type="button"
              className="primary"
              disabled={busy || !(status?.oracle_id || myEndpointId)}
              onClick={() => copyShareCode(item)}
            >
              {lastCopied?.includes(item.sha256) && copiedFlash
                ? "Copied!"
                : "Copy share code"}
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => mirrorLibraryItem(item)}
            >
              Mirror to Host
            </button>
          )}
        </div>
      </li>
    );
  }

  return (
    <div className="shell">
      <header className="top">
        <div className="brand">
          <span className="mark" aria-hidden />
          <div>
            <strong>PyreLink</strong>
            <span>Peer share · projects & mirrors</span>
          </div>
        </div>
        <nav className="tabs">
          <button
            type="button"
            className={tab === "get" ? "active" : ""}
            onClick={() => setTab("get")}
          >
            Get
          </button>
          <button
            type="button"
            className={tab === "host" ? "active" : ""}
            onClick={() => setTab("host")}
          >
            Host
          </button>
          <button
            type="button"
            className={tab === "rooms" ? "active" : ""}
            onClick={() => setTab("rooms")}
          >
            Rooms
          </button>
        </nav>
        <span className={`pill ${status?.online ? "on" : ""}`}>
          {status?.online ? "Online" : "Offline"}
        </span>
      </header>

      <p className="banner-note">
        Generic P2P platform. Share files/projects, or open ephemeral boards,
        chatrooms, and DMs via hash invites. Nothing is stored on a central
        server — if the room hub goes offline, live history dies with it.
      </p>

      {message && <p className="ok toast">{message}</p>}
      {error && <p className="err toast">{error}</p>}

      {lastCopied && (
        <div className="copied-bar">
          <span className="copied-label">Last copied</span>
          <textarea
            className="copied-code"
            readOnly
            value={lastCopied}
            rows={2}
            spellCheck={false}
            onFocus={(e) => e.currentTarget.select()}
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            type="button"
            className="primary"
            onClick={() => copyText(lastCopied)}
          >
            {copiedFlash === lastCopied ? "Copied!" : "Copy again"}
          </button>
        </div>
      )}

      {tab === "get" ? (
        <section className="panel">
          <h1>Get a file or project</h1>
          <p className="lede">
            Paste a share code. Project codes pull the manifest, thumbnail, and
            every file. Optionally mirror into Host so you can re-share.
          </p>

          <label>
            Share code
            <textarea
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              rows={3}
              placeholder="pyrelink:1:<endpoint>:<hash>:name"
              spellCheck={false}
            />
            {shareCodeHint(ticketInput) ? (
              <span className="field-hint">{shareCodeHint(ticketInput)}</span>
            ) : null}
          </label>

          <label className="check">
            <input
              type="checkbox"
              checked={alsoMirror}
              onChange={(e) => setAlsoMirror(e.target.checked)}
            />
            Mirror into my Host folder after fetch
          </label>

          <div className="row">
            <button
              type="button"
              className="primary"
              disabled={busy}
              onClick={fetchTicket}
            >
              {busy ? "Working…" : alsoMirror ? "Fetch & mirror" : "Fetch"}
            </button>
            {lastFetched && !alsoMirror && (
              <button type="button" disabled={busy} onClick={mirrorLastFetched}>
                Mirror last fetch
              </button>
            )}
          </div>

          {lastFetched && (
            <div className="fetched">
              {lastFetched.thumbnail_data_url ? (
                <img src={lastFetched.thumbnail_data_url} alt="" />
              ) : null}
              <div>
                <strong>
                  {lastFetched.kind === "project" ? "Project · " : ""}
                  {lastFetched.name}
                </strong>
                <span>{lastFetched.path}</span>
              </div>
            </div>
          )}

          {libraryItems.length > 0 && (
            <>
              <h2 className="subhead">Library (downloaded)</h2>
              <ul className="list">{libraryItems.map((item) => renderItem(item, false))}</ul>
            </>
          )}

          {library && (
            <p className="meta">
              Downloads: <code>{library}</code>
            </p>
          )}
        </section>
      ) : tab === "host" ? (
        <section className="panel">
          <h1>Host files & projects</h1>
          <p className="lede">
            Serve loose files and project folders (with thumbnails). Project
            share codes transfer the whole kit — thumbnail included — to peers.
          </p>

          <label>
            Folder to share
            <div className="row">
              <input
                value={shareDir}
                onChange={(e) => setShareDir(e.target.value)}
                spellCheck={false}
              />
              <button type="button" onClick={pickShareDir}>
                Browse
              </button>
            </div>
          </label>

          <div className="row">
            {!status?.online ? (
              <button
                type="button"
                className="primary"
                disabled={busy}
                onClick={startHost}
              >
                Go online
              </button>
            ) : (
              <button type="button" disabled={busy} onClick={stopHost}>
                Go offline
              </button>
            )}
            <button
              type="button"
              disabled={!shareDir}
              onClick={() => scanLocal(shareDir)}
            >
              Rescan
            </button>
          </div>

          {(status?.oracle_id || myEndpointId) && (
            <p className="meta">
              Your endpoint ID (not a share code):{" "}
              <code>{status?.oracle_id || myEndpointId}</code>{" "}
              <button
                type="button"
                className="linkish"
                onClick={() =>
                  copyText(
                    status?.oracle_id || myEndpointId,
                    "Endpoint ID copied — peers need a full share code, not just this.",
                  )
                }
              >
                Copy ID
              </button>
              {status?.online ? " · online" : " · offline"}
            </p>
          )}

          <h2 className="subhead">Projects</h2>
          <div className="row project-create">
            <input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="New project name"
            />
            <button type="button" disabled={busy || !shareDir} onClick={createProject}>
              Create
            </button>
            <button type="button" disabled={busy || !shareDir} onClick={importProjectFolder}>
              Import folder
            </button>
          </div>

          <ul className="list">
            {projects.map((item) => renderItem(item, true))}
            {!projects.length && (
              <li className="empty">
                No projects yet — create one or import a folder, then set a
                thumbnail.
              </li>
            )}
          </ul>

          <h2 className="subhead">Loose files</h2>
          <ul className="list">
            {looseFiles.map((item) => renderItem(item, true))}
            {!looseFiles.length && (
              <li className="empty">
                Empty — drop files in the share folder or mirror from Get.
              </li>
            )}
          </ul>
        </section>
      ) : (
        <section className="panel">
          <h1>Boards · chat · DMs</h1>
          <p className="lede">
            Hash invites open ephemeral rooms. Boards are plaintext. Chat and
            DMs are E2E (XChaCha20-Poly1305). Creating a room brings you online
            as the hub — stay online or the room dies.
          </p>

          <label>
            Nickname (spoofable — not identity)
            <input
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              maxLength={24}
            />
          </label>

          <label className="check">
            <input
              type="checkbox"
              checked={cacheMessages}
              onChange={(e) => toggleMessageCache(e.target.checked)}
            />
            Cache messages locally on this device (never sent to clearnet)
          </label>
          <div className="row">
            <button type="button" onClick={clearLocalCache}>
              {activeRoomId ? "Clear this room’s local cache" : "Clear all local caches"}
            </button>
          </div>

          <h2 className="subhead">Create</h2>
          <div className="row project-create">
            <input
              value={newRoomLabel}
              onChange={(e) => setNewRoomLabel(e.target.value)}
              placeholder="Label (optional)"
            />
            <button type="button" disabled={busy} onClick={() => createRoom("board")}>
              Board
            </button>
            <button type="button" disabled={busy} onClick={() => createRoom("chat")}>
              Chatroom
            </button>
            <button type="button" disabled={busy} onClick={() => createRoom("dm")}>
              DM
            </button>
          </div>

          <h2 className="subhead">Join with invite</h2>
          <label>
            Room invite
            <textarea
              value={roomInviteInput}
              onChange={(e) => setRoomInviteInput(e.target.value)}
              rows={2}
              placeholder="pyrelink:room:1:chat:<room_hash>:<endpoint>:<key>"
              spellCheck={false}
            />
          </label>
          <div className="row">
            <button
              type="button"
              className="primary"
              disabled={busy}
              onClick={joinRoomInvite}
            >
              Join
            </button>
            <button type="button" disabled={busy} onClick={() => refreshRooms()}>
              Refresh
            </button>
          </div>

          <div className="rooms-layout">
            <ul className="room-list">
              {rooms.map((r) => (
                <li key={r.room_id}>
                  <button
                    type="button"
                    className={r.room_id === activeRoomId ? "active" : ""}
                    onClick={() => setActiveRoomId(r.room_id)}
                  >
                    <strong>
                      {r.kind} · {r.label}
                    </strong>
                    <span>
                      {r.role}
                      {r.e2e ? " · E2E" : " · public"} · {r.room_id.slice(0, 10)}…
                    </span>
                  </button>
                </li>
              ))}
              {!rooms.length && (
                <li className="empty">No active rooms — create or join one.</li>
              )}
            </ul>

            <div className="chat-pane">
              {activeRoom ? (
                <>
                  <div className="chat-head">
                    <div>
                      <strong>
                        {activeRoom.kind} · {activeRoom.label}
                      </strong>
                      <span>
                        {activeRoom.e2e ? "E2E encrypted" : "plaintext board"} ·{" "}
                        {activeRoom.role}
                      </span>
                    </div>
                    <div className="row">
                      <button type="button" onClick={() => copyInvite(activeRoom.room_id)}>
                        {copiedFlash && lastCopied?.startsWith("pyrelink:room:")
                          ? "Copied!"
                          : "Copy invite"}
                      </button>
                      <button type="button" onClick={leaveActiveRoom}>
                        Leave
                      </button>
                    </div>
                  </div>
                  <div className="chat-log">
                    {activeMessages.map((m, i) => (
                      <div key={`${m.ts}-${m.from_endpoint}-${i}`} className="chat-line">
                        <span className="chat-nick">{m.from_nick}</span>
                        <span className="chat-text">{m.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="chat-compose row">
                    <input
                      value={roomDraft}
                      onChange={(e) => setRoomDraft(e.target.value)}
                      placeholder="Message…"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendChat();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="primary"
                      disabled={busy || !roomDraft.trim()}
                      onClick={sendChat}
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <p className="meta">Select a room to chat.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
