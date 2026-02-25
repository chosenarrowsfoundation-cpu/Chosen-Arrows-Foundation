-- Transparency Documents - Admin-managed reports and documents for public transparency page
-- Migration: 010_transparency_documents
-- Documents are stored in Supabase Storage (images/transparency folder)

CREATE TABLE transparency_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  document_type VARCHAR(50) NOT NULL, -- Impact, Financial, Project, Governance
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL, -- storage path for deletion
  file_size_bytes BIGINT,
  published_date VARCHAR(50), -- e.g. "January 2025", "December 2024", "Updated 2024"
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_transparency_documents_published ON transparency_documents(is_published);
CREATE INDEX idx_transparency_documents_order ON transparency_documents(display_order);

CREATE TRIGGER update_transparency_documents_updated_at
  BEFORE UPDATE ON transparency_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER audit_transparency_documents
  AFTER INSERT OR UPDATE OR DELETE ON transparency_documents
  FOR EACH ROW
  EXECUTE FUNCTION log_content_changes();

ALTER TABLE transparency_documents ENABLE ROW LEVEL SECURITY;

-- Public can read published documents
CREATE POLICY "Public can read published transparency documents"
  ON transparency_documents FOR SELECT
  USING (is_published = true);

-- Admins can manage all
CREATE POLICY "Admins can manage transparency_documents"
  ON transparency_documents FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

COMMENT ON TABLE transparency_documents IS 'Documents and reports displayed on the public transparency page';
