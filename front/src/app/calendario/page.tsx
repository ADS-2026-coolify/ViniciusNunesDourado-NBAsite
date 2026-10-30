"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  Search,
  Sparkles,
} from "lucide-react";
import {
  API_BASE_URL,
  formatDatePtBr,
  formatFullDatePtBr,
  shiftDateYmd,
} from "@/lib/api";
import type { NbaGame } from "@/lib/types";
import { GameCard } from "@/components/GameCard";

interface CalendarDayBucket {
  date: string;
  totalGames: number;
  liveGames: number;
  finalGames: number;
  games: NbaGame[];
}

interface CalendarWindowPayload {
  centerDate: string;
  seasonDisplay: string;
  calendarDates: string[];
  days: CalendarDayBucket[];
}

export default function CalendarioPage() {
  const todayIso = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const [anchorDate, setAnchorDate] = useState<string>(todayIso);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [windowData, setWindowData] = useState<CalendarWindowPayload | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "scheduled" | "live" | "final"
  >("all");
  const [teamQuery, setTeamQuery] = useState<string>("");

  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE_URL}/calendar?date=${anchorDate}&past=3&future=4`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload: CalendarWindowPayload | null) => {
        if (!cancelled && payload) {
          setWindowData(payload);
        }
        if (!cancelled) setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [anchorDate]);

  const jumpToDate = (ymd: string) => {
    setAnchorDate(ymd);
    setSelectedDate(ymd);
  };

  const filterGame = (g: NbaGame) => {
    if (statusFilter !== "all" && g.status !== statusFilter) return false;
    if (teamQuery.trim()) {
      const q = teamQuery.toLowerCase();
      const matchHome =
        g.home.team.name.toLowerCase().includes(q) ||
        g.home.team.abbreviation.toLowerCase().includes(q);
      const matchAway =
        g.away.team.name.toLowerCase().includes(q) ||
        g.away.team.abbreviation.toLowerCase().includes(q);
      if (!matchHome && !matchAway) return false;
    }
    return true;
  };

  const activeDayBucket = windowData?.days.find((d) => d.date === selectedDate);
  const filteredDayGames = (activeDayBucket?.games ?? []).filter(filterGame);

  const SPECIAL_DATES = [
    { label: "Hoje", date: todayIso },
    { label: "Ontem", date: shiftDateYmd(todayIso, -1) },
    { label: "Amanhã", date: shiftDateYmd(todayIso, 1) },
    { label: "Rodada de Natal (25/12)", date: "2026-12-25" },
    { label: "Ano Novo NBA (01/01)", date: "2027-01-01" },
  ];

  return (
    <div className="min-h-screen">
      {/* Parallax Header Banner */}
      <div
        ref={headerRef}
        className="relative overflow-hidden border-b border-white/10 py-16 sm:py-20"
      >
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <img
            src="/images/arena-hero.jpg"
            alt="Calendário NBA"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/75 via-[#050608]/80 to-[#050608]" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/35 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-300">
                <CalendarIcon className="h-3.5 w-3.5" />
                Agenda Oficial • Temporada {windowData?.seasonDisplay ?? "2026-27"}
              </div>
              <h1 className="mt-3 font-display text-5xl tracking-wide text-white sm:text-7xl">
                CALENDÁRIO DA <span className="text-orange-400">NBA</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base">
                Navegue por qualquer data da temporada, acompanhe horários,
                transmissões, arenas e clique nos jogos para abrir estatísticas
                completas em tempo real.
              </p>
            </div>

            {/* Date Picker + Quick Special Dates */}
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => jumpToDate(shiftDateYmd(anchorDate, -7))}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition hover:border-orange-500/40 hover:text-white"
                  title="Semana anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => e.target.value && jumpToDate(e.target.value)}
                  className="rounded-xl border border-white/15 bg-[#0b0e15] px-4 py-2 font-mono-num text-sm text-white outline-none focus:border-orange-500"
                />
                <button
                  onClick={() => jumpToDate(shiftDateYmd(anchorDate, 7))}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition hover:border-orange-500/40 hover:text-white"
                  title="Próxima semana"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SPECIAL_DATES.map((sd) => (
                  <button
                    key={sd.label}
                    onClick={() => jumpToDate(sd.date)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                      selectedDate === sd.date
                        ? "border-orange-500 bg-orange-500/20 text-orange-300"
                        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {sd.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive 8-Day Calendar Strip */}
          {windowData && (
            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
              {windowData.days.map((day) => {
                const isSelected = day.date === selectedDate;
                const isToday = day.date === todayIso;
                return (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setViewMode("day");
                    }}
                    className={`group relative flex flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition ${
                      isSelected
                        ? "border-orange-500 bg-gradient-to-br from-orange-500/25 to-amber-500/10 shadow-lg shadow-orange-500/15"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        {isToday ? "HOJE" : formatDatePtBr(day.date).split(",")[0]}
                      </span>
                      {day.liveGames > 0 && (
                        <span className="h-2 w-2 animate-ping rounded-full bg-red-400" />
                      )}
                    </div>
                    <div className="mt-1 font-display text-2xl text-white">
                      {formatDatePtBr(day.date, false)}
                    </div>
                    <div className="mt-2 font-mono-num text-[11px] text-orange-300">
                      {day.totalGames}{" "}
                      {day.totalGames === 1 ? "partida" : "partidas"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Filters & Main Schedule Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:flex-row md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={teamQuery}
              onChange={(e) => setTeamQuery(e.target.value)}
              placeholder="Filtrar franquia (ex: Lakers, Celtics, GSW, MIA)..."
              className="w-full rounded-xl border border-white/10 bg-black/45 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-orange-500"
            />
          </div>

          {/* Status & View Mode Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
              {(
                [
                  { id: "all", label: "Todos" },
                  { id: "scheduled", label: "Agendados" },
                  { id: "live", label: "Ao Vivo" },
                  { id: "final", label: "Encerrados" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    statusFilter === st.id
                      ? "bg-orange-500 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
              <button
                onClick={() => setViewMode("day")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "day"
                    ? "bg-amber-500 text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Dia Único
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "week"
                    ? "bg-amber-500 text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Janela 8 Dias
              </button>
            </div>
          </div>
        </div>

        {/* Games Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-11 w-11 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="mt-4 font-display text-2xl tracking-wider text-zinc-400">
              SINCRONIZANDO CALENDÁRIO DA NBA...
            </p>
          </div>
        ) : viewMode === "day" ? (
          <div className="mt-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-3xl sm:text-4xl capitalize text-white">
                {formatFullDatePtBr(selectedDate)}
              </h2>
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 font-mono-num text-xs font-bold text-orange-300">
                {filteredDayGames.length} jogos
              </span>
            </div>

            {filteredDayGames.length > 0 ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredDayGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-orange-400" />
                <h3 className="mt-4 font-display text-3xl text-white">
                  Nenhuma partida encontrada para este filtro
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Experimente alternar para a visualização{" "}
                  <button
                    onClick={() => setViewMode("week")}
                    className="font-semibold text-orange-400 underline"
                  >
                    Janela 8 Dias
                  </button>{" "}
                  ou escolher outra data na faixa superior.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {(windowData?.days ?? []).map((day) => {
              const dayGames = day.games.filter(filterGame);
              if (dayGames.length === 0) return null;
              return (
                <div key={day.date}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-display text-3xl capitalize text-white">
                      {formatFullDatePtBr(day.date)}
                    </h3>
                    <span className="font-mono-num text-xs text-orange-400">
                      {dayGames.length} jogos
                    </span>
                  </div>
                  <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {dayGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
