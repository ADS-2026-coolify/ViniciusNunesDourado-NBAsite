import { NbaService } from './nba.service.js';
export declare class NbaController {
    private readonly nbaService;
    constructor(nbaService: NbaService);
    getOverview(): Promise<{
        season: string;
        todayDate: string;
        todayGames: import("./nba.types.js").NbaGame[];
        recentGames: import("./nba.types.js").NbaGame[];
        mvpShowcase: {
            gameId: string;
            date: string;
            matchup: string;
            finalScore: string;
            venue: string;
            headline: string | undefined;
            mvp: import("./nba.types.js").GameMvp;
        }[];
        playersOfWeek: {
            weekLabel: string;
            overallMvp: import("./nba.types.js").WeeklyPlayerSpotlight;
            easternPlayer: import("./nba.types.js").WeeklyPlayerSpotlight;
            westernPlayer: import("./nba.types.js").WeeklyPlayerSpotlight;
        };
        topStandings: {
            eastern: import("./nba.types.js").StandingEntry[];
            western: import("./nba.types.js").StandingEntry[];
        };
        topLeaders: import("./nba.types.js").StatCategoryLeader[];
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
    getScoreboard(date?: string): Promise<{
        date: string;
        seasonDisplay: string;
        calendarDates: string[];
        games: import("./nba.types.js").NbaGame[];
    }>;
    getCalendarWindow(date?: string, past?: string, future?: string): Promise<{
        centerDate: string;
        seasonDisplay: string;
        calendarDates: string[];
        days: {
            date: string;
            totalGames: number;
            liveGames: number;
            finalGames: number;
            games: import("./nba.types.js").NbaGame[];
        }[];
    }>;
    getRecentGames(days?: string): Promise<{
        games: import("./nba.types.js").NbaGame[];
        mvpShowcase: {
            gameId: string;
            date: string;
            matchup: string;
            finalScore: string;
            venue: string;
            headline: string | undefined;
            mvp: import("./nba.types.js").GameMvp;
        }[];
    }>;
    getPlayersOfTheWeek(): Promise<{
        weekLabel: string;
        overallMvp: import("./nba.types.js").WeeklyPlayerSpotlight;
        easternPlayer: import("./nba.types.js").WeeklyPlayerSpotlight;
        westernPlayer: import("./nba.types.js").WeeklyPlayerSpotlight;
    }>;
    getStandings(): Promise<{
        season: string;
        eastern: import("./nba.types.js").StandingEntry[];
        western: import("./nba.types.js").StandingEntry[];
    }>;
    getLeaders(): Promise<{
        season: string;
        weekLabel: string;
        categories: import("./nba.types.js").StatCategoryLeader[];
    }>;
    getGameDetail(id: string): Promise<import("./nba.types.js").GameDetailResponse>;
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
    getNews(): Promise<any>;
}
