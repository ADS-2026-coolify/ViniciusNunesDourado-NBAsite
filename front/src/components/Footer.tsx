import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/[0.08] bg-[#040507]">
      {/* Architectural SVG Basketball Half-Court Watermark */}
      <svg
        viewBox="0 0 800 260"
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-64 w-full max-w-5xl opacity-[0.045]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="40" y="10" width="720" height="240" />
        <circle cx="400" cy="250" r="75" />
        <path d="M 140 250 A 260 220 0 0 1 660 250" />
        <rect x="320" y="130" width="160" height="120" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl tracking-wider text-white">
                COURTSIDE
              </span>
              <span className="rounded bg-orange-500/20 px-2 py-0.5 font-mono-num text-xs font-bold text-orange-400">
                NBA
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
              Plataforma interativa dedicada à cultura, estatísticas em tempo real,
              calendário oficial, MVPs da rodada e aos 80 anos de história da
              National Basketball Association.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                Next.js + React + Framer Motion
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                NestJS REST API
              </span>
              <span className="rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-orange-300">
                Dados NBA em Tempo Real
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wider text-white">
              Explorar Quadra
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/" className="transition hover:text-orange-400">
                  Início & Destaques
                </Link>
              </li>
              <li>
                <Link href="/calendario" className="transition hover:text-orange-400">
                  Calendário da Temporada
                </Link>
              </li>
              <li>
                <Link href="/historico" className="transition hover:text-orange-400">
                  Histórico de Jogos & MVPs
                </Link>
              </li>
              <li>
                <Link href="/stats" className="transition hover:text-orange-400">
                  Líderes & Classificação
                </Link>
              </li>
              <li>
                <Link href="/historia" className="transition hover:text-orange-400">
                  Enciclopédia da História NBA
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg tracking-wider text-white">
              Experiência Interativa
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              Clique em qualquer partida no calendário, histórico ou ticker superior
              para abrir o <strong>Courtside Game Center</strong> com boxscore completo
              de atletas, parciais por quarto e comparativo tático.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Courtside NBA Experience. Sem necessidade de login — acesso 100% livre.</p>
          <p className="font-mono-num">TEMPORADA OFICIAL NBA • PARALLAX EDITION</p>
        </div>
      </div>
    </footer>
  );
}
