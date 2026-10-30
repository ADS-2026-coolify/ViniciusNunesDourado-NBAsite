# 🏀 COURTSIDE NBA — Full-Stack Experience (Next.js + NestJS)

Plataforma web interativa completa sobre a **NBA**, construída com arquitetura desacoplada em duas pastas:
- **`front/`**: Aplicação **React + Next.js** (App Router, TypeScript, Tailwind CSS v4, Framer Motion) com design editorial escuro, **efeito parallax multicamadas**, cards 3D interativos e modal **Courtside Game Center**.
- **`back/`**: API REST em **NestJS** (TypeScript) com cache inteligente em memória, integração em tempo real com dados oficiais de jogos/boxscores/classificação/líderes da NBA e enciclopédia histórica completa (1946–Presente).

---

## ✨ Funcionalidades Principais

1. **Landing Page com Parallax Multicamadas (`/`)**
   - Palco Hero em 4 camadas de profundidade (arena iluminada, geometria de quadra e tipografia gigante em contra-parallax, bola de basquete 3D com rotação atrelada ao scroll e reatividade ao cursor, e telemetria ao vivo).
   - Ticker superior contínuo com placares e MVPs clicáveis em todas as páginas.
   - Destaques de jogos do dia, **Jogadores da Semana** (MVP Geral, Leste e Oeste), **MVPs dos Jogos**, portal parallax para a História da NBA, líderes da temporada, classificação e últimas notícias.
2. **Calendário Oficial da NBA (`/calendario`)**
   - Faixa interativa de 8 dias, seletor de qualquer data da temporada, atalhos para datas especiais (Hoje, Rodada de Natal, Ano Novo), busca por franquia e filtro por status (*Agendados*, *Ao Vivo*, *Encerrados*).
3. **Histórico de Jogos & Galeria de MVPs (`/historico`)**
   - Pódio dos 3 maiores MVPs individuais das últimas rodadas pelo índice oficial de impacto (*Rating*).
   - Filtros inteligentes: *Jogos Clutch (≤ 6 pts)*, *125+ Pontos*, *Prorrogação (OT)* e busca por time ou jogador.
4. **Courtside Game Center (Modal Interativo Global)**
   - Clique em qualquer partida em qualquer página para abrir o **Boxscore Completo** de atletas de ambas as equipes, parciais por quarto (`Q1–Q4/OT`), foto da arena, público e **Comparativo Tático** animado.
5. **Estatísticas & Classificação (`/stats`)**
   - Líderes da temporada em todas as categorias (Pontos, Rebotes, Assistências, Roubos, Tocos, Aproveitamento) com pódio 3D e gráfico Top 10.
   - Tabela completa das 30 franquias (Conferências Leste e Oeste) com destaque visual para zona de **Playoffs Diretos (1º–6º)** e **Torneio Play-In (7º–10º)**.
6. **Enciclopédia da História da NBA (`/historia`)**
   - Linha do tempo interativa das **8 Eras da NBA** (1946–Presente), **Evolução das Regras** (desde as cestas de pêssego de 1891 e o relógio de 24s), **Panteão de 12 Lendas/GOATs**, **Maiores Dinastias**, **Recordes Imortais** e **Quiz Interativo da História da NBA**.

---

## 🚀 Como Executar

### 1. Iniciar o Backend (`back` — Porta `3001`)
```powershell
cd back
npm run start:dev
```
A API ficará disponível em `http://localhost:3001/api/nba/overview`.

### 2. Iniciar o Frontend (`front` — Porta `3000`)
```powershell
cd front
npm run dev
```
Acesse no navegador: `http://localhost:3000`.
