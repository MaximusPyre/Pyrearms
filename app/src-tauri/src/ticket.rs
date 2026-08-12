//! Share tickets — pasteable codes for social media.
//!
//! Format: `pyrelink:1:<endpoint_id>:<sha256>[:<filename>]`
//!
//! Posting this (not a clearnet URL) is enough for anyone with PyreLink to
//! dial the host and fetch the file. The host must keep their oracle online.

use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShareTicket {
    pub endpoint: String,
    pub hash: String,
    pub name: Option<String>,
}

pub fn encode_ticket(endpoint: &str, hash: &str, name: Option<&str>) -> String {
    let ep = endpoint.trim();
    let h = hash.trim().to_lowercase().replace("sha256:", "");
    match name.map(str::trim).filter(|n| !n.is_empty()) {
        Some(n) => {
            // Keep filenames ticket-safe (no colons).
            let safe = n.replace(':', "_");
            format!("pyrelink:1:{ep}:{h}:{safe}")
        }
        None => format!("pyrelink:1:{ep}:{h}"),
    }
}

pub fn parse_ticket(raw: &str) -> Result<ShareTicket> {
    let s = raw.trim();
    let Some(rest) = s.strip_prefix("pyrelink:1:") else {
        bail!("not a pyrelink share ticket — expected pyrelink:1:<endpoint>:<hash>");
    };
    let parts: Vec<&str> = rest.splitn(3, ':').collect();
    if parts.len() < 2 {
        bail!("ticket needs endpoint and hash");
    }
    let endpoint = parts[0].trim().to_string();
    let hash = parts[1].trim().to_lowercase();
    let name = parts
        .get(2)
        .map(|n| n.trim().to_string())
        .filter(|n| !n.is_empty());
    if endpoint.len() < 32 || hash.len() < 16 {
        bail!("invalid ticket fields");
    }
    Ok(ShareTicket {
        endpoint,
        hash,
        name,
    })
}
