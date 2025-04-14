"use server"

import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import { getCookie} from "@/lib/utils/cookies/auth/index";
import { GetUser } from "@/lib/utils/supabase/user/get-user";

export async function GetUserData() {
    try {
        const user = await GetUser()
        if(!user) {
            return null; //the token does not exist, so the user is not authenticated
        }
            
        // Send the data to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getUser`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Backend Error:', errorData); 
            throw new Error(errorData.message || 'An unexpected error occurred');
        }
        
        return await response.json()
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
}