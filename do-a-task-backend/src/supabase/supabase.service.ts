import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus} from '@nestjs/common';

@Injectable()
export class SupabaseService {
  public supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      configService.get<string>('SUPABASE_URL'),
      configService.get<string>('SUPABASE_ANON_KEY'),
    );
  }

  handleSupabaseError(error: any, context: string): never {
    if (error) {
      const status = error.status || HttpStatus.BAD_REQUEST;
      
      throw new HttpException(`${context}: ${error.message}`, status);
    }

    throw new HttpException(`${context}: Unknown Supabase error occurred`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}