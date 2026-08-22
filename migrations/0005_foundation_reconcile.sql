-- Phase 0 reconciliation for installations created from the canonical
-- Wrangler migration directory. This migration is intentionally idempotent so
-- databases previously initialized by the legacy `drizzle/` track keep their
-- existing administrative content.

CREATE TABLE IF NOT EXISTS admin_credentials (
  id INTEGER PRIMARY KEY,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_iterations INTEGER NOT NULL,
  updated_at TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

UPDATE site_settings
SET
  tagline = CASE
    WHEN tagline LIKE 'UNSPECIFIED%' THEN 'Fotografia de presença, gesto e movimento.'
    ELSE tagline
  END,
  about_text = CASE
    WHEN about_text LIKE 'UNSPECIFIED%' THEN 'O trabalho de Maria Helena se aproxima sem invadir. Busca a textura dos lugares, a verdade dos gestos e o instante em que uma pessoa deixa de posar para simplesmente estar.'
    ELSE about_text
  END,
  updated_at = CASE
    WHEN tagline LIKE 'UNSPECIFIED%' OR about_text LIKE 'UNSPECIFIED%'
      THEN '2026-08-22T00:00:00.000Z'
    ELSE updated_at
  END
WHERE id = 1;

INSERT OR IGNORE INTO categories
  (id, name, slug, description, sort_order, is_visible, created_at, updated_at)
VALUES
  ('portfolio-documental', 'Documental', 'documental', 'Fé, encontros e histórias coletivas.', 100, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('portfolio-movimento', 'Movimento', 'movimento', 'Velocidade, matéria e gesto.', 200, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('portfolio-cotidiano', 'Cotidiano', 'cotidiano', 'Arquitetura, natureza e caminho.', 300, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('portfolio-musica', 'Música', 'musica', 'Palcos, artistas e presença.', 400, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('portfolio-retrato', 'Retrato', 'retrato', 'Ensaios e narrativas pessoais.', 500, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('portfolio-esporte', 'Esporte', 'esporte', 'Corpo, concentração e instante decisivo.', 600, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('portfolio-familia', 'Família', 'familia', 'Infância, afeto e celebração.', 700, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('portfolio-autorretrato', 'Autorretrato', 'autorretrato', 'Imagem principal de Maria Helena.', 800, 1, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z');

INSERT OR IGNORE INTO albums
  (id, slug, title, subtitle, description, status, cover_image_id, featured, sort_order, published_at, created_at, updated_at)
VALUES
  ('static-maria-helena', 'maria-helena', 'Imagem principal — Maria Helena', 'Retrato usado na abertura do site', 'Imagem de apresentação de Maria Helena fotografando.', 'draft', 'static-p001', 0, 0, NULL, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-ritos-de-luz', 'ritos-de-luz', 'Fé e Tradição', 'Fé, silêncio e comunidade iluminados por dentro', 'Velas, encontros e símbolos de devoção compõem uma narrativa de presença coletiva. A luz pequena atravessa a sombra e transforma o gesto cotidiano em memória.', 'published', 'static-p009', 1, 1000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-velocidade-e-materia', 'velocidade-e-materia', 'Velocidade & matéria', 'Terra, metal e segundos que não voltam', 'Entre a poeira da pista e o brilho de um automóvel antigo, o movimento aparece como textura. Um ensaio sobre força, cor e o prazer de perseguir o instante.', 'published', 'static-p005', 0, 2000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-intervalos-da-cidade', 'intervalos-da-cidade', 'Intervalos da cidade', 'Pequenas pausas entre arquitetura, natureza e caminho', 'Fachadas, flores, pássaros e o último brilho do dia revelam uma cidade observada sem pressa. São imagens sobre aquilo que costuma passar despercebido.', 'published', 'static-p033', 1, 3000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-palco-aceso', 'palco-aceso', 'Palco aceso', 'Cor, suor e presença diante do público', 'O palco é tratado como um organismo vivo: luzes duras, corpos em movimento e instantes de entrega formam uma sequência elétrica e próxima.', 'published', 'static-p015', 1, 4000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-personagens-do-campo', 'personagens-do-campo', 'Personagens do campo', 'Atitude, humor e invenção de personagem', 'Um retrato pode ser também uma brincadeira consciente com roupas, cenário e postura. Nesta série, a personagem encontra liberdade entre árvores, botas e chapéu.', 'published', 'static-p027', 1, 5000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-entre-nos', 'entre-nos', 'Entre nós', 'Afeto, convivência e os gestos de um encontro', 'A câmera acompanha uma comunidade em seus intervalos: conversas, risos, refeições e pequenas cumplicidades. O acontecimento nasce das relações.', 'published', 'static-p034', 0, 6000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-outono-rubro', 'outono-rubro', 'Outono rubro', 'Cor, intimidade e presença no cenário urbano', 'Vermelhos intensos e gestos tranquilos constroem um ensaio em que a cidade não é fundo: ela participa, enquadra e devolve atmosfera às pessoas.', 'published', 'static-p054', 1, 7000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-vermelho-em-cena', 'vermelho-em-cena', 'Vermelho em cena', 'Teatro, elegância e um personagem que encara a lente', 'O figurino, o leque e a arquitetura criam uma pequena cena cinematográfica. A série alterna mistério e humor sem perder a delicadeza do retrato.', 'published', 'static-p061', 1, 8000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-cinema-de-domingo', 'cinema-de-domingo', 'Cinema de domingo', 'Uma personagem retrô entre concreto e automóvel', 'Preto e branco, vestido de poás e enquadramentos oblíquos transformam um espaço comum em sequência de cinema. O ensaio tem ritmo, jogo e movimento.', 'published', 'static-p067', 0, 9000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-corpo-em-jogo', 'corpo-em-jogo', 'Corpo em jogo', 'Concentração, impulso e o instante decisivo', 'Na quadra, cada fotografia precisa antecipar o gesto. A série reúne força, espera, velocidade e a geometria criada por corpos em competição.', 'published', 'static-p079', 1, 10000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-pequenas-celebracoes', 'pequenas-celebracoes', 'Pequenas celebrações', 'Infância, descoberta e alegria sem direção', 'Uma festa infantil é feita de acontecimentos mínimos e enormes: mãos sujas, corridas, sustos, bolo e colo. A câmera acompanha sem interromper a brincadeira.', 'published', 'static-p085', 1, 11000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-noite-em-voz-alta', 'noite-em-voz-alta', 'Noite em voz alta', 'Presença cênica atravessada por vermelho e violeta', 'O contraste entre luz, sombra e atitude conduz esta sequência. Cada imagem preserva a força individual dos artistas e a vibração coletiva do palco.', 'published', 'static-p102', 1, 12000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z'),
  ('static-cancao-eletrica', 'cancao-eletrica', 'Canção elétrica', 'Uma voz entre azul profundo, branco e movimento', 'A proximidade com a artista transforma a apresentação em retrato. Expressão, esforço e luz criam uma narrativa intensa do primeiro ao último acorde.', 'published', 'static-p110', 1, 13000, '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z', '2026-07-20T00:00:00.000Z');

WITH RECURSIVE photo_numbers(number) AS (
  SELECT 1
  UNION ALL
  SELECT number + 1 FROM photo_numbers WHERE number < 113
)
INSERT OR IGNORE INTO images
  (id, album_id, original_key, original_filename, mime_type, size_bytes, width, height, alt_text, position, status, created_at, updated_at)
SELECT
  printf('static-p%03d', number),
  CASE
    WHEN number = 1 THEN 'static-maria-helena'
    WHEN number IN (2, 3, 4, 9, 21, 22, 32) THEN 'static-ritos-de-luz'
    WHEN number IN (5, 6, 7, 8, 20) THEN 'static-velocidade-e-materia'
    WHEN number IN (10, 11, 23, 33, 45, 46) THEN 'static-intervalos-da-cidade'
    WHEN number BETWEEN 12 AND 18 THEN 'static-palco-aceso'
    WHEN number = 19 OR number BETWEEN 24 AND 31 THEN 'static-personagens-do-campo'
    WHEN number BETWEEN 34 AND 44 THEN 'static-entre-nos'
    WHEN number BETWEEN 47 AND 54 THEN 'static-outono-rubro'
    WHEN number BETWEEN 55 AND 65 THEN 'static-vermelho-em-cena'
    WHEN number BETWEEN 66 AND 73 THEN 'static-cinema-de-domingo'
    WHEN number BETWEEN 74 AND 84 THEN 'static-corpo-em-jogo'
    WHEN number BETWEEN 85 AND 98 THEN 'static-pequenas-celebracoes'
    WHEN number BETWEEN 99 AND 106 THEN 'static-noite-em-voz-alta'
    ELSE 'static-cancao-eletrica'
  END,
  printf('static:/photos/p%03d.jpg', number),
  printf('p%03d.jpg', number),
  'image/jpeg',
  1,
  NULL,
  NULL,
  CASE WHEN number = 1
    THEN 'Maria Helena fotografando com uma câmera'
    ELSE printf('Fotografia %03d do arquivo Punctum Picture', number)
  END,
  number * 1000,
  'ready',
  '2026-07-20T00:00:00.000Z',
  '2026-07-20T00:00:00.000Z'
FROM photo_numbers;

INSERT OR IGNORE INTO album_categories (album_id, category_id)
VALUES
  ('static-maria-helena', 'portfolio-autorretrato'),
  ('static-ritos-de-luz', 'portfolio-documental'),
  ('static-velocidade-e-materia', 'portfolio-movimento'),
  ('static-intervalos-da-cidade', 'portfolio-cotidiano'),
  ('static-palco-aceso', 'portfolio-musica'),
  ('static-personagens-do-campo', 'portfolio-retrato'),
  ('static-entre-nos', 'portfolio-documental'),
  ('static-outono-rubro', 'portfolio-retrato'),
  ('static-vermelho-em-cena', 'portfolio-retrato'),
  ('static-cinema-de-domingo', 'portfolio-retrato'),
  ('static-corpo-em-jogo', 'portfolio-esporte'),
  ('static-pequenas-celebracoes', 'portfolio-familia'),
  ('static-noite-em-voz-alta', 'portfolio-musica'),
  ('static-cancao-eletrica', 'portfolio-musica');
