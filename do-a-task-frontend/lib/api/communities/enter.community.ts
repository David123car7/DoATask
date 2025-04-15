import { getCookie } from "@/lib/utils/cookies/auth";
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import { EnterCommunitySchema } from "@/lib/schemas/community/enter-community-schema";

export async function EnterCommunity(data: EnterCommunitySchema) {
    try {
        const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
        if(!access_token)
            return "Acess token not found"

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/community/enterCommunity`, {
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
        
        return await response.json();
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
}