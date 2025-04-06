"use server"

import { SignoutUser } from "../../api/auth/authentication/signout";
import { NextResponse } from 'next/server';
import { ROUTES } from "../../constants/routes";


export async function SignoutPage(){
    const { error } = await SignoutUser()
    if(error) {
      throw error;
  }

  return (<p>Signout</p>)
}