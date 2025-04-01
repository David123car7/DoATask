import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      configService.get<string>('SUPABASE_URL'),
      configService.get<string>('SUPABASE_ANON_KEY'),
    );
  }
}