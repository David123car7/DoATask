import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksService } from './tasks.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { StorageService } from '../storage/storage.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [TasksController],
    providers: [TasksService, StorageService, NotificationsService],
    exports: [TasksService],
})
export class TasksModule {}
