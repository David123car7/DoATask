import { Controller, Query, HttpStatus, Req, Res, Get, HttpException} from '@nestjs/common';
import { RequestWithUser } from '../auth/types/jwt-payload.type';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { Response } from 'express';
import { RankService } from './rank.service';
import { UseGuards } from '@nestjs/common';


@Controller('rank')
export class RankController {
    constructor(private rankService: RankService) {}

    @Get('getRankByCommunity')
    @UseGuards(JwtAuthGuard)
    async GetRankCommunity(@Query('communityName') communityName: string,@Res() res: Response) {
      console.log('Received communityName in backend:', communityName); 
      if (!communityName) {
        throw new HttpException("Community name is required", HttpStatus.BAD_REQUEST)
      }
      const rank = await this.rankService.getRankCommunity(communityName)
      return res.json({ message: 'Rank Found', rank: rank/*, user:rank.user*/});
    }

    @Get('getPointsMember')
    @UseGuards(JwtAuthGuard)
    async GetPointsMember(@Query('communityName') communityName: string,@Req() req: RequestWithUser ,@Res() res: Response) {
      console.log('Received communityName in backend:', communityName); 
      if (!communityName) {
        throw new HttpException("Community name is required", HttpStatus.BAD_REQUEST)
      }
      const pointsMember = await this.rankService.getUserPoints(req.user.sub,communityName)
      return res.json({ message: 'Rank Found', pointsMember: pointsMember.pointsMember});
    }
}
