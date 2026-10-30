import { Controller, Get, Param, Query } from '@nestjs/common';
import { NbaService } from './nba.service.js';

@Controller('nba')
export class NbaController {
  constructor(private readonly nbaService: NbaService) {}

  @Get('overview')
  getOverview() {
    return this.nbaService.getOverview();
  }

  @Get('scoreboard')
  getScoreboard(@Query('date') date?: string) {
    return this.nbaService.getScoreboardByDate(date);
  }

  @Get('calendar')
  getCalendarWindow(
    @Query('date') date?: string,
    @Query('past') past?: string,
    @Query('future') future?: string,
  ) {
    const pastDays = Math.min(7, Math.max(0, Number(past ?? 3)));
    const futureDays = Math.min(7, Math.max(0, Number(future ?? 4)));
    return this.nbaService.getScheduleWindow(date, pastDays, futureDays);
  }

  @Get('recent-games')
  getRecentGames(@Query('days') days?: string) {
    const parsedDays = Math.min(10, Math.max(1, Number(days ?? 6)));
    return this.nbaService.getRecentGamesAndMvps(parsedDays);
  }

  @Get('players-of-week')
  getPlayersOfTheWeek() {
    return this.nbaService.getPlayersOfTheWeek();
  }

  @Get('standings')
  getStandings() {
    return this.nbaService.getStandings();
  }

  @Get('leaders')
  getLeaders() {
    return this.nbaService.getStatLeaders();
  }

  @Get('games/:id')
  getGameDetail(@Param('id') id: string) {
    return this.nbaService.getGameDetail(id);
  }

  @Get('history')
  getHistory() {
    return this.nbaService.getHistory();
  }

  @Get('news')
  getNews() {
    return this.nbaService.getNews();
  }
}
