use std::path::{Path, PathBuf};

use anyhow::{bail, Context, Result};
use iroh::{Endpoint, EndpointId, endpoint::presets};
use serde::Serialize;
use tokio::io::AsyncWriteExt;

use crate::{
    identity::{hash_file, library_dir, safe_join},
    project::{self, ManifestBlob, ProjectManifest, ProjectMeta},
    protocol::{CatalogItem, Request, Response, ALPN},
    ticket::parse_ticket,
};

#[derive(Debug, Clone, Serialize)]
pub struct BootstrapInfo {
    pub label: String,
    pub oracles: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct FetchOutcome {
    pub path: String,
    pub name: String,
    pub sha256: String,
    pub kind: String,
    pub endpoint: String,
    pub file_count: Option<usize>,
    pub thumbnail_data_url: Option<String>,
}

fn normalize_hash(hash: &str) -> String {
    hash.trim().to_lowercase().replace("sha256:", "")
}

fn slugify(name: &str) -> String {
    let s = name
        .trim()
        .replace(['/', '\\', ':'], "-")
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || c == '-' || c == '_' {
                c
            } else if c == ' ' {
                '-'
            } else {
                '_'
            }
        })
        .collect::<String>();
    if s.is_empty() {
        "project".into()
    } else {
        s
    }
}

pub async fn fetch_connect(site_url: &str) -> Result<BootstrapInfo> {
    let base = site_url.trim_end_matches('/');
    let url = format!("{base}/api/connect");
    let body: serde_json::Value = reqwest::Client::new()
        .get(&url)
        .send()
        .await
        .context("connect fetch")?
        .error_for_status()
        .context("connect status")?
        .json()
        .await
        .context("connect json")?;

    let label = body
        .get("label")
        .and_then(|v| v.as_str())
        .unwrap_or("community")
        .to_string();

    let mut oracles = Vec::new();
    if let Some(arr) = body.get("oracles").and_then(|v| v.as_array()) {
        for v in arr {
            if let Some(s) = v.as_str() {
                let t = s.trim();
                if !t.is_empty() {
                    oracles.push(t.to_string());
                }
            }
        }
    }
    if oracles.is_empty() {
        if let Some(s) = body.get("oracle").and_then(|v| v.as_str()) {
            let t = s.trim();
            if !t.is_empty() {
                oracles.push(t.to_string());
            }
        }
    }
    oracles.sort();
    oracles.dedup();
    if oracles.is_empty() {
        bail!("no optional directory entries on that site");
    }
    Ok(BootstrapInfo { label, oracles })
}

async fn open_peer(oracle_hex: &str) -> Result<(Endpoint, iroh::endpoint::Connection)> {
    let endpoint_id: EndpointId = oracle_hex.parse().context("parse endpoint id")?;
    let endpoint = Endpoint::builder(presets::N0)
        .alpns(vec![ALPN.to_vec()])
        .bind()
        .await
        .context("bind local endpoint")?;
    endpoint.online().await;
    let conn = endpoint
        .connect(endpoint_id, ALPN)
        .await
        .context("dial peer")?;
    Ok((endpoint, conn))
}

async fn read_get_response(
    send: &mut iroh::endpoint::SendStream,
    recv: &mut iroh::endpoint::RecvStream,
    dest: &PathBuf,
) -> Result<(String, u64)> {
    let mut header = Vec::new();
    let mut tmp = [0u8; 1];
    loop {
        let n = recv.read(&mut tmp).await?.unwrap_or(0);
        if n == 0 {
            bail!("closed before meta");
        }
        header.push(tmp[0]);
        if tmp[0] == b'\n' {
            break;
        }
        if header.len() > 64 * 1024 {
            bail!("meta too large");
        }
    }
    let meta_line = String::from_utf8_lossy(&header);
    let resp: Response = serde_json::from_str(meta_line.trim()).context("parse get meta")?;
    let (ok, name, size, err) = match resp {
        Response::GetMeta {
            ok,
            name,
            size,
            error,
            ..
        } => (ok, name, size, error),
        Response::Err { error, .. } => bail!(error),
        _ => bail!("unexpected get response"),
    };
    if !ok {
        bail!(err.unwrap_or_else(|| "get failed".into()));
    }

    let mut file = tokio::fs::File::create(dest).await?;
    let mut remaining = size;
    let mut buf = vec![0u8; 64 * 1024];
    while remaining > 0 {
        let max = std::cmp::min(remaining as usize, buf.len());
        let n = recv.read(&mut buf[..max]).await?.unwrap_or(0);
        if n == 0 {
            bail!("truncated download");
        }
        file.write_all(&buf[..n]).await?;
        remaining -= n as u64;
    }
    file.flush().await?;
    let _ = send;
    Ok((name, size))
}

pub async fn list_catalog(oracle_hex: &str) -> Result<Vec<CatalogItem>> {
    let (endpoint, conn) = open_peer(oracle_hex).await?;
    let (mut send, mut recv) = conn.open_bi().await.context("open stream")?;
    let line = serde_json::to_string(&Request::List)? + "\n";
    send.write_all(line.as_bytes()).await?;
    send.finish()?;

    let buf = recv.read_to_end(2 * 1024 * 1024).await?;
    let text = String::from_utf8_lossy(&buf);
    let line = text.lines().next().unwrap_or("");
    let resp: Response = serde_json::from_str(line).context("parse list response")?;

    conn.close(0u32.into(), b"bye");
    endpoint.close().await;

    match resp {
        Response::List {
            ok,
            items,
            error: _,
        } if ok => Ok(items),
        Response::List { error, .. } => bail!(error.unwrap_or_else(|| "list failed".into())),
        Response::Err { error, .. } => bail!(error),
        _ => bail!("unexpected list response"),
    }
}

pub async fn download_file(oracle_hex: &str, name: &str) -> Result<PathBuf> {
    let dest_dir = library_dir()?;
    let dest = safe_join(&dest_dir, name)?;
    let (endpoint, conn) = open_peer(oracle_hex).await?;
    let (mut send, mut recv) = conn.open_bi().await.context("open stream")?;
    let line = serde_json::to_string(&Request::Get {
        name: name.to_string(),
    })? + "\n";
    send.write_all(line.as_bytes()).await?;
    send.finish()?;
    read_get_response(&mut send, &mut recv, &dest).await?;
    conn.close(0u32.into(), b"bye");
    endpoint.close().await;
    Ok(dest)
}

pub async fn download_by_hash_on(oracle_hex: &str, hash: &str) -> Result<(PathBuf, String)> {
    let want = normalize_hash(hash);
    let dest_dir = library_dir()?;
    let tmp_name = format!("hash-{}.bin", &want[..std::cmp::min(16, want.len())]);
    let dest = safe_join(&dest_dir, &tmp_name)?;

    let (endpoint, conn) = open_peer(oracle_hex).await?;
    let (mut send, mut recv) = conn.open_bi().await.context("open stream")?;
    let line = serde_json::to_string(&Request::GetByHash {
        hash: want.clone(),
    })? + "\n";
    send.write_all(line.as_bytes()).await?;
    send.finish()?;
    let (name, _) = read_get_response(&mut send, &mut recv, &dest).await?;
    conn.close(0u32.into(), b"bye");
    endpoint.close().await;

    let final_path = safe_join(&dest_dir, &name)?;
    if final_path != dest {
        let _ = tokio::fs::remove_file(&final_path).await;
        tokio::fs::rename(&dest, &final_path).await?;
        Ok((final_path, name))
    } else {
        Ok((dest, name))
    }
}

async fn download_blob_into(oracle_hex: &str, hash: &str, dest: &Path) -> Result<(String, u64)> {
    let want = normalize_hash(hash);
    if let Some(parent) = dest.parent() {
        tokio::fs::create_dir_all(parent).await?;
    }
    let (endpoint, conn) = open_peer(oracle_hex).await?;
    let (mut send, mut recv) = conn.open_bi().await.context("open stream")?;
    let line = serde_json::to_string(&Request::GetByHash { hash: want })? + "\n";
    send.write_all(line.as_bytes()).await?;
    send.finish()?;
    let result = read_get_response(&mut send, &mut recv, &dest.to_path_buf()).await?;
    conn.close(0u32.into(), b"bye");
    endpoint.close().await;
    Ok(result)
}

async fn assemble_project(
    oracle_hex: &str,
    manifest: &ProjectManifest,
    dest_root: &Path,
) -> Result<(PathBuf, Option<String>)> {
    let folder = slugify(&manifest.name);
    let mut dest = dest_root.join(&folder);
    let mut n = 1u32;
    while dest.exists() {
        dest = dest_root.join(format!("{folder}-{n}"));
        n += 1;
    }
    tokio::fs::create_dir_all(&dest).await?;

    let mut thumb_name = None;
    if let Some(ManifestBlob {
        name, sha256, ..
    }) = &manifest.thumbnail
    {
        let path = dest.join(name);
        download_blob_into(oracle_hex, sha256, &path).await?;
        thumb_name = Some(name.clone());
    }

    for blob in &manifest.files {
        let path = dest.join(&blob.name);
        download_blob_into(oracle_hex, &blob.sha256, &path).await?;
    }

    let meta = ProjectMeta {
        name: manifest.name.clone(),
        description: manifest.description.clone(),
        thumbnail: thumb_name,
    };
    project::save_meta(&dest, &meta)?;
    let (_m, _sha, _) = project::rebuild_manifest(&dest)?;
    let folder_name = dest
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    let thumb_url = project::scan_projects(dest_root)?
        .into_iter()
        .find(|p| p.folder == folder_name)
        .and_then(|p| p.thumbnail_data_url);
    Ok((dest, thumb_url))
}

/// Copy a completed project folder into the host share dir (mirror).
pub fn mirror_project_into_share(project_dir: &Path, share_dir: &Path) -> Result<CatalogItem> {
    std::fs::create_dir_all(share_dir)?;
    if !project_dir.is_dir() {
        bail!("not a project folder");
    }
    let meta = project::load_meta(project_dir)?;
    let (_, src_sha, _) = project::rebuild_manifest(project_dir)?;
    let folder = slugify(&meta.name);
    let mut dest = share_dir.join(&folder);
    let mut n = 1u32;
    while dest.exists() {
        if dest.is_dir() {
            if let Ok((_, sha, _)) = project::rebuild_manifest(&dest) {
                if sha == src_sha {
                    let folder_name = dest
                        .file_name()
                        .map(|s| s.to_string_lossy().to_string())
                        .unwrap_or_default();
                    let summary = project::scan_projects(share_dir)?
                        .into_iter()
                        .find(|p| p.folder == folder_name)
                        .context("mirrored project summary")?;
                    return Ok(project::summary_to_catalog(summary));
                }
            }
        }
        dest = share_dir.join(format!("{folder}-mirror{n}"));
        n += 1;
    }
    std::fs::create_dir_all(&dest)?;
    for entry in std::fs::read_dir(project_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() {
            std::fs::copy(&path, dest.join(entry.file_name()))?;
        }
    }
    let _ = project::save_meta(&dest, &meta);
    project::rebuild_manifest(&dest)?;
    let folder_name = dest
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    let summary = project::scan_projects(share_dir)?
        .into_iter()
        .find(|p| p.folder == folder_name)
        .context("new mirrored project summary")?;
    Ok(project::summary_to_catalog(summary))
}

pub async fn download_by_hash(oracles: &[String], hash: &str) -> Result<(PathBuf, String, String)> {
    let mut last_err = String::from("no oracles tried");
    for oracle in oracles {
        let oracle = oracle.trim();
        if oracle.is_empty() {
            continue;
        }
        match download_by_hash_on(oracle, hash).await {
            Ok((path, name)) => return Ok((path, name, oracle.to_string())),
            Err(e) => last_err = format!("{oracle}: {e}"),
        }
    }
    bail!("hash not found on any dialed peer ({last_err})")
}

pub async fn fetch_ticket_full(raw: &str) -> Result<FetchOutcome> {
    let ticket = parse_ticket(raw)?;
    let (path, name) = download_by_hash_on(&ticket.endpoint, &ticket.hash).await?;
    let bytes = tokio::fs::read(&path).await?;
    if let Some(manifest) = project::is_project_manifest_bytes(&bytes) {
        let lib = library_dir()?;
        let (proj_dir, thumb_url) = assemble_project(&ticket.endpoint, &manifest, &lib).await?;
        if path.is_file() && path.parent() == Some(lib.as_path()) {
            let _ = tokio::fs::remove_file(&path).await;
        }
        let (_m, sha, _) = project::rebuild_manifest(&proj_dir)?;
        return Ok(FetchOutcome {
            path: proj_dir.display().to_string(),
            name: manifest.name,
            sha256: sha,
            kind: "project".into(),
            endpoint: ticket.endpoint,
            file_count: Some(manifest.files.len()),
            thumbnail_data_url: thumb_url,
        });
    }
    let sha = hash_file(&path)?;
    Ok(FetchOutcome {
        path: path.display().to_string(),
        name,
        sha256: sha,
        kind: "file".into(),
        endpoint: ticket.endpoint,
        file_count: None,
        thumbnail_data_url: None,
    })
}

pub async fn mirror_ticket_full(raw: &str, share_dir: &Path) -> Result<(CatalogItem, FetchOutcome)> {
    let outcome = fetch_ticket_full(raw).await?;
    let item = if outcome.kind == "project" {
        mirror_project_into_share(Path::new(&outcome.path), share_dir)?
    } else {
        crate::identity::mirror_file_into_share(
            Path::new(&outcome.path),
            share_dir,
            Some(&outcome.name),
        )?
    };
    Ok((item, outcome))
}

pub async fn list_many(oracles: &[String]) -> Result<(Vec<CatalogItem>, Vec<String>)> {
    let mut merged: Vec<CatalogItem> = Vec::new();
    let mut alive = Vec::new();
    let mut seen_names = std::collections::HashSet::new();
    let mut last_err = None;

    for oracle in oracles {
        let oracle = oracle.trim();
        if oracle.is_empty() {
            continue;
        }
        match list_catalog(oracle).await {
            Ok(items) => {
                alive.push(oracle.to_string());
                for item in items {
                    if seen_names.insert(item.name.clone()) {
                        merged.push(item);
                    }
                }
            }
            Err(e) => last_err = Some(format!("{oracle}: {e}")),
        }
    }

    if alive.is_empty() {
        bail!(last_err.unwrap_or_else(|| "no reachable peers".into()));
    }
    merged.sort_by(|a, b| a.name.cmp(&b.name));
    Ok((merged, alive))
}
