import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService} from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  sendNotification(@Body() body: {userId: string, message: string}) {
    this.notificationsService.sendToUser(body.userId, body.message);
  }
}