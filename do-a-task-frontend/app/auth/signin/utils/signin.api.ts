"use server";

import {SignInSchema} from '@/app/auth/schema/signin-form-schema';
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

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
            throw new Error(errorData.message || 'An unexpected error occurred');
        }
        
        const setCookieHeader = response.headers.get("Set-Cookie");
        console.log("Set-Cookie Header:", setCookieHeader); // 🛠 Debugging
        
        if (setCookieHeader) {
            const token = setCookieHeader.split(";")[0].split("=")[1];
            const decodedTokenOnce = decodeURIComponent(token);
            const tokenString = decodedTokenOnce.slice(2); 
            const tokenObject = JSON.parse(tokenString);
            const accessToken = tokenObject.access_token;
            const decodedJWT = jwtDecode(accessToken);

            if(decodedJWT.exp){
                const expirationTime = decodedJWT.exp * 1000; //its red because the expiration time can happen to not be defined in the backend
                const cookieStore = await cookies();
                cookieStore.set({
                    name: "Authentication",
                    value: accessToken,
                    secure: true,
                    httpOnly: true,
                    expires: expirationTime
                });
            }
        }

        return response.json();
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
}