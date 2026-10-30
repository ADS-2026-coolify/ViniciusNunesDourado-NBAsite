"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Flame,
  History,
  Search,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import {
  API_BASE_URL,
  ensureVisibleColor,
  formatDatePtBr,
} from "@/lib/api";
import type { MvpShowcaseItem, NbaGame } from "@/lib/types";
import { GameCard } from "@/components/GameCard";
import { TiltCard } from "@/components/TiltCard";
import { useGameModal } from "@/components/GameModalContext";

interface RecentPayload {
  games: NbaGame[];
  mvpShowcase: MvpShowcaseItem[];
}

export default function HistoricoPage() {
  const [daysWindow, setDaysWindow] = useState<number>(6);
  const [data, setData] = useState<RecentPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [gameTag, setGameTag] = useState<
    "all" | "clutch" | "highscoring" | "ot"
  >("all");
  const { openGame } = useGameModal();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE_URL}/recent-games?days=${daysWindow}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload: RecentPayload | null) => {
        if (!cancelled && payload) setData(payload);
        if (!cancelled) setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [daysWindow]);

  const filteredGames = (data?.games ?? []).filter((g) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const hitTeam =
        g.home.team.name.toLowerCase().includes(q) ||
        g.away.team.name.toLowerCase().includes(q) ||
        g.home.team.abbreviation.toLowerCase().includes(q) ||
        g.away.team.abbreviation.toLowerCase().includes(q);
      const hitMvp = g.mvp?.name.toLowerCase().includes(q) ?? false;
      if (!hitTeam && !hitMvp) return false;
    }

    const diff = Math.abs(g.home.score - g.away.score);
    const maxScore = Math.max(g.home.score, g.away.score);
    if (gameTag === "clutch" && diff > 6) return false;
    if (gameTag === "highscoring" && maxScore < 125) return false;
    if (gameTag === "ot" && g.period <= 4 && !g.statusDetail.includes("OT"))
      return false;

    return true;
  });

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.18),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
                <History className="h-3.5 w-3.5" />
                Resultados Oficiais & Atuações Épicas
              </div>
              <h1 className="mt-3 font-display text-5xl tracking-wide text-white sm:text-7xl">
                HISTÓRICO DE JOGOS &{" "}
                <span className="text-amber-400">MVPs</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
                Reviva cada confronto encerrado, descubra quem foi coroado o MVP
                de cada partida pelo índice oficial de impacto e inspecione os
                boxscores completos.
              </p>
            </div>

            {/* Days Window Selector */}
            <div className="flex items-center gap-1.5 self-start rounded-2xl border border-white/10 bg-white/[0.03] p-1">
              {[
                { days: 4, label: "Últimos 4 Dias" },
                { days: 6, label: "Últimos 6 Dias" },
                { days: 9, label: "Últimos 9 Dias" },
              ].map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setDaysWindow(opt.days)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    daysWindow === opt.days
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* PODIUM OF TOP 3 GAME MVPs */}
          {!loading && data && data.mvpShowcase.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Trophy className="h-4 w-4" />
                Pódio de Impacto Individual • Top Atuações Recentes
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-3">
                {data.mvpShowcase.slice(0, 3).map((item, idx) => {
                  const accent = ensureVisibleColor(item.mvp.teamColor);
                  const matched = data.games.find((g) => g.id === item.gameId);
                  const medalColors = [
                    "from-amber-400 to-yellow-600",
                    "from-slate-300 to-slate-500",
                    "from-orange-400 to-amber-700",
                  ];

                  return (
                    <motion.div
                      key={`${item.gameId}-${item.mvp.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: idx * 0.08 }}
                    >
                      <TiltCard
                        glowColor={`${accent}48`}
                        onClick={() => matched && openGame(matched)}
                        className="relative p-6"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${medalColors[idx]} px-3 py-0.5 text-[11px] font-extrabold uppercase text-black`}
                          >
                            <Crown className="h-3 w-3" />#{idx + 1} MVP da Rodada
                          </span>
                          <span className="font-mono-num text-xs font-bold text-orange-300">
                            RAT {item.mvp.rating}
                          </span>
                        </div>

                        <div className="mt-5 flex items-center gap-4">
                          <img
                            src={item.mvp.headshot}
                            alt={item.mvp.name}
                            className="h-20 w-20 rounded-2xl border border-white/15 bg-zinc-900 object-cover"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <img
                                src={item.mvp.teamLogo}
                                alt={item.mvp.teamAbbreviation}
                                className="h-4 w-4 object-contain"
                              />
                              {item.mvp.teamName}
                            </div>
                            <h3 className="truncate font-display text-3xl text-white">
                              {item.mvp.name}
                            </h3>
                            <div className="mt-1 font-mono-num text-sm font-bold text-amber-300">
                              {item.mvp.statLine}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-zinc-400">
                          <span className="font-mono-num font-bold text-white">
                            {item.finalScore}
                          </span>
                          <span>{formatDatePtBr(item.date)}</span>
                        </div>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter Bar & Completed Games Feed */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por time ou nome do MVP (ex: Curry, Jokic, LAL)..."
              className="w-full rounded-xl border border-white/10 bg-black/45 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "all", label: "Todos os Jogos", icon: Sparkles },
                { id: "clutch", label: "Jogos Clutch (≤ 6 pts)", icon: Zap },
                { id: "highscoring", label: "125+ Pontos", icon: Flame },
                { id: "ot", label: "Prorrogação (OT)", icon: Crown },
              ] as const
            ).map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.id}
                  onClick={() => setGameTag(chip.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                    gameTag === chip.id
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-white/10 bg-black/40 text-zinc-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-11 w-11 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="mt-4 font-display text-2xl tracking-wider text-zinc-400">
              CARREGANDO HISTÓRICO DE PARTIDAS...
            </p>
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} showMvp />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <Sparkles className="mx-auto h-10 w-10 text-amber-400" />
            <h3 className="mt-4 font-display text-3xl text-white">
              Nenhum jogo corresponde ao filtro atual
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Limpe a busca ou selecione “Todos os Jogos” para visualizar todas
              as partidas recentes.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
