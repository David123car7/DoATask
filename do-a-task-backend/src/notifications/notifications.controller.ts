import { Controller, Post, Body, Get, UseGuards, Req, Res} from '@nestjs/common';
import { NotificationsService} from './notifications.service';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { RequestWithUser } from '../auth/types/jwt-payload.type';
import { Response } from "express";

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  sendNotification(@Body() body: {userId: string, message: string}) {
    this.notificationsService.sendToUser(body.userId, body.message);
  }

  @Get("getNotifications")
  @UseGuards(JwtAuthGuard)
  async getNotifications(@Req() req: RequestWithUser, @Res() res: Response){
    const data = await this.notificationsService.getNotifications(req.user.sub)
    return res.json({message: "Notifications found", notifications: data})
  }

  @Get("getAllNotifications")
  @UseGuards(JwtAuthGuard)
  async getAllNotifications(@Req() req: RequestWithUser, @Res() res: Response){
    const data = await this.notificationsService.getAllNotifications(req.user.sub)
    return res.json({message: "Notifications found", notifications: data})
  }

  @Get("countNotifications")
  @UseGuards(JwtAuthGuard)
  async countNotifications(@Req() req: RequestWithUser){
    return await this.notificationsService.countNotifications(req.user.sub)
  }

  
  @Post("setNotifications")
  @UseGuards(JwtAuthGuard)
  async setNotifications(@Req() req: RequestWithUser, @Res() res: Response){
    await this.notificationsService.setNotifications(req.user.sub)
    return res.json({message: "Notifications set"})
  }
}