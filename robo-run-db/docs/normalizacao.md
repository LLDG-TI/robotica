# Normalização — ROBO RUN

Modelo original (tudo em uma tabela): `partida_geral(id, jogador, personagem, roupa, tenis, pontuacao)`

| id | jogador | personagem | roupa | tenis | pontuacao |
|----|---------|------------|-------|-------|-----------|
| 1 | Ana | Robô Azul | Traje Neon | Turbo Jet | 1500 |
| 2 | Ana | Robô Verde | Armadura Prata | Mola Plasma | 2300 |
| 3 | Bruno | Robô Azul | Traje Neon | Turbo Jet | 1800 |
| 4 | Bruno | Robo Azul | Jaqueta Cyber | Magnético | 900 |

Na linha 4, "Robo Azul" (sem acento) é o mesmo personagem escrito de outro jeito: a redundância gera inconsistência.

## Problema 1 — Anomalia de atualização (violação de 3FN)
**Antes:** personagem, roupa e tênis são repetidos em cada partida. Renomear "Traje Neon" exige alterar várias linhas; se esquecer uma, o dado fica inconsistente (como "Robô Azul" x "Robo Azul"). Trocar o nome do jogador também exige alterar todas as suas partidas.

**Depois:** `personagem`, `roupa`, `tenis` e `jogador` guardam cada dado uma única vez. A `partida` apenas referencia por chave estrangeira. O nome é alterado em um só registro.

## Problema 2 — Anomalia de inserção (violação de 3FN)
**Antes:** não é possível cadastrar um novo personagem, roupa ou tênis (nem um jogador) enquanto ninguém jogou com ele, pois eles só existem dentro de uma linha de partida.

**Depois:** cada item é uma tabela independente. Novos itens são cadastrados no catálogo antes de qualquer partida.

## Problema 3 — Anomalia de exclusão (violação de 2FN/3FN)
**Antes:** ao apagar a única partida de um jogador, ou a única que usou um tênis, esses dados somem junto.

**Depois:** apagar uma `partida` remove só a pontuação. Jogador e itens continuam cadastrados. Itens usados em partidas não podem ser excluídos (RESTRICT) e, se o jogador for excluído, suas partidas também são (CASCADE).

## Verificação das formas normais
- **1FN:** campos atômicos, sem grupos repetidos; toda tabela tem PK.
- **2FN:** todas as PKs são simples (uma coluna), então não há dependência parcial.
- **3FN:** em `partida`, os atributos não-chave (`pontuacao`, `data_partida`) dependem só de `id_partida`. Nomes e descrições dos itens ficaram nas tabelas de catálogo.
