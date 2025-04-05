export async function verifySession(authToken: string | null){
    if (!authToken) {
      return { valid: false, error: 'NO_TOKEN' };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
          },
      });

      if (response.status === 401) {
        return { valid: false, error: 'INVALID_TOKEN' };
      }

      if (!response.ok) {
        throw new Error(`Session verification failed: ${response.status}`);
      }

      return { valid: true, error: null };
    } catch (error) {
      console.error('Session verification error:', error);
      return {
        valid: 'UNKNOWN',
        error: error instanceof Error ? error.message : 'SERVER_ERROR',
      };
    }
  }