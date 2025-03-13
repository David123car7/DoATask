import { Controller, Get, UseGuards, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator/get-user-decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

    @Get("me")
    getMe(@GetUser("email") user: User){
        return user;
    }
}
