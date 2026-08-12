//! Local-only message cache for boards / chat / DMs.
//! Never uploaded to clearnet. Optional QoL for the signed-in device user.

use std::{
    fs::{self, OpenOptions},
    io::{BufRead, BufReader, Write},
    path::PathBuf,
};

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};

use crate::identity::data_dir;
use crate::room::ChatMessage;

const MAX_PER_ROOM: usize = 2000;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CacheSettings {
    /// When true, decrypted messages are appended under the local data dir.
    pub cache_messages: bool,
}

impl Default for CacheSettings {
    fn default() -> Self {
        Self {
            cache_messages: false,
        }
    }
}

fn settings_path() -> Result<PathBuf> {
    Ok(data_dir()?.join("settings.json"))
}

fn cache_root() -> Result<PathBuf> {
    let dir = data_dir()?.join("message_cache");
    fs::create_dir_all(&dir)?;
    Ok(dir)
}

fn room_cache_path(room_id: &str) -> Result<PathBuf> {
    let safe: String = room_id
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || c == '-' || c == '_' {
                c
            } else {
                '_'
            }
        })
        .take(128)
        .collect();
    if safe.is_empty() {
        anyhow::bail!("bad room id");
    }
    Ok(cache_root()?.join(format!("{safe}.jsonl")))
}

pub fn load_settings() -> Result<CacheSettings> {
    let path = settings_path()?;
    if !path.exists() {
        return Ok(CacheSettings::default());
    }
    let raw = fs::read_to_string(&path)?;
    Ok(serde_json::from_str(&raw).unwrap_or_default())
}

pub fn save_settings(settings: &CacheSettings) -> Result<()> {
    let path = settings_path()?;
    fs::write(path, serde_json::to_string_pretty(settings)?)?;
    Ok(())
}

pub fn maybe_append(msg: &ChatMessage) {
    let Ok(settings) = load_settings() else {
        return;
    };
    if !settings.cache_messages {
        return;
    }
    let _ = append(msg);
}

pub fn append(msg: &ChatMessage) -> Result<()> {
    let path = room_cache_path(&msg.room_id)?;
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)
        .context("open room cache")?;
    let line = serde_json::to_string(msg)?;
    writeln!(file, "{line}")?;

    // Trim if overgrown (rewrite last MAX_PER_ROOM).
    let loaded = load_room(&msg.room_id)?;
    if loaded.len() > MAX_PER_ROOM {
        rewrite_room(&msg.room_id, &loaded[loaded.len() - MAX_PER_ROOM..])?;
    }
    Ok(())
}

pub fn load_room(room_id: &str) -> Result<Vec<ChatMessage>> {
    let path = room_cache_path(room_id)?;
    if !path.exists() {
        return Ok(Vec::new());
    }
    let file = fs::File::open(&path)?;
    let reader = BufReader::new(file);
    let mut out = Vec::new();
    for line in reader.lines() {
        let line = line?;
        let t = line.trim();
        if t.is_empty() {
            continue;
        }
        if let Ok(msg) = serde_json::from_str::<ChatMessage>(t) {
            out.push(msg);
        }
    }
    Ok(out)
}

fn rewrite_room(room_id: &str, msgs: &[ChatMessage]) -> Result<()> {
    let path = room_cache_path(room_id)?;
    let mut file = fs::File::create(&path)?;
    for msg in msgs {
        writeln!(file, "{}", serde_json::to_string(msg)?)?;
    }
    Ok(())
}

pub fn clear_room(room_id: &str) -> Result<()> {
    let path = room_cache_path(room_id)?;
    if path.exists() {
        fs::remove_file(path)?;
    }
    Ok(())
}

pub fn clear_all() -> Result<()> {
    let root = cache_root()?;
    if root.is_dir() {
        for entry in fs::read_dir(root)? {
            let entry = entry?;
            let path = entry.path();
            if path.extension().and_then(|e| e.to_str()) == Some("jsonl") {
                let _ = fs::remove_file(path);
            }
        }
    }
    Ok(())
}
