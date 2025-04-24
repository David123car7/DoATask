import { Body, Controller, Get, Post , Query, Req, Res, UseGuards} from "@nestjs/common";
import { MemberService } from "./member.service";
import { Response } from "express";
import { RequestWithUser } from "../auth/types/jwt-payload.type";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";

@Controller("member")
export class MemberController {
    constructor(private memberService: MemberService) {}

    @Get("getMemberCoins")
    @UseGuards(JwtAuthGuard)
    async GetMemberCoins(@Query('communityName') communityName: string,@Req() req: RequestWithUser, @Res() res: Response){
        const memberCoins = await this.memberService.GetMemberCoins(req.user.sub, communityName)
        return res.json({message: "Member Coins was found", memberCoins: memberCoins})
    }
}