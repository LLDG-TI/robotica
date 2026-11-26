-- =====================================================================
-- Aula 12: JOIN e agregações (adaptado para o banco do robô)
-- Banco de Dados · EFG
-- Aluno(a): SEUNOME
-- Banco: robotica   |   Onde rodar: XAMPP > phpMyAdmin > robotica > aba SQL
-- =====================================================================
--
-- EQUIVALÊNCIA ENTRE O ROTEIRO (LOJA) E O SEU BANCO (ROBÔ)
--   cliente                     -> jogador
--   pedido                      -> partida
--   produto                     -> personagem, roupa, tenis
--   item_pedido                 -> (não existe: partida já guarda as 3 chaves)
--   quantidade * preco_unitario -> pontuacao
-- =====================================================================


-- =====================================================================
-- PREPARAÇÃO: dados de teste
-- Rode este bloco UMA vez. Os nomes são UNIQUE, então rodar de novo dá erro.
-- Para recomeçar, rode antes (descomente):
--   DELETE FROM partida;
--   DELETE FROM jogador;
--   ALTER TABLE partida AUTO_INCREMENT = 1;
--   ALTER TABLE jogador AUTO_INCREMENT = 1;
-- =====================================================================
USE robotica;

-- jogador deve ser inserido antes de partida (chave estrangeira)
INSERT INTO jogador (nome, data_cadastro) VALUES
('Ana Souza',    '2026-11-01 10:00:00'),
('Bruno Lima',   '2026-11-01 10:05:00'),
('Carla Mendes', '2026-11-01 10:10:00'),
('Daniel Rocha', '2026-11-01 10:15:00'),
('Eduarda Melo', '2026-11-01 10:20:00');

-- O Robo Vermelho (id 2) nunca é usado, para a Missão 3 ter o que mostrar.
INSERT INTO partida (id_jogador, id_personagem, id_roupa, id_tenis, pontuacao, data_partida) VALUES
(1, 1, 2, 2, 220, '2026-11-02 14:00:00'),  -- partida 1: Ana
(2, 1, 1, 1,  50, '2026-11-03 14:00:00'),  -- partida 2: Bruno
(1, 1, 1, 2, 800, '2026-11-04 14:00:00'),  -- partida 3: Ana
(3, 1, 2, 1, 400, '2026-11-05 14:00:00'),  -- partida 4: Carla
(4, 1, 1, 1, 270, '2026-11-06 14:00:00'),  -- partida 5: Daniel
(5, 1, 2, 2, 800, '2026-11-07 14:00:00'),  -- partida 6: Eduarda
(1, 1, 1, 1, 200, '2026-11-08 14:00:00'),  -- partida 7: Ana
(3, 1, 1, 2,  50, '2026-11-09 14:00:00');  -- partida 8: Carla


-- =====================================================================
-- MISSÃO 0: conferir o banco (checkpoint)
-- Esperado: 5 jogadores · 2 personagens · 2 roupas · 2 tenis · 8 partidas
-- =====================================================================
SELECT
  (SELECT COUNT(*) FROM jogador)    AS jogadores,
  (SELECT COUNT(*) FROM personagem) AS personagens,
  (SELECT COUNT(*) FROM roupa)      AS roupas,
  (SELECT COUNT(*) FROM tenis)      AS tenis,
  (SELECT COUNT(*) FROM partida)    AS partidas;


-- =====================================================================
-- MISSÃO 1: INNER JOIN (quem jogou o quê, em nível de partida)
-- Esperado: 8 linhas, uma por partida, ordenadas pela data.
-- =====================================================================
SELECT j.nome, p.id_partida AS partida, p.data_partida
FROM jogador j
INNER JOIN partida p ON p.id_jogador = j.id_jogador
ORDER BY p.data_partida;

-- M1.1: Por que o JOIN é p.id_jogador = j.id_jogador e não p.id_partida = j.id_jogador?
--       A partida guarda o id do jogador na coluna id_jogador (chave estrangeira).
--       Comparar id_partida com id_jogador juntaria ids sem relação entre si.
-- M1.2: Trocando INNER JOIN por LEFT JOIN o número de linhas muda?
--       Aqui não (continua 8), porque todo jogador tem partida. O LEFT JOIN só
--       acrescentaria linhas se existisse jogador sem partida (viria com NULL).


-- =====================================================================
-- MISSÃO 2: JOIN de várias tabelas (detalhe da partida 1)
-- Esperado: Robo Azul · Armadura · Turbo
-- =====================================================================
SELECT p.id_partida AS partida,
       pe.nome      AS personagem,
       r.nome       AS roupa,
       t.nome       AS tenis
FROM partida p
JOIN personagem pe ON pe.id_personagem = p.id_personagem
JOIN roupa r       ON r.id_roupa       = p.id_roupa
JOIN tenis t       ON t.id_tenis       = p.id_tenis
WHERE p.id_partida = 1;

-- Desafio: trocar para p.id_partida = 5
-- Resultado: Robo Azul · Padrão · Padrão
SELECT p.id_partida AS partida,
       pe.nome      AS personagem,
       r.nome       AS roupa,
       t.nome       AS tenis
FROM partida p
JOIN personagem pe ON pe.id_personagem = p.id_personagem
JOIN roupa r       ON r.id_roupa       = p.id_roupa
JOIN tenis t       ON t.id_tenis       = p.id_tenis
WHERE p.id_partida = 5;


-- =====================================================================
-- MISSÃO 3: LEFT JOIN (o que nunca foi usado)
-- Esperado: Robo Vermelho
-- =====================================================================
SELECT pe.nome
FROM personagem pe
LEFT JOIN partida p ON p.id_personagem = pe.id_personagem
WHERE p.id_partida IS NULL;

-- Teste de compreensão: mesma consulta com INNER JOIN e sem WHERE
SELECT pe.nome
FROM personagem pe
INNER JOIN partida p ON p.id_personagem = pe.id_personagem;

-- M3: O LEFT JOIN mantém todos os personagens; quem nunca foi usado fica com NULL
--     nas colunas de partida. O IS NULL filtra justamente esses casos, por isso
--     encontra o Robo Vermelho. Com INNER JOIN e sem WHERE só aparecem os
--     personagens que já foram usados (e o Vermelho some).


-- =====================================================================
-- MISSÃO 4: GROUP BY (partidas por jogador)
-- Esperado: Ana 3 · Carla 2 · Bruno 1 · Daniel 1 · Eduarda 1
-- (a ordem entre os empates pode variar)
-- =====================================================================
SELECT j.nome, COUNT(p.id_partida) AS total_partidas
FROM jogador j
LEFT JOIN partida p ON p.id_jogador = j.id_jogador
GROUP BY j.id_jogador, j.nome
ORDER BY total_partidas DESC;

-- Regra: toda coluna do SELECT que não está numa função de agregação
--        precisa estar no GROUP BY.


-- =====================================================================
-- MISSÃO 5: SUM (valor de cada partida)
-- Esperado: partida 1 = 220 · 2 = 50 · 3 = 800 · 4 = 400
--           5 = 270 · 6 = 800 · 7 = 200 · 8 = 50
-- No roteiro o total vinha de quantidade * preco_unitario; aqui a pontuação
-- já é o total de cada partida, então o SUM por partida devolve o mesmo valor.
-- =====================================================================
SELECT id_partida, SUM(pontuacao) AS total_partida
FROM partida
GROUP BY id_partida
ORDER BY id_partida;

-- Extra: pontos de cada jogador
-- Esperado: 1 = 1220 · 2 = 50 · 3 = 450 · 4 = 270 · 5 = 800
SELECT id_jogador, SUM(pontuacao) AS total_pontos
FROM partida
GROUP BY id_jogador
ORDER BY id_jogador;


-- =====================================================================
-- MISSÃO 6: HAVING (só jogadores com mais de uma partida)
-- Esperado: Ana Souza (3) e Carla Mendes (2)
-- =====================================================================
SELECT j.nome, COUNT(*) AS partidas
FROM jogador j
JOIN partida p ON p.id_jogador = j.id_jogador
GROUP BY j.id_jogador, j.nome
HAVING COUNT(*) > 1;

-- Desafio: trocar por WHERE COUNT(*) > 1 gera ERRO (Invalid use of group function).
-- M6: O WHERE roda ANTES do agrupamento, quando ainda não existe contagem por
--     jogador. Filtro sobre resultado de agregação precisa ir no HAVING.


-- =====================================================================
-- MISSÃO 7: pontuação total e média
-- Esperado: soma 2790 · média 348.75 (média por partida, igual ao PDF)
-- =====================================================================
SELECT SUM(total), AVG(total)
FROM (
  SELECT id_partida, SUM(pontuacao) AS total
  FROM partida
  GROUP BY id_partida
) AS t;

-- Variação: média do total de cada JOGADOR (2790 / 5 = 558)
SELECT SUM(total), AVG(total)
FROM (
  SELECT id_jogador, SUM(pontuacao) AS total
  FROM partida
  GROUP BY id_jogador
) AS t;

-- M7: A média não é a média de um valor fixo de cadastro (como o preço do produto),
--     e sim a média do total calculado de cada grupo (cada partida). O que se agrega
--     é o resultado da subconsulta, não uma coluna da tabela original.


-- =====================================================================
-- MISSÃO 8 (desafio final): quanto cada jogador pontuou
-- Esperado: Ana 1220 · Eduarda 800 · Carla 450 · Daniel 270 · Bruno 50
-- =====================================================================
SELECT j.nome, SUM(p.pontuacao) AS total_pontos
FROM jogador j
JOIN partida p ON p.id_jogador = j.id_jogador
GROUP BY j.id_jogador, j.nome
ORDER BY total_pontos DESC;
