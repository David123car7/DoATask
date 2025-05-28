"use server"

import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import { getCookie } from "@/lib/utils/cookies/auth/index";

export async function GetAllTasksCommunity(communityName: string) {
  try {
    const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
    if (!access_token) {
      return { message: "Access token not found", state: false };
    }
    console.log('Sending communityName:', communityName);
    // Call the backend endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/tasksDoneCommunity?communityName=${communityName}`,
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
    console.log("voluntariados API:",data.task)
    return data.task;
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    throw error;
  }
}