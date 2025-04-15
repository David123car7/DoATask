import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommunityService } from 'src/community/community.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { StreetsCommunityService } from './streetsCommunity.service';
import { StreetsCommunityController } from './streetsCommunity.controller';
import { LocalityModule } from 'src/locality/locality.module';
import { AddressService } from 'src/addresses/addresses.service';



@Module({
    imports: [PrismaModule, SupabaseModule, LocalityModule],
    controllers: [StreetsCommunityController],
    providers: [StreetsCommunityService, CommunityService, AddressService],
    exports: [StreetsCommunityService],
})
export class StreetsCommunityModule {}