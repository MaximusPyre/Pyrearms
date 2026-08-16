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

fn strip_wrappers(s: &str) -> &str {
    s.trim()
        .trim_matches(|c: char| matches!(c, '"' | '\'' | '`' | ',' | ';' | '(' | ')' | '[' | ']'))
}

fn looks_like_hex_blob(s: &str) -> bool {
    let t = s.trim();
    t.len() >= 32
        && t.len() <= 128
        && t.chars()
            .all(|c| c.is_ascii_hexdigit() || c == '-' || c == '_')
}

/// Pull a `pyrelink:1:…` token out of a tweet, quote, or multi-line paste.
fn extract_share_token(raw: &str) -> Option<String> {
    let idx = raw.find("pyrelink:1:")?;
    let rest = &raw[idx..];
    let line = rest
        .split(['\n', '\r', '<', '>'])
        .next()
        .unwrap_or(rest);
    Some(strip_wrappers(line).to_string())
}

pub fn parse_ticket(raw: &str) -> Result<ShareTicket> {
    let trimmed = strip_wrappers(raw);
    if trimmed.starts_with("pyrelink:room:") {
        bail!("that’s a room invite — open Rooms and paste it there");
    }
    let s = match extract_share_token(trimmed) {
        Some(token) => token,
        None if looks_like_hex_blob(trimmed) => {
            bail!(
                "that looks like an endpoint ID or file hash, not a share code. Copy a full ticket from Host: pyrelink:1:<endpoint>:<hash>"
            );
        }
        None => {
            bail!("not a pyrelink share ticket — expected pyrelink:1:<endpoint>:<hash>");
        }
    };
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn roundtrip() {
        let t = encode_ticket("a".repeat(40).as_str(), "b".repeat(64).as_str(), Some("kit"));
        let parsed = parse_ticket(&t).unwrap();
        assert_eq!(parsed.name.as_deref(), Some("kit"));
        assert_eq!(parsed.hash.len(), 64);
    }

    #[test]
    fn extracts_from_messy_paste() {
        let ep = "a".repeat(40);
        let h = "b".repeat(64);
        let blob = format!("check this out\n\"pyrelink:1:{ep}:{h}:Pyre Cycle\"\nthanks");
        let parsed = parse_ticket(&blob).unwrap();
        assert_eq!(parsed.endpoint, ep);
        assert_eq!(parsed.hash, h);
        assert_eq!(parsed.name.as_deref(), Some("Pyre Cycle"));
    }

    #[test]
    fn rejects_bare_endpoint() {
        let err = parse_ticket(&"a".repeat(64)).unwrap_err().to_string();
        assert!(err.contains("endpoint ID or file hash"), "{err}");
    }

    #[test]
    fn rejects_room_invite() {
        let err = parse_ticket("pyrelink:room:1:chat:abc:def").unwrap_err().to_string();
        assert!(err.contains("room invite"), "{err}");
    }
}
