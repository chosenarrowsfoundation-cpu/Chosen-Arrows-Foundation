-- Journey gallery: images shown in "Our Journey in Pictures" on the About page.
-- path: storage path (e.g. journey/filename.jpg) or static path (e.g. /about/Image 2.jpeg)

CREATE TABLE journey_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  span TEXT NOT NULL DEFAULT 'col-span-1 row-span-1',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journey_gallery_sort ON journey_gallery(sort_order);

ALTER TABLE journey_gallery ENABLE ROW LEVEL SECURITY;

-- Public can read (for About page)
CREATE POLICY "Public can read journey_gallery"
  ON journey_gallery FOR SELECT
  USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage journey_gallery"
  ON journey_gallery FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Seed current live images (static paths from public/about)
INSERT INTO journey_gallery (path, alt, span, sort_order) VALUES
  ('/about/Image with the kids .jpeg', 'Our children together', 'col-span-2 row-span-2', 0),
  ('/about/Image 2.jpeg', 'Growing stronger', 'col-span-1 row-span-1', 1),
  ('/about/Banner kind image.jpeg', 'Community impact', 'col-span-2 row-span-1', 2),
  ('/about/Image 3.jpeg', 'Hope for tomorrow', 'col-span-1 row-span-1', 3),
  ('/about/Winnie image with a kid 2.jpeg', 'Building futures together', 'col-span-1 row-span-1', 4);

COMMENT ON TABLE journey_gallery IS 'Images for the About page "Our Journey in Pictures" gallery; manageable from admin media.';
