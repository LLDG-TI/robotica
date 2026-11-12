INSERT INTO personagem (nome, descricao) VALUES
 ('Robô Azul','Unidade R-07 padrão'),('Robô Vermelho','Modelo de combate'),('Robô Verde','Modelo de laboratório');
INSERT INTO roupa (nome, descricao) VALUES
 ('Armadura Prata','Proteção metálica'),('Traje Neon','Brilha no escuro'),('Jaqueta Cyber','Estilo urbano');
INSERT INTO tenis (nome, descricao) VALUES
 ('Turbo Jet','Mais velocidade'),('Magnético','Aderência no chão'),('Mola Plasma','Pulo mais alto');
INSERT INTO jogador (nome) VALUES ('Ana'),('Bruno');
INSERT INTO partida (id_jogador,id_personagem,id_roupa,id_tenis,pontuacao) VALUES
 (1,1,2,1,1500),(1,3,1,3,2300),(2,2,3,2,1800);
