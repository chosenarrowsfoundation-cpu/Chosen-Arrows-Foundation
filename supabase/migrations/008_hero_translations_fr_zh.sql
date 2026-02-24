-- Add French and Chinese translations for hero section
-- Ensures hero title, badge, subtitle, and CTAs translate when user switches language

INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT
  cs.id,
  lang.code,
  lang.content,
  NOW()
FROM content_sections cs
CROSS JOIN (
  VALUES
    ('fr', '{
      "badge": "Autonomiser les enfants, façonner les destins",
      "title": "Chaque enfant est une flèche dans la main de Dieu",
      "subtitle": "Nous guidons les enfants vers leurs destins ordonnés par le mentorat, l''éducation et un soutien transparent — plantant des graines d''espoir qui illumineront le monde.",
      "cta": "Commencer à donner de l''espoir",
      "ctaMentor": "Devenir mentor",
      "stats": {
        "childrenSupported": 45,
        "activeMentors": 8,
        "fundsRaised": 15000
      }
    }'::jsonb),
    ('zh', '{
      "badge": "赋能儿童，塑造命运",
      "title": "每个孩子都是上帝手中的箭",
      "subtitle": "我们通过导师指导、教育和透明支持引导孩子走向他们注定的命运——播下希望的种子，照亮世界。",
      "cta": "开始给予希望",
      "ctaMentor": "成为导师",
      "stats": {
        "childrenSupported": 45,
        "activeMentors": 8,
        "fundsRaised": 15000
      }
    }'::jsonb)
) AS lang(code, content)
WHERE cs.section_key = 'hero'
ON CONFLICT (section_id, language_code) DO UPDATE
SET content = EXCLUDED.content,
    updated_at = NOW();
