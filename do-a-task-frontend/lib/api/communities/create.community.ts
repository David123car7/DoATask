import { CreateCommunitySchema } from "@/lib/schemas/community/create-community-schema";
import { getCookie } from "@/lib/utils/cookies/auth";
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";

export async function CreateCommunity(data: CreateCommunitySchema) {
    try {
        const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
        if(!access_token)
            return "Acess token not found"

        // Send the data to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/community/createCommunity`, {
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