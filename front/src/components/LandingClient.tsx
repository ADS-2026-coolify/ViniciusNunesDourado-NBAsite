"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Calendar,
  Crown,
  ExternalLink,
  Flame,
  Newspaper,
  Sparkles,
} from "lucide-react";
import type { NbaGame, OverviewResponse } from "@/lib/types";
import {
  API_BASE_URL,
  ensureVisibleColor,
  formatDatePtBr,
} from "@/lib/api";
import { ParallaxHero } from "./ParallaxHero";
import { PlayersOfWeekSection } from "./PlayersOfWeekSection";
import { CourtParallaxPortal } from "./CourtParallaxPortal";
import { GameCard } from "./GameCard";
import { TiltCard } from "./TiltCard";
import { useGameModal } from "./GameModalContext";

export function LandingClient({
  initialData,
}: {
  initialData: OverviewResponse | null;
}) {
  const [data, setData] = useState<OverviewResponse | null>(initialData);
  const [confTab, setConfTab] = useState<"western" | "eastern">("western");
  const { openGame } = useGameModal();

  useEffect(() => {
    if (data) return;
    fetch(`${API_BASE_URL}/overview`)
      .then((r) => (r.ok ? r.json() : null))
      .then((res: OverviewResponse | null) => {
        if (res) setData(res);
      })
      .catch(() => {});
  }, [data]);

  if (!data) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        <p className="font-display text-2xl tracking-wider text-zinc-300">
          ENTRANDO EM QUADRA...
        </p>
      </div>
    );
  }

  const allKnownGames: NbaGame[] = [...data.todayGames, ...data.recentGames];
  const findGameById = (id: string) =>
    allKnownGames.find((g) => g.id === id);

  const featuredMvp = data.mvpShowcase[0];
  const featuredGame = featuredMvp
    ? findGameById(featuredMvp.gameId) ?? data.recentGames[0]
    : data.recentGames[0];

  const displayGames =
    data.todayGames.length > 0
      ? data.todayGames.slice(0, 6)
      : data.recentGames.slice(0, 6);

  return (
    <div className="overflow-hidden">
      {/* 1. 4-LAYER BASKETBALL PARALLAX HERO */}
      <ParallaxHero
        season={data.season}
        featuredMvp={featuredMvp}
        featuredGame={featuredGame}
        totalTodayGames={data.todayGames.length}
      />

      {/* 2. TODAY'S GAMES / LIVE SCHEDULE */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-300">
              <Calendar className="h-3.5 w-3.5" />
              {data.todayGames.length > 0
                ? `Agenda de Hoje • ${formatDatePtBr(data.todayDate)}`
                : "Última Rodada Oficial"}
            </div>
            <h2 className="mt-3 font-display text-5xl tracking-wide text-white sm:text-6xl">
              {data.todayGames.length > 0 ? (
                <>
                  NOITE DE <span className="text-orange-400">NBA</span>
                </>
              ) : (
                <>
                  PLACARES <span className="text-orange-400">RECENTES</span>
                </>
              )}
            </h2>
          </div>

          <Link
            href="/calendario"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-400 transition hover:text-amber-300"
          >
            Ver Calendário Completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {displayGames.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. PLAYERS OF THE WEEK (OVERALL, EAST & WEST) */}
      <PlayersOfWeekSection data={data.playersOfWeek} />

      {/* 4. GAME MVPs SHOWCASE (MVPs DOS JOGOS) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Crown className="h-3.5 w-3.5" />
              Atuações Individuais Dominantes
            </div>
            <h2 className="mt-3 font-display text-5xl tracking-wide text-white sm:text-6xl">
              MVPs DOS <span className="text-amber-400">JOGOS</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Os maiores índices de performance (Game Rating) registrados nas
              últimas rodadas da NBA. Clique em qualquer card para abrir o
              boxscore completo da partida.
            </p>
          </div>

          <Link
            href="/historico"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400 transition hover:text-orange-300"
          >
            Histórico Completo & MVPs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.mvpShowcase.map((item, idx) => {
            const accent = ensureVisibleColor(item.mvp.teamColor);
            const matchedGame = findGameById(item.gameId);

            return (
              <motion.div
                key={`${item.gameId}-${item.mvp.id}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
              >
                <TiltCard
                  glowColor={`${accent}45`}
                  onClick={() => {
                    if (matchedGame) {
                      openGame(matchedGame);
                    } else {
                      // Construct lightweight NbaGame stub so modal can fetch full /games/:id boxscore!
                      openGame({
                        id: item.gameId,
                        date: item.date,
                        name: item.matchup,
                        shortName: item.matchup,
                        status: "final",
                        statusDetail: "Final",
                        period: 4,
                        clock: "0:00",
                        venue: { name: item.venue, city: "", state: "" },
                        broadcast: "NBA League Pass",
                        headline: item.headline,
                        recap: item.headline,
                        home: {
                          team: {
                            id: "home",
                            name: item.mvp.teamName,
                            shortName: item.mvp.teamAbbreviation,
                            abbreviation: item.mvp.teamAbbreviation,
                            location: "",
                            color: item.mvp.teamColor,
                            alternateColor: "#18181b",
                            logo: item.mvp.teamLogo,
                          },
                          score: 0,
                          winner: true,
                          homeAway: "home",
                          linescores: [],
                          stats: {},
                          leaders: {},
                        },
                        away: {
                          team: {
                            id: "away",
                            name: item.matchup.split("@")[0]?.trim() || "NBA",
                            shortName: item.matchup.split("@")[0]?.trim() || "NBA",
                            abbreviation: item.matchup.split("@")[0]?.trim() || "NBA",
                            location: "",
                            color: "#f97316",
                            alternateColor: "#18181b",
                            logo: item.mvp.teamLogo,
                          },
                          score: 0,
                          winner: false,
                          homeAway: "away",
                          linescores: [],
                          stats: {},
                          leaders: {},
                        },
                        mvp: item.mvp,
                      });
                    }
                  }}
                  className="relative flex flex-col justify-between p-6"
                >
                  {/* Rank Watermark */}
                  <div className="pointer-events-none absolute right-4 top-2 font-display text-7xl text-white/[0.05]">
                    0{idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 font-mono-num text-[11px] font-bold text-amber-300">
                        <Flame className="h-3 w-3" />
                        RATING {item.mvp.rating}
                      </span>
                      <span className="font-mono-num text-xs text-zinc-400">
                        {formatDatePtBr(item.date)}
                      </span>
                    </div>

                    {/* Player Avatar + Name */}
                    <div className="mt-5 flex items-center gap-4">
                      <div
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-zinc-900"
                        style={{
                          boxShadow: `0 12px 30px -10px ${accent}77`,
                        }}
                      >
                        <img
                          src={item.mvp.teamLogo}
                          alt={item.mvp.teamAbbreviation}
                          className="absolute inset-0 m-auto h-14 w-14 object-contain opacity-20"
                        />
                        <img
                          src={item.mvp.headshot}
                          alt={item.mvp.name}
                          className="relative z-10 h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                          <img
                            src={item.mvp.teamLogo}
                            alt={item.mvp.teamAbbreviation}
                            className="h-4 w-4 object-contain"
                          />
                          {item.mvp.teamName} • #{item.mvp.jersey}
                        </div>
                        <h3 className="truncate font-display text-3xl text-white">
                          {item.mvp.name}
                        </h3>
                        <div className="mt-1 inline-block rounded-lg bg-orange-500/15 px-2.5 py-0.5 font-mono-num text-xs font-bold text-orange-300">
                          {item.mvp.statLine}
                        </div>
                      </div>
                    </div>

                    {item.headline && (
                      <p className="mt-4 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                        {item.headline}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs">
                    <span className="font-mono-num font-bold text-zinc-200">
                      {item.finalScore}
                    </span>
                    <span className="text-zinc-500 truncate max-w-[140px]">
                      {item.venue}
                    </span>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. PARALLAX PORTAL INTO NBA HISTORY */}
      <CourtParallaxPortal
        heroStats={data.historyPreview.heroStats}
        featuredEras={data.historyPreview.featuredEras}
        featuredLegends={data.historyPreview.featuredLegends}
      />

      {/* 6. SEASON STATS LEADERS & STANDINGS SNAPSHOT */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Season Leaders Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Domínio Individual
                </div>
                <h2 className="mt-1 font-display text-4xl sm:text-5xl text-white">
                  LÍDERES DA TEMPORADA
                </h2>
              </div>
              <Link
                href="/stats"
                className="text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-amber-300"
              >
                Ver Todas Categorias →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {data.topLeaders.map((cat) => {
                const top = cat.leaders[0];
                if (!top) return null;
                const accent = ensureVisibleColor(top.teamColor);
                return (
                  <TiltCard
                    key={cat.categoryKey}
                    glowColor={`${accent}38`}
                    className="p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        {cat.categoryLabel}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={top.headshot}
                          alt={top.name}
                          className="h-14 w-14 rounded-2xl border border-white/15 bg-zinc-900 object-cover"
                        />
                        <div className="min-w-0">
                          <div className="font-display text-3xl text-orange-400 leading-none">
                            {top.displayValue}{" "}
                            <span className="text-sm text-zinc-400">
                              {cat.abbreviation}
                            </span>
                          </div>
                          <div className="mt-1 truncate text-sm font-bold text-white">
                            {top.name}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {top.teamAbbreviation} • #{top.jersey}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-white/[0.08] pt-3">
                      {cat.leaders.slice(1, 4).map((runner) => (
                        <div
                          key={runner.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="truncate text-zinc-300">
                            <span className="font-mono-num text-zinc-500 mr-1.5">
                              {runner.rank}.
                            </span>
                            {runner.shortName || runner.name}
                          </span>
                          <span className="font-mono-num font-semibold text-zinc-200">
                            {runner.displayValue}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>

          {/* Conference Standings Snapshot */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
                  <Activity className="h-3.5 w-3.5" />
                  Corrida pelos Playoffs
                </div>
                <h2 className="mt-1 font-display text-4xl sm:text-5xl text-white">
                  TOP 6 CONFERÊNCIAS
                </h2>
              </div>

              <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
                <button
                  onClick={() => setConfTab("western")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold uppercase transition ${
                    confTab === "western"
                      ? "bg-orange-500 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Oeste
                </button>
                <button
                  onClick={() => setConfTab("eastern")}
                  className={`rounded-lg px-3 py-1 text-xs font-bold uppercase transition ${
                    confTab === "eastern"
                      ? "bg-orange-500 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Leste
                </button>
              </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-zinc-400">
                    <th className="py-3 pl-4">#</th>
                    <th className="py-3">Franquia</th>
                    <th className="py-3 text-right font-mono-num">V-D</th>
                    <th className="py-3 text-right font-mono-num">%</th>
                    <th className="py-3 pr-4 text-right font-mono-num">SEQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {data.topStandings[confTab].map((row) => (
                    <tr
                      key={row.team.id}
                      className="transition hover:bg-white/[0.04]"
                    >
                      <td className="py-3 pl-4 font-mono-num font-bold text-orange-400">
                        {row.seed}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={row.team.logo}
                            alt={row.team.abbreviation}
                            className="h-5 w-5 object-contain"
                          />
                          <span className="font-semibold text-white">
                            {row.team.shortName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono-num text-zinc-200">
                        {row.wins}-{row.losses}
                      </td>
                      <td className="py-3 text-right font-mono-num text-zinc-400">
                        {row.winPct}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono-num">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            row.streak.startsWith("W")
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-red-500/15 text-red-300"
                          }`}
                        >
                          {row.streak}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-white/10 bg-white/[0.02] px-4 py-2.5 text-right">
                <Link
                  href="/stats"
                  className="text-xs font-semibold text-orange-400 hover:text-amber-300"
                >
                  Abrir tabela completa das 30 franquias →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST NBA HEADLINES */}
      {data.news.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
            <Newspaper className="h-3.5 w-3.5" />
            Radar da Liga
          </div>
          <h2 className="mt-1 font-display text-4xl sm:text-5xl text-white">
            ÚLTIMAS NOTÍCIAS DA NBA
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.news.slice(0, 3).map((article) => (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-panel glass-panel-hover flex flex-col justify-between overflow-hidden rounded-2xl"
              >
                <div>
                  {article.image && (
                    <div className="h-44 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={article.image}
                        alt={article.headline}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-white group-hover:text-orange-300 transition-colors line-clamp-2">
                      {article.headline}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 text-[11px] text-zinc-500">
                  <span>{formatDatePtBr(article.published)}</span>
                  <span className="inline-flex items-center gap-1 text-orange-400">
                    Ler matéria <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
