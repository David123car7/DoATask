"use server"

import { SignoutUser } from "../../lib/api/auth/authentication/signout";
import { NextResponse } from 'next/server';
import { ROUTES } from "../../lib/constants/routes";


export async function SignoutPage(){
    const { error } = await SignoutUser()
    if(error) {
      throw error;
  }

  return (<p>Signout</p>)
}