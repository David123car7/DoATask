import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommunityService } from './community.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { CommunityController } from './community.controller';


@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [CommunityController],
    providers: [CommunityService],
    exports: [CommunityService],
})
export class CommunityModule {}