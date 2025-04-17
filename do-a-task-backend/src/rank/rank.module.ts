import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [RankController],
    providers: [RankService],
    exports: [RankService],
})
export class RankModule {}
