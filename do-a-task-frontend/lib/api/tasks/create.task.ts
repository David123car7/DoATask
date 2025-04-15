import { CreateTaskSchema } from "@/lib/schemas/tasks/create-task-form-schema";
import { getCookie } from "@/lib/utils/cookies/auth";
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";

export async function CreateTask(data: FormData) {
    try {
        const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
        if(!access_token)
            return "Acess token not found"

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/createTask`, {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${access_token}`,
            },
            body: data,
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