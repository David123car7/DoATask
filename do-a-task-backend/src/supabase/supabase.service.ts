import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus} from '@nestjs/common';

@Injectable()
export class SupabaseService {
  private publicClient: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error('Supabase environment variables are not defined');
    }

    this.publicClient = createClient(supabaseUrl, anonKey);
    this.adminClient = createClient(supabaseUrl, serviceRoleKey);
  }

  getPublicClient(): SupabaseClient {
    return this.publicClient;
  }

  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }

  handleSupabaseError(error: any, context: string): never {
    if (error) {
      const status = error.status || HttpStatus.BAD_REQUEST;
      
      throw new HttpException(`${context}: ${error.message}`, status);
    }

    throw new HttpException(`${context}: Unknown Supabase error occurred`, HttpStatus.INTERNAL_SERVER_ERROR);
  }

 /**
   * Deletes all users in Supabase Auth via the Admin API.
   * Use this in end-to-end tests to reset auth state.
   */
 async cleanAuthUsers(): Promise<void> {
  // Supabase Admin API supports listing and deleting users
  const { data, error: listError } = await this.adminClient.auth.admin.listUsers();
  if (listError) {
    this.handleSupabaseError(listError, 'Clean Auth Users - list');
  }
  // data contains users array and pagination info
  const users = data?.users ?? [];
  for (const user of users) {
    const { error: deleteError } = await this.adminClient.auth.admin.deleteUser(user.id);
    if (deleteError) {
      // Log and continue
      console.error(`Failed to delete user ${user.id}:`, deleteError.message);
    }
  }
}
}
