use serde::{Deserialize, Serialize};

pub const ALPN: &[u8] = b"pyrelink/share/1";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "op", rename_all = "snake_case")]
pub enum Request {
    List,
    Get { name: String },
    GetByHash { hash: String },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CatalogItem {
    pub name: String,
    pub size: u64,
    pub sha256: String,
    /// "file" (default) or "project"
    #[serde(default = "default_kind")]
    pub kind: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_count: Option<usize>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail_sha256: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail_data_url: Option<String>,
    /// Project folder name under the share root (set for kind=project).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub folder: Option<String>,
}

fn default_kind() -> String {
    "file".into()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum Response {
    List {
        ok: bool,
        items: Vec<CatalogItem>,
        #[serde(skip_serializing_if = "Option::is_none")]
        error: Option<String>,
    },
    GetMeta {
        ok: bool,
        name: String,
        size: u64,
        sha256: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        error: Option<String>,
    },
    Err {
        ok: bool,
        error: String,
    },
}
