import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksModule } from './tasks/tasks.module';
import { AddressModule } from './addresses/addresses.module';
import { LocalityModule } from './locality/locality.module';
import { CommunityModule } from './community/community.module';
import { MemberModule } from './member/member.module';

@Module({
<<<<<<< Updated upstream
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TasksModule],
  controllers: [AppController, TasksController],
=======
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TasksModule, AddressModule, LocalityModule, CommunityModule,MemberModule],
  controllers: [AppController],
>>>>>>> Stashed changes
  providers: [AppService, SupabaseService],
})
export class AppModule {}
