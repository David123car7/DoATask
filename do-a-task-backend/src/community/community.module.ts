import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CommunityService } from './community.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { CommunityController } from './community.controller';
import { AddressService } from '../addresses/addresses.service';
import { MemberService } from '../member/member.service';
import { UserCommunityService } from '../userCommunity/userCommunity.service';
import { StoreService } from '../store/store.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [CommunityController],
    providers: [CommunityService, AddressService, MemberService, UserCommunityService, StoreService],
    exports: [CommunityService],
})
export class CommunityModule {}