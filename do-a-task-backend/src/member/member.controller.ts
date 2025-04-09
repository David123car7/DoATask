import { Body, Controller, Post } from "@nestjs/common";
import { MemberService } from "./member.service";


@Controller("member")
export class MemberController {
    constructor(private memberService: MemberService) {}

    @Post("createMember")
    async createAdrress(/*userId: number, addressId:number,communityId:number*/ ){

        const createAdrress = await this.memberService.createMember(/*userId,addressId,communityId*/)

        return createAdrress;
    }

}