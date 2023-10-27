import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function NavBar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="flex justify-between py-2 px-5 border-b border-b-foreground/10 h-16 items-center">
      <Link href="/">Kanban</Link>
      <div className="flex gap-2 items-center">
        {user && <div>{user.email}</div>}
        {user && <form action="/auth/sign-out" method="post">
          <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
            Logout
          </button>
        </form>}
        {!user && <Link
          href="/login"
          className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          Login
        </Link>}
      </div>
    </nav>
  )
}