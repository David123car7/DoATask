import { getCookie } from "@/lib/utils/cookies/auth";
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";

export async function UploadImages(data: FormData) {
  try {
    const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
    if (!access_token) return "Access token not found";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/uploadImage`,
      {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Backend Error:", errorData);
      throw new Error(errorData.message || "An unexpected error occurred");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}