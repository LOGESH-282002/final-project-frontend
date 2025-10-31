'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-black">
            Welcome to Google Auth App
          </h1>
          <p className="max-w-md text-lg leading-8 text-black dark:text-black">
            A Next.js application with Google OAuth authentication using Supabase as the database.
            {user ? ` Welcome back, ${user.name}!` : ' Please sign in to continue.'}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : user ? (
            <Link
              href="/dashboard"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 md:w-[158px]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 md:w-[158px]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-blue-600 px-5 text-blue-600 transition-colors hover:bg-blue-50 md:w-[158px]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
