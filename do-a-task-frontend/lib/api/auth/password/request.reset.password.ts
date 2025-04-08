"use server"

import {RequestResetPasswordSchema} from '@/app/auth/schema/request-reset-password-form-schema';

export async function RequestResetPassword(data : RequestResetPasswordSchema) {
    try {
        // Send the data to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/requestResetPassword`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
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