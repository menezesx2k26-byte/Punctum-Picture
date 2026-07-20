INSERT INTO site_settings (
  id,
  brand_name,
  tagline,
  about_text,
  whatsapp_e164,
  whatsapp_message,
  instagram_url,
  contact_email,
  seo_title,
  seo_description,
  updated_at
) VALUES (
  1,
  'Punctum Picture',
  'UNSPECIFIED — uma frase curta será definida por Maria Helena.',
  'UNSPECIFIED — texto de apresentação a ser fornecido por Maria Helena.',
  NULL,
  'Olá, Maria Helena! Gostaria de conversar sobre um ensaio.',
  NULL,
  NULL,
  'Punctum Picture — fotografia autoral',
  'Portfólio de fotografia da Punctum Picture.',
  '2026-07-20T00:00:00.000Z'
);

INSERT INTO categories (
  id,
  name,
  slug,
  description,
  sort_order,
  is_visible,
  created_at,
  updated_at
) VALUES
  ('seed-casamentos', 'Casamentos', 'casamentos', 'Histórias de casamento e celebrações.', 1000, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('seed-ensaios', 'Ensaios', 'ensaios', 'Retratos, casais e narrativas pessoais.', 2000, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z');
