"use server"

import { ResetPasswordSchema } from '@/app/auth/schema/reset-password-form-schema';

export async function ResetPassword(data : ResetPasswordSchema, access_token: string) {
    try {
        // Send the data to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resetPassword`, {
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