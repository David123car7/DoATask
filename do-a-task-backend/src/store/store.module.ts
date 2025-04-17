import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [StoreController],
    providers: [StoreService],
    exports: [StoreService],
})
export class StoreModule {}
