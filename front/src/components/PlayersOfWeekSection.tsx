"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Flame, Sparkles, Trophy } from "lucide-react";
import type { WeeklyPlayerSpotlight } from "@/lib/types";
import { ensureVisibleColor } from "@/lib/api";
import { TiltCard } from "./TiltCard";

interface PlayersOfWeekProps {
  data: {
    weekLabel: string;
    overallMvp: WeeklyPlayerSpotlight;
    easternPlayer: WeeklyPlayerSpotlight;
    westernPlayer: WeeklyPlayerSpotlight;
  };
}

export function PlayersOfWeekSection({ data }: PlayersOfWeekProps) {
  const cards = [data.overallMvp, data.westernPlayer, data.easternPlayer];
  const [focusedIndex, setFocusedIndex] = useState(0);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Trophy className="h-3.5 w-3.5" />
            Premiação Semanal • {data.weekLabel}
          </div>
          <h2 className="mt-3 font-display text-5xl tracking-wide text-white sm:text-6xl">
            JOGADORES DA <span className="text-orange-400">SEMANA</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
            Calculado a partir do índice oficial de impacto, vitórias e domínio
            estatístico nas partidas disputadas nos últimos 7 dias na Conferência
            Leste e na Conferência Oeste.
          </p>
        </div>

        {/* Interactive Spotlight Filter Pills */}
        <div className="flex gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1 self-start">
          {[
            { idx: 0, label: "MVP Geral" },
            { idx: 1, label: "Oeste" },
            { idx: 2, label: "Leste" },
          ].map((tab) => (
            <button
              key={tab.idx}
              onClick={() => setFocusedIndex(tab.idx)}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                focusedIndex === tab.idx
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Interactive Hero Banner for Selected Player of the Week */}
      <AnimatePresence mode="wait">
        {(() => {
          const active = cards[focusedIndex] ?? cards[0];
          const accent = ensureVisibleColor(active.player.teamColor);
          return (
            <motion.div
              key={active.conference + active.player.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="relative mt-8 overflow-hidden rounded-3xl border border-white/15 bg-[#0a0d14] p-6 sm:p-10"
            >
              {/* Dynamic Team Color Spotlight Glow */}
              <div
                className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full opacity-30 blur-[110px]"
                style={{ backgroundColor: accent }}
              />
              <div
                className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full opacity-20 blur-[100px]"
                style={{ backgroundColor: accent }}
              />

              {/* Giant Jersey Watermark */}
              <div className="pointer-events-none absolute right-8 top-2 select-none font-display text-[11rem] sm:text-[16rem] leading-none text-white/[0.04]">
                #{active.player.jersey || "MVP"}
              </div>

              <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
                {/* Player Cutout Portrait */}
                <div className="relative flex justify-center lg:col-span-5">
                  <div
                    className="relative flex h-64 w-64 sm:h-72 sm:w-72 items-end justify-center overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-black/70 shadow-2xl"
                    style={{
                      boxShadow: `0 25px 70px -20px ${accent}66`,
                    }}
                  >
                    <img
                      src={active.player.teamLogo}
                      alt={active.player.teamName}
                      className="pointer-events-none absolute inset-0 m-auto h-48 w-48 object-contain opacity-15"
                    />
                    <img
                      src={active.player.headshot}
                      alt={active.player.name}
                      className="relative z-10 h-60 sm:h-68 w-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)]"
                    />
                  </div>
                </div>

                {/* Editorial Details & Weekly Stats */}
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                      <Crown className="h-3.5 w-3.5" />
                      {active.badge}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200">
                      <img
                        src={active.player.teamLogo}
                        alt={active.player.teamAbbreviation}
                        className="h-4 w-4 object-contain"
                      />
                      {active.player.teamName} • #{active.player.jersey}{" "}
                      {active.player.position}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-5xl sm:text-6xl tracking-wide text-white">
                    {active.player.name}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-300">
                    {active.narrative}
                  </p>

                  {/* Stat Pillars */}
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Média Pontos", value: active.averages.ppg, unit: "PPG" },
                      { label: "Média Rebotes", value: active.averages.rpg, unit: "RPG" },
                      { label: "Assistências", value: active.averages.apg, unit: "APG" },
                      { label: "Pico Rating", value: active.averages.rating, unit: "RAT" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/10 bg-black/45 p-3.5"
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                          {stat.label}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="font-display text-3xl sm:text-4xl text-white leading-none">
                            {stat.value}
                          </span>
                          <span className="font-mono-num text-[11px] font-bold text-orange-400">
                            {stat.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Best Single Game Callout */}
                  <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-orange-500/25 bg-orange-500/10 px-4 py-2.5 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-orange-300">
                      <Flame className="h-3.5 w-3.5" />
                      Melhor Jogo da Semana:
                    </span>
                    <span className="font-mono-num font-bold text-white">
                      {active.bestPerformance.statLine}
                    </span>
                    <span className="text-zinc-400">
                      ({active.bestPerformance.teamScore})
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* 3-Card Interactive 3D Comparison Strip */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {cards.map((spot, idx) => {
          const isSelected = focusedIndex === idx;
          const accent = ensureVisibleColor(spot.player.teamColor);
          return (
            <TiltCard
              key={spot.conference}
              onClick={() => setFocusedIndex(idx)}
              glowColor={`${accent}40`}
              className={`p-5 transition ${
                isSelected ? "ring-1 ring-orange-500/60" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  <Sparkles className="h-3 w-3" />
                  {spot.conference === "Overall"
                    ? "MVP Geral NBA"
                    : spot.conference === "Eastern"
                    ? "Conferência Leste"
                    : "Conferência Oeste"}
                </span>
                <img
                  src={spot.player.teamLogo}
                  alt={spot.player.teamAbbreviation}
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div className="mt-3 flex items-center gap-3.5">
                <img
                  src={spot.player.headshot}
                  alt={spot.player.name}
                  className="h-14 w-14 rounded-2xl border border-white/15 bg-zinc-900 object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate font-display text-2xl text-white">
                    {spot.player.name}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {spot.player.teamName} • #{spot.player.jersey}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 font-mono-num text-xs">
                <span className="text-zinc-300">
                  <strong className="text-white">{spot.averages.ppg}</strong> PPG •{" "}
                  <strong className="text-white">{spot.averages.rpg}</strong> RPG
                </span>
                <span className="rounded-md bg-orange-500/15 px-2 py-0.5 font-bold text-orange-300">
                  RAT {spot.averages.rating}
                </span>
              </div>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
