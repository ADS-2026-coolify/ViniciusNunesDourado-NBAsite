import type { GameDetailResponse, GameMvp, NbaGame, StandingEntry, StatCategoryLeader, WeeklyPlayerSpotlight } from './nba.types.js';
export declare class NbaService {
    private readonly logger;
    private readonly cache;
    private formatYmd;
    private normalizeDateParam;
    private shiftYmd;
    private fetchJsonCached;
    private parseTeamSummary;
    private extractLeader;
    private parseTeamSide;
    private computeGameMvp;
    private parseEventToGame;
    getScoreboardByDate(dateParam?: string): Promise<{
        date: string;
        seasonDisplay: string;
        calendarDates: string[];
        games: NbaGame[];
    }>;
    getScheduleWindow(centerDate?: string, pastDays?: number, futureDays?: number): Promise<{
        centerDate: string;
        seasonDisplay: string;
        calendarDates: string[];
        days: {
            date: string;
            totalGames: number;
            liveGames: number;
            finalGames: number;
            games: NbaGame[];
        }[];
    }>;
    getRecentGamesAndMvps(days?: number): Promise<{
        games: NbaGame[];
        mvpShowcase: {
            gameId: string;
            date: string;
            matchup: string;
            finalScore: string;
            venue: string;
            headline: string | undefined;
            mvp: GameMvp;
        }[];
    }>;
    getPlayersOfTheWeek(): Promise<{
        weekLabel: string;
        overallMvp: WeeklyPlayerSpotlight;
        easternPlayer: WeeklyPlayerSpotlight;
        westernPlayer: WeeklyPlayerSpotlight;
    }>;
    getStandings(): Promise<{
        season: string;
        eastern: StandingEntry[];
        western: StandingEntry[];
    }>;
    getStatLeaders(): Promise<{
        season: string;
        weekLabel: string;
        categories: StatCategoryLeader[];
    }>;
    getGameDetail(eventId: string): Promise<GameDetailResponse>;
    getNews(): Promise<any>;
    getOverview(): Promise<{
        season: string;
        todayDate: string;
        todayGames: NbaGame[];
        recentGames: NbaGame[];
        mvpShowcase: {
            gameId: string;
            date: string;
            matchup: string;
            finalScore: string;
            venue: string;
            headline: string | undefined;
            mvp: GameMvp;
        }[];
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
        news: any;
        historyPreview: {
            heroStats: {
                label: string;
                value: string;
                detail: string;
            }[];
            featuredEras: import("./nba-history.data.js").NbaEra[];
            featuredLegends: import("./nba-history.data.js").NbaLegend[];
        };
    }>;
    getHistory(): {
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
        eras: import("./nba-history.data.js").NbaEra[];
        legends: import("./nba-history.data.js").NbaLegend[];
        dynasties: import("./nba-history.data.js").NbaDynasty[];
        records: import("./nba-history.data.js").NbaRecord[];
        trivia: import("./nba-history.data.js").NbaTriviaQuestion[];
    };
    private getFallbackGames;
    private getFallbackPlayersOfWeek;
}
