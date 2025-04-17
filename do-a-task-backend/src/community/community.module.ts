import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommunityService } from './community.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { CommunityController } from './community.controller';
import { AddressService } from 'src/addresses/addresses.service';
import { MemberService } from 'src/member/member.service';
import { UserCommunityService } from 'src/userCommunity/userCommunity.service';
import { StoreService } from 'src/store/store.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [CommunityController],
    providers: [CommunityService, AddressService, MemberService, UserCommunityService, StoreService],
    exports: [CommunityService],
})
export class CommunityModule {}