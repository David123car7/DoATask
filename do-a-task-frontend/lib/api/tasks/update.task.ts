// lib/api/tasks/update.task.ts

import { getCookie } from "@/lib/utils/cookies/auth";
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";

export async function UpdateTask(taskId: number, data: any) {
  const access_token = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/updateTask?taskId=${taskId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao atualizar voluntariado");
  }

  return response.json();
}
