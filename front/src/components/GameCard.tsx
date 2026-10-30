"use client";

import React from "react";
import { ArrowUpRight, Crown, MapPin, Tv } from "lucide-react";
import type { NbaGame } from "@/lib/types";
import {
  ensureVisibleColor,
  formatDatePtBr,
  formatTimePtBr,
} from "@/lib/api";
import { TiltCard } from "./TiltCard";
import { useGameModal } from "./GameModalContext";

export function GameCard({
  game,
  showMvp = true,
}: {
  game: NbaGame;
  showMvp?: boolean;
}) {
  const { openGame } = useGameModal();
  const accent = ensureVisibleColor(
    game.mvp?.teamColor ||
      (game.home.winner ? game.home.team.color : game.away.team.color)
  );

  return (
    <TiltCard
      onClick={() => openGame(game)}
      glowColor={`${accent}36`}
      intensity={6}
      className="flex flex-col justify-between p-5"
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono-num text-[11px] font-bold uppercase tracking-wider ${
              game.status === "live"
                ? "border border-red-500/40 bg-red-500/20 text-red-300"
                : game.status === "final"
                ? "border border-white/15 bg-white/[0.07] text-zinc-200"
                : "border border-orange-500/30 bg-orange-500/15 text-orange-300"
            }`}
          >
            {game.status === "live" && (
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-400" />
            )}
            {game.status === "live"
              ? `Q${game.period} • ${game.clock}`
              : game.status === "final"
              ? game.statusDetail
              : `${formatDatePtBr(game.date)} • ${formatTimePtBr(game.date)}`}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-orange-300 transition-colors">
            Boxscore
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        {/* Teams & Scores */}
        <div className="mt-4 space-y-3">
          {[game.away, game.home].map((side) => {
            const isLoser = game.status === "final" && !side.winner;
            return (
              <div
                key={side.team.id || side.homeAway}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40 p-1.5">
                    <img
                      src={side.team.logo}
                      alt={side.team.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`truncate font-semibold ${
                          isLoser ? "text-zinc-400" : "text-white"
                        }`}
                      >
                        {side.team.name}
                      </span>
                      {side.winner && (
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      )}
                    </div>
                    <div className="font-mono-num text-[11px] text-zinc-500">
                      {side.homeAway === "away" ? "Visitante" : "Mandante"}
                      {side.team.record ? ` • ${side.team.record}` : ""}
                    </div>
                  </div>
                </div>

                {game.status !== "scheduled" ? (
                  <div className="flex items-center gap-3">
                    {side.linescores.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5 font-mono-num text-[11px] text-zinc-500">
                        {side.linescores.map((q, idx) => (
                          <span key={idx} className="w-5 text-right">
                            {q}
                          </span>
                        ))}
                      </div>
                    )}
                    <span
                      className={`font-display text-3xl leading-none ${
                        isLoser ? "text-zinc-500" : "text-white"
                      }`}
                    >
                      {side.score}
                    </span>
                  </div>
                ) : (
                  <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono-num text-xs text-zinc-300">
                    {side.stats.avgPoints ? `${side.stats.avgPoints} PPG` : side.team.abbreviation}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Arena / Game MVP Strip */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.07]">
        {showMvp && game.mvp ? (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent px-3 py-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={game.mvp.headshot}
                alt={game.mvp.name}
                className="h-9 w-9 shrink-0 rounded-full border border-amber-400/40 bg-zinc-900 object-cover"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  <Crown className="h-3 w-3 shrink-0" />
                  MVP do Jogo
                </div>
                <div className="truncate text-xs font-semibold text-white">
                  {game.mvp.name}{" "}
                  <span className="text-zinc-400">({game.mvp.teamAbbreviation})</span>
                </div>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono-num text-xs font-bold text-amber-300">
                {game.mvp.statLine}
              </div>
              <div className="font-mono-num text-[10px] text-zinc-400">
                RAT {game.mvp.rating}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0 text-orange-400" />
              {game.venue.name}
            </span>
            <span className="inline-flex items-center gap-1 shrink-0 text-zinc-500">
              <Tv className="h-3 w-3 text-amber-400" />
              {game.broadcast}
            </span>
          </div>
        )}
      </div>
    </TiltCard>
  );
}
