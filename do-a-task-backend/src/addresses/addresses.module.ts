import { Module } from '@nestjs/common';
import { AddressesController } from './addressess.controller';
import { AddressService } from './addresses.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
    imports: [PrismaModule, SupabaseModule],
    controllers: [AddressesController],
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule {}