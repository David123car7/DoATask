"use server"

export async function GetUserData() {
    try {
        // Send a GET request to the backend to fetch user data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/1`, {
            method: 'GET', // Use GET request since you're only fetching data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Backend Error:', errorData); // Log the full error response
            throw new Error(errorData.message || 'An unexpected error occurred');
        }

        // Return the JSON data received from the backend
        return response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}