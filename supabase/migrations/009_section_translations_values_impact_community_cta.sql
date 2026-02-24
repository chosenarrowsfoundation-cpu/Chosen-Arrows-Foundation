-- Add French and Chinese translations for values, impact, community, and cta sections
-- Ensures homepage sections translate when user switches language

-- Values section
INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT cs.id, 'fr', '{"title": "Nos valeurs fondamentales", "subtitle": "R.I.T.A.H + Communauté", "description": "Principes directeurs qui façonnent tout ce que nous faisons et chaque vie que nous touchons", "values": [{"key": "responsibility", "title": "Responsabilité", "description": "Nous prenons soin de chaque enfant qui nous est confié avec compassion et responsabilité."}, {"key": "integrity", "title": "Intégrité", "description": "Nous défendons l''honnêteté et la transparence dans chaque action et partenariat."}, {"key": "trust", "title": "Confiance", "description": "Nous construisons des relations fiables enracinées dans l''amour et la cohérence."}, {"key": "adeptness", "title": "Compétence", "description": "Nous servons avec excellence, apprenant et grandissant toujours dans un but précis."}, {"key": "honesty", "title": "Honnêteté", "description": "Nous disons la vérité avec amour — reflétant la nature et la lumière de Dieu."}, {"key": "community", "title": "Communauté", "description": "Nous favorisons l''appartenance et la connexion, construisant une famille de soutien autour de chaque enfant."}], "vision": {"title": "Notre vision", "quote": "Tout comme des flèches dans les mains d''un archer qualifié, nous visons à guider les enfants que Dieu nous confie vers la direction de leurs destins ordonnés."}}'::jsonb, NOW()
FROM content_sections cs WHERE cs.section_key = 'values'
ON CONFLICT (section_id, language_code) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT cs.id, 'zh', '{"title": "我们的核心价值观", "subtitle": "R.I.T.A.H", "description": "指导我们所做的一切和我们触及的每一个生命的原则", "values": [{"key": "responsibility", "title": "责任", "description": "我们以同情心和责任心照顾托付给我们的每一个孩子。"}, {"key": "integrity", "title": "诚信", "description": "我们在每一项行动和伙伴关系中坚持诚实和透明。"}, {"key": "trust", "title": "信任", "description": "我们建立植根于爱和一致性的可靠关系。"}, {"key": "adeptness", "title": "熟练", "description": "我们以卓越的态度服务，始终在目标中学习和成长。"}, {"key": "honesty", "title": "正直", "description": "我们以爱说真话——反映上帝的本性和光芒。"}, {"key": "community", "title": "社区", "description": "我们培养归属感和联系，为每个孩子建立一个支持家庭。"}], "vision": {"title": "我们的愿景", "quote": "就像技艺精湛的弓箭手手中的箭一样，我们的目标是引导上帝托付给我们的孩子走向他们注定的命运方向。"}}'::jsonb, NOW()
FROM content_sections cs WHERE cs.section_key = 'values'
ON CONFLICT (section_id, language_code) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- Impact section
INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT cs.id, 'fr', '{"title": "Mesurer l''impact réel", "subtitle": "Chaque nombre raconte une histoire de transformation, d''espoir et de destin divin accompli", "stats": [{"value": "45", "label": "Enfants soutenus", "description": "Vies touchées et transformées"}, {"value": "30", "label": "Bourses attribuées", "description": "Rêves éducatifs réalisés"}, {"value": "8", "label": "Mentorats actifs", "description": "Guidés vers un but"}, {"value": "100+", "label": "Donateurs dans le monde", "description": "Partenaires d''espoir"}, {"value": "95%", "label": "Taux de réussite", "description": "Atteindre les jalons"}, {"value": "1", "label": "Pays servi", "description": "Kenya"}], "transparency": {"title": "Transparence à chaque étape", "description": "Nous croyons en une transparence totale. Chaque don est suivi, chaque jalon est documenté. Vous êtes témoin de la transformation.", "features": ["Mises à jour en temps réel", "Impact vérifié", "Responsabilité totale"]}}'::jsonb, NOW()
FROM content_sections cs WHERE cs.section_key = 'impact'
ON CONFLICT (section_id, language_code) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT cs.id, 'zh', '{"title": "衡量真实影响", "subtitle": "每个数字都讲述着转变、希望和实现神圣目标的故事", "stats": [{"value": "45", "label": "支持的儿童", "description": "触及和改变的生命"}, {"value": "30", "label": "颁发的奖学金", "description": "实现的教育梦想"}, {"value": "8", "label": "活跃的导师关系", "description": "引导走向目标"}, {"value": "100+", "label": "全球捐赠者", "description": "希望的伙伴"}, {"value": "95%", "label": "成功率", "description": "达到里程碑"}, {"value": "1", "label": "服务国家", "description": "肯尼亚"}], "transparency": {"title": "每一步都透明", "description": "我们相信完全透明。每一笔捐款都被追踪，每一个里程碑都被记录。你见证转变。", "features": ["实时更新", "经过验证的影响", "完全问责"]}}'::jsonb, NOW()
FROM content_sections cs WHERE cs.section_key = 'impact'
ON CONFLICT (section_id, language_code) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- Community section
INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT cs.id, 'fr', '{"title": "Une communauté de bâtisseurs d''espoir", "subtitle": "Écoutez ceux qui croient, donnent et témoignent de la transformation", "imageCaption": "Ensemble, nous façonnons la prochaine génération de leaders", "stats": {"donorRetention": "98%", "avgRating": "4.9★", "transparency": "100%"}}'::jsonb, NOW()
FROM content_sections cs WHERE cs.section_key = 'community'
ON CONFLICT (section_id, language_code) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT cs.id, 'zh', '{"title": "希望建设者社区", "subtitle": "倾听那些相信、给予和见证转变的人", "imageCaption": "我们一起塑造下一代领导者", "stats": {"donorRetention": "98%", "avgRating": "4.9★", "transparency": "100%"}}'::jsonb, NOW()
FROM content_sections cs WHERE cs.section_key = 'community'
ON CONFLICT (section_id, language_code) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

-- CTA section
INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT cs.id, 'fr', '{"title": "Faites partie de quelque chose d''éternel", "subtitle": "Chaque flèche a besoin de guidance. Chaque enfant a besoin d''espoir. Votre soutien peut changer une vie pour toujours.", "mainCta": "Faites votre impact aujourd''hui", "items": [{"title": "Don unique ou mensuel", "description": "Choisissez un montant qui vous convient et regardez votre impact grandir", "action": "Commencer à donner", "href": "/donate"}, {"title": "Devenir mentor", "description": "Partagez votre temps, sagesse et expérience avec un enfant dans le besoin", "action": "Postuler comme mentor", "href": "/mentorship"}, {"title": "Parrainer un enfant", "description": "Créez un lien durable et suivez leur voyage vers un but", "action": "Trouvez votre flèche", "href": "/donate"}]}'::jsonb, NOW()
FROM content_sections cs WHERE cs.section_key = 'cta'
ON CONFLICT (section_id, language_code) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();

INSERT INTO content_translations (section_id, language_code, content, updated_at)
SELECT cs.id, 'zh', '{"title": "成为永恒事业的一部分", "subtitle": "每支箭都需要指引。每个孩子都需要希望。您的支持可以永远改变一个生命。", "mainCta": "今天就产生影响", "items": [{"title": "一次性或每月捐赠", "description": "选择一个合适的金额，看着您的影响力增长", "action": "开始捐赠", "href": "/donate"}, {"title": "成为导师", "description": "与需要帮助的孩子分享您的时间、智慧和经验", "action": "申请成为导师", "href": "/mentorship"}, {"title": "资助儿童", "description": "建立持久的纽带，跟随他们走向目标的旅程", "action": "找到您的箭", "href": "/donate"}]}'::jsonb, NOW()
FROM content_sections cs WHERE cs.section_key = 'cta'
ON CONFLICT (section_id, language_code) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
