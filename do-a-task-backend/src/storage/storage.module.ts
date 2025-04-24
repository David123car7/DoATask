import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageService } from './storage.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { StorageController } from './storage.controller';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [StorageController],
    providers: [StorageService],
    exports: [StorageService],
})
export class StorageModule {}