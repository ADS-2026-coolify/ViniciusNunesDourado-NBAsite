import { Injectable, Logger } from '@nestjs/common';
import { NBA_HISTORY_DATA } from './nba-history.data.js';
import type {
  GameDetailResponse,
  GameMvp,
  NbaGame,
  PlayerLeader,
  StandingEntry,
  StatCategoryLeader,
  TeamGameSide,
  TeamSummary,
  WeeklyPlayerSpotlight,
} from './nba.types.js';

interface CacheEntry<T> {
  expiresAt: number;
  data: T;
}

const EAST_ABBREVIATIONS = new Set([
  'ATL',
  'BOS',
  'BKN',
  'CHA',
  'CHI',
  'CLE',
  'DET',
  'IND',
  'MIA',
  'MIL',
  'NY',
  'NYK',
  'ORL',
  'PHI',
  'TOR',
  'WSH',
  'WAS',
]);

@Injectable()
export class NbaService {
  private readonly logger = new Logger(NbaService.name);
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  private formatYmd(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private normalizeDateParam(dateInput?: string): string {
    if (!dateInput) {
      return this.formatYmd(new Date());
    }
    const cleaned = dateInput.replace(/-/g, '').trim();
    if (/^\d{8}$/.test(cleaned)) {
      return cleaned;
    }
    return this.formatYmd(new Date());
  }

  private shiftYmd(ymd: string, deltaDays: number): string {
    const year = Number(ymd.slice(0, 4));
    const month = Number(ymd.slice(4, 6)) - 1;
    const day = Number(ymd.slice(6, 8));
    const d = new Date(year, month, day);
    d.setDate(d.getDate() + deltaDays);
    return this.formatYmd(d);
  }

  private async fetchJsonCached<T>(
    cacheKey: string,
    url: string,
    ttlMs = 120_000,
  ): Promise<T> {
    const hit = this.cache.get(cacheKey);
    if (hit && hit.expiresAt > Date.now()) {
      return hit.data as T;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CourtsideNBA-NestJS/1.0',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}`);
      }
      const data = (await response.json()) as T;
      this.cache.set(cacheKey, {
        expiresAt: Date.now() + ttlMs,
        data,
      });
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  private parseTeamSummary(competitor: any): TeamSummary {
    const team = competitor?.team ?? {};
    const records: any[] = competitor?.records ?? [];
    const totalRecord =
      records.find((r) => r.type === 'total' || r.name === 'overall')?.summary ??
      '';
    const homeRecord =
      records.find((r) => r.type === 'home' || r.name === 'Home')?.summary ?? '';
    const awayRecord =
      records.find((r) => r.type === 'road' || r.name === 'Road')?.summary ?? '';

    const logo =
      team.logo ||
      team.logos?.[0]?.href ||
      `https://a.espncdn.com/i/teamlogos/nba/500/${String(team.abbreviation || 'nba').toLowerCase()}.png`;

    return {
      id: String(team.id ?? ''),
      name: String(team.displayName ?? team.name ?? 'NBA Team'),
      shortName: String(team.shortDisplayName ?? team.name ?? 'Team'),
      abbreviation: String(team.abbreviation ?? 'NBA'),
      location: String(team.location ?? ''),
      color: `#${String(team.color || 'f97316').replace('#', '')}`,
      alternateColor: `#${String(team.alternateColor || '18181b').replace('#', '')}`,
      logo,
      record: totalRecord,
      homeRecord,
      awayRecord,
    };
  }

  private extractLeader(
    competitor: any,
    categoryName: string,
    team: TeamSummary,
  ): PlayerLeader | undefined {
    const cat = (competitor?.leaders ?? []).find(
      (l: any) => l.name === categoryName,
    );
    const entry = cat?.leaders?.[0];
    if (!entry?.athlete) return undefined;

    const athlete = entry.athlete;
    const headshot =
      typeof athlete.headshot === 'string'
        ? athlete.headshot
        : athlete.headshot?.href ||
          `https://a.espncdn.com/i/headshots/nba/players/full/${athlete.id}.png`;

    return {
      id: String(athlete.id ?? ''),
      name: String(athlete.displayName ?? athlete.fullName ?? 'Athlete'),
      shortName: String(athlete.shortName ?? athlete.displayName ?? ''),
      headshot,
      jersey: String(athlete.jersey ?? ''),
      position: String(athlete.position?.abbreviation ?? ''),
      teamId: team.id,
      teamAbbreviation: team.abbreviation,
      teamColor: team.color,
      teamLogo: team.logo,
      statLabel: String(cat.shortDisplayName ?? cat.abbreviation ?? categoryName),
      displayValue: String(entry.displayValue ?? ''),
      value: Number(entry.value ?? 0),
    };
  }

  private parseTeamSide(competitor: any): TeamGameSide {
    const team = this.parseTeamSummary(competitor);
    const stats: Record<string, string> = {};
    for (const s of competitor?.statistics ?? []) {
      if (s?.name && s?.displayValue !== undefined) {
        stats[s.name] = String(s.displayValue);
      }
    }

    return {
      team,
      score: Number(competitor?.score ?? 0),
      winner: Boolean(competitor?.winner),
      homeAway: competitor?.homeAway === 'away' ? 'away' : 'home',
      linescores: (competitor?.linescores ?? []).map((ls: any) =>
        Number(ls.value ?? ls.displayValue ?? 0),
      ),
      stats,
      leaders: {
        points: this.extractLeader(competitor, 'points', team),
        rebounds: this.extractLeader(competitor, 'rebounds', team),
        assists: this.extractLeader(competitor, 'assists', team),
      },
    };
  }

  private computeGameMvp(
    homeComp: any,
    awayComp: any,
    homeSide: TeamGameSide,
    awaySide: TeamGameSide,
    status: 'scheduled' | 'live' | 'final',
  ): GameMvp | null {
    if (status === 'scheduled') {
      return null;
    }

    const homeRating = this.extractLeader(homeComp, 'rating', homeSide.team);
    const awayRating = this.extractLeader(awayComp, 'rating', awaySide.team);

    let chosenComp = homeComp;
    let chosenSide = homeSide;
    let chosenRating = homeRating;

    if (status === 'final') {
      if (awaySide.score > homeSide.score && (awayRating || awaySide.leaders.points)) {
        chosenComp = awayComp;
        chosenSide = awaySide;
        chosenRating = awayRating;
      } else if (homeSide.score >= awaySide.score && (homeRating || homeSide.leaders.points)) {
        chosenComp = homeComp;
        chosenSide = homeSide;
        chosenRating = homeRating;
      }
    } else if (
      (awayRating?.value ?? 0) > (homeRating?.value ?? 0)
    ) {
      chosenComp = awayComp;
      chosenSide = awaySide;
      chosenRating = awayRating;
    }

    const baseLeader =
      chosenRating ||
      chosenSide.leaders.points ||
      homeRating ||
      awayRating ||
      homeSide.leaders.points ||
      awaySide.leaders.points;

    if (!baseLeader) return null;

    const ptsLeader = this.extractLeader(chosenComp, 'points', chosenSide.team);
    const rebLeader = this.extractLeader(chosenComp, 'rebounds', chosenSide.team);
    const astLeader = this.extractLeader(chosenComp, 'assists', chosenSide.team);

    const points =
      ptsLeader?.id === baseLeader.id ? ptsLeader.value : undefined;
    const rebounds =
      rebLeader?.id === baseLeader.id ? rebLeader.value : undefined;
    const assists =
      astLeader?.id === baseLeader.id ? astLeader.value : undefined;

    let statLine = chosenRating?.displayValue ?? '';
    if (!statLine) {
      const parts: string[] = [];
      if (points !== undefined) parts.push(`${points} PTS`);
      if (rebounds !== undefined) parts.push(`${rebounds} REB`);
      if (assists !== undefined) parts.push(`${assists} AST`);
      statLine = parts.join(' • ') || `${baseLeader.displayValue} ${baseLeader.statLabel}`;
    }

    return {
      id: baseLeader.id,
      name: baseLeader.name,
      shortName: baseLeader.shortName,
      headshot: baseLeader.headshot,
      jersey: baseLeader.jersey,
      position: baseLeader.position,
      teamAbbreviation: chosenSide.team.abbreviation,
      teamName: chosenSide.team.name,
      teamColor: chosenSide.team.color,
      teamLogo: chosenSide.team.logo,
      statLine,
      rating: Number((chosenRating?.value ?? (points ?? 25) * 1.6).toFixed(1)),
      points,
      rebounds,
      assists,
    };
  }

  private parseEventToGame(event: any): NbaGame {
    const comp = event?.competitions?.[0] ?? {};
    const competitors: any[] = comp.competitors ?? [];
    const homeComp =
      competitors.find((c) => c.homeAway === 'home') ?? competitors[0] ?? {};
    const awayComp =
      competitors.find((c) => c.homeAway === 'away') ?? competitors[1] ?? {};

    const state = event?.status?.type?.state ?? comp?.status?.type?.state;
    const status: 'scheduled' | 'live' | 'final' =
      state === 'in' ? 'live' : state === 'post' ? 'final' : 'scheduled';

    const home = this.parseTeamSide(homeComp);
    const away = this.parseTeamSide(awayComp);
    const mvp = this.computeGameMvp(homeComp, awayComp, home, away, status);

    const broadcasts: string[] =
      comp.broadcasts?.flatMap((b: any) => b.names ?? []) ?? [];
    const headlineObj = comp.headlines?.[0];
    const highlightObj = comp.highlights?.[0];

    return {
      id: String(event.id ?? comp.id ?? ''),
      date: String(event.date ?? comp.date ?? ''),
      name: String(event.name ?? `${away.team.name} at ${home.team.name}`),
      shortName: String(
        event.shortName ?? `${away.team.abbreviation} @ ${home.team.abbreviation}`,
      ),
      status,
      statusDetail: String(
        event?.status?.type?.shortDetail ??
          event?.status?.type?.detail ??
          'Agendado',
      ),
      period: Number(event?.status?.period ?? 0),
      clock: String(event?.status?.displayClock ?? ''),
      venue: {
        name: String(comp.venue?.fullName ?? 'NBA Arena'),
        city: String(comp.venue?.address?.city ?? ''),
        state: String(comp.venue?.address?.state ?? ''),
      },
      broadcast: broadcasts[0] ?? comp.broadcast ?? 'NBA League Pass',
      attendance: comp.attendance ? Number(comp.attendance) : undefined,
      headline: headlineObj?.shortLinkText,
      recap: headlineObj?.description,
      highlightThumbnail: highlightObj?.thumbnail,
      home,
      away,
      mvp,
    };
  }

  async getScoreboardByDate(dateParam?: string): Promise<{
    date: string;
    seasonDisplay: string;
    calendarDates: string[];
    games: NbaGame[];
  }> {
    const ymd = this.normalizeDateParam(dateParam);
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${ymd}`;

    try {
      const raw = await this.fetchJsonCached<any>(`scoreboard:${ymd}`, url, 90_000);
      const league = raw?.leagues?.[0] ?? {};
      const calendarDates: string[] = (league.calendar ?? []).map((iso: string) =>
        String(iso).slice(0, 10),
      );
      const games: NbaGame[] = (raw?.events ?? []).map((ev: any) =>
        this.parseEventToGame(ev),
      );

      return {
        date: `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`,
        seasonDisplay: String(league.season?.displayName ?? '2026-27'),
        calendarDates,
        games,
      };
    } catch (error) {
      this.logger.warn(`Fallback activated for scoreboard ${ymd}: ${String(error)}`);
      return {
        date: `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`,
        seasonDisplay: '2026-27',
        calendarDates: [],
        games: this.getFallbackGames(),
      };
    }
  }

  async getScheduleWindow(centerDate?: string, pastDays = 3, futureDays = 4) {
    const baseYmd = this.normalizeDateParam(centerDate);
    const ymds: string[] = [];
    for (let offset = -pastDays; offset <= futureDays; offset++) {
      ymds.push(this.shiftYmd(baseYmd, offset));
    }

    const results = await Promise.all(
      ymds.map((ymd) => this.getScoreboardByDate(ymd)),
    );

    return {
      centerDate: `${baseYmd.slice(0, 4)}-${baseYmd.slice(4, 6)}-${baseYmd.slice(6, 8)}`,
      seasonDisplay: results[0]?.seasonDisplay ?? '2026-27',
      calendarDates: results.find((r) => r.calendarDates.length > 0)?.calendarDates ?? [],
      days: results.map((r) => ({
        date: r.date,
        totalGames: r.games.length,
        liveGames: r.games.filter((g) => g.status === 'live').length,
        finalGames: r.games.filter((g) => g.status === 'final').length,
        games: r.games,
      })),
    };
  }

  async getRecentGamesAndMvps(days = 6) {
    const todayYmd = this.formatYmd(new Date());
    const dateList: string[] = [];
    for (let i = 0; i < days; i++) {
      dateList.push(this.shiftYmd(todayYmd, -i));
    }

    const boards = await Promise.all(
      dateList.map((ymd) => this.getScoreboardByDate(ymd)),
    );

    const completedGames: NbaGame[] = boards
      .flatMap((b) => b.games)
      .filter((g) => g.status === 'final' || g.status === 'live')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const topMvps = completedGames
      .filter((g): g is NbaGame & { mvp: GameMvp } => Boolean(g.mvp))
      .map((g) => ({
        gameId: g.id,
        date: g.date,
        matchup: g.shortName,
        finalScore: `${g.away.team.abbreviation} ${g.away.score} - ${g.home.score} ${g.home.team.abbreviation}`,
        venue: g.venue.name,
        headline: g.headline || g.recap,
        mvp: g.mvp,
      }))
      .sort((a, b) => b.mvp.rating - a.mvp.rating);

    return {
      games: completedGames,
      mvpShowcase: topMvps.slice(0, 12),
    };
  }

  async getPlayersOfTheWeek(): Promise<{
    weekLabel: string;
    overallMvp: WeeklyPlayerSpotlight;
    easternPlayer: WeeklyPlayerSpotlight;
    westernPlayer: WeeklyPlayerSpotlight;
  }> {
    try {
      const [{ games }, leadersData] = await Promise.all([
        this.getRecentGamesAndMvps(7),
        this.getStatLeaders(),
      ]);

      const ppgMap = new Map<string, string>();
      const rpgMap = new Map<string, string>();
      const apgMap = new Map<string, string>();

      for (const cat of leadersData.categories) {
        for (const l of cat.leaders) {
          if (cat.categoryKey === 'pointsPerGame') ppgMap.set(l.id, l.displayValue);
          if (cat.categoryKey === 'reboundsPerGame') rpgMap.set(l.id, l.displayValue);
          if (cat.categoryKey === 'assistsPerGame') apgMap.set(l.id, l.displayValue);
        }
      }

      interface AggPlayer {
        mvp: GameMvp;
        conference: 'Eastern' | 'Western';
        totalRating: number;
        gamesMvpCount: number;
        wins: number;
        totalPoints: number;
        pointsGames: number;
        bestGame: NbaGame;
        bestRating: number;
        bestStatLine: string;
      }

      const agg = new Map<string, AggPlayer>();

      for (const game of games) {
        if (!game.mvp) continue;
        const m = game.mvp;
        const conf: 'Eastern' | 'Western' = EAST_ABBREVIATIONS.has(
          m.teamAbbreviation.toUpperCase(),
        )
          ? 'Eastern'
          : 'Western';

        const won =
          (game.home.team.abbreviation === m.teamAbbreviation && game.home.winner) ||
          (game.away.team.abbreviation === m.teamAbbreviation && game.away.winner);

        const existing = agg.get(m.id);
        if (!existing) {
          agg.set(m.id, {
            mvp: m,
            conference: conf,
            totalRating: m.rating + (won ? 8 : 0),
            gamesMvpCount: 1,
            wins: won ? 1 : 0,
            totalPoints: m.points ?? 28,
            pointsGames: 1,
            bestGame: game,
            bestRating: m.rating,
            bestStatLine: m.statLine,
          });
        } else {
          existing.totalRating += m.rating + (won ? 8 : 0);
          existing.gamesMvpCount += 1;
          existing.wins += won ? 1 : 0;
          existing.totalPoints += m.points ?? 28;
          existing.pointsGames += 1;
          if (m.rating > existing.bestRating) {
            existing.bestRating = m.rating;
            existing.bestGame = game;
            existing.bestStatLine = m.statLine;
          }
        }
      }

      const ranked = Array.from(agg.values()).sort(
        (a, b) => b.totalRating - a.totalRating,
      );

      const eastCandidate = ranked.find((r) => r.conference === 'Eastern');
      const westCandidate = ranked.find((r) => r.conference === 'Western');
      const overallCandidate = ranked[0];

      if (overallCandidate && eastCandidate && westCandidate) {
        const toSpotlight = (
          item: AggPlayer,
          conference: 'Overall' | 'Eastern' | 'Western',
          badge: string,
        ): WeeklyPlayerSpotlight => {
          const avgPts =
            ppgMap.get(item.mvp.id) ??
            (item.totalPoints / Math.max(1, item.pointsGames)).toFixed(1);
          const avgReb =
            rpgMap.get(item.mvp.id) ??
            (item.mvp.rebounds ? item.mvp.rebounds.toFixed(1) : '8.4');
          const avgAst =
            apgMap.get(item.mvp.id) ??
            (item.mvp.assists ? item.mvp.assists.toFixed(1) : '6.8');
          const g = item.bestGame;

          return {
            conference,
            badge,
            player: {
              id: item.mvp.id,
              name: item.mvp.name,
              jersey: item.mvp.jersey,
              position: item.mvp.position,
              headshot: item.mvp.headshot,
              teamName: item.mvp.teamName,
              teamAbbreviation: item.mvp.teamAbbreviation,
              teamColor: item.mvp.teamColor,
              teamLogo: item.mvp.teamLogo,
            },
            averages: {
              ppg: avgPts,
              rpg: avgReb,
              apg: avgAst,
              rating: item.bestRating.toFixed(1),
              gamesWon: item.wins,
              gamesPlayed: item.gamesMvpCount,
            },
            bestPerformance: {
              matchup: g.shortName,
              date: g.date,
              statLine: item.bestStatLine,
              teamScore: `${g.away.team.abbreviation} ${g.away.score} - ${g.home.score} ${g.home.team.abbreviation}`,
            },
            narrative:
              g.recap?.replace(/^—\s*/, '') ||
              `${item.mvp.name} comandou o ${item.mvp.teamName} com ${item.bestStatLine} e índice de impacto ${item.bestRating.toFixed(1)}, sendo eleito MVP de ${item.gamesMvpCount} partida(s) nos últimos 7 dias.`,
          };
        };

        return {
          weekLabel: leadersData.weekLabel || 'Semana Atual • Temporada Regular',
          overallMvp: toSpotlight(
            overallCandidate,
            'Overall',
            'MVP Geral da Semana NBA',
          ),
          easternPlayer: toSpotlight(
            eastCandidate,
            'Eastern',
            'Jogador da Semana • Conferência Leste',
          ),
          westernPlayer: toSpotlight(
            westCandidate,
            'Western',
            'Jogador da Semana • Conferência Oeste',
          ),
        };
      }
    } catch (error) {
      this.logger.warn(`Fallback activated for Players of the Week: ${String(error)}`);
    }

    return this.getFallbackPlayersOfWeek();
  }

  async getStandings(): Promise<{
    season: string;
    eastern: StandingEntry[];
    western: StandingEntry[];
  }> {
    const url = 'https://site.api.espn.com/apis/v2/sports/basketball/nba/standings';
    try {
      const raw = await this.fetchJsonCached<any>('standings', url, 300_000);
      const children: any[] = raw?.children ?? [];

      const parseConference = (confNode: any): StandingEntry[] => {
        const entries: any[] = confNode?.standings?.entries ?? [];
        const parsed = entries.map((entry) => {
          const teamObj = entry.team ?? {};
          const statsArr: any[] = entry.stats ?? [];
          const getStat = (name: string) =>
            statsArr.find((s) => s.name === name || s.type === name);

          const wins = Number(getStat('wins')?.value ?? 0);
          const losses = Number(getStat('losses')?.value ?? 0);
          const winPctNum = Number(getStat('winPercent')?.value ?? 0);
          const diffVal = Number(getStat('differential')?.value ?? 0);

          return {
            seed: Number(getStat('playoffSeed')?.value ?? 0),
            winPctNum,
            diffVal,
            team: {
              id: String(teamObj.id ?? ''),
              name: String(teamObj.displayName ?? teamObj.name ?? ''),
              shortName: String(teamObj.shortDisplayName ?? teamObj.name ?? ''),
              abbreviation: String(teamObj.abbreviation ?? ''),
              location: String(teamObj.location ?? ''),
              color: '#f97316',
              alternateColor: '#18181b',
              logo:
                teamObj.logos?.[0]?.href ??
                `https://a.espncdn.com/i/teamlogos/nba/500/${String(teamObj.abbreviation || 'nba').toLowerCase()}.png`,
            },
            wins,
            losses,
            winPct: String(getStat('winPercent')?.displayValue ?? '.000'),
            gamesBehind: String(getStat('gamesBehind')?.displayValue ?? '-'),
            homeRecord: String(getStat('Home')?.displayValue ?? '0-0'),
            awayRecord: String(getStat('Road')?.displayValue ?? '0-0'),
            lastTen: String(getStat('Last Ten Games')?.displayValue ?? '0-0'),
            streak: String(getStat('streak')?.displayValue ?? '-'),
            ppg: String(getStat('avgPointsFor')?.displayValue ?? '0.0'),
            oppPpg: String(getStat('avgPointsAgainst')?.displayValue ?? '0.0'),
            diff: String(getStat('differential')?.displayValue ?? '0.0'),
          };
        });

        parsed.sort((a, b) => {
          if (b.winPctNum !== a.winPctNum) return b.winPctNum - a.winPctNum;
          if (b.wins !== a.wins) return b.wins - a.wins;
          return b.diffVal - a.diffVal;
        });

        return parsed.map(({ winPctNum: _w, diffVal: _d, ...rest }, idx) => ({
          ...rest,
          seed: idx + 1,
        }));
      };

      const eastNode =
        children.find((c) => String(c.name).includes('East')) ?? children[0];
      const westNode =
        children.find((c) => String(c.name).includes('West')) ?? children[1];

      return {
        season: String(
          eastNode?.standings?.seasonDisplayName ?? '2026-27',
        ),
        eastern: parseConference(eastNode),
        western: parseConference(westNode),
      };
    } catch (error) {
      this.logger.warn(`Fallback standings used: ${String(error)}`);
      return {
        season: '2026-27',
        eastern: [],
        western: [],
      };
    }
  }

  async getStatLeaders(): Promise<{
    season: string;
    weekLabel: string;
    categories: StatCategoryLeader[];
  }> {
    const url =
      'https://site.web.api.espn.com/apis/site/v3/sports/basketball/nba/leaders';
    try {
      const raw = await this.fetchJsonCached<any>('leaders', url, 300_000);
      const labelTranslations: Record<string, string> = {
        pointsPerGame: 'Pontos por Jogo',
        reboundsPerGame: 'Rebotes por Jogo',
        assistsPerGame: 'Assistências por Jogo',
        stealsPerGame: 'Roubos de Bola por Jogo',
        blocksPerGame: 'Tocos por Jogo',
        fieldGoalPct: 'Aproveitamento de Quadra (FG%)',
        threePointFieldGoalPct: 'Aproveitamento de 3 Pontos (3P%)',
        threePointFieldGoalsMade: 'Bolas de 3 Convertidas',
      };

      const rawCategories: any[] = raw?.leaders?.categories ?? [];
      const categories: StatCategoryLeader[] = rawCategories
        .slice(0, 8)
        .map((cat) => ({
          categoryKey: String(cat.name ?? ''),
          categoryLabel:
            labelTranslations[cat.name] ?? String(cat.displayName ?? cat.name),
          abbreviation: String(cat.abbreviation ?? ''),
          leaders: (cat.leaders ?? []).slice(0, 10).map((item: any, idx: number) => {
            const athlete = item.athlete ?? {};
            const team = item.team ?? {};
            return {
              rank: idx + 1,
              id: String(athlete.id ?? idx),
              name: String(athlete.displayName ?? athlete.fullName ?? ''),
              shortName: String(athlete.shortName ?? athlete.displayName ?? ''),
              jersey: String(athlete.jersey ?? ''),
              position: String(athlete.position?.abbreviation ?? ''),
              headshot:
                athlete.headshot?.href ||
                `https://a.espncdn.com/i/headshots/nba/players/full/${athlete.id}.png`,
              teamName: String(team.displayName ?? team.name ?? ''),
              teamAbbreviation: String(team.abbreviation ?? ''),
              teamColor: `#${String(team.color || 'f97316').replace('#', '')}`,
              teamLogo:
                team.logos?.[0]?.href ||
                `https://a.espncdn.com/i/teamlogos/nba/500/${String(team.abbreviation || 'nba').toLowerCase()}.png`,
              value: Number(item.value ?? 0),
              displayValue: String(item.displayValue ?? ''),
            };
          }),
        }));

      const weekText = raw?.currentSeason?.type?.week?.text;
      return {
        season: String(raw?.currentSeason?.displayName ?? '2026-27'),
        weekLabel: weekText
          ? `${String(weekText).replace('Week', 'Semana')} • Temporada ${raw?.currentSeason?.displayName ?? '2026-27'}`
          : 'Temporada Regular 2026-27',
        categories,
      };
    } catch (error) {
      this.logger.warn(`Fallback leaders used: ${String(error)}`);
      return {
        season: '2026-27',
        weekLabel: 'Temporada Regular',
        categories: [],
      };
    }
  }

  async getGameDetail(eventId: string): Promise<GameDetailResponse> {
    const cleanId = eventId.replace(/[^0-9]/g, '');
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${cleanId}`;
    const raw = await this.fetchJsonCached<any>(`summary:${cleanId}`, url, 120_000);

    const boxTeams: any[] = raw?.boxscore?.teams ?? [];
    const awayBoxTeam =
      boxTeams.find((t) => t.homeAway === 'away') ?? boxTeams[0] ?? {};
    const homeBoxTeam =
      boxTeams.find((t) => t.homeAway === 'home') ?? boxTeams[1] ?? {};

    const comparisonMetrics = [
      { key: 'fieldGoalsMade-fieldGoalsAttempted', label: 'Arremessos (FG)' },
      { key: 'fieldGoalPct', label: 'Aproveitamento FG%' },
      { key: 'threePointFieldGoalsMade-threePointFieldGoalsAttempted', label: 'Bolas de 3 (3PT)' },
      { key: 'threePointFieldGoalPct', label: 'Aproveitamento 3P%' },
      { key: 'freeThrowsMade-freeThrowsAttempted', label: 'Lances Livres (FT)' },
      { key: 'totalRebounds', label: 'Rebotes Totais' },
      { key: 'assists', label: 'Assistências' },
      { key: 'steals', label: 'Roubos de Bola' },
      { key: 'blocks', label: 'Tocos' },
      { key: 'pointsInPaint', label: 'Pontos no Garrafão' },
      { key: 'fastBreakPoints', label: 'Pontos de Contra-Ataque' },
      { key: 'largestLead', label: 'Maior Liderança' },
    ];

    const findTeamStat = (teamNode: any, key: string) =>
      String(
        (teamNode?.statistics ?? []).find((s: any) => s.name === key)
          ?.displayValue ?? '-',
      );

    const teamComparison = comparisonMetrics.map((m) => ({
      key: m.key,
      label: m.label,
      awayValue: findTeamStat(awayBoxTeam, m.key),
      homeValue: findTeamStat(homeBoxTeam, m.key),
    }));

    const boxPlayers: any[] = raw?.boxscore?.players ?? [];
    const boxscore = boxPlayers.map((group, idx) => {
      const t = group.team ?? {};
      const statBlock = group.statistics?.[0] ?? {};
      const homeAway: 'home' | 'away' =
        t.id === homeBoxTeam?.team?.id || idx === 1 ? 'home' : 'away';

      return {
        homeAway,
        team: {
          id: String(t.id ?? ''),
          name: String(t.displayName ?? t.name ?? ''),
          shortName: String(t.shortDisplayName ?? t.name ?? ''),
          abbreviation: String(t.abbreviation ?? ''),
          location: String(t.location ?? ''),
          color: `#${String(t.color || 'f97316').replace('#', '')}`,
          alternateColor: `#${String(t.alternateColor || '18181b').replace('#', '')}`,
          logo:
            t.logo ||
            `https://a.espncdn.com/i/teamlogos/nba/500/${String(t.abbreviation || 'nba').toLowerCase()}.png`,
        },
        labels: (statBlock.labels ?? []) as string[],
        totals: (statBlock.totals ?? []) as string[],
        players: (statBlock.athletes ?? []).map((a: any) => ({
          id: String(a.athlete?.id ?? ''),
          name: String(a.athlete?.displayName ?? ''),
          shortName: String(a.athlete?.shortName ?? ''),
          headshot:
            a.athlete?.headshot?.href ||
            `https://a.espncdn.com/i/headshots/nba/players/full/${a.athlete?.id}.png`,
          jersey: String(a.athlete?.jersey ?? ''),
          position: String(a.athlete?.position?.abbreviation ?? ''),
          starter: Boolean(a.starter),
          didNotPlay: Boolean(a.didNotPlay),
          reason: a.reason ? String(a.reason) : undefined,
          stats: (a.stats ?? []) as string[],
        })),
      };
    });

    const venue = raw?.gameInfo?.venue ?? {};
    return {
      id: cleanId,
      venue: {
        name: String(venue.fullName ?? 'NBA Arena'),
        city: String(venue.address?.city ?? ''),
        state: String(venue.address?.state ?? ''),
        image: venue.images?.[0]?.href,
        attendance: raw?.gameInfo?.attendance
          ? Number(raw.gameInfo.attendance)
          : undefined,
      },
      officials: (raw?.gameInfo?.officials ?? []).map((o: any) =>
        String(o.displayName ?? o.fullName ?? ''),
      ),
      seriesSummary: raw?.seasonseries?.[0]?.summary,
      teamComparison,
      boxscore,
    };
  }

  async getNews() {
    const url =
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=6';
    try {
      const raw = await this.fetchJsonCached<any>('news', url, 180_000);
      return (raw?.articles ?? []).map((art: any, idx: number) => ({
        id: String(art.dataSourceIdentifier ?? idx),
        headline: String(art.headline ?? ''),
        description: String(art.description ?? ''),
        published: String(art.published ?? ''),
        image: art.images?.[0]?.url ?? null,
        link: art.links?.web?.href ?? 'https://www.nba.com',
      }));
    } catch {
      return [];
    }
  }

  async getOverview() {
    const [todayBoard, recent, playersOfWeek, standings, leaders, news] =
      await Promise.all([
        this.getScoreboardByDate(),
        this.getRecentGamesAndMvps(5),
        this.getPlayersOfTheWeek(),
        this.getStandings(),
        this.getStatLeaders(),
        this.getNews(),
      ]);

    return {
      season: todayBoard.seasonDisplay,
      todayDate: todayBoard.date,
      todayGames: todayBoard.games,
      recentGames: recent.games.slice(0, 8),
      mvpShowcase: recent.mvpShowcase.slice(0, 6),
      playersOfWeek,
      topStandings: {
        eastern: standings.eastern.slice(0, 6),
        western: standings.western.slice(0, 6),
      },
      topLeaders: leaders.categories.slice(0, 3),
      news,
      historyPreview: {
        heroStats: NBA_HISTORY_DATA.heroStats,
        featuredEras: NBA_HISTORY_DATA.eras.slice(0, 4),
        featuredLegends: NBA_HISTORY_DATA.legends.slice(0, 4),
      },
    };
  }

  getHistory() {
    return NBA_HISTORY_DATA;
  }

  private getFallbackGames(): NbaGame[] {
    return [
      {
        id: '401909881',
        date: new Date().toISOString(),
        name: 'Boston Celtics at Los Angeles Lakers',
        shortName: 'BOS @ LAL',
        status: 'final',
        statusDetail: 'Final',
        period: 4,
        clock: '0:00',
        venue: { name: 'Crypto.com Arena', city: 'Los Angeles', state: 'CA' },
        broadcast: 'ESPN',
        headline: 'Luka Doncic brilha no clássico histórico entre Lakers e Celtics',
        home: {
          team: {
            id: '13',
            name: 'Los Angeles Lakers',
            shortName: 'Lakers',
            abbreviation: 'LAL',
            location: 'Los Angeles',
            color: '#552583',
            alternateColor: '#fdb927',
            logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
            record: '4-1',
          },
          score: 124,
          winner: true,
          homeAway: 'home',
          linescores: [32, 29, 31, 32],
          stats: { fieldGoalPct: '51.2', threePointPct: '41.0', rebounds: '46', assists: '29' },
          leaders: {},
        },
        away: {
          team: {
            id: '2',
            name: 'Boston Celtics',
            shortName: 'Celtics',
            abbreviation: 'BOS',
            location: 'Boston',
            color: '#007a33',
            alternateColor: '#ba9653',
            logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
            record: '4-1',
          },
          score: 118,
          winner: false,
          homeAway: 'away',
          linescores: [28, 31, 30, 29],
          stats: { fieldGoalPct: '47.8', threePointPct: '38.6', rebounds: '42', assists: '27' },
          leaders: {},
        },
        mvp: {
          id: '3945274',
          name: 'Luka Dončić',
          shortName: 'L. Dončić',
          headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3945274.png',
          jersey: '77',
          position: 'G',
          teamAbbreviation: 'LAL',
          teamName: 'Los Angeles Lakers',
          teamColor: '#552583',
          teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
          statLine: '36 PTS, 10 REB, 11 AST',
          rating: 58.4,
          points: 36,
          rebounds: 10,
          assists: 11,
        },
      },
    ];
  }

  private getFallbackPlayersOfWeek() {
    return {
      weekLabel: 'Semana em Destaque • Temporada Regular NBA',
      overallMvp: {
        conference: 'Overall' as const,
        badge: 'MVP Geral da Semana NBA',
        player: {
          id: '3945274',
          name: 'Luka Dončić',
          jersey: '77',
          position: 'G',
          headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3945274.png',
          teamName: 'Los Angeles Lakers',
          teamAbbreviation: 'LAL',
          teamColor: '#552583',
          teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
        },
        averages: {
          ppg: '36.0',
          rpg: '9.5',
          apg: '9.8',
          rating: '58.4',
          gamesWon: 3,
          gamesPlayed: 4,
        },
        bestPerformance: {
          matchup: 'BOS @ LAL',
          date: new Date().toISOString(),
          statLine: '36 PTS, 10 REB, 11 AST',
          teamScore: 'BOS 118 - 124 LAL',
        },
        narrative:
          'Dominando o perímetro e o ritmo ofensivo em Los Angeles, Luka lidera a NBA em pontuação com eficiência cirúrgica nos momentos decisivos.',
      },
      easternPlayer: {
        conference: 'Eastern' as const,
        badge: 'Jogador da Semana • Conferência Leste',
        player: {
          id: '3032977',
          name: 'Giannis Antetokounmpo',
          jersey: '7',
          position: 'F',
          headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3032977.png',
          teamName: 'Miami Heat',
          teamAbbreviation: 'MIA',
          teamColor: '#98002e',
          teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
        },
        averages: {
          ppg: '29.4',
          rpg: '14.2',
          apg: '6.1',
          rating: '50.7',
          gamesWon: 2,
          gamesPlayed: 3,
        },
        bestPerformance: {
          matchup: 'MIA @ ATL',
          date: new Date().toISOString(),
          statLine: '24 PTS, 18 REB',
          teamScore: 'MIA 129 - 117 ATL',
        },
        narrative:
          'Imparável em transição e dominante nos dois garrafões, comandou a vitória fora de casa com duplo-duplo monstruoso de 24 pontos e 18 rebotes.',
      },
      westernPlayer: {
        conference: 'Western' as const,
        badge: 'Jogador da Semana • Conferência Oeste',
        player: {
          id: '4594268',
          name: 'Anthony Edwards',
          jersey: '5',
          position: 'G',
          headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/4594268.png',
          teamName: 'Minnesota Timberwolves',
          teamAbbreviation: 'MIN',
          teamColor: '#266092',
          teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
        },
        averages: {
          ppg: '33.2',
          rpg: '6.3',
          apg: '5.4',
          rating: '53.1',
          gamesWon: 3,
          gamesPlayed: 4,
        },
        bestPerformance: {
          matchup: 'MIN @ DEN',
          date: new Date().toISOString(),
          statLine: '38 PTS, 7 REB, 6 AST',
          teamScore: 'MIN 119 - 114 DEN',
        },
        narrative:
          'Explosão atlética e bolas triplas letais colocam Ant-Man entre os cestinhas absolutos da temporada no Oeste.',
      },
    };
  }
}
