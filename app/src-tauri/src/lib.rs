use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};

use iroh::SecretKey;

use crate::protocol::CatalogItem;

mod advocate;
mod cache;
mod identity;
mod oracle;
mod project;
mod protocol;
mod room;
mod ticket;

use oracle::{OracleNode, SharedOracle};
use room::{join_remote, RoomHub, RoomKind, SharedRooms};
use ticket::{encode_ticket, parse_ticket};

#[derive(Clone)]
struct AppState {
    oracle: SharedOracle,
    secret: Arc<Mutex<SecretKey>>,
    rooms: SharedRooms,
}

#[derive(serde::Serialize)]
struct StatusPayload {
    mode: String,
    oracle_id: Option<String>,
    share_dir: Option<String>,
    online: bool,
}

fn local_catalog(share_dir: &std::path::Path) -> Result<Vec<CatalogItem>, String> {
    let mut items = Vec::new();
    for p in project::scan_projects(share_dir).map_err(|e| e.to_string())? {
        items.push(project::summary_to_catalog(p));
    }
    for f in identity::scan_catalog(share_dir).map_err(|e| e.to_string())? {
        items.push(f);
    }
    Ok(items)
}

fn our_endpoint(state: &AppState) -> Result<String, String> {
    let guard = state.oracle.0.lock().unwrap();
    if let Some(node) = guard.as_ref() {
        return Ok(node.endpoint_id.clone());
    }
    drop(guard);
    let secret = state.secret.lock().unwrap();
    Ok(secret.public().to_string())
}

#[tauri::command]
fn get_status(state: tauri::State<'_, AppState>) -> StatusPayload {
    let guard = state.oracle.0.lock().unwrap();
    match guard.as_ref() {
        Some(node) => StatusPayload {
            mode: "host".into(),
            oracle_id: Some(node.endpoint_id.clone()),
            share_dir: Some(node.share_dir.display().to_string()),
            online: true,
        },
        None => StatusPayload {
            mode: "idle".into(),
            oracle_id: None,
            share_dir: None,
            online: false,
        },
    }
}

#[tauri::command]
async fn start_oracle(
    state: tauri::State<'_, AppState>,
    share_dir: Option<String>,
) -> Result<String, String> {
    {
        let guard = state.oracle.0.lock().unwrap();
        if guard.is_some() {
            return Err("already hosting".into());
        }
    }

    let dir = match share_dir {
        Some(s) if !s.trim().is_empty() => PathBuf::from(s),
        _ => identity::default_share_dir().map_err(|e| e.to_string())?,
    };
    let secret = state.secret.lock().unwrap().clone();
    let node = OracleNode::start(dir, secret, state.rooms.0.clone())
        .await
        .map_err(|e| e.to_string())?;
    let id = node.endpoint_id.clone();
    *state.oracle.0.lock().unwrap() = Some(node);
    Ok(id)
}

#[tauri::command]
async fn stop_oracle(state: tauri::State<'_, AppState>) -> Result<(), String> {
    state.rooms.0.clear_all();
    let node = {
        let mut guard = state.oracle.0.lock().unwrap();
        guard.take()
    };
    if let Some(node) = node {
        node.shutdown().await.map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn get_endpoint_id(state: tauri::State<'_, AppState>) -> Result<String, String> {
    our_endpoint(&state)
}

#[tauri::command]
fn get_default_share_dir() -> Result<String, String> {
    identity::default_share_dir()
        .map(|p| p.display().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn refresh_local_catalog(share_dir: String) -> Result<Vec<CatalogItem>, String> {
    local_catalog(PathBuf::from(share_dir).as_path())
}

#[tauri::command]
fn make_share_ticket(endpoint: String, hash: String, name: Option<String>) -> String {
    encode_ticket(&endpoint, &hash, name.as_deref())
}

#[tauri::command]
fn parse_share_ticket(ticket: String) -> Result<ticket::ShareTicket, String> {
    parse_ticket(&ticket).map_err(|e| e.to_string())
}

#[tauri::command]
async fn fetch_share_ticket(ticket: String) -> Result<advocate::FetchOutcome, String> {
    advocate::fetch_ticket_full(&ticket)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn mirror_share_ticket(
    ticket: String,
    share_dir: String,
) -> Result<(CatalogItem, advocate::FetchOutcome), String> {
    advocate::mirror_ticket_full(&ticket, PathBuf::from(share_dir).as_path())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn mirror_local_file(
    source_path: String,
    share_dir: String,
    name: Option<String>,
) -> Result<CatalogItem, String> {
    let src = PathBuf::from(&source_path);
    if src.is_dir() {
        return advocate::mirror_project_into_share(&src, PathBuf::from(share_dir).as_path())
            .map_err(|e| e.to_string());
    }
    identity::mirror_file_into_share(
        src.as_path(),
        PathBuf::from(share_dir).as_path(),
        name.as_deref(),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn list_library() -> Result<Vec<CatalogItem>, String> {
    local_catalog(identity::library_dir().map_err(|e| e.to_string())?.as_path())
}

#[tauri::command]
async fn connect_bootstrap(site_url: String) -> Result<advocate::BootstrapInfo, String> {
    advocate::fetch_connect(&site_url)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn list_remote(oracle_id: String) -> Result<Vec<CatalogItem>, String> {
    advocate::list_catalog(&oracle_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn list_remotes(oracle_ids: Vec<String>) -> Result<(Vec<CatalogItem>, Vec<String>), String> {
    advocate::list_many(&oracle_ids)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn download_remote(oracle_id: String, name: String) -> Result<String, String> {
    advocate::download_file(&oracle_id, &name)
        .await
        .map(|p| p.display().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn download_by_hash(
    oracle_ids: Vec<String>,
    hash: String,
) -> Result<(String, String, String), String> {
    advocate::download_by_hash(&oracle_ids, &hash)
        .await
        .map(|(path, name, oracle)| (path.display().to_string(), name, oracle))
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn library_path() -> Result<String, String> {
    identity::library_dir()
        .map(|p| p.display().to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn create_project(share_dir: String, name: String) -> Result<project::ProjectSummary, String> {
    let dir = PathBuf::from(&share_dir);
    let created = project::create_project(&dir, &name, &name).map_err(|e| e.to_string())?;
    let folder = created
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    project::scan_projects(&dir)
        .map_err(|e| e.to_string())?
        .into_iter()
        .find(|p| p.folder == folder)
        .ok_or_else(|| "project created but not found".into())
}

#[tauri::command]
fn set_project_thumbnail(
    share_dir: String,
    folder: String,
    image_path: String,
) -> Result<project::ProjectSummary, String> {
    let dir = project::project_dir(PathBuf::from(share_dir).as_path(), &folder)
        .map_err(|e| e.to_string())?;
    project::set_thumbnail(&dir, PathBuf::from(image_path).as_path()).map_err(|e| e.to_string())?;
    let share = dir.parent().ok_or("bad project path")?;
    project::scan_projects(share)
        .map_err(|e| e.to_string())?
        .into_iter()
        .find(|p| p.folder == folder)
        .ok_or_else(|| "project missing after thumbnail".into())
}

#[tauri::command]
fn set_project_description(
    share_dir: String,
    folder: String,
    description: String,
) -> Result<project::ProjectSummary, String> {
    let dir = project::project_dir(PathBuf::from(share_dir).as_path(), &folder)
        .map_err(|e| e.to_string())?;
    project::update_description(&dir, &description).map_err(|e| e.to_string())?;
    let share = dir.parent().ok_or("bad project path")?;
    project::scan_projects(share)
        .map_err(|e| e.to_string())?
        .into_iter()
        .find(|p| p.folder == folder)
        .ok_or_else(|| "project missing after description".into())
}

#[tauri::command]
fn add_files_to_project(
    share_dir: String,
    folder: String,
    paths: Vec<String>,
) -> Result<project::ProjectSummary, String> {
    let dir = project::project_dir(PathBuf::from(share_dir).as_path(), &folder)
        .map_err(|e| e.to_string())?;
    for p in paths {
        let src = PathBuf::from(&p);
        if !src.is_file() {
            continue;
        }
        let name = src
            .file_name()
            .map(|s| s.to_string_lossy().to_string())
            .unwrap_or_else(|| "file.bin".into());
        std::fs::copy(&src, dir.join(&name)).map_err(|e| e.to_string())?;
    }
    project::rebuild_manifest(&dir).map_err(|e| e.to_string())?;
    let share = dir.parent().ok_or("bad project path")?;
    project::scan_projects(share)
        .map_err(|e| e.to_string())?
        .into_iter()
        .find(|p| p.folder == folder)
        .ok_or_else(|| "project missing after add files".into())
}

#[tauri::command]
fn import_folder_as_project(
    share_dir: String,
    source_folder: String,
    name: String,
) -> Result<project::ProjectSummary, String> {
    let share = PathBuf::from(&share_dir);
    let created = project::import_folder_as_project(
        share.as_path(),
        PathBuf::from(source_folder).as_path(),
        &name,
    )
    .map_err(|e| e.to_string())?;
    let folder = created
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    project::scan_projects(share.as_path())
        .map_err(|e| e.to_string())?
        .into_iter()
        .find(|p| p.folder == folder)
        .ok_or_else(|| "imported project not found".into())
}

#[tauri::command]
async fn ensure_online(
    state: tauri::State<'_, AppState>,
    share_dir: Option<String>,
) -> Result<String, String> {
    {
        let guard = state.oracle.0.lock().unwrap();
        if let Some(node) = guard.as_ref() {
            return Ok(node.endpoint_id.clone());
        }
    }
    start_oracle(state, share_dir).await
}

#[tauri::command]
async fn create_room(
    state: tauri::State<'_, AppState>,
    kind: String,
    label: String,
    nick: String,
    share_dir: Option<String>,
) -> Result<room::RoomSummary, String> {
    let kind = RoomKind::parse(&kind).map_err(|e| e.to_string())?;
    let endpoint = ensure_online(state.clone(), share_dir).await?;
    state
        .rooms
        .0
        .create_hosted(kind, &label, &nick, &endpoint)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn join_room(
    state: tauri::State<'_, AppState>,
    invite: String,
    nick: String,
) -> Result<room::RoomSummary, String> {
    if let Ok(parsed) = room::parse_invite(&invite) {
        let ours = our_endpoint(&state)?;
        if parsed.endpoint == ours {
            let list = state.rooms.0.list(&ours);
            if let Some(s) = list.into_iter().find(|r| r.room_id == parsed.room_id) {
                return Ok(s);
            }
        }
    }
    join_remote(state.rooms.0.clone(), &invite, &nick)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn send_room_message(
    state: tauri::State<'_, AppState>,
    room_id: String,
    text: String,
    nick: String,
) -> Result<room::ChatMessage, String> {
    let endpoint = our_endpoint(&state)?;
    state
        .rooms
        .0
        .send_message(&room_id, &text, &endpoint, &nick)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn list_rooms(state: tauri::State<'_, AppState>) -> Result<Vec<room::RoomSummary>, String> {
    let endpoint = our_endpoint(&state)?;
    Ok(state.rooms.0.list(&endpoint))
}

#[tauri::command]
fn copy_room_invite(state: tauri::State<'_, AppState>, room_id: String) -> Result<String, String> {
    let endpoint = our_endpoint(&state)?;
    state
        .rooms
        .0
        .invite_for(&room_id, &endpoint)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn leave_room(state: tauri::State<'_, AppState>, room_id: String) -> Result<(), String> {
    state.rooms.0.close_room(&room_id);
    Ok(())
}

#[tauri::command]
fn parse_room_invite(invite: String) -> Result<room::RoomInvite, String> {
    room::parse_invite(&invite).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_cache_settings() -> Result<cache::CacheSettings, String> {
    cache::load_settings().map_err(|e| e.to_string())
}

#[tauri::command]
fn set_cache_settings(cache_messages: bool) -> Result<cache::CacheSettings, String> {
    let settings = cache::CacheSettings { cache_messages };
    cache::save_settings(&settings).map_err(|e| e.to_string())?;
    Ok(settings)
}

#[tauri::command]
fn load_cached_messages(room_id: String) -> Result<Vec<room::ChatMessage>, String> {
    cache::load_room(&room_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn clear_cached_room(room_id: String) -> Result<(), String> {
    cache::clear_room(&room_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn clear_all_cached_messages() -> Result<(), String> {
    cache::clear_all().map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = tracing_subscriber::fmt()
        .with_env_filter("pyrelink=info,iroh=warn")
        .try_init();

    let secret = identity::load_or_create_secret().expect("identity");
    let rooms = SharedRooms(Arc::new(RoomHub::new()));
    let state = AppState {
        oracle: SharedOracle(Arc::new(Mutex::new(None))),
        secret: Arc::new(Mutex::new(secret)),
        rooms: rooms.clone(),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(state)
        .setup(move |app| {
            rooms.0.set_app(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_status,
            start_oracle,
            stop_oracle,
            get_endpoint_id,
            get_default_share_dir,
            refresh_local_catalog,
            make_share_ticket,
            parse_share_ticket,
            fetch_share_ticket,
            mirror_share_ticket,
            mirror_local_file,
            list_library,
            connect_bootstrap,
            list_remote,
            list_remotes,
            download_remote,
            download_by_hash,
            library_path,
            create_project,
            set_project_thumbnail,
            set_project_description,
            add_files_to_project,
            import_folder_as_project,
            ensure_online,
            create_room,
            join_room,
            send_room_message,
            list_rooms,
            copy_room_invite,
            leave_room,
            parse_room_invite,
            get_cache_settings,
            set_cache_settings,
            load_cached_messages,
            clear_cached_room,
            clear_all_cached_messages
        ])
        .run(tauri::generate_context!())
        .expect("error while running PyreLink");
}
