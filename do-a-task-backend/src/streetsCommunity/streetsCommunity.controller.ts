import { Controller, Post, Body, Put, Get, Param } from '@nestjs/common';
import { StreetsCommunityService } from './streetsCommunity.service';

@Controller('streetsCommunity')
export class StreetsCommunityController {
    constructor(private communityService: StreetsCommunityService) {}

    @Post('addstreetsCommunity')
    async createTask(@Body() body: { communityId: number, streets: string[] }) {
      const { communityId, streets } = body;
      // Criação da tarefa usando o serviço
      const task = await this.communityService.addStreets(communityId, streets);
      return task;
    }
}