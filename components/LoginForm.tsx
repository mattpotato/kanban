"use client"
import { useSearchParams } from "next/navigation";

const LoginForm = () => {
  const searchParams = useSearchParams(); 
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
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
        <div className="flex-1 h-px bg-gray-300 opacity-50 m-4" />
        OR
        <div className="flex-1 h-px bg-gray-300 opacity-50 m-4" />
      </div>
      <button
        formAction="/auth/sign-up"
        className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
      >
        Sign up with email
      </button>
      {message && <div className="border border-gray-400 p-3 rounded bg-gray-100">{message}</div>}
      {error && <div className="border border-red-500 p-3 rounded bg-red-50">{error}</div>}
    </form>
  )

}

export default LoginForm;