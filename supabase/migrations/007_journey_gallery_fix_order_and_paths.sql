-- Fix: use URL-safe filenames (files were renamed from WhatsApp/2026 names) and put the 3 new images first

-- Update the 3 new images to new paths and set sort_order 0,1,2 (first)
UPDATE journey_gallery SET path = '/about/journey-2026-1.jpeg', sort_order = 0
  WHERE path = '/about/ 2026-02-17 at 4.19.38 AM.jpeg';

UPDATE journey_gallery SET path = '/about/journey-2026-2.jpeg', sort_order = 1
  WHERE path = '/about/WhatsApp Image 2026-02-17 at 4.19.37 AM.jpeg';

UPDATE journey_gallery SET path = '/about/journey-2026-3.jpeg', sort_order = 2
  WHERE path = '/about/WhatsApp Image 2026-02-17 at 4.19.38 AM.jpeg';

-- Move the original 5 images to sort_order 3,4,5,6,7 (after the 3 new)
UPDATE journey_gallery SET sort_order = 3 WHERE path = '/about/Image with the kids .jpeg';
UPDATE journey_gallery SET sort_order = 4 WHERE path = '/about/Image 2.jpeg';
UPDATE journey_gallery SET sort_order = 5 WHERE path = '/about/Banner kind image.jpeg';
UPDATE journey_gallery SET sort_order = 6 WHERE path = '/about/Image 3.jpeg';
UPDATE journey_gallery SET sort_order = 7 WHERE path = '/about/Winnie image with a kid 2.jpeg';
