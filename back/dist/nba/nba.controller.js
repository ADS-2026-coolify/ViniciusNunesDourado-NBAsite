var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, Query } from '@nestjs/common';
import { NbaService } from './nba.service.js';
let NbaController = class NbaController {
    nbaService;
    constructor(nbaService) {
        this.nbaService = nbaService;
    }
    getOverview() {
        return this.nbaService.getOverview();
    }
    getScoreboard(date) {
        return this.nbaService.getScoreboardByDate(date);
    }
    getCalendarWindow(date, past, future) {
        const pastDays = Math.min(7, Math.max(0, Number(past ?? 3)));
        const futureDays = Math.min(7, Math.max(0, Number(future ?? 4)));
        return this.nbaService.getScheduleWindow(date, pastDays, futureDays);
    }
    getRecentGames(days) {
        const parsedDays = Math.min(10, Math.max(1, Number(days ?? 6)));
        return this.nbaService.getRecentGamesAndMvps(parsedDays);
    }
    getPlayersOfTheWeek() {
        return this.nbaService.getPlayersOfTheWeek();
    }
    getStandings() {
        return this.nbaService.getStandings();
    }
    getLeaders() {
        return this.nbaService.getStatLeaders();
    }
    getGameDetail(id) {
        return this.nbaService.getGameDetail(id);
    }
    getHistory() {
        return this.nbaService.getHistory();
    }
    getNews() {
        return this.nbaService.getNews();
    }
};
__decorate([
    Get('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getOverview", null);
__decorate([
    Get('scoreboard'),
    __param(0, Query('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getScoreboard", null);
__decorate([
    Get('calendar'),
    __param(0, Query('date')),
    __param(1, Query('past')),
    __param(2, Query('future')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getCalendarWindow", null);
__decorate([
    Get('recent-games'),
    __param(0, Query('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getRecentGames", null);
__decorate([
    Get('players-of-week'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getPlayersOfTheWeek", null);
__decorate([
    Get('standings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getStandings", null);
__decorate([
    Get('leaders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getLeaders", null);
__decorate([
    Get('games/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getGameDetail", null);
__decorate([
    Get('history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getHistory", null);
__decorate([
    Get('news'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NbaController.prototype, "getNews", null);
NbaController = __decorate([
    Controller('nba'),
    __metadata("design:paramtypes", [NbaService])
], NbaController);
export { NbaController };
//# sourceMappingURL=nba.controller.js.map