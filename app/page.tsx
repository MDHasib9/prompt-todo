import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function HomePage() {
  // Read session metrics securely from the server
  const { userId } = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-liner-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          TaskFlow
        </h1>
        <p className="text-lg text-slate-400">
          A sleek, multi-tenant task management engine engineered using modern full-stack methodologies.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          {userId ? (
            <Link
              href="/todos"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 font-semibold rounded-lg transition-colors duration-200 border border-slate-700"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}