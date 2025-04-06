"use server"

import { SignoutUser } from "@/lib/api/auth/authentication/signout";
import { ROUTES } from "@/lib/constants/routes";
import { redirect } from "next/navigation";
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import { resolve } from "url";

export default async function SignoutPage(){
    const res = await SignoutUser();
    if(!res)
      throw new Error(res.message || 'An unexpected error occurred');

    redirect(ROUTES.HOME)
}