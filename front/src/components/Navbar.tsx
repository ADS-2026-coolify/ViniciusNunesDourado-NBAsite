"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BookOpen,
  Calendar,
  Crown,
  Flame,
  History,
  Menu,
  X,
} from "lucide-react";
import { API_BASE_URL, formatTimePtBr } from "@/lib/api";
import type { NbaGame, OverviewResponse } from "@/lib/types";
import { useGameModal } from "./GameModalContext";

const NAV_ITEMS = [
  { href: "/", label: "Início", icon: Flame },
  { href: "/calendario", label: "Calendário", icon: Calendar },
  { href: "/historico", label: "Histórico & MVPs", icon: History },
  { href: "/stats", label: "Stats & Tabela", icon: Activity },
  { href: "/historia", label: "História da NBA", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const { openGame } = useGameModal();
  const [tickerGames, setTickerGames] = useState<NbaGame[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/overview`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: OverviewResponse | null) => {
        if (!data) return;
        const combined = [...data.todayGames, ...data.recentGames];
        const unique = Array.from(
          new Map(combined.map((g) => [g.id, g])).values()
        );
        setTickerGames(unique.slice(0, 10));
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Live NBA Scoreboard Marquee Ticker */}
      {tickerGames.length > 0 && (
        <div className="relative overflow-hidden border-b border-white/[0.07] bg-[#040507]/95 py-1.5 backdrop-blur-md">
          <div className="animate-marquee flex items-center gap-3 px-4">
            {[...tickerGames, ...tickerGames].map((game, idx) => (
              <button
                key={`${game.id}-${idx}`}
                onClick={() => openGame(game)}
                className="group flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1 text-left transition hover:border-orange-500/40 hover:bg-orange-500/10"
              >
                <div className="flex items-center gap-1.5">
                  <img
                    src={game.away.team.logo}
                    alt={game.away.team.abbreviation}
                    className="h-4 w-4 object-contain"
                  />
                  <span
                    className={`font-mono-num text-xs font-semibold ${
                      game.away.winner ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {game.away.team.abbreviation}
                    {game.status !== "scheduled" ? ` ${game.away.score}` : ""}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-600">@</span>

                <div className="flex items-center gap-1.5">
                  <img
                    src={game.home.team.logo}
                    alt={game.home.team.abbreviation}
                    className="h-4 w-4 object-contain"
                  />
                  <span
                    className={`font-mono-num text-xs font-semibold ${
                      game.home.winner ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {game.home.team.abbreviation}
                    {game.status !== "scheduled" ? ` ${game.home.score}` : ""}
                  </span>
                </div>

                <span
                  className={`rounded px-1.5 py-0.5 font-mono-num text-[9px] font-bold uppercase ${
                    game.status === "live"
                      ? "bg-red-500/20 text-red-400"
                      : game.status === "final"
                      ? "bg-white/10 text-zinc-300"
                      : "bg-orange-500/15 text-orange-300"
                  }`}
                >
                  {game.status === "live"
                    ? `Q${game.period}`
                    : game.status === "final"
                    ? "FIM"
                    : formatTimePtBr(game.date)}
                </span>

                {game.mvp && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-400/90">
                    <Crown className="h-2.5 w-2.5" />
                    {game.mvp.shortName || game.mvp.name}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Sticky Glass Navigation */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#06080c]/88 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl"
            : "border-b border-white/[0.05] bg-[#06080c]/65 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Crest */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 p-[1px] shadow-lg shadow-orange-500/25 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#090b10]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-orange-400 transition-transform duration-500 group-hover:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3v18" />
                  <path d="M5.6 5.6c3.5 3.5 3.5 9.3 0 12.8" />
                  <path d="M18.4 5.6c-3.5 3.5-3.5 9.3 0 12.8" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-2xl tracking-wider text-white">
                  COURTSIDE
                </span>
                <span className="rounded bg-orange-500/20 px-1.5 py-0.5 font-mono-num text-[10px] font-bold tracking-widest text-orange-400">
                  NBA
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Live Hub & Heritage
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="courtside-nav-pill"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/90 to-amber-500/80 shadow-md shadow-orange-500/25"
                    />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live API Pulse Indicator & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              NBA Live Feed
            </div>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Abrir menu"
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-300 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 bg-[#080a0f] md:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
