import { Controller, Get, UseGuards, Req, Post, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user-decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

    @Get("me")
    getMe(@GetUser() user: User){
        return user;
    }
}
