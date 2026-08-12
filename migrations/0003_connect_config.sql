CREATE TABLE IF NOT EXISTS connect_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  oracle_id TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT 'community',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO connect_config (id, oracle_id, label) VALUES (1, '', 'community');
