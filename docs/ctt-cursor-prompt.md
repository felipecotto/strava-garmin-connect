# Prompt para o Cursor: CTT, "Seu Strava, editado"

> Cole tudo abaixo da linha no chat do Cursor (modo Agent), com o projeto `strava-garmin-connect` aberto.
> A referência visual é a landing page "CTT — Arquivo de Corrida" (artifact). Se possível, salve o HTML dela em `docs/ctt-lp-referencia.html` e anexe ao chat com `@docs/ctt-lp-referencia.html`.

---

## Papel e contexto

Você é um engenheiro front-end sênior trabalhando no **CTT** (usectt.com.br), um app Next.js conectado ao Strava. Stack atual: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui (componentes em `src/components/ui`, primitivas `@base-ui/react`), Recharts 3, Supabase (tabelas `profiles`, `activities`, `sync_cursors`), iron-session para a sessão do Strava.

**Antes de escrever código, leia `AGENTS.md`.** Esta versão do Next tem mudanças que quebram APIs. Confira em `node_modules/next/dist/docs/` tudo que for usar (params assíncronos, `next/font`, `ImageResponse`, route handlers, cache) e respeite os avisos de depreciação.

## Objetivo

Trocar o dashboard genérico por uma **edição** do histórico de corrida do atleta: uma página única, bonita e fácil de ler, com volume, forma, recordes, rotina e um card para o Stories.

- A mesma página atende a home (`/`) e o perfil público (`/[slug]`).
- Na home anônima, ela mostra o arquivo do Felipe como exemplo, com um aviso claro de que é um exemplo e um CTA "Conectar Strava".
- O dono logado vê a própria página com duas ações a mais: "Compartilhar" e "Gerar card".
- O dashboard (`/dashboard/*`) deixa de ser o destino principal. Depois do login, redirecione para `/[slug]`. Mantenha `/dashboard/settings` (ou mova para `/perfil`) para as configurações.

Trabalhe no branch `feat/edicao`. Faça um commit por fase (abaixo), com mensagem em português.

## Princípio de UI: shadcn primeiro

O shadcn/ui resolve a camada de interface. **Não reinvente componente que o shadcn já tem.** Regras:

1. Antes de criar qualquer elemento de interface, procure o equivalente no shadcn. Se não estiver instalado, adicione pelo CLI (`npx shadcn@latest add <nome>`), respeitando o `components.json` do projeto (estilo e base-ui já configurados). Não copie código de outro registry na mão.
2. Instale no início: `chart`, `tooltip`, `toggle-group`, `table`, `hover-card`. Os que já existem (`button`, `card`, `badge`, `tabs`, `separator`, `skeleton`, `avatar`, `dropdown-menu`, `sheet`, `switch`, `alert-dialog`) devem ser reaproveitados.
3. **Personalize pelo tema, não por componente.** A identidade vem das variáveis CSS do shadcn (`--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--chart-1..5`, `--radius`) e de poucas variantes novas via `cva`. Evite `className` com cor literal espalhado nas páginas.
4. **Gráficos com o shadcn Chart** (`ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartConfig`) sobre o Recharts que já está no projeto. Cor sempre via `var(--color-<chave>)` definida no `ChartConfig`.
5. Composição com `Card` usada com moderação. A página é editorial: a maioria das seções não é card. Use `Card` só para o que é objeto separado (o card do Stories, o painel de configurações).

### Mapeamento seção → componentes shadcn

| Seção | Componentes |
|---|---|
| Navegação | `Button` (variante `default` e `ghost`), `NavigationMenu` no desktop, `Sheet` no mobile, `DropdownMenu` com avatar para o dono |
| Hero e odômetro | Tipografia pura; `Separator` entre as métricas; `Badge variant="outline"` para "Arquivo de exemplo" |
| Volume semanal (faixa) | `ChartContainer` + `BarChart` (Recharts), `ChartTooltip` |
| Volume mensal | `ChartContainer` + `BarChart`; `ToggleGroup` para alternar "km" / "corridas" |
| Resumo por ano | `Table` do shadcn, com barra inline na coluna de km |
| Forma e fadiga | `ChartContainer` + `ComposedChart` (`Area` para forma, `Line` para fadiga), `ReferenceArea` para pausas, `ReferenceLine` para provas, `ChartLegend` |
| Recordes | Grade de 4 colunas; `HoverCard` com os detalhes da atividade; `Tooltip` na trilha de progressão |
| Relógio | `ChartContainer` + `BarChart` vertical (hora) e horizontal (dia da semana) |
| Calendário de 12 meses | Grade de `div`s com `Tooltip` por dia (não é um gráfico do Recharts) |
| Card do Stories | `Card` + `ToggleGroup` (tipo: Prova / Mês / Temporada) + `ToggleGroup` de cor (Papel / Tinta / Ultramar) + `Button` "Baixar PNG" |
| Estados | `Skeleton` durante o carregamento; estado vazio com `Button` para conectar |
| Configurações | `Card`, `Switch`, `Input`, `Label`, `AlertDialog` para desconectar |

## Direção visual

**Conceito:** laboratório suíço de corrida. A atitude tipográfica da Bandit Running (números condensados enormes) com a precisão da On (muito respiro, grid rígido, nada decorativo). Os dados são monocromáticos, e **uma única cor de sinal** marca o que importa: recorde, pico, prova, o dia de hoje.

### Tipografia (via `next/font/google`)

- **Archivo** com eixo de largura (`axes: ["wdth"]`). Condensada (`font-stretch: 62%–78%`, peso 800–900) em números e títulos; largura normal no texto.
- **Geist Mono** para rótulos, eixos, datas e metadados, em caixa alta com `letter-spacing: .06em` e 11–12px.
- Remova Plus Jakarta Sans, Inter e JetBrains Mono do `layout.tsx`.
- `font-variant-numeric: tabular-nums` em todo número que alinha em coluna.

Escala (desktop → mobile):

| Uso | Tamanho | Estilo |
|---|---|---|
| Odômetro (km total) | clamp(88px, 19vw, 260px) | Archivo 900, stretch 62%, line-height .78 |
| H1 | clamp(44px, 7.4vw, 104px) | Archivo 800, stretch 78% |
| H2 de seção | clamp(34px, 4.6vw, 64px) | Archivo 800, stretch 75% |
| Número de recorde | clamp(40px, 4.6vw, 64px) | Archivo 800, stretch 70% |
| Texto | 16–18px | Archivo 400 |
| Rótulo | 11.5px | Geist Mono, caixa alta |

### Cor: substitua os tokens do `globals.css`

Mapeie a paleta para as variáveis do shadcn (Tailwind v4, `@theme inline` já existe no arquivo). O laranja `#E8450A` sai.

```css
:root {
  --background: #F2F2EE;   /* papel */
  --foreground: #111210;   /* tinta */
  --card: #FFFFFF;
  --card-foreground: #111210;
  --popover: #111210;      /* tooltips escuros */
  --popover-foreground: #F2F2EE;
  --primary: #111210;      /* botão principal é tinta; o hover vira ultramar */
  --primary-foreground: #F2F2EE;
  --secondary: #E6E7E1;
  --secondary-foreground: #111210;
  --muted: #E6E7E1;
  --muted-foreground: #7A7C74;
  --accent: #DADCFF;
  --accent-foreground: #111210;
  --border: #D8D9D2;
  --input: #D8D9D2;
  --ring: #2B34F5;
  --signal: #2B34F5;        /* ultramar: a única cor de destaque */
  --signal-soft: #DADCFF;
  --ink-2: #4A4C46;
  --chart-1: #2B34F5;       /* destaque */
  --chart-2: #111210;       /* série principal */
  --chart-3: #4A4C46;       /* série secundária */
  --chart-4: #7A7C74;       /* fadiga, linhas de apoio */
  --chart-5: #D8D9D2;       /* grade */
  --radius: 0.5rem;
}
.dark {
  --background: #0D0E0C;
  --foreground: #ECEDE7;
  --card: #161714;
  --card-foreground: #ECEDE7;
  --popover: #ECEDE7;
  --popover-foreground: #0D0E0C;
  --primary: #ECEDE7;
  --primary-foreground: #0D0E0C;
  --secondary: #20221E;
  --secondary-foreground: #ECEDE7;
  --muted: #20221E;
  --muted-foreground: #83857C;
  --accent: #262A5C;
  --accent-foreground: #ECEDE7;
  --border: #2C2E29;
  --input: #2C2E29;
  --ring: #8A90FF;
  --signal: #8A90FF;
  --signal-soft: #262A5C;
  --ink-2: #B4B6AE;
  --chart-1: #8A90FF;
  --chart-2: #ECEDE7;
  --chart-3: #B4B6AE;
  --chart-4: #83857C;
  --chart-5: #2C2E29;
}
```

Adicione `--color-signal`, `--color-signal-soft` e `--color-ink-2` ao `@theme inline`. Remova os tokens que não forem mais usados (`--brand`, `--glow`, `--mist`, `--sand`, `atmosphere`, `grain-surface`, etc.) depois de migrar os componentes que dependem deles.

### Regras de forma

- Raio pequeno (8px) em superfícies; botões e chips em pílula (`rounded-full`). Nada de sombra, exceto no card do Stories.
- Divisões com linhas de 1px (`border-border`). Uma linha de 1px em `foreground` abre cada seção e cada bloco de métricas.
- Barras de gráfico finas, com cantos de 2–3px só na ponta de cima (`radius={[3,3,0,0]}`), sem grade vertical, grade horizontal em `--chart-5`.
- Rótulos de eixo em Geist Mono 10.5px, cor `muted-foreground`.
- Nenhum gradiente, nenhum emoji, nenhum ícone decorativo. Ícones do `lucide-react` só em ações (compartilhar, baixar, configurações).
- Movimento: só transições de hover (150ms). Respeite `prefers-reduced-motion`. A página precisa estar completa sem depender de animação.

### Botão principal

Variante `default` do `Button`: fundo `primary` (tinta), texto `primary-foreground`, `rounded-full`, altura 44px; no hover, fundo `signal`. Crie isso na `cva` do `button.tsx` em vez de sobrescrever por página.

## Dados

Todos os cálculos saem da tabela `activities` (corridas: `sport_type` em `Run`, `TrailRun`, `VirtualRun`), usando `start_date_local`. Crie `src/lib/archive/` com funções puras e testáveis (Vitest já está configurado):

```ts
// src/lib/archive/types.ts
export type ArchiveData = {
  totals: { runs: number; km: number; hours: number; elevationM: number; firstRunYear: number }
  weeks: { weekStart: string; km: number; race?: string }[]            // segunda-feira ISO, desde 2023 ou desde a 1ª corrida
  months: { month: string; km: number; runs: number }[]                // "2025-04"
  years: { year: number; km: number; runs: number; paceSecPerKm: number; longestKm: number }[]
  load: { weekStart: string; fitness: number; fatigue: number }[]       // forma (42d) e fadiga (7d)
  records: { key: "5k" | "10k" | "half" | "marathon"; bestSec: number; bestPace: number; date: string;
             activityId: number; firstPace: number; firstDate: string; exact: boolean }[]
  hours: number[]                                                       // 24 posições, contagem por hora de início
  weekdays: { day: "seg"|"ter"|"qua"|"qui"|"sex"|"sab"|"dom"; km: number; runs: number }[]
  daily: Record<string, number>                                         // últimos 371 dias, km por dia (SOMA de todas as corridas do dia)
  streaks: { longestWeeks: number; longestFrom: string; longestTo: string; currentWeeks: number }
  highlights: { peakWeek: { weekStart: string; km: number }; peakMonth: { month: string; km: number };
                earlyShare: number; saturdayShare: number }             // frases da página
}
```

Regras de cálculo:

- **Semanas** começam na segunda-feira. Preencha semanas sem corrida com 0 (elas aparecem como buraco na faixa).
- **Ritmo** = tempo em movimento ÷ distância. Formate como `m:ss/km`.
- **Recordes:** hoje, aproxime pelo melhor ritmo entre atividades com distância entre 100% e 105% do alvo e normalize o tempo para a distância exata (`exact: false`). Na maratona, use o tempo real da atividade (`exact: true`). Deixe um ponto de extensão para usar `best_efforts` da atividade detalhada quando essa sincronização existir.
- **Provas:** marque como prova a atividade com `workout_type = 1` (corrida marcada como prova no Strava) ou com distância de 21,1–22,2 km ou 42,2–43,5 km quando for a mais rápida da semana. Adicione a coluna `workout_type smallint` em `activities` com uma migration nova e preencha na sincronização (`map-activity.ts`).
- **Carga (forma e fadiga):** TRIMP de Banister por atividade, com a FC média já salva:
  `hrr = (avg_hr − hr_rest) / (hr_max − hr_rest)`; `trimp = minutos × hrr × 0.64 × e^(1.92 × hrr)`.
  Use `hr_rest = 50` e `hr_max = percentil 98 de max_heartrate` do atleta (padrão 190 se não houver dados). Atividade sem FC: estime por `minutos × 0.8`. Some por dia, incluindo pedal e musculação.
  Depois, dia a dia: `fitness += (carga − fitness) / 42`; `fatigue += (carga − fatigue) / 7`. Guarde um ponto por semana.
- **Calendário diário:** some todas as corridas do mesmo dia. (Um bug comum é acumular em unidades diferentes; teste um dia com duas corridas.)
- **Sequência:** semanas consecutivas com pelo menos uma corrida.
- **Destaques:** `earlyShare` = fração das corridas que começam entre 6h e 7h59; `saturdayShare` = fração do volume no sábado. Os textos da página usam esses números (não escreva "64%" fixo).

Crie `getArchive(profileId)` em `src/lib/archive/get-archive.ts`, com cache do Next (confira a API de cache nesta versão) e invalidação quando a sincronização terminar (`recompute-stats.ts`).

Escreva testes em `src/lib/archive/*.test.ts` para: semanas com buraco, dia com duas corridas, recorde normalizado, TRIMP sem FC, sequência de semanas.

## Página

Crie `src/components/archive/edition/` e monte a página nesta ordem. O texto pode ser adaptado, mas mantenha o tom: frases curtas, voz ativa, sem frase motivacional.

1. **Nav:** "CTT" (Archivo 900 condensada) + "Arquivo de corrida" em mono. Links âncora: Volume, Forma, Recordes, Card. CTA "Conectar Strava" (anônimo) ou avatar com menu (dono).
2. **Hero:** rótulo mono (`Arquivo de exemplo · Nome · Cidade` ou `Arquivo · Nome · Cidade`), H1 "Seu Strava, *editado.*" (a segunda parte em `signal`) na home; no perfil, o nome do atleta. Parágrafo: "O Strava guarda cada treino num feed. O CTT lê esse histórico e monta uma edição dele: quanto você correu, como sua forma mudou, onde estão seus recordes. No fim, vira um card pronto para o Stories."
3. **Odômetro:** km total gigante + 4 métricas separadas por `Separator` vertical (Corridas, Horas, Subida · m, Desde). Abaixo, a faixa de volume semanal (uma barra por semana, provas em `signal` com rótulo "42K"/"21K", marcação dos anos no eixo).
4. **Volume:** título + parágrafo gerado a partir dos dados; gráfico mensal (pico em `signal`, ano corrente em `chart-2`, anteriores em `chart-3` a 55%) + `Table` por ano (ano de maior volume em `signal`).
5. **Forma:** "A curva que o feed não mostra." Área de forma em `signal-soft` com linha `signal` de 2px, fadiga em linha `chart-4` de 1.25px, `ReferenceLine` tracejada nas provas, `ReferenceArea` em semanas seguidas com carga zero ("pausa"). Crosshair com tooltip "Forma X · Fadiga Y · semana de D".
6. **Recordes:** "Do primeiro ao melhor." 4 colunas (2 no mobile): data, distância gigante, tempo, ritmo, e uma trilha horizontal com o ponto da primeira vez (vazado) e do recorde (preenchido em `signal`). O recorde mais recente fica todo em `signal` e mostra a diferença para o anterior ("−5:58 vs. 2024"). Nota de rodapé explicando quando o tempo é aproximado.
7. **Relógio:** frase grande com o percentual (`earlyShare`) + barras por hora (6h e 7h em `signal`); frase com `saturdayShare` + barras horizontais por dia (dia de maior volume em `signal`).
8. **Últimos 12 meses:** calendário 53 × 7 (linhas seg→dom), 6 níveis de cor de `muted` até `signal` via `color-mix`, legenda "Menos → Mais · 21 km+", tooltip por dia ("10,4 km · 18 set 2026" ou "Descanso"). Rolagem horizontal própria no mobile. Parágrafo com a maior sequência de semanas.
9. **Card do Stories** (ver abaixo).
10. **Como funciona:** 3 colunas (Conectar, Ler, Compartilhar), cada uma com linha de 1px em cima.
11. **CTA final:** "Quanto você já correu?" em Archivo 900 condensada enorme + botão "Conectar Strava". Só na home anônima.
12. **Rodapé:** mono, "CTT · usectt.com.br" e "Dados via Strava". Inclua o selo "Powered by Strava" conforme as diretrizes de marca do Strava.

Layout: container `max-w-[1240px]` com `px-4 sm:px-8 lg:px-12`. Cabeçalho de seção em duas colunas (título à esquerda, parágrafo à direita, alinhados pela base) que vira uma coluna abaixo de 860px. Seções separadas por `border-t` e `py-14 md:py-28`. Nada de rolagem horizontal no body em 375px.

## Card do Stories

- `src/components/archive/edition/story-card.tsx`: prévia 9:16 (`aspect-[9/16]`, largura máxima 330px) dentro de `Card` com sombra.
- Três tipos via `ToggleGroup`:
  - **Prova:** "Maratona · 07 jun 2026", tempo gigante, "42,5 km · 4:52/km", pílula com a diferença para o recorde anterior, barras das 16 semanas antes da prova (a da prova em destaque), "16 semanas · 899 km · maior: 36 km".
  - **Mês:** mês anterior completo: km gigante, corridas · ritmo · horas, barras por dia.
  - **Temporada:** km total desde a primeira corrida, corridas · horas · maratonas, barras por ano.
- Três cores via `ToggleGroup`: Papel (#F2F2EE/#111210, destaque #2B34F5), Tinta (#0F100E/#EFEFEA, destaque #8A90FF), Ultramar (#2B34F5/#FFFFFF, destaque #FFFFFF). Essas cores são fixas (é uma imagem exportada) e não seguem o tema da página.
- Rodapé do card: `usectt.com.br/<slug>` e nome do atleta.
- Mantenha os números entre 12% e 88% da altura (áreas que o Instagram cobre ficam livres).
- **Exportação:** route handler `src/app/[slug]/card/route.tsx` com `ImageResponse` gerando PNG 1080 × 1920 (`?tipo=prova|mes|temporada&cor=papel|tinta|ultramar`). Carregue Archivo e Geist Mono como `ArrayBuffer` para a fonte sair certa. O botão "Baixar PNG" aponta para essa rota. Só o dono vê o botão; perfis públicos podem ver a prévia.

## Fases e critérios de aceite

**Fase 1: tema.** Fontes, tokens, `button` com a variante nova, componentes shadcn instalados. Aceite: `npm run build` passa; `/` renderiza com as fontes novas nos dois temas.

**Fase 2: dados.** `src/lib/archive/*`, migration `workout_type`, testes. Aceite: `npx vitest run` passa; `getArchive` retorna os campos acima para o perfil do Felipe.

**Fase 3: página.** Seções 1 a 12 em `/[slug]` e na home. Aceite: sem erro no console; 375px sem rolagem horizontal; todos os gráficos com tooltip; texto dos destaques vindo dos dados; `/felipe-oliveira` (ou o slug real) responde 200. Hoje ele responde 404: descubra por quê (slug diferente ou `is_public = false`) e corrija.

**Fase 4: card.** Prévia com os 3 tipos e 3 cores; rota PNG 1080 × 1920. Aceite: o PNG abre com as fontes certas e os números corretos.

**Fase 5: limpeza.** Redirecione o pós-login para `/[slug]`; remova componentes e tokens que ficaram sem uso (`landing/*`, `dashboard/*` exceto configurações, `ui/atmosphere`); atualize as stories do Storybook dos componentes novos.

## Não faça

- Não use o laranja `#E8450A`, gradientes, emojis ou sombras fora do card do Stories.
- Não crie componentes de UI do zero quando o shadcn tiver um equivalente.
- Não escreva números fixos no texto da página; tudo sai do `ArchiveData`.
- Não adicione feed, ranking, seguidores ou plano de treino.
- Não mude a lógica de OAuth do Strava nem os segredos do `.env`.
- Não faça `git push` sem eu pedir.

Ao terminar cada fase, me mostre um resumo curto do que mudou e o que eu devo testar no navegador.
