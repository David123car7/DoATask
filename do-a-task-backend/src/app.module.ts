import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TasksModule],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
