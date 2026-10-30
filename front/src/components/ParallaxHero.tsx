"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Crown,
  Flame,
  Sparkles,
} from "lucide-react";
import type { MvpShowcaseItem, NbaGame } from "@/lib/types";
import { useGameModal } from "./GameModalContext";

interface ParallaxHeroProps {
  season: string;
  featuredMvp?: MvpShowcaseItem;
  featuredGame?: NbaGame;
  totalTodayGames: number;
}

export function ParallaxHero({
  season,
  featuredMvp,
  featuredGame,
  totalTodayGames,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openGame } = useGameModal();

  // Scroll-driven multi-layer parallax transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const arenaY = useTransform(scrollYProgress, [0, 1], ["0%", "34%"]);
  const arenaScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.2]);
  const textWatermarkX = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const textWatermarkY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const ballY = useTransform(scrollYProgress, [0, 1], [0, -165]);
  const ballRotate = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const ballScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0]);

  // Subtle mouse-driven parallax for the floating basketball & court lines
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 90, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth - 0.5) * 34;
    const ny = (e.clientY / innerHeight - 0.5) * 34;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] w-full overflow-hidden border-b border-white/[0.08]"
    >
      {/* LAYER 0: Deep Parallax Luxury Arena Hardwood Background */}
      <motion.div
        style={{ y: arenaY, scale: arenaScale }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <img
          src="/images/arena-hero.jpg"
          alt="NBA Arena Hardwood Court"
          className="h-full w-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/80 via-[#050608]/55 to-[#050608]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608] via-[#050608]/50 to-transparent" />
      </motion.div>

      {/* LAYER 1: Architectural SVG Basketball Court Geometry + Giant Parallax Outline Typography */}
      <motion.div
        style={{ x: textWatermarkX, y: textWatermarkY }}
        className="pointer-events-none absolute top-16 left-0 z-10 select-none whitespace-nowrap"
      >
        <span className="font-display text-[17vw] leading-none text-outline-hero">
          COURTSIDE • NATIONAL BASKETBALL ASSOCIATION
        </span>
      </motion.div>

      <svg
        viewBox="0 0 1200 700"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-[0.09]"
        fill="none"
        stroke="url(#courtGrad)"
        strokeWidth="1.5"
      >
        <defs>
          <linearGradient id="courtGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <circle cx="920" cy="350" r="185" />
        <circle cx="920" cy="350" r="58" strokeDasharray="8 8" />
        <path d="M 1200 75 A 360 310 0 0 0 1200 625" />
        <line x1="920" y1="0" x2="920" y2="700" />
      </svg>

      {/* LAYER 2: 3D Floating & Scroll-Rotating Macro Basketball Parallax Sphere */}
      <motion.div
        style={{
          y: ballY,
          x: springX,
          scale: ballScale,
        }}
        className="pointer-events-none absolute right-[-10%] top-[12%] z-20 hidden sm:flex lg:right-[3%] lg:top-[10%] items-center justify-center"
      >
        {/* Warm Arena Rim Glow behind the ball */}
        <div className="absolute h-[360px] w-[360px] lg:h-[500px] lg:w-[500px] rounded-full bg-orange-500/20 blur-[95px]" />

        <motion.div
          style={{ rotate: ballRotate, y: springY }}
          animate={{ y: [0, -14, 0] }}
          transition={{
            y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative h-[340px] w-[340px] lg:h-[490px] lg:w-[490px]"
        >
          <img
            src="/images/ball-spotlight.jpg"
            alt="Bola de Basquete Parallax"
            className="h-full w-full object-contain ball-spotlight-mask drop-shadow-[0_30px_60px_rgba(249,115,22,0.35)]"
          />
        </motion.div>
      </motion.div>

      {/* LAYER 3: Foreground Editorial Content & Live Interactive Spotlight */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-30 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          {/* Season Live Pill */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-orange-500/35 bg-orange-500/10 px-4 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span className="font-mono-num text-xs font-semibold uppercase tracking-widest text-orange-300">
              Temporada Oficial {season}
            </span>
            <span className="h-1 w-1 rounded-full bg-orange-400/60" />
            <span className="text-xs text-zinc-300">
              {totalTodayGames > 0
                ? `${totalTodayGames} jogos programados hoje`
                : "Cobertura completa em tempo real"}
            </span>
          </motion.div>

          {/* Monumental Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mt-6 font-display text-6xl leading-[0.92] tracking-wide text-white sm:text-8xl lg:text-[6.8rem]"
          >
            ONDE CADA POSSE{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              VIRA HISTÓRIA.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg"
          >
            Mergulhe no ecossistema definitivo do basquete: calendário oficial
            da NBA, <strong>Jogador da Semana</strong>, <strong>MVPs de cada partida</strong>,
            boxscores interativos e uma viagem imersiva pelas 8 décadas de lendas da liga.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/calendario"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-orange-500/25 transition hover:scale-[1.02] hover:shadow-orange-500/40"
            >
              <Calendar className="h-4 w-4" />
              Calendário da NBA
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/historia"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-orange-400/50 hover:bg-white/[0.1]"
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              80 Anos de História
            </Link>

            <Link
              href="/historico"
              className="inline-flex items-center gap-2 rounded-2xl border border-transparent px-4 py-3.5 text-sm font-semibold text-zinc-300 transition hover:text-orange-400"
            >
              <Flame className="h-4 w-4 text-orange-400" />
              Ver MVPs dos Jogos
            </Link>
          </motion.div>
        </div>

        {/* Bottom Floating Glass Telemetry Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Card 1: Top Performance / Game MVP of the Week */}
          {featuredMvp && (
            <div
              onClick={() => featuredGame && openGame(featuredGame)}
              className={`glass-panel glass-panel-hover flex items-center gap-4 rounded-2xl p-4 ${
                featuredGame ? "cursor-pointer" : ""
              }`}
            >
              <img
                src={featuredMvp.mvp.headshot}
                alt={featuredMvp.mvp.name}
                className="h-14 w-14 shrink-0 rounded-2xl border border-amber-400/40 bg-zinc-900 object-cover"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  <Crown className="h-3.5 w-3.5" />
                  Maior Atuação da Semana
                </div>
                <div className="truncate font-display text-2xl text-white">
                  {featuredMvp.mvp.name}
                </div>
                <div className="font-mono-num text-xs text-orange-300">
                  {featuredMvp.mvp.statLine} • {featuredMvp.finalScore}
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Interactive Boxscore Callout */}
          <Link
            href="/stats"
            className="glass-panel glass-panel-hover flex items-center justify-between gap-4 rounded-2xl p-4"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                Analytics & Tabelas
              </div>
              <div className="mt-0.5 font-display text-2xl text-white">
                Leste vs. Oeste Ao Vivo
              </div>
              <div className="text-xs text-zinc-400">
                Classificação de Playoffs, Play-In e cestinhas
              </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/15 text-orange-300">
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>

          {/* Card 3: History Encyclopedia Quick Portal */}
          <Link
            href="/historia"
            className="glass-panel glass-panel-hover flex items-center justify-between gap-4 rounded-2xl p-4 sm:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Arquivo Imortal • 1946–2027
              </div>
              <div className="mt-0.5 font-display text-2xl text-white">
                Dinastias, Recordes & GOATs
              </div>
              <div className="text-xs text-zinc-400">
                De Russell & Wilt a Jordan, LeBron, Curry & Jokić
              </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-300">
              <BookOpen className="h-5 w-5" />
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
