-- Clearnet stores peer endpoint IDs only. Drop legacy commerce/file tables.
-- R2 file bucket binding is also removed from wrangler.jsonc.

DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
