-- ROBO RUN - banco de dados normalizado (3FN)
-- Compatível com SQLite (extensão "SQLite" no VSCode).
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS partida;
DROP TABLE IF EXISTS jogador;
DROP TABLE IF EXISTS tenis;
DROP TABLE IF EXISTS roupa;
DROP TABLE IF EXISTS personagem;

CREATE TABLE personagem (
    id_personagem INTEGER PRIMARY KEY AUTOINCREMENT,
    nome          VARCHAR(50)  NOT NULL UNIQUE,
    descricao     VARCHAR(200)
);

CREATE TABLE roupa (
    id_roupa  INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      VARCHAR(50)  NOT NULL UNIQUE,
    descricao VARCHAR(200)
);

CREATE TABLE tenis (
    id_tenis  INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      VARCHAR(50)  NOT NULL UNIQUE,
    descricao VARCHAR(200)
);

CREATE TABLE jogador (
    id_jogador    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome          VARCHAR(30) NOT NULL UNIQUE,
    data_cadastro DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE partida (
    id_partida    INTEGER PRIMARY KEY AUTOINCREMENT,
    id_jogador    INTEGER  NOT NULL,
    id_personagem INTEGER  NOT NULL,
    id_roupa      INTEGER  NOT NULL,
    id_tenis      INTEGER  NOT NULL,
    pontuacao     INTEGER  NOT NULL DEFAULT 0 CHECK (pontuacao >= 0),
    data_partida  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jogador)    REFERENCES jogador(id_jogador)       ON DELETE CASCADE,
    FOREIGN KEY (id_personagem) REFERENCES personagem(id_personagem) ON DELETE RESTRICT,
    FOREIGN KEY (id_roupa)      REFERENCES roupa(id_roupa)           ON DELETE RESTRICT,
    FOREIGN KEY (id_tenis)      REFERENCES tenis(id_tenis)           ON DELETE RESTRICT
);
