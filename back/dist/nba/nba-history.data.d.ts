export interface NbaEra {
    id: string;
    period: string;
    title: string;
    subtitle: string;
    accentColor: string;
    definingStat: {
        value: string;
        label: string;
    };
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
    category: 'Jogo Único' | 'Temporada' | 'Carreira' | 'Franquia';
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
export declare const NBA_HISTORY_DATA: {
    heroStats: {
        label: string;
        value: string;
        detail: string;
    }[];
    courtEvolution: {
        year: string;
        title: string;
        description: string;
    }[];
    eras: NbaEra[];
    legends: NbaLegend[];
    dynasties: NbaDynasty[];
    records: NbaRecord[];
    trivia: NbaTriviaQuestion[];
};
