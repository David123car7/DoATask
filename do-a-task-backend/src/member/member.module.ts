import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { CommunityService } from 'src/community/community.service';
import { AddressService } from 'src/addresses/addresses.service';
import { LocalityService } from 'src/locality/locality.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [MemberController],
    providers: [MemberService, CommunityService, AddressService, LocalityService],
    exports: [MemberService],
})
export class MemberModule {}