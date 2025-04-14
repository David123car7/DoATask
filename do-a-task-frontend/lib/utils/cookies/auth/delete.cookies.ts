"use server"

import { cookies } from 'next/headers';

export async function deleteAuthCookie(name : string) { 
    const cookieStore = await cookies();
    const res = cookieStore.delete(name);
    if(!res) return(`Failed to delete cookie: ${name}`);
    return res;
}

