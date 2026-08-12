ALTER TABLE connect_config ADD COLUMN oracles_json TEXT NOT NULL DEFAULT '[]';

-- Seed oracles_json from legacy single oracle_id when present.
UPDATE connect_config
SET oracles_json = CASE
  WHEN length(trim(oracle_id)) > 0 THEN json_array(trim(oracle_id))
  ELSE '[]'
END
WHERE id = 1;
