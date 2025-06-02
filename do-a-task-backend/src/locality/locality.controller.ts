import { Controller, Post, Body, Put, Get, Param } from '@nestjs/common';
import { LocalityService } from './locality.service';
import { CreateLocalityDto } from './dto/locality.dto';


@Controller('locality')
export class LocalityController {
    constructor(private LocalityService: LocalityService) {}


}