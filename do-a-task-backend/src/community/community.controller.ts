import { Controller, Post, Body, Put, Get, Param } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/community.dto';

@Controller('community')
export class CommunityController {
    constructor(private communityService: CommunityService) {}

    @Post("createCommunity")
    async createTask(@Body() dto: CreateCommunityDto/*, localityId: number*/) {
      // Criação da tarefa usando o serviço
      const task = await this.communityService.createCommunity(dto/*, localityId*/);
      
      // Retorna o status e os dados da tarefa criada
      return {
        status: 'success',  // Corrigido o typo para "success"
        task,               // Tarefa criada
      };
    }

    @Post("addStreetCommunity")
    async addStreet(@Body() dto: CreateCommunityDto/*, localityId: number*/) {
      // Criação da tarefa usando o serviço
      const task = await this.communityService.addAdrresses(dto/*, localityId*/);
      
      // Retorna o status e os dados da tarefa criada
      return {
        status: 'success',  // Corrigido o typo para "success"
        task,               // Tarefa criada
      };
    }


    @Get(':id')
    async getCommunityData(@Param('id') id:string){
      const community = parseInt(id);
      return this.communityService.getDataCommunity(community)
    }

}