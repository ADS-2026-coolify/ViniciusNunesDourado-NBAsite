"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Crown,
  Search,
  Trophy,
} from "lucide-react";
import { API_BASE_URL, ensureVisibleColor } from "@/lib/api";
import type { StandingEntry, StatCategoryLeader } from "@/lib/types";
import { TiltCard } from "@/components/TiltCard";

interface LeadersPayload {
  season: string;
  weekLabel: string;
  categories: StatCategoryLeader[];
}

interface StandingsPayload {
  season: string;
  eastern: StandingEntry[];
  western: StandingEntry[];
}

export default function StatsPage() {
  const [leadersData, setLeadersData] = useState<LeadersPayload | null>(null);
  const [standingsData, setStandingsData] = useState<StandingsPayload | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCatIndex, setSelectedCatIndex] = useState<number>(0);
  const [confView, setConfView] = useState<"western" | "eastern" | "both">(
    "western"
  );
  const [teamFilter, setTeamFilter] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/leaders`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_BASE_URL}/standings`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([leaders, standings]) => {
        if (!cancelled) {
          if (leaders) setLeadersData(leaders);
          if (standings) setStandingsData(standings);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeCategory = leadersData?.categories[selectedCatIndex];
  const maxStatValue = activeCategory?.leaders[0]?.value || 1;

  const renderStandingsTable = (title: string, rows: StandingEntry[]) => {
    const filtered = rows.filter((r) => {
      if (!teamFilter.trim()) return true;
      const q = teamFilter.toLowerCase();
      return (
        r.team.name.toLowerCase().includes(q) ||
        r.team.abbreviation.toLowerCase().includes(q)
      );
    });

    return (
      <div className="glass-panel overflow-hidden rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-6 py-4">
          <h3 className="font-display text-3xl tracking-wide text-white">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              1º–6º Playoffs Diretos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              7º–10º Play-In
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/30 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="py-3.5 pl-6 pr-2">#</th>
                <th className="py-3.5 pr-4">Franquia</th>
                <th className="px-3 py-3.5 text-right font-mono-num">V</th>
                <th className="px-3 py-3.5 text-right font-mono-num">D</th>
                <th className="px-3 py-3.5 text-right font-mono-num">%</th>
                <th className="px-3 py-3.5 text-right font-mono-num">GB</th>
                <th className="px-3 py-3.5 text-right font-mono-num">CASA</th>
                <th className="px-3 py-3.5 text-right font-mono-num">FORA</th>
                <th className="px-3 py-3.5 text-right font-mono-num">ÚLT 10</th>
                <th className="px-3 py-3.5 text-right font-mono-num">PPG</th>
                <th className="px-3 py-3.5 text-right font-mono-num">SALDO</th>
                <th className="py-3.5 pl-3 pr-6 text-right font-mono-num">
                  SEQ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((row) => {
                const isPlayoff = row.seed <= 6;
                const isPlayIn = row.seed >= 7 && row.seed <= 10;
                const diffPositive = !row.diff.startsWith("-");

                return (
                  <tr
                    key={row.team.id}
                    className={`transition hover:bg-white/[0.045] ${
                      row.seed === 6
                        ? "border-b-2 border-emerald-500/35"
                        : row.seed === 10
                        ? "border-b-2 border-amber-500/35"
                        : ""
                    }`}
                  >
                    <td className="py-3.5 pl-6 pr-2 font-mono-num font-bold">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-[11px] ${
                          isPlayoff
                            ? "bg-emerald-500/15 text-emerald-300"
                            : isPlayIn
                            ? "bg-amber-500/15 text-amber-300"
                            : "text-zinc-500"
                        }`}
                      >
                        {row.seed}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.team.logo}
                          alt={row.team.abbreviation}
                          className="h-7 w-7 object-contain"
                        />
                        <div>
                          <div className="font-semibold text-white">
                            {row.team.name}
                          </div>
                          <div className="font-mono-num text-[10px] text-zinc-500">
                            {row.team.abbreviation}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono-num font-bold text-white">
                      {row.wins}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono-num text-zinc-300">
                      {row.losses}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono-num font-semibold text-orange-300">
                      {row.winPct}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono-num text-zinc-400">
                      {row.gamesBehind}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono-num text-zinc-300">
                      {row.homeRecord}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono-num text-zinc-300">
                      {row.awayRecord}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono-num text-zinc-300">
                      {row.lastTen}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono-num text-zinc-200">
                      {row.ppg}
                    </td>
                    <td
                      className={`px-3 py-3.5 text-right font-mono-num font-semibold ${
                        diffPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {diffPositive && row.diff !== "0.0"
                        ? `+${row.diff}`
                        : row.diff}
                    </td>
                    <td className="py-3.5 pl-3 pr-6 text-right font-mono-num">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          row.streak.startsWith("W")
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-red-500/15 text-red-300"
                        }`}
                      >
                        {row.streak}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(234,179,8,0.16),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/35 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-300">
            <BarChart3 className="h-3.5 w-3.5" />
            Analytics NBA • Temporada {standingsData?.season ?? "2026-27"}
          </div>
          <h1 className="mt-3 font-display text-5xl tracking-wide text-white sm:text-7xl">
            ESTATÍSTICAS & <span className="text-orange-400">CLASSIFICAÇÃO</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Líderes individuais em tempo real em todas as categorias oficiais e
            a corrida completa pelos Playoffs e Torneio Play-In nas Conferências
            Leste e Oeste.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="mt-4 font-display text-2xl tracking-wider text-zinc-400">
            PROCESSANDO TELEMETRIA DA TEMPORADA...
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl space-y-20 px-4 pt-12 sm:px-6 lg:px-8">
          {/* PART 1: INDIVIDUAL STAT LEADERS */}
          {leadersData && leadersData.categories.length > 0 && (
            <section>
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
                    <Trophy className="h-3.5 w-3.5" />
                    Corrida pelas Estatísticas
                  </div>
                  <h2 className="mt-1 font-display text-4xl sm:text-5xl text-white">
                    LÍDERES INDIVIDUAIS
                  </h2>
                </div>

                {/* Category Selector Pills */}
                <div className="flex flex-wrap gap-2">
                  {leadersData.categories.map((cat, idx) => (
                    <button
                      key={cat.categoryKey}
                      onClick={() => setSelectedCatIndex(idx)}
                      className={`rounded-xl border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition ${
                        selectedCatIndex === idx
                          ? "border-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {cat.categoryLabel}
                    </button>
                  ))}
                </div>
              </div>

              {activeCategory && (
                <div className="mt-8 grid gap-8 lg:grid-cols-12">
                  {/* Top 3 Podium Cards */}
                  <div className="grid gap-5 sm:grid-cols-3 lg:col-span-7">
                    {activeCategory.leaders.slice(0, 3).map((leader, idx) => {
                      const accent = ensureVisibleColor(leader.teamColor);
                      return (
                        <TiltCard
                          key={leader.id}
                          glowColor={`${accent}45`}
                          className="relative flex flex-col justify-between p-5"
                        >
                          <div className="pointer-events-none absolute right-3 top-1 font-display text-6xl text-white/[0.06]">
                            #{leader.rank}
                          </div>

                          <div>
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                              <Crown className="h-3 w-3" />
                              {idx === 0
                                ? "Líder da NBA"
                                : `${leader.rank}º Colocado`}
                            </div>

                            <div className="mt-4 flex justify-center">
                              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-white/15 bg-zinc-900">
                                <img
                                  src={leader.teamLogo}
                                  alt={leader.teamAbbreviation}
                                  className="absolute inset-0 m-auto h-20 w-20 object-contain opacity-15"
                                />
                                <img
                                  src={leader.headshot}
                                  alt={leader.name}
                                  className="relative z-10 h-full w-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="mt-4 text-center">
                              <h3 className="font-display text-2xl text-white">
                                {leader.name}
                              </h3>
                              <p className="text-xs text-zinc-400">
                                {leader.teamName} • #{leader.jersey}{" "}
                                {leader.position}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 rounded-xl border border-white/10 bg-black/45 py-2.5 text-center">
                            <span className="font-display text-4xl text-orange-400 leading-none">
                              {leader.displayValue}
                            </span>
                            <span className="ml-1.5 font-mono-num text-xs text-zinc-400">
                              {activeCategory.abbreviation}
                            </span>
                          </div>
                        </TiltCard>
                      );
                    })}
                  </div>

                  {/* Ranks 1-10 Visual Bar Chart */}
                  <div className="glass-panel rounded-3xl p-6 lg:col-span-5">
                    <h3 className="font-display text-2xl tracking-wide text-white">
                      TOP 10 • {activeCategory.categoryLabel.toUpperCase()}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {activeCategory.leaders.map((leader) => {
                        const pct = Math.max(
                          18,
                          Math.round((leader.value / maxStatValue) * 100)
                        );
                        const accent = ensureVisibleColor(leader.teamColor);

                        return (
                          <div key={leader.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 font-mono-num font-bold text-zinc-500">
                                  {leader.rank}.
                                </span>
                                <img
                                  src={leader.teamLogo}
                                  alt={leader.teamAbbreviation}
                                  className="h-4 w-4 object-contain"
                                />
                                <span className="truncate font-semibold text-white">
                                  {leader.name}
                                </span>
                                <span className="text-[10px] text-zinc-500">
                                  {leader.teamAbbreviation}
                                </span>
                              </div>
                              <span className="font-mono-num font-bold text-orange-300">
                                {leader.displayValue}
                              </span>
                            </div>

                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.55 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: accent }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PART 2: FULL CONFERENCE STANDINGS */}
          {standingsData && (
            <section className="space-y-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">
                    <Activity className="h-3.5 w-3.5" />
                    Tabela Oficial das 30 Franquias
                  </div>
                  <h2 className="mt-1 font-display text-4xl sm:text-5xl text-white">
                    CLASSIFICAÇÃO POR CONFERÊNCIA
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={teamFilter}
                      onChange={(e) => setTeamFilter(e.target.value)}
                      placeholder="Buscar franquia..."
                      className="rounded-xl border border-white/10 bg-black/45 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
                    {(
                      [
                        { id: "western", label: "Oeste" },
                        { id: "eastern", label: "Leste" },
                        { id: "both", label: "Ambas" },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setConfView(tab.id)}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase transition ${
                          confView === tab.id
                            ? "bg-orange-500 text-white"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {confView === "western" &&
                renderStandingsTable(
                  "CONFERÊNCIA OESTE (WESTERN)",
                  standingsData.western
                )}

              {confView === "eastern" &&
                renderStandingsTable(
                  "CONFERÊNCIA LESTE (EASTERN)",
                  standingsData.eastern
                )}

              {confView === "both" && (
                <div className="space-y-10">
                  {renderStandingsTable(
                    "CONFERÊNCIA OESTE (WESTERN)",
                    standingsData.western
                  )}
                  {renderStandingsTable(
                    "CONFERÊNCIA LESTE (EASTERN)",
                    standingsData.eastern
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
