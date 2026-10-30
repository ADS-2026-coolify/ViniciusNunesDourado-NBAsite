import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { NbaModule } from './nba/nba.module.js';

@Module({
  imports: [NbaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
