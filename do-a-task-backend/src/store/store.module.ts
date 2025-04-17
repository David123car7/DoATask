import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StorageService } from 'src/storage/storage.service';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [StoreController],
    providers: [StoreService, StorageService],
    exports: [StoreService],
})
export class StoreModule {}
