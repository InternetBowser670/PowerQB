"use client";

import {
  ClerkLoading,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
import TextLogo from "@workspace/ui/components/branding/text-logo"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TopbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter();

  return (
    <div className="h-screen">
      <header className="z-20 flex h-16 w-full items-center justify-between gap-4 border-b border-dashed bg-accent/10 p-4">
        <Link href="/" className="flex gap-4">
          <TextLogo />
        </Link>
        <div className="flex gap-4">
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
              <Button variant="default">Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
            <UserButton />
          </Show>
          <ClerkLoading>Loading User...</ClerkLoading>
        </div>
      </header>
      <div className="flex min-h-[calc(100svh-64px)] flex-col">{children}</div>
    </div>
  )
}
