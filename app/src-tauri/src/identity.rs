use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::{Context, Result};
use iroh::SecretKey;
use sha2::{Digest, Sha256};

use crate::protocol::CatalogItem;

pub fn data_dir() -> Result<PathBuf> {
    let base = dirs::data_dir().context("no data dir")?;
    let dir = base.join("PyreLink");
    fs::create_dir_all(&dir)?;
    Ok(dir)
}

pub fn load_or_create_secret() -> Result<SecretKey> {
    let path = data_dir()?.join("oracle.key");
    if path.exists() {
        let bytes = fs::read(&path)?;
        if bytes.len() != 32 {
            anyhow::bail!("invalid oracle.key length");
        }
        let mut arr = [0u8; 32];
        arr.copy_from_slice(&bytes);
        return Ok(SecretKey::from(arr));
    }
    let key = SecretKey::generate();
    fs::write(&path, key.to_bytes())?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let _ = fs::set_permissions(&path, fs::Permissions::from_mode(0o600));
    }
    Ok(key)
}

pub fn library_dir() -> Result<PathBuf> {
    let dir = data_dir()?.join("library");
    fs::create_dir_all(&dir)?;
    Ok(dir)
}

pub fn default_share_dir() -> Result<PathBuf> {
    let dir = data_dir()?.join("share");
    fs::create_dir_all(&dir)?;
    let readme = dir.join("WELCOME.txt");
    if !readme.exists() {
        fs::write(
            readme,
            "PyreLink share folder.\nDrop files here, or create Projects (folders + thumbnail).\nGo online, copy share codes. Keep the app running so peers can fetch.\n",
        )?;
    }
    Ok(dir)
}

pub fn scan_catalog(share: &Path) -> Result<Vec<CatalogItem>> {
    let mut items = Vec::new();
    if !share.exists() {
        return Ok(items);
    }
    for entry in fs::read_dir(share)? {
        let entry = entry?;
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        let name = entry.file_name().to_string_lossy().to_string();
        if name.starts_with('.') {
            continue;
        }
        let meta = fs::metadata(&path)?;
        let sha256 = hash_file(&path)?;
        items.push(CatalogItem {
            name,
            size: meta.len(),
            sha256,
            kind: "file".into(),
            description: None,
            file_count: None,
            thumbnail_sha256: None,
            thumbnail_data_url: None,
            folder: None,
        });
    }
    items.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(items)
}

pub fn hash_file(path: &Path) -> Result<String> {
    let mut file = fs::File::open(path)?;
    let mut hasher = Sha256::new();
    std::io::copy(&mut file, &mut hasher)?;
    Ok(hex::encode(hasher.finalize()))
}

pub fn safe_join(dir: &Path, name: &str) -> Result<PathBuf> {
    if name.contains("..") || name.contains('/') || name.contains('\\') || name.is_empty() {
        anyhow::bail!("invalid name");
    }
    Ok(dir.join(name))
}

/// Copy a local file into the share folder (mirror). Same hash → reuse; name clash → suffix.
pub fn mirror_file_into_share(
    source: &Path,
    share_dir: &Path,
    preferred_name: Option<&str>,
) -> Result<CatalogItem> {
    fs::create_dir_all(share_dir)?;
    if !source.is_file() {
        anyhow::bail!("source is not a file");
    }
    let src_hash = hash_file(source)?;
    let existing = scan_catalog(share_dir)?;
    if let Some(hit) = existing.iter().find(|i| i.sha256 == src_hash) {
        return Ok(hit.clone());
    }

    let base_name = preferred_name
        .map(str::trim)
        .filter(|n| !n.is_empty())
        .map(|n| n.replace(['/', '\\', ':'], "_"))
        .unwrap_or_else(|| {
            source
                .file_name()
                .map(|s| s.to_string_lossy().to_string())
                .unwrap_or_else(|| format!("mirror-{}.bin", &src_hash[..12]))
        });

    let mut dest_name = base_name.clone();
    let mut n = 1u32;
    while share_dir.join(&dest_name).exists() {
        let stem = Path::new(&base_name)
            .file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("file");
        let ext = Path::new(&base_name)
            .extension()
            .and_then(|s| s.to_str())
            .map(|e| format!(".{e}"))
            .unwrap_or_default();
        dest_name = format!("{stem}-mirror{n}{ext}");
        n += 1;
    }

    let dest = share_dir.join(&dest_name);
    fs::copy(source, &dest)?;
    let meta = fs::metadata(&dest)?;
    Ok(CatalogItem {
        name: dest_name,
        size: meta.len(),
        sha256: src_hash,
        kind: "file".into(),
        description: None,
        file_count: None,
        thumbnail_sha256: None,
        thumbnail_data_url: None,
        folder: None,
    })
}

pub fn list_library() -> Result<Vec<CatalogItem>> {
    scan_catalog(&library_dir()?)
}
