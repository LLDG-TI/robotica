ROBO RUN 3D - v0.3

ESTRUTURA
html/index.html   -> página do jogo (abra este arquivo)
css/style.css     -> estilos
js/main.js        -> motor do jogo: loop, entrada, HUD, física, câmera, iluminação, pós-processamento
js/biomes.js      -> os 4 cenários e a montagem do corredor
js/entities.js    -> robô, obstáculos, coletáveis e padrões de pista
js/core.js        -> helpers 3D e texturas procedurais

COMO EXECUTAR
Abra a pasta no VS Code, clique com o botão direito em html/index.html e escolha "Open with Live Server".
(Módulos JavaScript não funcionam abrindo o arquivo direto com duplo clique; precisa de servidor local.)
Requer internet para carregar o Three.js (CDN) e as fontes.

CENÁRIOS (trocam a cada 500 m, com portal de transição)
1. Fábrica de montagem   - braços robóticos animados, esteiras, caixas
2. Data center           - racks com LEDs piscando, bandejas de cabos
3. Armazém autônomo      - prateleiras com caixas, robôs AGV
4. Laboratório de IA     - sala limpa, vidro, bancadas com braços

OBSTÁCULOS
Caixa/rack alta: troque de pista | Barreira baixa: pule | Raio laser: deslize | Robô AGV: móvel, pule ou desvie

EXTRAS
Combo de núcleos (até x5), passada rente (+2), ímã (8 s), escudo (8 s), partículas, sons sintetizados, tremor de câmera.

CONTROLES
Setas ou A/D: mover | Seta cima/W/Espaço: pular | Seta baixo/S: deslizar (no ar, cai rápido) | P/Esc: pausar
Celular: deslize na tela, ou toque nas laterais/centro.
