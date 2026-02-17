-- Integration config table for API keys and secrets (Admin → Settings → API & Integrations).
-- Only the server (service role) reads/writes this table; RLS ensures no client access.
-- Safe to re-run: skips creation if table already exists.
CREATE TABLE IF NOT EXISTS integration_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integration_config_updated ON integration_config(updated_at);

ALTER TABLE integration_config ENABLE ROW LEVEL SECURITY;

-- No policies for anon or authenticated: only service role (server) can read/write.
-- This keeps API secrets out of the browser and restricts access to server-side code.

COMMENT ON TABLE integration_config IS 'API keys and integration config; server-only access via service role.';
