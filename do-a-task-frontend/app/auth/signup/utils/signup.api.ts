"use server"

import {SignUpSchema} from '@/app/auth/schema/signup-form-schema';

export async function SignupUser(data: SignUpSchema) {
    try {
        // Send the data to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Backend Error:', errorData); // Log the full error response
            throw new Error(errorData.message || 'An unexpected error occurred');
        }
        return response.json();
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
}