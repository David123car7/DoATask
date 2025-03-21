"use server"
import { cookies } from "next/headers";

/**
 * Sends a message to the backend.
 * @param message - The message to send.
 * @returns The backend's response.
 */
export const sendMessage = async (message: string) => {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("Authentication")?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({ message }), // Send the message in the request body
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error; // Re-throw the error for handling in the component
  }
};