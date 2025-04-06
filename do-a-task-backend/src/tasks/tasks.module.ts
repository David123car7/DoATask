import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TasksService } from './tasks.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule {}
