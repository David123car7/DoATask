import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { LocalityController } from './locality.controller';
import { LocalityService } from './locality.service';



@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [LocalityController],
    providers: [LocalityService],
    exports: [LocalityService],
})
export class LocalityModule {}