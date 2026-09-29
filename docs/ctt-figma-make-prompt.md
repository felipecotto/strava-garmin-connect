# CTT no Figma Make: prompts para um design de excelência

Este guia leva a direção do CTT para o Figma Make em cinco passos. O Make trabalha melhor com uma base de regras fixa e prompts curtos e focados do que com um prompt gigante só, então o material está dividido assim:

1. **Guidelines.md:** as regras de design que valem para todas as gerações.
2. **Dados:** o arquivo com os números reais do seu Strava.
3. **Prompt inicial:** monta a estrutura da página inteira.
4. **Prompts por seção:** refinam uma seção de cada vez.
5. **Passes de polimento:** responsivo, tema escuro, estados e detalhes.

Como anexo, use prints da landing page de referência (`docs/ctt-lp-referencia.html`, aberta no navegador) no primeiro prompt e no prompt de cada seção correspondente.

---

## Passo 1: Guidelines.md

No Figma Make, abra o arquivo `guidelines/Guidelines.md` do projeto e substitua o conteúdo por este bloco:

```md
# CTT: diretrizes de design

## Produto
CTT (usectt.com.br) lê o histórico de corrida do Strava e monta uma edição dele: volume, forma, recordes, rotina e um card para o Stories. Não é dashboard, não é feed, não tem ranking. É uma página editorial, bonita e fácil de ler, para corredores amadores que gostam de números.
Idioma: português do Brasil. Números no formato brasileiro (7.727 km, 4:52/km, 42,5 km).

## Conceito visual
Laboratório suíço de corrida. A atitude tipográfica da Bandit Running (números condensados enormes, tipografia como imagem) com a precisão da On Running (muito respiro, grid rígido, nada decorativo). Os dados são monocromáticos e uma única cor de sinal marca o que importa.

## Tipografia
- Archivo (Google Fonts, com eixo de largura wdth 62–125). Importe: https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Geist+Mono:wght@400;500&display=swap
- Números e títulos: Archivo condensada (font-stretch 62% a 78%), peso 800–900, tracking negativo (-0.02em a -0.03em), line-height 0.78–0.95.
- Texto corrido: Archivo largura normal, 16–18px, line-height 1.5, máximo 60 caracteres por linha.
- Rótulos, eixos, datas, metadados: Geist Mono 11–12px, caixa alta, letter-spacing 0.06em, cor muted.
- Todo número em coluna usa font-variant-numeric: tabular-nums.
- Escala: odômetro clamp(88px,19vw,260px) · H1 clamp(44px,7.4vw,104px) · H2 clamp(34px,4.6vw,64px) · número de recorde clamp(40px,4.6vw,64px) · corpo 16–18px · rótulo 11.5px.

## Cor (tokens do shadcn em theme.css)
Claro: background #F2F2EE (papel), foreground #111210 (tinta), card #FFFFFF, muted #E6E7E1, muted-foreground #7A7C74, border #D8D9D2, texto secundário #4A4C46, signal #2B34F5 (ultramar), signal-soft #DADCFF.
Escuro: background #0D0E0C, foreground #ECEDE7, card #161714, muted #20221E, muted-foreground #83857C, border #2C2E29, texto secundário #B4B6AE, signal #8A90FF, signal-soft #262A5C.
Gráficos: chart-1 = signal, chart-2 = foreground, chart-3 = texto secundário, chart-4 = muted-foreground, chart-5 = border.
Regras de cor:
- Ultramar é a ÚNICA cor de destaque. Use só para: recorde, pico, prova, dia/semana atual, estado ativo, hover do botão principal.
- Nada de laranja (lembra o Strava), gradiente, neon, roxo, glassmorphism.
- Superfícies quase sempre no background. Card branco só para objetos separados.

## Componentes
- Use os componentes shadcn/ui do projeto (components/ui) como base de toda a interface: Button, Badge, Card, Table, Tabs, ToggleGroup, Tooltip, HoverCard, Separator, Skeleton, Sheet, DropdownMenu, Avatar.
- Gráficos com o componente Chart do shadcn (ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend) sobre Recharts. Cores via ChartConfig apontando para os tokens.
- Personalize pelos tokens do tema, não com cores soltas em cada componente.
- Botão principal: fundo foreground (tinta), texto background, rounded-full, altura 44px, peso 600; hover muda o fundo para signal. Botão secundário: transparente com borda 1px border, hover borda foreground.
- Chips e toggles: rounded-full, Geist Mono 12px caixa alta; ativo = fundo foreground, texto background.

## Forma e espaço
- Container máximo 1240px, gutter lateral 16px no mobile, 32px no tablet, 48px no desktop.
- Seções separadas por border-top 1px (border) e padding vertical 56px mobile / 112px desktop.
- Cada cabeçalho de seção: grid de 2 colunas (título à esquerda, parágrafo à direita, alinhados pela base). Vira 1 coluna abaixo de 860px.
- Linha de 1px em foreground no topo de blocos de métricas e grades de recordes.
- Raio 8px em superfícies; pílula em botões e chips. Sem sombra, exceto no card do Stories.
- Grid de 8px. Espaços generosos: prefira espaço vazio a mais um elemento.

## Gráficos
- Barras finas, cantos de 2–3px só no topo, sem contorno, 2px de espaço entre barras.
- Grade só horizontal, 1px, cor muted; eixo base 1px foreground. Sem grade vertical, sem fundo.
- Rótulos de eixo em Geist Mono 10.5px, muted-foreground. Poucos rótulos: só os anos, ou a cada 3 horas.
- Série principal em foreground ou texto secundário; destaque em signal; linhas de apoio em muted-foreground.
- Anotações diretas no gráfico (ex.: "42K", "pausa", "308 km · abr 25") em Geist Mono 10.5px, em vez de legenda sempre que possível.
- Todo gráfico tem tooltip no hover: fundo foreground, texto background, valor em Archivo 600, contexto em Geist Mono.
- Nenhum gráfico de pizza, rosca, 3D ou eixo duplo.

## Texto
- Frases curtas, voz ativa, tom de quem entende de corrida. Sem frase motivacional, sem exclamação, sem emoji.
- Títulos de seção são afirmações sobre os dados ("Corredor das 6h da manhã."), não rótulos ("Estatísticas de horário").

## Movimento
- Só transições de hover (150ms ease-out) e, no máximo, uma entrada suave dos gráficos ao carregar.
- A página precisa estar completa e legível sem animação. Respeite prefers-reduced-motion.

## Acessibilidade
- Contraste AA em todo texto. Foco visível (outline 2px signal, offset 3px).
- Gráficos com aria-label descritivo. Nada comunicado só por cor.
- Mobile em 375px sem rolagem horizontal da página (o calendário anual pode rolar dentro do próprio container).
```

---

## Passo 2: dados reais

Mande este prompt sozinho, antes de pedir qualquer tela. Assim os números ficam num arquivo e todas as seções leem dele.

````text
Crie o arquivo src/data/felipe.ts exportando os dados abaixo com tipos TypeScript. Não invente nem arredonde números; use exatamente estes. Não crie nenhuma tela ainda.

- Atleta: Felipe Oliveira, São Paulo, slug "felipe", primeira corrida em maio de 2020, dados até 20 de setembro de 2026.
- Totais: 812 corridas, 7.727 km, 705 horas, 29.992 m de subida, 2 maratonas.
- Volume semanal: array de km por semana, começando na segunda-feira 2023-01-02 (uma posição por semana, 0 = semana sem corrida). Provas nas semanas de 2024-09-23 ("Maratona · 42,8 km") e 2026-06-01 ("Maratona · 42,5 km").
  [16.6,33.5,26.6,24.3,38.1,23.9,15.1,17.9,20.3,24.4,6,13.4,23.1,27.9,29.1,27.3,24.1,29,27.5,44.1,42.1,35.2,38.3,30.1,42.1,38,47.4,42.1,36.1,41.1,42.6,36.9,42.2,23.5,23.1,29.1,26,21.3,26,20,19.2,21.6,19.2,21.6,25,12,34.5,23.2,28.1,23.6,19,0,25.1,27,31.3,37.1,30.1,20.1,35.1,23.9,32.2,26.4,37.5,29.8,38.1,39.5,42.1,49.1,46.9,39.5,42.2,56.2,63.5,64.5,62.4,56,55.9,59.7,61.1,72.7,70.1,47.6,53.2,65.4,73.8,75.6,80.5,78.5,66.9,44.2,65.9,20.1,32.1,45.1,44,49.2,9,38.3,31.6,43.5,41.4,21.4,20.8,18.1,30.1,29.1,39.9,45,44.1,64.4,64.5,63.5,49.1,68,54.1,57.2,60.6,68.5,70.5,73.5,76.1,52.6,0,5,0,0,0,19.1,15,18.3,30.1,35,37.2,36.6,28.1,35.4,41.1,42.3,38.1,44.1,40.7,42,38.1,32.2,37.1,34.4,41,0,10.6,19.1,26,29.5,23.9,16,32.1,30.6,10.4,30.5,18.9,44.1,20.4,35.1,41.5,41.3,46.3,44.4,63.2,41.2,72.4,46.7,52.6,60.1,68.7,70.6,57.2,79.5,53.6,44.7,56.7,28.3,32.3,46.3,43.1,52.5,42.2,44.8,27.6,41.8,39.8,36,36.9,38.5,40.2,32.7,0]
- Volume mensal [mês, km, corridas]:
  [["2023-01",109,13],["2023-02",87,10],["2023-03",76,10],["2023-04",119,16],["2023-05",151,15],["2023-06",158,15],["2023-07",185,17],["2023-08",158,17],["2023-09",113,15],["2023-10",86,17],["2023-11",100,14],["2023-12",81,11],["2024-01",128,14],["2024-02",117,17],["2024-03",149,21],["2024-04",188,18],["2024-05",230,23],["2024-06",260,28],["2024-07",277,25],["2024-08",293,22],["2024-09",286,20],["2024-10",160,16],["2024-11",152,15],["2024-12",110,13],["2025-01",160,18],["2025-02",244,28],["2025-03",258,27],["2025-04",308,23],["2025-05",38,5],["2025-06",52,7],["2025-07",154,14],["2025-08",170,15],["2025-09",165,13],["2025-10",145,18],["2025-11",85,11],["2025-12",107,16],["2026-01",110,14],["2026-02",157,16],["2026-03",248,18],["2026-04",249,25],["2026-05",275,27],["2026-06",173,13],["2026-07",192,19],["2026-08",172,20],["2026-09",103,10]]
- Anos [ano, km, corridas, ritmo médio em segundos/km, maior corrida em km]:
  [[2020,50,8,438,8.4],[2021,38,5,417,10.6],[2022,304,40,380,11.6],[2023,1423,170,339,21.3],[2024,2349,232,317,42.8],[2025,1885,195,323,30.0],[2026,1679,162,327,42.5]]
- Forma (carga média de 42 dias) e fadiga (7 dias), um ponto por semana começando em 2023-06-05:
  forma: [5,15,19,24,27,30,34,37,37,39,40,43,43,43,43,44,45,43,41,39,39,38,37,39,33,36,36,36,35,34,30,33,36,38,42,42,39,38,38,40,39,42,39,44,46,50,52,52,52,53,56,63,66,69,73,75,73,73,74,77,77,77,81,85,90,97,96,95,89,89,80,74,74,73,73,64,65,64,67,69,65,63,57,59,59,61,66,72,78,83,84,81,83,81,81,85,89,89,91,95,92,78,68,58,49,41,40,38,39,42,49,53,57,62,62,66,71,74,81,85,86,85,85,85,84,86,76,68,64,66,68,65,62,63,65,57,65,63,68,65,70,76,79,84,85,91,91,97,98,98,104,105,110,108,114,110,104,107,99,93,89,85,86,84,84,78,79,77,77,77,76,76,76]
  fadiga: [23,57,43,46,42,42,52,50,40,45,42,55,44,42,42,44,51,36,32,28,33,29,28,40,14,37,36,32,33,28,13,35,43,43,54,42,26,29,33,40,37,53,36,54,56,63,60,54,48,53,64,88,80,81,85,81,67,63,68,82,79,68,82,95,103,122,101,88,63,81,52,41,59,62,66,29,53,53,72,73,47,54,37,52,54,62,76,92,100,104,92,72,79,73,75,89,97,87,90,103,77,27,14,7,2,1,25,24,38,51,69,70,81,91,72,81,87,87,106,103,91,82,79,77,79,96,49,31,33,57,64,47,44,57,68,36,76,60,77,61,84,94,97,104,100,116,99,115,108,96,123,111,124,103,127,101,79,116,82,65,63,60,79,73,82,56,68,63,66,73,72,75,77]
  Pausa: semanas de 2025-05-05 a 2025-06-09.
- Recordes (tempo em segundos, ritmo em segundos/km):
  5K: 1174 s, 3:55/km, 2 jul 2024; primeira vez 5:28/km em 2022
  10K: 2502 s, 4:10/km, 27 ago 2024; primeira vez 7:27/km em 2021
  21K: 5741 s, 4:32/km, 28 jul 2024; primeira vez 5:15/km em 2023
  42K: 12407 s (3:26:47), 4:52/km, 7 jun 2026; anterior 3:32:45 (4:58/km) em 29 set 2024; diferença −5:58
  Os tempos de 5K, 10K e 21K são equivalentes ao ritmo médio da atividade (aproximados). O da maratona é real.
- Corridas por hora de início (0h a 23h): [0,0,0,0,0,12,243,276,78,20,17,16,20,6,1,2,6,17,36,36,23,3,0,0]
- Dias da semana [dia, km, corridas]: [["Seg",99,18],["Ter",1536,214],["Qua",518,69],["Qui",1485,183],["Sex",771,101],["Sáb",2342,147],["Dom",977,80]]
- Km por dia nos últimos 12 meses (dias ausentes = descanso), de 2025-09-22 a 2026-09-27:
  {"2025-09-23":10,"2025-09-26":8,"2025-09-27":20,"2025-10-01":10.1,"2025-10-02":7.1,"2025-10-04":15.1,"2025-10-07":8,"2025-10-09":10,"2025-10-11":19,"2025-10-15":10.4,"2025-10-16":9,"2025-10-18":15.1,"2025-10-20":2.5,"2025-10-21":8,"2025-10-23":9.1,"2025-10-26":21.3,"2025-11-03":3.6,"2025-11-04":7,"2025-11-11":8,"2025-11-12":8,"2025-11-15":3,"2025-11-18":7,"2025-11-19":4,"2025-11-22":15,"2025-11-25":7.4,"2025-11-27":8,"2025-11-28":14.1,"2025-12-02":10.6,"2025-12-04":7,"2025-12-05":6.3,"2025-12-10":8,"2025-12-12":8,"2025-12-15":2.5,"2025-12-17":8,"2025-12-18":8.2,"2025-12-20":13.4,"2025-12-23":5,"2025-12-24":5.1,"2025-12-27":16,"2025-12-28":4.4,"2025-12-31":4,"2026-01-02":1.4,"2026-01-03":5,"2026-01-06":8,"2026-01-08":8.5,"2026-01-10":14,"2026-01-12":3.6,"2026-01-13":5.1,"2026-01-16":10.3,"2026-01-19":6,"2026-01-20":9,"2026-01-22":10,"2026-01-24":19,"2026-01-26":4.2,"2026-01-28":6.1,"2026-02-01":10,"2026-02-03":8,"2026-02-05":7,"2026-02-07":20,"2026-02-10":12.5,"2026-02-12":10,"2026-02-14":19,"2026-02-17":10,"2026-02-18":2.8,"2026-02-19":7,"2026-02-22":21.4,"2026-02-24":10,"2026-02-26":12,"2026-02-28":7.3,"2026-03-01":17,"2026-03-04":12,"2026-03-05":8,"2026-03-06":2.3,"2026-03-08":22,"2026-03-11":10,"2026-03-13":14,"2026-03-14":25.1,"2026-03-15":14.1,"2026-03-17":10,"2026-03-21":27,"2026-03-22":4.2,"2026-03-23":5.3,"2026-03-24":10,"2026-03-26":15.1,"2026-03-27":10,"2026-03-28":32,"2026-03-31":10,"2026-04-02":11,"2026-04-04":7.6,"2026-04-05":18,"2026-04-07":12,"2026-04-09":10,"2026-04-11":7,"2026-04-12":23.5,"2026-04-14":15,"2026-04-16":12,"2026-04-17":8,"2026-04-19":25,"2026-04-21":14.8,"2026-04-23":15,"2026-04-24":4,"2026-04-25":29,"2026-04-26":5.9,"2026-04-28":10.5,"2026-04-29":4,"2026-04-30":16,"2026-05-01":8,"2026-05-02":32,"2026-05-05":12.6,"2026-05-07":13,"2026-05-08":6,"2026-05-09":25.5,"2026-05-12":11.4,"2026-05-14":14,"2026-05-15":8,"2026-05-16":36,"2026-05-17":10,"2026-05-19":9,"2026-05-21":13.5,"2026-05-22":6,"2026-05-23":25.1,"2026-05-26":9.2,"2026-05-28":11.1,"2026-05-29":6.2,"2026-05-30":18.1,"2026-06-02":10,"2026-06-04":4.1,"2026-06-07":42.5,"2026-06-11":7,"2026-06-14":21.2,"2026-06-16":8,"2026-06-18":10.2,"2026-06-20":14,"2026-06-23":10.5,"2026-06-25":10,"2026-06-27":15,"2026-06-28":10.8,"2026-06-30":9,"2026-07-02":10,"2026-07-04":10,"2026-07-05":14,"2026-07-07":11.4,"2026-07-09":5.7,"2026-07-10":13.5,"2026-07-11":14.7,"2026-07-12":7.1,"2026-07-14":8.2,"2026-07-16":11.1,"2026-07-17":6.7,"2026-07-18":16.2,"2026-07-21":7.5,"2026-07-22":11.2,"2026-07-23":4.7,"2026-07-26":21.4,"2026-07-29":8,"2026-07-30":1.7,"2026-07-31":8.5,"2026-08-01":9.4,"2026-08-04":7.9,"2026-08-06":11.7,"2026-08-07":9.3,"2026-08-08":12.9,"2026-08-11":7.4,"2026-08-12":10.9,"2026-08-14":7.6,"2026-08-15":13.9,"2026-08-18":6.9,"2026-08-19":9.4,"2026-08-21":8.7,"2026-08-22":11.1,"2026-08-25":6.2,"2026-08-26":8.2,"2026-08-27":8.8,"2026-08-28":12.7,"2026-08-29":1.1,"2026-08-31":8.2,"2026-09-02":10,"2026-09-04":9.1,"2026-09-05":11.2,"2026-09-07":7.2,"2026-09-09":9.6,"2026-09-11":13.4,"2026-09-13":10,"2026-09-17":7,"2026-09-18":10.4,"2026-09-20":15.3}
- Sequência: 70 semanas seguidas com corrida, de janeiro de 2024 a abril de 2025.
- Destaques: 64% das corridas começam entre 6h e 8h; 30% do volume é no sábado; pico semanal 80,5 km (semana de 26 ago 2024); pico mensal 308 km (abr 2025).
- Card de prova: 16 semanas antes da maratona de 7 jun 2026 somam 899 km, maior longão 36 km.
- Card de mês (agosto 2026): 172 km, 20 corridas, 5:35/km, 16h01, maior corrida 13,9 km em 15 ago.
````

---

## Passo 3: prompt inicial

Anexe o print do topo da landing page de referência.

```text
Crie a landing page do CTT seguindo o Guidelines.md à risca e usando os dados de src/data/felipe.ts. Uma página única, rolagem vertical, desktop primeiro e 100% responsiva.

Posicionamento: "Seu Strava, editado." O Strava é o feed; o CTT é a edição do seu histórico. A página usa o arquivo real do Felipe como exemplo, deixando claro que é um exemplo, e convida o visitante a conectar o próprio Strava.

Estrutura, nesta ordem (crie um componente por seção em src/components/sections/):
1. Nav: "CTT" em Archivo 900 condensada + "Arquivo de corrida" em Geist Mono. Links âncora Volume, Forma, Recordes, Card. Botão "Conectar Strava". No mobile, os links vão para um Sheet.
2. Hero: rótulo mono "Arquivo de exemplo · Felipe Oliveira · São Paulo"; H1 em duas linhas "Seu Strava," / "editado." (a segunda em signal); à direita, o parágrafo "O Strava guarda cada treino num feed. O CTT lê esse histórico e monta uma edição dele: quanto você correu, como sua forma mudou, onde estão seus recordes. No fim, vira um card pronto para o Stories." e dois botões: "Conectar Strava →" (principal) e "Ver o card" (secundário).
3. Odômetro: linha de 1px foreground em cima; "7.727" gigante com "km" pequeno sobrescrito; ao lado, 4 métricas separadas por Separator vertical: Corridas 812, Horas 705, Subida · m 29.992, Desde 2020. Abaixo, a faixa de volume semanal (uma barra fina por semana, 2023→2026, provas em signal com o rótulo "42K" em cima, anos marcados no eixo), com "Cada barra é uma semana" à esquerda e "Pico: 80,5 km · ago 2024" à direita.
4. Volume: título "Seis anos de corrida, quatro de rotina." Gráfico de barras mensal (pico em signal com anotação "308 km · abr 25", 2026 em foreground, anos anteriores em texto secundário a 55%) e, ao lado, uma Table por ano (Ano, km com mini barra, Corridas, Ritmo, Maior), 2024 destacado em signal.
5. Forma: título "A curva que o feed não mostra." Área da forma em signal-soft com linha signal de 2px; fadiga em linha fina muted-foreground; faixa cinza "pausa" em mai–jun 2025; linhas tracejadas "Maratona · set 24" e "Maratona · jun 26"; crosshair com tooltip.
6. Recordes: título "Do primeiro ao melhor." Grade de 4 colunas (2 no mobile) com data, distância gigante (5K, 10K, 21K, 42K), tempo, ritmo e uma trilha horizontal com o ponto da primeira vez (vazado) e o do recorde (signal). A coluna 42K fica toda em signal com "−5:58 vs. 2024".
7. Relógio: título "Corredor das 6h da manhã." "64%" grande em signal + barras por hora (6h e 7h em signal); "30%" + barras horizontais por dia da semana (sábado em signal).
8. Últimos 12 meses: título "Um ano, dia por dia." Calendário estilo GitHub, 53 colunas × 7 linhas (seg→dom), 6 tons de muted até signal, legenda "Menos → Mais · 21 km+", tooltip por dia.
9. Card para o Stories: à esquerda, título "Um treino vira uma capa.", texto e dois ToggleGroups (tipo: Prova, Mês, Temporada; cor: Papel, Tinta, Ultramar). À direita, a prévia 9:16 do card.
10. Como funciona: título "Sem feed. Sem ranking." e 3 colunas (Conectar, Ler, Compartilhar) com linha de 1px em cima.
11. CTA final: "Quanto você já correu?" em Archivo 900 condensada gigante + botão "Conectar Strava →".
12. Rodapé em Geist Mono: "CTT · usectt.com.br" e "Dados via Strava · São Paulo, BR".

Nesta primeira versão, priorize estrutura, tipografia e espaçamento corretos. Os gráficos podem ser simples; vamos refiná-los seção por seção.
```

---

## Passo 4: prompts por seção

Mande um de cada vez, conferindo o resultado antes do próximo. Anexe o print da seção correspondente na referência.

### 4.1 Hero e odômetro

```text
Refine só o Hero e o Odômetro, sem mexer nas outras seções.
- O H1 e o "7.727" são a imagem da página: Archivo 800/900, font-stretch 78% no H1 e 62% no odômetro, tracking -0.03em, line-height 0.9 e 0.78. Confira se a fonte está com o eixo de largura aplicado (se o número parecer largo, a fonte condensada não carregou).
- O H1 e o parágrafo ficam alinhados pela base, em grid 1.1fr / 1fr com 72px de gap.
- As 4 métricas do odômetro alinham pela base do número gigante; rótulo mono em cima, valor em Archivo 700 stretch 75%, 30px. No mobile, viram 2×2 abaixo do número.
- Faixa semanal: altura 180px no desktop e 120px no mobile, barras de 62% da largura do passo, grade horizontal em 20/40/60/80 km, tooltip "{km} km · semana de {data}" e o nome da prova quando houver.
```

### 4.2 Volume

```text
Refine só a seção Volume.
- Gráfico mensal com ChartContainer do shadcn, BarChart, barras com radius [3,3,0,0], eixo Y com 0/100/200/300, eixo X só com os anos no primeiro mês de cada um.
- ToggleGroup acima do gráfico para alternar "km" e "corridas" (a cor de destaque continua no mês de pico).
- Table do shadcn: cabeçalho em Geist Mono caixa alta, linha de 1px foreground abaixo do cabeçalho, linhas com border 1px, números tabulares alinhados à direita, mini barra de 6px antes do km proporcional ao maior ano. Linha de 2024 inteira em signal.
- Nota de rodapé em 13px muted: "Ritmo médio de todas as corridas do ano, em min/km. 2026 vai até 20 de setembro."
```

### 4.3 Forma

```text
Refine só a seção Forma.
- ComposedChart: Area (forma) com fill signal-soft a 70% e stroke signal 2.25px; Line (fadiga) muted-foreground 1.25px; sem pontos, exceto um ponto signal de 9px no último valor da forma.
- ReferenceArea cinza (muted) para a pausa com rótulo "pausa" em cima; ReferenceLine tracejada para as duas maratonas com rótulo em Geist Mono.
- Tooltip com cursor vertical: "Forma 97 · Fadiga 115" em Archivo 600 e "semana de 30 mar 2026" em mono.
- Legenda discreta abaixo: traço signal "Forma · 42 dias", traço fino "Fadiga · 7 dias".
- Parágrafo do cabeçalho: "Forma é a média da carga dos últimos 42 dias. Fadiga é a mesma conta em 7 dias. Quando a fadiga passa muito da forma, é bloco pesado. Quando cai, é descanso."
```

### 4.4 Recordes

```text
Refine só a seção Recordes.
- Grade com linha 1px foreground em cima e divisórias verticais de 1px border entre colunas.
- Cada coluna: data em mono, distância em Archivo 800 stretch 70% (64px), tempo em Archivo 600 stretch 80% (26px), ritmo em 14px texto secundário.
- Trilha de progressão: eixo invertido (mais rápido à direita), trilho 2px border, segmento signal entre a primeira vez e o recorde, ponto vazado na primeira vez, ponto cheio signal no recorde, rótulos mono nas pontas ("5:28 · 2022" e "3:55").
- HoverCard em cada coluna com detalhes: nome da atividade, distância real, tempo real.
- 42K inteira em signal, com a pílula "−5:58 vs. 2024".
- Nota: "Tempos de 5K, 10K e meia são equivalentes ao ritmo médio da atividade inteira. A maratona é o tempo real em movimento."
```

### 4.5 Relógio e calendário

```text
Refine só as seções Relógio e Últimos 12 meses.
- Relógio: duas colunas (1.4fr / 1fr). Número grande em signal (Archivo 800 stretch 70%, 48px) + frase curta ao lado. Barras por hora com rótulos a cada 3h; 6h e 7h em signal, o resto em texto secundário a 60%. Barras horizontais por dia com o km no fim de cada barra; sábado em signal.
- Calendário: quadrados de 12–14px com 3px de gap e raio 2px, meses em mono acima da primeira semana de cada mês, "Seg / Qua / Sex / Dom" à esquerda. Níveis: 0 = muted, <5, <10, <15, <21, 21+ km (este último em signal puro). Tooltip "10,4 km · 18 set 2026" ou "Descanso · 19 set 2026". No mobile, rolagem horizontal só dentro do calendário, começando pelo fim (mês atual visível).
```

### 4.6 Card para o Stories (a peça mais importante)

```text
Refine só a seção do Card para o Stories. Essa é a peça que as pessoas vão compartilhar; trate como uma capa de revista.
- Prévia 9:16, largura 330px, raio 22px, sombra longa e suave, borda 1px border. Padding interno 12% em cima e embaixo (área segura do Instagram) e 9% nas laterais.
- As cores do card são fixas (é uma imagem exportada) e não seguem o tema da página:
  Papel: fundo #F2F2EE, texto #111210, destaque #2B34F5, secundário #8A8C84.
  Tinta: fundo #0F100E, texto #EFEFEA, destaque #8A90FF, secundário #7C7E76.
  Ultramar: fundo #2B34F5, texto #FFFFFF, destaque #FFFFFF, secundário #B9BCFF.
- Layout do card: topo com "CTT" (Archivo 900 condensada) e o contexto em mono à direita; o bloco de números empurrado para baixo (margin-top auto): rótulo mono, número gigante (Archivo 900 stretch 62%, ~76px), linha de detalhe, pílula com borda na cor de destaque, gráfico de barras, duas linhas de rodapé em mono ("usectt.com.br/felipe" e "Felipe Oliveira").
- Prova: "Maratona · 07 jun 2026", "Tempo em movimento", "3:26:47", "42,5 km · 4:52/km", pílula "−5:58 vs. set 2024", barras das 16 semanas antes da prova (a última em destaque), "16 semanas · 899 km" / "maior: 36 km".
- Mês: "Agosto 2026", "Volume do mês", "172 km", "20 corridas · 5:35/km · 16h01", pílula "Maior: 13,9 km · 15 ago", barras por dia de agosto (15 ago em destaque), "1 ago" / "31 ago".
- Temporada: "2020 — 2026", "Tudo que já corri", "7.727 km", "812 corridas · 705 horas · 2 maratonas", pílula "Pico: 2.349 km em 2024", barras por ano (2024 em destaque), anos abreviados embaixo.
- Troca de tipo e cor com transição de 150ms. Botão secundário "Baixar PNG" abaixo dos toggles (pode ficar desativado com Tooltip "Disponível na versão final").
```

---

## Passo 5: passes de polimento

Esses prompts transformam uma boa página numa página excelente. Mande em sequência.

```text
Passe de responsivo. Revise a página em 375px, 768px, 1024px e 1440px. Em 375px não pode haver rolagem horizontal (exceto dentro do calendário), nenhum texto cortado, nenhum número saindo do container. Ajuste tamanhos com clamp() e reorganize grids em vez de só encolher. Os gráficos devem manter rótulos legíveis (mínimo 10px) e esconder rótulos intermediários quando faltar espaço.
```

```text
Passe de tema escuro. Adicione um toggle claro/escuro discreto na nav (ícone lucide sun/moon, botão ghost). Use os tokens escuros do Guidelines.md. Revise cada gráfico no escuro: grade, eixos, tooltip e o signal (#8A90FF) precisam ter contraste. O card do Stories não muda com o tema.
```

```text
Passe de estados e interação. 1) Hover em toda barra, célula e ponto dos gráficos, com área de clique maior que a marca. 2) Foco visível por teclado em todos os controles. 3) Crie a variação "carregando" da página com Skeleton do shadcn no lugar dos números e gráficos, e deixe um toggle escondido em ?estado=carregando para eu revisar. 4) Crie o estado "sem dados" (atleta conectou mas ainda está importando): mensagem "Estamos importando seu histórico. Isso leva alguns minutos." com um Badge "Sincronizando".
```

```text
Passe de detalhe tipográfico. Revise toda a página: 1) nenhuma viúva nos títulos (text-wrap: balance); 2) números sempre tabulares; 3) separador de milhar com ponto e decimal com vírgula; 4) caixa alta só nos rótulos mono; 5) alinhamento óptico dos números gigantes com a margem esquerda (compense o respiro lateral do "7" e do "5K"); 6) hierarquia clara: no máximo 3 tamanhos de texto por seção.
```

```text
Passe de consistência. Liste todos os componentes que você criou e confirme que cada um usa os componentes shadcn e os tokens do tema (nenhuma cor hexadecimal solta fora do card do Stories). Unifique espaçamentos repetidos em constantes. Me mostre a lista do que ajustou.
```

---

## Dicas para tirar o máximo do Figma Make

- **Uma mudança por prompt.** Quando o Make erra, peça a correção isolada ("só a coluna 42K, o resto está certo") em vez de reescrever a seção inteira.
- **Aponte o elemento.** Use a ferramenta de seleção do Make para clicar no elemento antes de pedir a mudança; o prompt fica mais curto e preciso.
- **Guarde versões boas.** Antes de um passe grande (tema escuro, responsivo), salve a versão atual para poder voltar.
- **Se a fonte condensada não aparecer:** peça "importe Archivo pelo link do Guidelines.md no topo de styles/globals.css e aplique font-stretch nos títulos". O eixo wdth só funciona com o link que inclui `wdth`.
- **Para levar ao Figma:** quando a página estiver pronta, copie as seções como design para o arquivo do Figma e monte a biblioteca de componentes (card, recordes, gráficos) a partir delas.
