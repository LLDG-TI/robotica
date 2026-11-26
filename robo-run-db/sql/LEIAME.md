# Aula 12: JOIN e agregações (banco robotica)

## Conteúdo da pasta
- `aula12-join-SEUNOME.sql`: arquivo de entrega (dados de teste, missões 0 a 8, respostas em comentários).
- `LEIAME.md`: este guia.

## Como usar
1. Abra XAMPP > phpMyAdmin e selecione o banco `robotica`.
2. Aba **SQL**: rode primeiro o bloco PREPARAÇÃO (INSERTs), uma única vez.
3. Rode cada missão separadamente e compare com o "Esperado" do comentário.
4. Renomeie o arquivo trocando `SEUNOME` pelo seu nome e envie no Classroom.

## Equivalência roteiro x seu banco
| Roteiro (loja) | Seu banco (robô) |
|---|---|
| cliente | jogador |
| pedido | partida |
| produto | personagem, roupa, tenis |
| quantidade * preco_unitario | pontuacao |

## Resultados esperados
| Missão | Resultado |
|---|---|
| 0 | 5 · 2 · 2 · 2 · 8 |
| 1 | 8 linhas por data |
| 2 | Partida 1: Robo Azul, Armadura, Turbo |
| 3 | Robo Vermelho |
| 4 | Ana 3, Carla 2, Bruno 1, Daniel 1, Eduarda 1 |
| 5 | 220, 50, 800, 400, 270, 800, 200, 50 |
| 6 | Ana Souza (3), Carla Mendes (2) |
| 7 | Soma 2790, média 348.75 |
| 8 | Ana 1220, Eduarda 800, Carla 450, Daniel 270, Bruno 50 |

## Observações
- Só o banco `robotica` tem dados; `robo_run` e `test` estão vazios.
- Os nomes são UNIQUE: rodar os INSERTs duas vezes dá erro. Use o bloco de reset comentado no arquivo.
