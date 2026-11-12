# ROBO RUN — Banco de Dados

Squad: <NOME DA SQUAD>
Integrantes: <Nome 1>, <Nome 2>, <Nome 3>

Banco do jogo ROBO RUN: o jogador escolhe boneco, roupa, tênis e nome; ao fim da partida a pontuação é registrada. Modelo em 3FN.

## Estrutura
```
sql/schema.sql            -> criação das tabelas
sql/dados.sql             -> dados de exemplo
sql/consultas.sql         -> ranking de pontuações
modelo/modelo_logico.png  -> modelo lógico
docs/normalizacao.md      -> 3 problemas, antes e depois
docs/dicionario_dados.md  -> dicionário de dados
```

## Como executar no VSCode
1. Instale a extensão **SQLite** (alexcvzz).
2. `Ctrl+Shift+P` > *SQLite: New Query* e rode `schema.sql`, `dados.sql` e `consultas.sql`.
   (Terminal: `sqlite3 robo_run.db < sql/schema.sql`)
