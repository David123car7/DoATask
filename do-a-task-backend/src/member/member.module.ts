import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { LocalityService } from '../locality/locality.service';
import { CommunityService } from '../community/community.service';
import { AddressService } from '../addresses/addresses.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [MemberController],
    providers: [MemberService],
    exports: [MemberService],
})
export class MemberModule {}