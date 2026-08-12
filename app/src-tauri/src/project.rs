//! Folder projects: metadata + thumbnail + files, shared via a manifest hash.

use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};

use crate::identity::{hash_file, safe_join};

pub const META_FILE: &str = ".pyrelink.json";
pub const MANIFEST_FILE: &str = ".pyrelink.manifest.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectMeta {
    pub name: String,
    #[serde(default)]
    pub description: String,
    /// Relative filename inside the project folder (e.g. "thumb.webp").
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestBlob {
    pub name: String,
    pub sha256: String,
    pub size: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectManifest {
    pub v: u32,
    pub kind: String,
    pub name: String,
    #[serde(default)]
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<ManifestBlob>,
    pub files: Vec<ManifestBlob>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectSummary {
    pub id: String,
    pub name: String,
    pub description: String,
    pub folder: String,
    pub file_count: usize,
    pub manifest_sha256: String,
    pub manifest_size: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail_sha256: Option<String>,
    /// data URL for UI preview (small thumbs only).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail_data_url: Option<String>,
}

pub fn summary_to_catalog(p: ProjectSummary) -> crate::protocol::CatalogItem {
    crate::protocol::CatalogItem {
        name: p.name,
        size: p.manifest_size,
        sha256: p.manifest_sha256,
        kind: "project".into(),
        description: Some(p.description),
        file_count: Some(p.file_count),
        thumbnail_sha256: p.thumbnail_sha256,
        thumbnail_data_url: p.thumbnail_data_url,
        folder: Some(p.folder),
    }
}

fn is_reserved(name: &str) -> bool {
    name == META_FILE
        || name == MANIFEST_FILE
        || name.starts_with('.')
}

pub fn project_dir(share_dir: &Path, folder: &str) -> Result<PathBuf> {
    let dir = safe_join(share_dir, folder)?;
    if !dir.is_dir() {
        bail!("not a project folder");
    }
    Ok(dir)
}

pub fn load_meta(dir: &Path) -> Result<ProjectMeta> {
    let path = dir.join(META_FILE);
    if path.exists() {
        let raw = fs::read_to_string(&path)?;
        return Ok(serde_json::from_str(&raw)?);
    }
    let name = dir
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| "project".into());
    Ok(ProjectMeta {
        name,
        description: String::new(),
        thumbnail: None,
    })
}

pub fn save_meta(dir: &Path, meta: &ProjectMeta) -> Result<()> {
    fs::create_dir_all(dir)?;
    let path = dir.join(META_FILE);
    fs::write(path, serde_json::to_string_pretty(meta)?)?;
    Ok(())
}

pub fn create_project(share_dir: &Path, folder_name: &str, display_name: &str) -> Result<PathBuf> {
    let safe = folder_name
        .trim()
        .replace(['/', '\\', ':'], "-")
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '-' || *c == '_' || *c == ' ')
        .collect::<String>()
        .trim()
        .replace(' ', "-");
    if safe.is_empty() {
        bail!("invalid project name");
    }
    let dir = share_dir.join(&safe);
    if dir.exists() {
        bail!("project folder already exists");
    }
    fs::create_dir_all(&dir)?;
    save_meta(
        &dir,
        &ProjectMeta {
            name: display_name.trim().to_string(),
            description: String::new(),
            thumbnail: None,
        },
    )?;
    rebuild_manifest(&dir)?;
    Ok(dir)
}

pub fn set_thumbnail(dir: &Path, image_source: &Path) -> Result<ProjectMeta> {
    if !image_source.is_file() {
        bail!("thumbnail source is not a file");
    }
    let ext = image_source
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("img")
        .to_lowercase();
    if !matches!(
        ext.as_str(),
        "png" | "jpg" | "jpeg" | "webp" | "gif" | "bmp"
    ) {
        bail!("thumbnail must be an image (png/jpg/webp/gif)");
    }
    let dest_name = format!("thumb.{ext}");
    fs::copy(image_source, dir.join(&dest_name))?;
    let mut meta = load_meta(dir)?;
    meta.thumbnail = Some(dest_name);
    save_meta(dir, &meta)?;
    rebuild_manifest(dir)?;
    Ok(meta)
}

fn list_payload_files(dir: &Path) -> Result<Vec<PathBuf>> {
    let mut out = Vec::new();
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        let name = entry.file_name().to_string_lossy().to_string();
        if is_reserved(&name) {
            continue;
        }
        // Thumbnail is listed separately in manifest.
        if let Ok(meta) = load_meta(dir) {
            if meta.thumbnail.as_deref() == Some(name.as_str()) {
                continue;
            }
        }
        out.push(path);
    }
    out.sort();
    Ok(out)
}

pub fn build_manifest(dir: &Path) -> Result<ProjectManifest> {
    let meta = load_meta(dir)?;
    let mut files = Vec::new();
    for path in list_payload_files(dir)? {
        let name = path
            .file_name()
            .map(|s| s.to_string_lossy().to_string())
            .unwrap_or_default();
        let size = path.metadata()?.len();
        let sha256 = hash_file(&path)?;
        files.push(ManifestBlob { name, sha256, size });
    }
    let thumbnail = if let Some(ref thumb_name) = meta.thumbnail {
        let path = dir.join(thumb_name);
        if path.is_file() {
            Some(ManifestBlob {
                name: thumb_name.clone(),
                sha256: hash_file(&path)?,
                size: path.metadata()?.len(),
            })
        } else {
            None
        }
    } else {
        None
    };

    Ok(ProjectManifest {
        v: 1,
        kind: "project".into(),
        name: meta.name,
        description: meta.description,
        thumbnail,
        files,
    })
}

pub fn rebuild_manifest(dir: &Path) -> Result<(ProjectManifest, String, u64)> {
    let manifest = build_manifest(dir)?;
    let json = serde_json::to_string_pretty(&manifest)?;
    let path = dir.join(MANIFEST_FILE);
    fs::write(&path, &json)?;
    let sha256 = hash_file(&path)?;
    let size = path.metadata()?.len();
    Ok((manifest, sha256, size))
}

fn thumb_data_url(dir: &Path, meta: &ProjectMeta) -> Option<String> {
    let name = meta.thumbnail.as_ref()?;
    let path = dir.join(name);
    if !path.is_file() {
        return None;
    }
    let bytes = fs::read(&path).ok()?;
    if bytes.len() > 400_000 {
        return None;
    }
    let mime = match path.extension().and_then(|e| e.to_str()).unwrap_or("") {
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "webp" => "image/webp",
        "gif" => "image/gif",
        "bmp" => "image/bmp",
        _ => "application/octet-stream",
    };
    use base64::Engine;
    let b64 = base64::engine::general_purpose::STANDARD.encode(bytes);
    Some(format!("data:{mime};base64,{b64}"))
}

pub fn scan_projects(share_dir: &Path) -> Result<Vec<ProjectSummary>> {
    let mut out = Vec::new();
    if !share_dir.is_dir() {
        return Ok(out);
    }
    for entry in fs::read_dir(share_dir)? {
        let entry = entry?;
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }
        let folder = entry.file_name().to_string_lossy().to_string();
        if folder.starts_with('.') {
            continue;
        }
        // Treat as project if meta exists OR we create meta for any subdir with files.
        let meta_path = path.join(META_FILE);
        if !meta_path.exists() {
            // Auto-promote folders that look intentional (contain files).
            let has_files = fs::read_dir(&path)?
                .filter_map(|e| e.ok())
                .any(|e| e.path().is_file());
            if !has_files {
                continue;
            }
            let _ = save_meta(
                &path,
                &ProjectMeta {
                    name: folder.clone(),
                    description: String::new(),
                    thumbnail: None,
                },
            );
        }
        let meta = load_meta(&path)?;
        let (_manifest, sha, size) = rebuild_manifest(&path)?;
        let file_count = list_payload_files(&path)?.len();
        let thumbnail_sha256 = meta
            .thumbnail
            .as_ref()
            .and_then(|n| hash_file(path.join(n).as_path()).ok());
        out.push(ProjectSummary {
            id: folder.clone(),
            name: meta.name.clone(),
            description: meta.description.clone(),
            folder,
            file_count,
            manifest_sha256: sha,
            manifest_size: size,
            thumbnail_sha256,
            thumbnail_data_url: thumb_data_url(&path, &meta),
        });
    }
    out.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(out)
}

pub fn is_project_manifest_bytes(bytes: &[u8]) -> Option<ProjectManifest> {
    let v: ProjectManifest = serde_json::from_slice(bytes).ok()?;
    if v.v == 1 && v.kind == "project" {
        Some(v)
    } else {
        None
    }
}

pub fn find_project_by_manifest_hash(share_dir: &Path, hash: &str) -> Result<Option<(PathBuf, ProjectManifest)>> {
    let want = hash.trim().to_lowercase();
    for summary in scan_projects(share_dir)? {
        if summary.manifest_sha256 == want
            || summary.manifest_sha256.starts_with(&want)
            || want.starts_with(&summary.manifest_sha256)
        {
            let dir = project_dir(share_dir, &summary.folder)?;
            let manifest = build_manifest(&dir)?;
            return Ok(Some((dir, manifest)));
        }
    }
    Ok(None)
}

pub fn update_description(dir: &Path, description: &str) -> Result<ProjectMeta> {
    let mut meta = load_meta(dir)?;
    meta.description = description.to_string();
    save_meta(dir, &meta)?;
    rebuild_manifest(dir)?;
    Ok(meta)
}

pub fn ensure_share_layout(share_dir: &Path) -> Result<()> {
    fs::create_dir_all(share_dir)?;
    Ok(())
}

pub fn resolve_blob_path(share_dir: &Path, name: &str) -> Result<PathBuf> {
    // Prefer direct share-root file, then search project subfolders.
    let direct = share_dir.join(name);
    if direct.is_file() {
        return Ok(direct);
    }
    for entry in fs::read_dir(share_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            let candidate = path.join(name);
            if candidate.is_file() {
                return Ok(candidate);
            }
            // Also allow folder-relative names like "MyProj/file.stl" — already handled if name has slash? we ban slashes in safe_join.
        }
    }
    bail!("blob not found: {name}");
}

pub fn find_file_by_hash(share_dir: &Path, hash: &str) -> Result<Option<(PathBuf, String)>> {
    let want = hash.trim().to_lowercase();
    // Loose files + every project file + manifests + thumbs.
    if let Ok(entries) = fs::read_dir(share_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_file() {
                let name = entry.file_name().to_string_lossy().to_string();
                if let Ok(h) = hash_file(&path) {
                    if h == want || h.starts_with(&want) || want.starts_with(&h) {
                        return Ok(Some((path, name)));
                    }
                }
            } else if path.is_dir() {
                for sub in fs::read_dir(&path)?.flatten() {
                    let sp = sub.path();
                    if !sp.is_file() {
                        continue;
                    }
                    let name = sub.file_name().to_string_lossy().to_string();
                    if let Ok(h) = hash_file(&sp) {
                        if h == want || h.starts_with(&want) || want.starts_with(&h) {
                            return Ok(Some((sp, name)));
                        }
                    }
                }
            }
        }
    }
    Ok(None)
}

pub fn import_folder_as_project(share_dir: &Path, source_folder: &Path, name: &str) -> Result<PathBuf> {
    if !source_folder.is_dir() {
        bail!("source is not a folder");
    }
    let dest = create_project(share_dir, name, name)?;
    for entry in fs::read_dir(source_folder)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() {
            let fname = entry.file_name();
            fs::copy(&path, dest.join(&fname))?;
        }
    }
    rebuild_manifest(&dest)?;
    Ok(dest)
}
