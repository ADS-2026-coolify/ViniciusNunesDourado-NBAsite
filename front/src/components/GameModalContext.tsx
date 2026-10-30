"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart3,
  Calendar,
  MapPin,
  Tv,
  Users,
  X,
  Crown,
  Sparkles,
} from "lucide-react";
import type { GameDetailResponse, NbaGame } from "@/lib/types";
import {
  API_BASE_URL,
  ensureVisibleColor,
  formatDatePtBr,
  formatTimePtBr,
} from "@/lib/api";

interface GameModalContextValue {
  openGame: (game: NbaGame) => void;
  closeGame: () => void;
}

const GameModalContext = createContext<GameModalContextValue>({
  openGame: () => {},
  closeGame: () => {},
});

export function useGameModal() {
  return useContext(GameModalContext);
}

export function GameModalProvider({ children }: { children: React.ReactNode }) {
  const [selectedGame, setSelectedGame] = useState<NbaGame | null>(null);
  const [detail, setDetail] = useState<GameDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"boxscore" | "comparison">("boxscore");
  const [selectedTeamSide, setSelectedTeamSide] = useState<"away" | "home">("away");

  useEffect(() => {
    if (!selectedGame) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setActiveTab(selectedGame.status === "scheduled" ? "comparison" : "boxscore");
    setSelectedTeamSide(selectedGame.away.winner ? "away" : "home");

    fetch(`${API_BASE_URL}/games/${selectedGame.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: GameDetailResponse | null) => {
        if (!cancelled) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedGame]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedGame(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <GameModalContext.Provider
      value={{
        openGame: (game) => setSelectedGame(game),
        closeGame: () => setSelectedGame(null),
      }}
    >
      {children}

      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGame(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 18 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#090b10] shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
            >
              {/* Header with arena backdrop & dynamic team gradient */}
              <div className="relative overflow-hidden border-b border-white/10 px-6 py-6 sm:px-8">
                {detail?.venue?.image && (
                  <img
                    src={detail.venue.image}
                    alt={selectedGame.venue.name}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
                  />
                )}
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(110deg, ${ensureVisibleColor(
                      selectedGame.away.team.color
                    )}44 0%, transparent 48%, ${ensureVisibleColor(
                      selectedGame.home.team.color
                    )}44 100%)`,
                  }}
                />

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold uppercase tracking-wider ${
                        selectedGame.status === "live"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : selectedGame.status === "final"
                          ? "bg-orange-500/15 text-orange-300 border border-orange-500/30"
                          : "bg-white/10 text-zinc-200 border border-white/15"
                      }`}
                    >
                      {selectedGame.status === "live" && (
                        <span className="h-2 w-2 animate-ping rounded-full bg-red-400" />
                      )}
                      {selectedGame.status === "final"
                        ? selectedGame.statusDetail
                        : selectedGame.status === "live"
                        ? `AO VIVO • Q${selectedGame.period} ${selectedGame.clock}`
                        : `${formatDatePtBr(selectedGame.date)} • ${formatTimePtBr(
                            selectedGame.date
                          )}`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 text-orange-400" />
                      {selectedGame.venue.name}
                      {selectedGame.venue.city ? ` • ${selectedGame.venue.city}` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-400">
                      <Tv className="h-3.5 w-3.5 text-amber-400" />
                      {selectedGame.broadcast}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedGame(null)}
                    aria-label="Fechar detalhes do jogo"
                    className="rounded-full border border-white/15 bg-white/5 p-2 text-zinc-300 transition hover:border-orange-500/50 hover:bg-orange-500/15 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Big Matchup Scoreboard */}
                <div className="relative z-10 mt-6 grid grid-cols-3 items-center gap-4">
                  {/* Away Team */}
                  <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-4">
                    <img
                      src={selectedGame.away.team.logo}
                      alt={selectedGame.away.team.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                    />
                    <div className="mt-2 text-center sm:mt-0 sm:text-left">
                      <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Visitante {selectedGame.away.team.record ? `(${selectedGame.away.team.record})` : ""}
                      </div>
                      <div className="font-display text-2xl sm:text-3xl tracking-wide text-white">
                        {selectedGame.away.team.name}
                      </div>
                    </div>
                  </div>

                  {/* Center Score / Tip-off */}
                  <div className="flex flex-col items-center justify-center text-center">
                    {selectedGame.status === "scheduled" ? (
                      <div>
                        <div className="font-display text-4xl sm:text-5xl text-orange-400">
                          VS
                        </div>
                        <div className="mt-1 font-mono-num text-xs text-zinc-400">
                          {formatTimePtBr(selectedGame.date)} BRT
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 sm:gap-5">
                        <span
                          className={`font-display text-5xl sm:text-6xl ${
                            selectedGame.away.winner
                              ? "text-white"
                              : "text-zinc-500"
                          }`}
                        >
                          {selectedGame.away.score}
                        </span>
                        <span className="text-zinc-600 font-display text-3xl">:</span>
                        <span
                          className={`font-display text-5xl sm:text-6xl ${
                            selectedGame.home.winner
                              ? "text-white"
                              : "text-zinc-500"
                          }`}
                        >
                          {selectedGame.home.score}
                        </span>
                      </div>
                    )}

                    {/* Quarter linescores */}
                    {selectedGame.home.linescores.length > 0 && (
                      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/45 px-3 py-1.5">
                        <table className="font-mono-num text-[11px] text-zinc-300">
                          <thead>
                            <tr className="text-zinc-500">
                              <th className="pr-3 text-left">EQP</th>
                              {selectedGame.home.linescores.map((_, i) => (
                                <th key={i} className="px-2">
                                  {i < 4 ? `Q${i + 1}` : `OT${i - 3}`}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="pr-3 font-semibold text-white">
                                {selectedGame.away.team.abbreviation}
                              </td>
                              {selectedGame.away.linescores.map((q, i) => (
                                <td key={i} className="px-2 text-center">
                                  {q}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="pr-3 font-semibold text-white">
                                {selectedGame.home.team.abbreviation}
                              </td>
                              {selectedGame.home.linescores.map((q, i) => (
                                <td key={i} className="px-2 text-center">
                                  {q}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Home Team */}
                  <div className="flex flex-col items-center sm:flex-row-reverse sm:items-center sm:gap-4">
                    <img
                      src={selectedGame.home.team.logo}
                      alt={selectedGame.home.team.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                    />
                    <div className="mt-2 text-center sm:mt-0 sm:text-right">
                      <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Mandante {selectedGame.home.team.record ? `(${selectedGame.home.team.record})` : ""}
                      </div>
                      <div className="font-display text-2xl sm:text-3xl tracking-wide text-white">
                        {selectedGame.home.team.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {/* Game MVP Highlight Banner */}
                {selectedGame.mvp && (
                  <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-amber-400/40 bg-black/50">
                          <img
                            src={selectedGame.mvp.headshot}
                            alt={selectedGame.mvp.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
                            <Crown className="h-3.5 w-3.5" />
                            MVP da Partida • {selectedGame.mvp.teamName}
                          </div>
                          <div className="font-display text-2xl sm:text-3xl text-white">
                            {selectedGame.mvp.name}{" "}
                            <span className="text-zinc-400 text-lg">
                              #{selectedGame.mvp.jersey}
                            </span>
                          </div>
                          {selectedGame.recap && (
                            <p className="mt-1 text-xs text-zinc-300 max-w-2xl line-clamp-2">
                              {selectedGame.recap.replace(/^—\s*/, "")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-center">
                        <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-right">
                          <div className="text-[10px] uppercase tracking-wider text-zinc-400">
                            Linha Estatística
                          </div>
                          <div className="font-mono-num text-sm font-bold text-amber-300">
                            {selectedGame.mvp.statLine}
                          </div>
                        </div>
                        <div className="rounded-xl border border-orange-500/40 bg-orange-500/20 px-3.5 py-2 text-center">
                          <div className="text-[10px] uppercase tracking-wider text-orange-200">
                            Rating
                          </div>
                          <div className="font-display text-2xl text-white leading-none">
                            {selectedGame.mvp.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab("boxscore")}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                        activeTab === "boxscore"
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                          : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Award className="h-4 w-4" />
                      Boxscore de Jogadores
                    </button>
                    <button
                      onClick={() => setActiveTab("comparison")}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                        activeTab === "comparison"
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                          : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      Comparativo Tático
                    </button>
                  </div>

                  {detail?.venue?.attendance ? (
                    <div className="inline-flex items-center gap-2 text-xs text-zinc-400">
                      <Users className="h-3.5 w-3.5 text-orange-400" />
                      Público:{" "}
                      <span className="font-mono-num text-zinc-200">
                        {detail.venue.attendance.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ) : null}
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                    <p className="mt-4 text-sm">
                      Carregando estatísticas oficiais da quadra...
                    </p>
                  </div>
                ) : activeTab === "boxscore" && detail && detail.boxscore.length > 0 ? (
                  <div className="space-y-4">
                    {/* Team switcher for Boxscore */}
                    <div className="flex gap-2">
                      {(["away", "home"] as const).map((side) => {
                        const teamGroup = detail.boxscore.find(
                          (b) => b.homeAway === side
                        );
                        if (!teamGroup) return null;
                        return (
                          <button
                            key={side}
                            onClick={() => setSelectedTeamSide(side)}
                            className={`flex items-center gap-2.5 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                              selectedTeamSide === side
                                ? "border-orange-500/50 bg-orange-500/15 text-white"
                                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                            }`}
                          >
                            <img
                              src={teamGroup.team.logo}
                              alt={teamGroup.team.abbreviation}
                              className="h-5 w-5 object-contain"
                            />
                            {teamGroup.team.name}
                          </button>
                        );
                      })}
                    </div>

                    {(() => {
                      const activeBox =
                        detail.boxscore.find(
                          (b) => b.homeAway === selectedTeamSide
                        ) ?? detail.boxscore[0];
                      if (!activeBox) return null;

                      const displayIdx = [0, 1, 5, 6, 2, 3, 4, 8, 9, 13].filter(
                        (idx) => idx < activeBox.labels.length
                      );

                      return (
                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                          <table className="w-full min-w-[680px] text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] uppercase tracking-wider text-zinc-400">
                                <th className="py-3 pl-4 pr-3">Atleta</th>
                                {displayIdx.map((idx) => (
                                  <th
                                    key={idx}
                                    className="px-2.5 py-3 text-right font-mono-num"
                                  >
                                    {activeBox.labels[idx]}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06]">
                              {activeBox.players
                                .filter((p) => !p.didNotPlay && p.stats.length > 0)
                                .map((player) => (
                                  <tr
                                    key={player.id}
                                    className="transition hover:bg-white/[0.04]"
                                  >
                                    <td className="py-2.5 pl-4 pr-3">
                                      <div className="flex items-center gap-2.5">
                                        <img
                                          src={player.headshot}
                                          alt={player.name}
                                          className="h-8 w-8 rounded-full border border-white/10 bg-zinc-900 object-cover"
                                        />
                                        <div>
                                          <div className="font-semibold text-white">
                                            {player.name}
                                            {player.starter && (
                                              <span className="ml-1.5 rounded bg-orange-500/20 px-1.5 py-0.5 text-[9px] font-bold text-orange-300">
                                                TIT
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-[10px] text-zinc-500">
                                            #{player.jersey} • {player.position}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    {displayIdx.map((idx) => (
                                      <td
                                        key={idx}
                                        className={`px-2.5 py-2.5 text-right font-mono-num ${
                                          activeBox.labels[idx] === "PTS"
                                            ? "font-bold text-orange-300"
                                            : "text-zinc-300"
                                        }`}
                                      >
                                        {player.stats[idx] ?? "-"}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                ) : detail && detail.teamComparison.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {detail.teamComparison.map((row) => {
                      const awayNum = parseFloat(row.awayValue) || 0;
                      const homeNum = parseFloat(row.homeValue) || 0;
                      const total = awayNum + homeNum || 1;
                      const awayPct = Math.round((awayNum / total) * 100);

                      return (
                        <div
                          key={row.key}
                          className="rounded-xl border border-white/10 bg-white/[0.025] p-3.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono-num font-bold text-white">
                              {row.awayValue}
                            </span>
                            <span className="text-[11px] uppercase tracking-wider text-zinc-400">
                              {row.label}
                            </span>
                            <span className="font-mono-num font-bold text-white">
                              {row.homeValue}
                            </span>
                          </div>
                          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="transition-all duration-500"
                              style={{
                                width: `${awayPct}%`,
                                backgroundColor: ensureVisibleColor(
                                  selectedGame.away.team.color
                                ),
                              }}
                            />
                            <div
                              className="transition-all duration-500"
                              style={{
                                width: `${100 - awayPct}%`,
                                backgroundColor: ensureVisibleColor(
                                  selectedGame.home.team.color
                                ),
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
                    <Sparkles className="mx-auto h-8 w-8 text-orange-400" />
                    <h4 className="mt-3 font-display text-2xl text-white">
                      Partida Agendada no Calendário Oficial
                    </h4>
                    <p className="mt-1 text-sm text-zinc-400">
                      O boxscore em tempo real e o MVP da partida serão disponibilizados
                      assim que a bola subir em {selectedGame.venue.name}.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs text-orange-300">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDatePtBr(selectedGame.date)} às{" "}
                      {formatTimePtBr(selectedGame.date)}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameModalContext.Provider>
  );
}
