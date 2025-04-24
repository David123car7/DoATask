import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksService } from './tasks.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { StorageService } from '../storage/storage.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [TasksController],
    providers: [TasksService, StorageService],
    exports: [TasksService],
})
export class TasksModule {}
