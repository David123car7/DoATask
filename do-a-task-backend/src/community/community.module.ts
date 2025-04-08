import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommunityService } from './community.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { CommunityController } from './community.controller';
import { LocalityModule } from 'src/locality/locality.module';


@Module({
    imports: [PrismaModule, SupabaseModule, LocalityModule],
    controllers: [CommunityController],
    providers: [CommunityService],
    exports: [CommunityService],
})
export class CommunityModule {}