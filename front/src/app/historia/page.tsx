"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Crown,
  Flame,
  HelpCircle,
  Quote,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import type { NbaHistoryPayload } from "@/lib/types";
import { TiltCard } from "@/components/TiltCard";

export default function HistoriaPage() {
  const [history, setHistory] = useState<NbaHistoryPayload | null>(null);
  const [activeEraIdx, setActiveEraIdx] = useState<number>(4); // Default spotlight on Air Jordan 90s or user picks any!
  const [recordFilter, setRecordFilter] = useState<string>("Todos");

  // Interactive Quiz State
  const [quizStep, setQuizStep] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/history`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: NbaHistoryPayload | null) => {
        if (data) setHistory(data);
      })
      .catch(() => {});
  }, []);

  if (!history) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <p className="font-display text-2xl tracking-wider text-zinc-300">
          ABRINDO OS ARQUIVOS HISTÓRICOS DA NBA...
        </p>
      </div>
    );
  }

  const activeEra = history.eras[activeEraIdx] ?? history.eras[0];
  const filteredRecords =
    recordFilter === "Todos"
      ? history.records
      : history.records.filter((r) => r.category === recordFilter);

  const currentQuestion = history.trivia[quizStep];

  const handleAnswer = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    if (optIdx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (quizStep + 1 < history.trivia.length) {
      setQuizStep((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* 1. VINTAGE GYMNASIUM PARALLAX HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[78vh] overflow-hidden border-b border-white/10 flex items-center"
      >
        <motion.div
          style={{ y: bgY, scale: bgScale }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <img
            src="/images/history-era.jpg"
            alt="História do Basquete NBA"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/70 via-[#050608]/60 to-[#050608]" />
        </motion.div>

        <motion.div
          style={{ y: titleY }}
          className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
            <BookOpen className="h-3.5 w-3.5" />
            Enciclopédia Definitiva • 1891 – 1946 – Presente
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.92] tracking-wide text-white sm:text-8xl lg:text-[6.5rem]">
            A HISTÓRIA COMPLETA DA{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              MAIOR LIGA DO PLANETA.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-200 sm:text-lg">
            Das 13 regras originais de James Naismith e a fundação em 1946 até
            os 18 banners do Boston Celtics, a era Air Jordan, a revolução dos 3
            pontos e a consagração global contemporânea.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {history.heroStats.map((st) => (
              <div
                key={st.label}
                className="glass-panel rounded-2xl border border-amber-500/20 p-5"
              >
                <div className="font-display text-4xl sm:text-5xl text-amber-400">
                  {st.value}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white">
                  {st.label}
                </div>
                <div className="mt-0.5 text-[11px] text-zinc-400">
                  {st.detail}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-4 pt-16 sm:px-6 lg:px-8">
        {/* 2. INTERACTIVE 8 ERAS EXPLORER */}
        <section>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            Máquina do Tempo • 8 Décadas
          </div>
          <h2 className="mt-1 font-display text-5xl tracking-wide text-white sm:text-6xl">
            AS ERAS QUE MOLDARAM A <span className="text-orange-400">NBA</span>
          </h2>

          {/* Decade Timeline Selector */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-3">
            {history.eras.map((era, idx) => {
              const active = idx === activeEraIdx;
              return (
                <button
                  key={era.id}
                  onClick={() => setActiveEraIdx(idx)}
                  className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-orange-500 bg-gradient-to-br from-orange-500/25 to-amber-500/10 text-white shadow-lg shadow-orange-500/15"
                      : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <div className="font-mono-num text-xs font-bold text-amber-400">
                    {era.period}
                  </div>
                  <div className="mt-0.5 font-display text-xl tracking-wide">
                    {era.title.split("&")[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Era Deep-Dive Stage */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEra.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="relative mt-6 overflow-hidden rounded-3xl border border-white/15 bg-[#090c12] p-6 sm:p-10"
            >
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-25 blur-[110px]"
                style={{ backgroundColor: activeEra.accentColor }}
              />

              <div className="relative z-10 grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <span
                    className="inline-block rounded-full px-3.5 py-1 font-mono-num text-xs font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: `${activeEra.accentColor}40` }}
                  >
                    {activeEra.period}
                  </span>
                  <h3 className="mt-3 font-display text-4xl sm:text-6xl text-white">
                    {activeEra.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-amber-300">
                    {activeEra.subtitle}
                  </p>
                  <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-300">
                    {activeEra.fullStory}
                  </p>

                  {/* Era Icons */}
                  <div className="mt-6">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      Protagonistas da Década
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {activeEra.icons.map((person) => (
                        <span
                          key={person}
                          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-6 lg:col-span-4">
                  {/* Defining Stat Box */}
                  <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-transparent p-6">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                      Número Símbolo da Era
                    </div>
                    <div className="mt-2 font-display text-6xl text-white leading-none">
                      {activeEra.definingStat.value}
                    </div>
                    <div className="mt-2 text-xs text-zinc-300">
                      {activeEra.definingStat.label}
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="rounded-2xl border border-white/10 bg-black/45 p-5">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-orange-400">
                      Marcos Históricos
                    </div>
                    <ul className="mt-3 space-y-2.5 text-xs text-zinc-300">
                      {activeEra.milestones.map((ms) => (
                        <li key={ms} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                          <span>{ms}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* 3. HALL OF GOATS (PANTEÃO DAS 12 LENDAS) */}
        <section>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Crown className="h-3.5 w-3.5" />
            Panteão Imortal
          </div>
          <h2 className="mt-1 font-display text-5xl tracking-wide text-white sm:text-6xl">
            LENDAS & <span className="text-amber-400">GOATs DA NBA</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Os titãs que redefiniram o limite humano em quadra, com suas médias
            de carreira, anéis, movimentos-assinatura e filosofias.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {history.legends.map((legend) => (
              <TiltCard
                key={legend.id}
                glowColor={`${legend.accentColor}40`}
                className="relative flex flex-col justify-between p-6"
              >
                {/* Giant Jersey Number Watermark */}
                <div className="pointer-events-none absolute right-4 top-2 select-none font-display text-7xl text-white/[0.05]">
                  #{legend.jersey}
                </div>

                <div>
                  <div className="flex items-center gap-3.5">
                    {legend.headshot ? (
                      <img
                        src={legend.headshot}
                        alt={legend.name}
                        className="h-16 w-16 shrink-0 rounded-2xl border border-white/15 bg-zinc-900 object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 p-2.5"
                        style={{ backgroundColor: `${legend.accentColor}22` }}
                      >
                        <img
                          src={legend.teamLogo}
                          alt={legend.teamAbbreviation}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-mono-num text-[11px] font-bold text-amber-400">
                        {legend.era} • {legend.position}
                      </div>
                      <h3 className="truncate font-display text-3xl text-white">
                        {legend.name}
                      </h3>
                      <div className="truncate text-xs text-zinc-400">
                        “{legend.nickname}” • {legend.primaryTeam}
                      </div>
                    </div>
                  </div>

                  {/* Trophy Cabinet Row */}
                  <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-black/40 p-2.5 text-center">
                    <div>
                      <div className="font-display text-2xl text-amber-400 leading-none">
                        {legend.titles}×
                      </div>
                      <div className="text-[10px] uppercase text-zinc-400">
                        Campeão
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-2xl text-orange-400 leading-none">
                        {legend.mvps}×
                      </div>
                      <div className="text-[10px] uppercase text-zinc-400">
                        MVP Liga
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-2xl text-white leading-none">
                        {legend.allStars}×
                      </div>
                      <div className="text-[10px] uppercase text-zinc-400">
                        All-Star
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-zinc-300">
                    {legend.bio}
                  </p>

                  <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs italic text-zinc-400">
                    <Quote className="mb-1 h-3.5 w-3.5 text-amber-400" />“
                    {legend.quote}”
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between font-mono-num text-xs">
                    <span className="text-zinc-300">
                      <strong className="text-white">{legend.stats.ppg}</strong>{" "}
                      PPG •{" "}
                      <strong className="text-white">{legend.stats.rpg}</strong>{" "}
                      RPG •{" "}
                      <strong className="text-white">{legend.stats.apg}</strong>{" "}
                      APG
                    </span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-orange-300">
                    Assinatura: {legend.signatureMove}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 4. GREATEST DYNASTIES & CHAMPIONSHIP BANNERS */}
        <section>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
            <Trophy className="h-3.5 w-3.5" />
            Flâmulas no Teto das Arenas
          </div>
          <h2 className="mt-1 font-display text-5xl tracking-wide text-white sm:text-6xl">
            MAIORES <span className="text-orange-400">DINASTIAS</span>
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {history.dynasties.map((dyn) => (
              <TiltCard
                key={dyn.id}
                glowColor={`${dyn.color}45`}
                className="flex flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={dyn.logo}
                        alt={dyn.franchise}
                        className="h-12 w-12 object-contain"
                      />
                      <div>
                        <h3 className="font-display text-3xl text-white">
                          {dyn.franchise}
                        </h3>
                        <span className="font-mono-num text-xs text-zinc-400">
                          {dyn.abbreviation}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-500/35 bg-amber-500/15 px-3.5 py-2 text-center">
                      <div className="font-display text-3xl text-amber-300 leading-none">
                        {dyn.titles}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-amber-200">
                        Títulos
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-zinc-300">
                    {dyn.legacy}
                  </p>

                  {/* Championship Years Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {dyn.years.map((yr) => (
                      <span
                        key={yr}
                        className="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono-num text-[10px] font-bold text-amber-300"
                      >
                        {yr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-3 text-[11px] text-zinc-400">
                  <strong className="text-zinc-200">Ícones:</strong>{" "}
                  {dyn.definingLegends.join(" • ")}
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* 5. EVOLUTION OF THE COURT & IMMORTAL RECORDS */}
        <section className="grid gap-12 lg:grid-cols-12">
          {/* Evolution Timeline */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Flame className="h-3.5 w-3.5" />
              Regras & Revoluções
            </div>
            <h2 className="mt-1 font-display text-4xl sm:text-5xl text-white">
              EVOLUÇÃO DO BASQUETE
            </h2>

            <div className="mt-6 relative border-l border-orange-500/30 pl-6 space-y-6">
              {history.courtEvolution.map((ev) => (
                <div key={ev.year} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-orange-400 bg-[#050608]" />
                  <div className="font-mono-num text-xs font-bold text-orange-400">
                    {ev.year}
                  </div>
                  <h4 className="font-display text-2xl text-white">
                    {ev.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Immortal Records + Filter */}
          <div className="lg:col-span-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400">
                  <Award className="h-3.5 w-3.5" />
                  Números Inquebráveis
                </div>
                <h2 className="mt-1 font-display text-4xl sm:text-5xl text-white">
                  RECORDES IMORTAIS
                </h2>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {["Todos", "Jogo Único", "Temporada", "Carreira", "Franquia"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setRecordFilter(cat)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        recordFilter === cat
                          ? "bg-orange-500 text-white"
                          : "bg-white/[0.04] text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      <span>{rec.category}</span>
                      <span className="font-mono-num text-zinc-500">
                        {rec.dateOrSpan}
                      </span>
                    </div>
                    <div className="mt-2 font-display text-5xl text-orange-400 leading-none">
                      {rec.value}
                    </div>
                    <h4 className="mt-2 font-semibold text-white">
                      {rec.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                      {rec.context}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-2.5 text-xs font-semibold text-zinc-200">
                    {rec.holder}{" "}
                    <span className="text-zinc-500">• {rec.team}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. INTERACTIVE NBA HISTORY QUIZ */}
        <section className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-[#090c12] to-amber-500/5 p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <HelpCircle className="h-4 w-4" />
                Desafio Interativo Courtside
              </div>
              <h2 className="mt-1 font-display text-4xl sm:text-5xl text-white">
                QUIZ DA HISTÓRIA DA NBA
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2 font-mono-num text-sm text-zinc-300">
              Pontuação:{" "}
              <strong className="text-amber-400">
                {score} / {history.trivia.length}
              </strong>
            </div>
          </div>

          {!quizFinished && currentQuestion ? (
            <div className="mt-8">
              <div className="text-xs font-mono-num uppercase tracking-wider text-zinc-400">
                Pergunta {quizStep + 1} de {history.trivia.length}
              </div>
              <h3 className="mt-2 text-lg sm:text-xl font-bold text-white">
                {currentQuestion.question}
              </h3>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((opt, idx) => {
                  const answered = selectedOption !== null;
                  const isCorrect = idx === currentQuestion.correctIndex;
                  const isPicked = idx === selectedOption;

                  let styleClass =
                    "border-white/10 bg-white/[0.03] text-zinc-200 hover:border-orange-500/50 hover:bg-white/[0.06]";
                  if (answered) {
                    if (isCorrect) {
                      styleClass =
                        "border-emerald-500 bg-emerald-500/20 text-emerald-200";
                    } else if (isPicked) {
                      styleClass = "border-red-500 bg-red-500/20 text-red-200";
                    } else {
                      styleClass =
                        "border-white/5 bg-white/[0.01] text-zinc-500";
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition ${styleClass}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                      )}
                      {answered && isPicked && !isCorrect && (
                        <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/50 p-4 sm:flex-row sm:items-center"
                >
                  <p className="text-xs sm:text-sm text-zinc-300">
                    {currentQuestion.explanation}
                  </p>
                  <button
                    onClick={nextQuestion}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    {quizStep + 1 < history.trivia.length
                      ? "Próxima Pergunta →"
                      : "Ver Resultado Final"}
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/45 p-8 text-center">
              <Trophy className="mx-auto h-12 w-12 text-amber-400" />
              <h3 className="mt-3 font-display text-4xl text-white">
                VOCÊ ACERTOU {score} DE {history.trivia.length}!
              </h3>
              <p className="mt-2 text-sm text-zinc-300">
                {score === history.trivia.length
                  ? "Nível Hall da Fama! Você domina todos os capítulos da NBA."
                  : score >= 3
                  ? "Nível All-Star! Excelente conhecimento histórico das quadras."
                  : "Nível Rookie! Continue explorando nossa linha do tempo acima."}
              </p>
              <button
                onClick={resetQuiz}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-600"
              >
                <RotateCcw className="h-4 w-4" />
                Jogar Novamente
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
