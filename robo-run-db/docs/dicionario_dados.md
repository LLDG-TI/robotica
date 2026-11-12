# Dicionário de Dados — ROBO RUN

| Tabela | Coluna | Tipo | Chave | Obrigatório | Descrição |
|---|---|---|---|---|---|
| personagem | id_personagem | INTEGER | PK | Sim | Identificador do boneco (autoincremento) |
| personagem | nome | VARCHAR(50) | — | Sim | Nome do boneco. **UNIQUE** |
| personagem | descricao | VARCHAR(200) | — | Não | Descrição do boneco |
| roupa | id_roupa | INTEGER | PK | Sim | Identificador da roupa (autoincremento) |
| roupa | nome | VARCHAR(50) | — | Sim | Nome da roupa. **UNIQUE** |
| roupa | descricao | VARCHAR(200) | — | Não | Descrição da roupa |
| tenis | id_tenis | INTEGER | PK | Sim | Identificador do tênis (autoincremento) |
| tenis | nome | VARCHAR(50) | — | Sim | Nome do tênis. **UNIQUE** |
| tenis | descricao | VARCHAR(200) | — | Não | Descrição do tênis |
| jogador | id_jogador | INTEGER | PK | Sim | Identificador do jogador (autoincremento) |
| jogador | nome | VARCHAR(30) | — | Sim | Nome escolhido pelo jogador. **UNIQUE** |
| jogador | data_cadastro | DATETIME | — | Sim | Data do cadastro. **DEFAULT CURRENT_TIMESTAMP** |
| partida | id_partida | INTEGER | PK | Sim | Identificador da partida (autoincremento) |
| partida | id_jogador | INTEGER | FK → jogador.id_jogador | Sim | Quem jogou. **ON DELETE CASCADE** |
| partida | id_personagem | INTEGER | FK → personagem.id_personagem | Sim | Boneco escolhido. **ON DELETE RESTRICT** |
| partida | id_roupa | INTEGER | FK → roupa.id_roupa | Sim | Roupa escolhida. **ON DELETE RESTRICT** |
| partida | id_tenis | INTEGER | FK → tenis.id_tenis | Sim | Tênis escolhido. **ON DELETE RESTRICT** |
| partida | pontuacao | INTEGER | — | Sim | Pontuação final. **DEFAULT 0**, CHECK (>= 0) |
| partida | data_partida | DATETIME | — | Sim | Data/hora da partida. **DEFAULT CURRENT_TIMESTAMP** |

**Relacionamentos:** jogador 1:N partida; personagem 1:N partida; roupa 1:N partida; tenis 1:N partida.
