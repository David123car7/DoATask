"use server"

import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import { getCookie } from "@/lib/utils/cookies/auth/index";

export async function GetLocalityUser() {
  try {
    const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
    if (!access_token) {
      return { message: "Access token not found", state: false };
    }

    // Call the backend endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/community/getLocalityUser`,
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
      return errorData.message;
    }

    // Await response.json() to actually resolve the JSON data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    throw error;
  }
}