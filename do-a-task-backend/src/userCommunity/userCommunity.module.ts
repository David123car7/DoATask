import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { UserCommunityService } from './userCommunity.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [],
    providers: [UserCommunityService],
    exports: [UserCommunityService],
})
export class UserModule {}
