
import {Injectable } from "@nestjs/common";
import { AuthDtoSignup, AuthDtoSignin } from "./dto";
import { Response } from 'express';
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({})
export class AuthService{
    constructor(private readonly supabaseService: SupabaseService) {}

    async signup(dto: AuthDtoSignup) {
        const email = dto.email;
        const password = dto.password;
        // Step 1: Create user in Supabase Auth
        const { data, error } = await this.supabaseService.supabase.auth.signUp({
            email,
            password
        });
        
        if (error) {
            throw new Error(`Signup error: ${error.message}`);
          }

        return { message: "Signup successful", user: data.user };
      }
    
    async sighin(dto: AuthDtoSignin){
        const email = dto.email;
        const password = dto.password;

        const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new Error(`Signup error: ${error.message}`);
          }

        return { message: "Signin successful", user: data.user };
    }
}
