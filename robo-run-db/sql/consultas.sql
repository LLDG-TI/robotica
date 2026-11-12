-- Ranking de pontuações
SELECT j.nome AS jogador, pe.nome AS personagem, r.nome AS roupa, t.nome AS tenis,
       p.pontuacao, p.data_partida
FROM partida p
JOIN jogador j     ON j.id_jogador = p.id_jogador
JOIN personagem pe ON pe.id_personagem = p.id_personagem
JOIN roupa r       ON r.id_roupa = p.id_roupa
JOIN tenis t       ON t.id_tenis = p.id_tenis
ORDER BY p.pontuacao DESC;
