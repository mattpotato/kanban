import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 px-3 w-full">
        <main className="flex flex-1 justify-center items-center gap-72">
          <form
            className="flex-1 flex flex-col max-w-md justify-center gap-2 text-foreground"
            action="/auth/sign-in"
            method="post"
          >
            <p className="text-3xl text-center">
              Kanban
            </p>
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              placeholder="you@example.com"
              required
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
            <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
              Sign In
            </button>
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gray-300 opacity-50 m-4"/>
              OR
              <div className="flex-1 h-px bg-gray-300 opacity-50 m-4"/>
            </div>
            <button
              formAction="/auth/sign-up"
              className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
            >
              Sign up with email
            </button>
          </form>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          <a
            href="https://github.com/mattpotato"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            github.com/mattpotato
          </a>
        </p>
      </footer>
    </div>
  )
}
