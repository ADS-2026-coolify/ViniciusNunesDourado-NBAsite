export interface TeamSummary {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  location: string;
  color: string;
  alternateColor: string;
  logo: string;
  record?: string;
  homeRecord?: string;
  awayRecord?: string;
}

export interface PlayerLeader {
  id: string;
  name: string;
  shortName: string;
  headshot: string;
  jersey: string;
  position: string;
  teamId?: string;
  teamAbbreviation?: string;
  teamColor?: string;
  teamLogo?: string;
  statLabel: string;
  displayValue: string;
  value: number;
}

export interface GameMvp {
  id: string;
  name: string;
  shortName: string;
  headshot: string;
  jersey: string;
  position: string;
  teamAbbreviation: string;
  teamName: string;
  teamColor: string;
  teamLogo: string;
  statLine: string;
  rating: number;
  points?: number;
  rebounds?: number;
  assists?: number;
}

export interface TeamGameSide {
  team: TeamSummary;
  score: number;
  winner: boolean;
  homeAway: "home" | "away";
  linescores: number[];
  stats: Record<string, string>;
  leaders: {
    points?: PlayerLeader;
    rebounds?: PlayerLeader;
    assists?: PlayerLeader;
  };
}

export interface NbaGame {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: "scheduled" | "live" | "final";
  statusDetail: string;
  period: number;
  clock: string;
  venue: {
    name: string;
    city: string;
    state: string;
  };
  broadcast: string;
  attendance?: number;
  headline?: string;
  recap?: string;
  highlightThumbnail?: string;
  home: TeamGameSide;
  away: TeamGameSide;
  mvp: GameMvp | null;
}

export interface WeeklyPlayerSpotlight {
  conference: "Overall" | "Eastern" | "Western";
  badge: string;
  player: {
    id: string;
    name: string;
    jersey: string;
    position: string;
    headshot: string;
    teamName: string;
    teamAbbreviation: string;
    teamColor: string;
    teamLogo: string;
  };
  averages: {
    ppg: string;
    rpg: string;
    apg: string;
    rating: string;
    gamesWon: number;
    gamesPlayed: number;
  };
  bestPerformance: {
    matchup: string;
    date: string;
    statLine: string;
    teamScore: string;
  };
  narrative: string;
}

export interface StandingEntry {
  seed: number;
  team: TeamSummary;
  wins: number;
  losses: number;
  winPct: string;
  gamesBehind: string;
  homeRecord: string;
  awayRecord: string;
  lastTen: string;
  streak: string;
  ppg: string;
  oppPpg: string;
  diff: string;
}

export interface StatCategoryLeader {
  categoryKey: string;
  categoryLabel: string;
  abbreviation: string;
  leaders: Array<{
    rank: number;
    id: string;
    name: string;
    shortName: string;
    jersey: string;
    position: string;
    headshot: string;
    teamName: string;
    teamAbbreviation: string;
    teamColor: string;
    teamLogo: string;
    value: number;
    displayValue: string;
  }>;
}

export interface MvpShowcaseItem {
  gameId: string;
  date: string;
  matchup: string;
  finalScore: string;
  venue: string;
  headline?: string;
  mvp: GameMvp;
}

export interface GameDetailResponse {
  id: string;
  venue: {
    name: string;
    city: string;
    state: string;
    image?: string;
    attendance?: number;
  };
  officials: string[];
  seriesSummary?: string;
  teamComparison: Array<{
    label: string;
    key: string;
    awayValue: string;
    homeValue: string;
  }>;
  boxscore: Array<{
    team: TeamSummary;
    homeAway: "home" | "away";
    labels: string[];
    totals: string[];
    players: Array<{
      id: string;
      name: string;
      shortName: string;
      headshot: string;
      jersey: string;
      position: string;
      starter: boolean;
      didNotPlay: boolean;
      reason?: string;
      stats: string[];
    }>;
  }>;
}

export interface NbaEra {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  accentColor: string;
  definingStat: { value: string; label: string };
  summary: string;
  fullStory: string;
  milestones: string[];
  icons: string[];
}

export interface NbaLegend {
  id: string;
  name: string;
  nickname: string;
  era: string;
  jersey: string;
  position: string;
  primaryTeam: string;
  teamAbbreviation: string;
  teamLogo: string;
  accentColor: string;
  headshot?: string;
  titles: number;
  mvps: number;
  finalsMvps: number;
  allStars: number;
  stats: {
    ppg: string;
    rpg: string;
    apg: string;
  };
  signatureMove: string;
  quote: string;
  bio: string;
}

export interface NbaDynasty {
  id: string;
  franchise: string;
  abbreviation: string;
  logo: string;
  color: string;
  titles: number;
  years: string[];
  definingLegends: string[];
  legacy: string;
}

export interface NbaRecord {
  id: string;
  category: "Jogo Único" | "Temporada" | "Carreira" | "Franquia";
  value: string;
  title: string;
  holder: string;
  team: string;
  dateOrSpan: string;
  context: string;
}

export interface NbaTriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NbaHistoryPayload {
  heroStats: Array<{ label: string; value: string; detail: string }>;
  courtEvolution: Array<{ year: string; title: string; description: string }>;
  eras: NbaEra[];
  legends: NbaLegend[];
  dynasties: NbaDynasty[];
  records: NbaRecord[];
  trivia: NbaTriviaQuestion[];
}

export interface OverviewResponse {
  season: string;
  todayDate: string;
  todayGames: NbaGame[];
  recentGames: NbaGame[];
  mvpShowcase: MvpShowcaseItem[];
  playersOfWeek: {
    weekLabel: string;
    overallMvp: WeeklyPlayerSpotlight;
    easternPlayer: WeeklyPlayerSpotlight;
    westernPlayer: WeeklyPlayerSpotlight;
  };
  topStandings: {
    eastern: StandingEntry[];
    western: StandingEntry[];
  };
  topLeaders: StatCategoryLeader[];
  news: Array<{
    id: string;
    headline: string;
    description: string;
    published: string;
    image: string | null;
    link: string;
  }>;
  historyPreview: {
    heroStats: Array<{ label: string; value: string; detail: string }>;
    featuredEras: NbaEra[];
    featuredLegends: NbaLegend[];
  };
}
