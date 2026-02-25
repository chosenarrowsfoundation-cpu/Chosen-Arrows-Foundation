-- Seed default transparency documents (manageable from admin - can be edited or deleted)
-- These appear on the public page until admin removes them. Upload real files via admin to replace placeholders.
-- Only runs when table is empty to avoid duplicates on re-run.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM transparency_documents LIMIT 1) THEN
    INSERT INTO transparency_documents (title, document_type, file_url, file_path, published_date, display_order)
    VALUES
      ('2024 Annual Impact Report', 'Impact', '#', 'transparency/placeholder-impact', 'January 2025', 0),
      ('2024 Financial Statements', 'Financial', '#', 'transparency/placeholder-financial', 'January 2025', 1),
      ('Q4 2024 Project Update', 'Project', '#', 'transparency/placeholder-project', 'December 2024', 2),
      ('Foundation Bylaws', 'Governance', '#', 'transparency/placeholder-governance', 'Updated 2024', 3);
  END IF;
END $$;
