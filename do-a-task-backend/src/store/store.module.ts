import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StorageService } from '../storage/storage.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [StoreController],
    providers: [StoreService, StorageService],
    exports: [StoreService],
})
export class StoreModule {}
