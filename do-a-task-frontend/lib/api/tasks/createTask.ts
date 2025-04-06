import {CreateTaskSchema} from "@/app/tasks/schema/createTask-form-schema";

export async function CreateTask(data: CreateTaskSchema) {

    try{
        // Send the data to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/createTask`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include', 
        });

        if (!response.ok) {
            // if backend returns an error, log it to the console
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