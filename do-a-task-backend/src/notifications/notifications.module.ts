import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

//https://docs.nestjs.com/techniques/server-sent-events
@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [NotificationsController],
    providers: [NotificationsService, PrismaService],
    exports: [NotificationsService],
})
export class NotificationModule {}