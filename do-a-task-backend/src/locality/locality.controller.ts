import { Controller, Post, Body, Put, Get, Param } from '@nestjs/common';
import { LocalityService } from './locality.service';
import { CreateLocalityDto } from './dto/locality.dto';


@Controller('locality')
export class LocalityController {
    constructor(private LocalityService: LocalityService) {}

    @Post("createLocality")
    async createLocality(@Body() dto: CreateLocalityDto, localityId: number) {
      // Criação da tarefa usando o serviço
      const task = await this.LocalityService.createLocality(dto);
      
      // Retorna o status e os dados da tarefa criada
      return {
        task,               // Tarefa criada
      };
    }

      @Get(':id')
      async getCommunityData(@Param('id') id:string){
        const community = parseInt(id);
        return this.LocalityService.getLocalityData(community);
      }
}