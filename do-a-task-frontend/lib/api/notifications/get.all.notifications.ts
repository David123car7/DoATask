"use server"

import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import { getCookie } from "@/lib/utils/cookies/auth/index";

export async function GetAllNotifications() {
  try {
    const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
    if (!access_token) {
      return { message: "Access token not found", state: false };
    }

    // Call the backend endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/getAllNotifications`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Backend Error:', errorData);
      throw new Error(errorData.message || 'An unexpected error occurred');
    }


    const data = await response.json();
    return data.notifications;
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    throw error;
  }
}