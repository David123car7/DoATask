import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService], // Register SupabaseService
  exports: [SupabaseService], // Export it so other modules can use it
})
export class SupabaseModule {}