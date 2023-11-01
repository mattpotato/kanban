import LoginForm from "@/components/LoginForm";

export const dynamic = 'force-dynamic'

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 px-3 w-full">
        <main className="flex flex-1 justify-center items-center gap-72">
          <LoginForm />
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
