import { Controller, Get, Post, UseGuards, Res, Req} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard} from "../auth/guard/jwt.auth.guard";
import { Response } from "express";
import {RequestWithUser} from '../auth/types/jwt-payload.type'

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('getUser')
  @UseGuards(JwtAuthGuard)
  async getUserData(@Req() req: RequestWithUser, @Res() res: Response) {
    const userData = await this.userService.getUserData(req.user.email)
    return res.json({ message: 'User was found', 
      user: {
        name: userData.user.name,
        email: userData.user.email,
        birthDate: userData.user.birthDate,
      },
      contact: { 
        number: userData.contact.number
      }
    });
  }
}
