// app/private/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/utils/supabase/server'

//This is a example of using Dynamic rendering
export default async function PrivatePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  // You can render different UI based on whether data.user exists.
  return (
    <div>
      {data?.user ? (
        <p>Hello {data.user.email}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
      {/* Render other parts of your page conditionally */}
    </div>
  )
}