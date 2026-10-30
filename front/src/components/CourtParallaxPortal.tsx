"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import type { NbaEra, NbaLegend } from "@/lib/types";
import { TiltCard } from "./TiltCard";

interface CourtParallaxPortalProps {
  heroStats: Array<{ label: string; value: string; detail: string }>;
  featuredEras: NbaEra[];
  featuredLegends: NbaLegend[];
}

export function CourtParallaxPortal({
  heroStats,
  featuredEras,
  featuredLegends,
}: CourtParallaxPortalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={sectionRef} className="relative my-20 overflow-hidden py-24">
      {/* Parallax Vintage Gymnasium Background Window */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute -inset-y-28 inset-x-0 z-0"
      >
        <img
          src="/images/history-era.jpg"
          alt="História do Basquete NBA"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050608] via-[#050608]/65 to-[#050608]" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-300">
              <BookOpen className="h-3.5 w-3.5" />
              Enciclopédia Histórica • 1946 a 2027
            </div>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-wide text-white sm:text-7xl">
              DAS CESTAS DE PÊSSEGO ÀS{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                DINASTIAS ETERNAS.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
              Explore todas as eras da NBA: os 11 anéis de Bill Russell, os 100
              pontos de Wilt Chamberlain, a rivalidade Magic vs. Bird, os dois
              Three-Peats perfeitos de Michael Jordan, a Mamba Mentality de Kobe,
              os 40.000 pontos de LeBron e a revolução de 3 pontos de Stephen Curry.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/historia"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-orange-500/25 transition hover:scale-[1.02]"
              >
                Mergulhar na História Completa
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Floating Parallax Heritage Monoliths */}
          <motion.div
            style={{ y: badgeY }}
            className="grid grid-cols-2 gap-4 lg:col-span-5"
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-2xl p-5 border border-amber-500/20"
              >
                <div className="font-display text-4xl sm:text-5xl text-amber-400">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white">
                  {stat.label}
                </div>
                <div className="mt-1 text-[11px] text-zinc-400">
                  {stat.detail}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Preview of Legends & Eras */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredLegends.map((legend) => (
            <Link key={legend.id} href="/historia">
              <TiltCard
                glowColor={`${legend.accentColor}40`}
                className="p-5 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-num text-xs font-bold text-amber-400">
                      {legend.era}
                    </span>
                    <img
                      src={legend.teamLogo}
                      alt={legend.teamAbbreviation}
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <div className="mt-3 font-display text-3xl text-white">
                    {legend.name}
                  </div>
                  <div className="text-xs font-medium text-orange-300">
                    “{legend.nickname}” • #{legend.jersey}
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                    {legend.bio}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono-num text-xs">
                  <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                    <Trophy className="h-3.5 w-3.5" />
                    {legend.titles}× Campeão
                  </span>
                  <span className="text-zinc-300">{legend.stats.ppg} PPG</span>
                </div>
              </TiltCard>
            </Link>
          ))}
        </div>

        {/* Quick Era Timeline Ribbon */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredEras.map((era) => (
            <Link
              key={era.id}
              href="/historia"
              className="group rounded-2xl border border-white/10 bg-black/45 p-4 transition hover:border-amber-500/40 hover:bg-white/[0.04]"
            >
              <div className="font-mono-num text-xs font-bold text-orange-400">
                {era.period}
              </div>
              <div className="mt-1 font-display text-xl text-white group-hover:text-amber-300 transition-colors">
                {era.title}
              </div>
              <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                {era.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
