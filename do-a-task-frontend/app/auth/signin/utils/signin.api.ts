import {SignInSchema} from '@/app/auth/schema/signin-form-schema';

export async function SigninUser(data: SignInSchema) {
    try {
        // Send the data to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Backend Error:', errorData); 
            throw errorData;
        }
        return response.json();
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
}