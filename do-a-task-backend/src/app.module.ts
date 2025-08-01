import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { CommunityModule } from './community/community.module';
import { LocalityModule } from './locality/locality.module';
import { AddressModule } from './addresses/addresses.module';
import { StorageModule } from './storage/storage.module';
import { NotificationModule } from './notifications/notifications.module';
import { StoreModule } from './store/store.module';
import { RankModule } from './rank/rank.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    AuthModule, 
    TasksModule, 
    UserModule, 
    MemberModule, 
    CommunityModule, 
    LocalityModule, 
    AddressModule,
    StorageModule,
    NotificationModule,
    StoreModule,
    RankModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
