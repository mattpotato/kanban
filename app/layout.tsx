import NavBar from '@/components/NavBar'
import './globals.css'

export const metadata = {
  title: 'Kanban Board',
  description: 'Organize your projects and tasks!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <main className="min-h-screen bg-background flex flex-col">
          <NavBar />
          <div className="p-4 flex flex-1 h-full max-w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
