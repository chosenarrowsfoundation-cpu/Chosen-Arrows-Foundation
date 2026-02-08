-- Mentor applications table
-- Stores applications from the mentorship page form
CREATE TABLE mentor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  occupation VARCHAR(255),
  why_mentor TEXT,
  skills_expertise TEXT,
  availability TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mentor_applications_email ON mentor_applications(email);
CREATE INDEX idx_mentor_applications_status ON mentor_applications(status);
CREATE INDEX idx_mentor_applications_created ON mentor_applications(created_at DESC);

ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;

-- Admins can view all mentor applications
CREATE POLICY "Admins can view mentor applications"
  ON mentor_applications FOR SELECT
  USING (is_admin_user());

-- Service role can insert (used by server action - no auth required for public form)
CREATE POLICY "Anyone can submit mentor application"
  ON mentor_applications FOR INSERT
  WITH CHECK (true);

-- Admins can update (e.g. change status)
CREATE POLICY "Admins can update mentor applications"
  ON mentor_applications FOR UPDATE
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE TRIGGER update_mentor_applications_updated_at
  BEFORE UPDATE ON mentor_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
