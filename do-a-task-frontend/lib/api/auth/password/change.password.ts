"use server"

import { ChangePasswordSchema } from '@/app/auth/schema/change-password-form-schema';
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import { getCookie} from "@/lib/utils/cookies/auth/index";

export async function ResetPassword(data : ChangePasswordSchema) {
    try {
        const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
        if(!access_token)
            return "Acess token not found"

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/changePassword`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Backend Error:', errorData); 
            throw new Error(errorData.message || 'An unexpected error occurred');
        }
        return response.json();
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
}