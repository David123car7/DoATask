import { Controller, Post, Body, Put, Get, Param, Req, UseGuards, Res, Delete} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto, EnterExitCommunityDto} from './dto/community.dto';
import { RequestWithUser } from '../auth/types/jwt-payload.type';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { Response } from 'express';

@Controller('community')
export class CommunityController {
    constructor(private communityService: CommunityService) {}

    @Post("createCommunity")
    @UseGuards(JwtAuthGuard)
    async createTask(@Body() dto: CreateCommunityDto, @Req() req: RequestWithUser ,@Res() res: Response) {
      await this.communityService.createCommunity(dto, req.user.sub);
      return res.json({ message: 'Communitie created'});
    }

    @Post("enterCommunity")
    @UseGuards(JwtAuthGuard)
    async UserEnterCommunity(@Body() dto: EnterExitCommunityDto,@Res() res: Response, @Req() req: RequestWithUser){
      const data = await this.communityService.UserEnterCommunity(req.user.sub, dto.communityName)
      return res.json({ message: 'User entered community'});
    }

    
    @Delete("exitCommunity")
    @UseGuards(JwtAuthGuard)
    async ExitCommunity(@Body() dto: EnterExitCommunityDto, @Req() req: RequestWithUser, @Res() res: Response){
      await this.communityService.ExitCommunity(req.user.sub, dto.communityName)
      return res.json({ message: 'Exit community successful'});
    }

    @Get("getUserCommunities")
    @UseGuards(JwtAuthGuard)
    async GetUserCommunity(@Req() req: RequestWithUser, @Res() res: Response){
      const data = await this.communityService.GetUserCommunities(req.user.sub)
      return res.json({ message: 'Communities get successful', communities: data.communities, membersCount: data.membersCount});
    }

    @Get("getUserCommunitiesNames")
    @UseGuards(JwtAuthGuard)
    async GetUserCommunityNames(@Req() req: RequestWithUser, @Res() res: Response){
      const communities = await this.communityService.GetUserCommunitiesNames(req.user.sub)
      return res.json({ message: 'Communities names get successful', communities: communities});
    }

    @Get("getAllCommunities")
    @UseGuards(JwtAuthGuard)
    async GetAllCommunity(@Res() res: Response, @Req() req: RequestWithUser){
      const data = await this.communityService.GetAllCommunitiesWithLocality(req.user.sub)
      return res.json({ message: 'Communities get successful', communities: data.communities, membersCount: data.membersCount});
    }

    @Get("membersCount")
    @UseGuards(JwtAuthGuard)
    async GetMembersCount(){

    }

}