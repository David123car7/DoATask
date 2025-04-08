export async function refreshSession(refreshToken: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refreshSession`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      return {
        message: `Session refresh failed: ${res.status}`,
        state: false
      }
    }
    else return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Session refresh failed: ${error.message}`);
    }
    throw new Error('Unknown session refresh error');
  }
}