"use client"

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  ClerkLoading,
} from "@clerk/nextjs"
import TextLogo from "@workspace/ui/components/branding/text-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"

export default function Topbar() {
  const router = useRouter()
  return (
    <>
      <header className="z-20 flex h-16 w-full items-center justify-between gap-4 border-b border-dashed bg-accent/10 p-4">
        <div className="flex h-full items-center gap-4">
          <Link href="/" className="flex gap-4">
            <TextLogo />
          </Link>
          <div className="h-[90%] border-r border-r-foreground" />
          <Link href={"/singleplayer"}>Singleplayer</Link>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
              <Button variant="default">Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
            <div className="aspect-square! h-[28px]">
              <UserButton />
            </div>
          </Show>
          <ClerkLoading>Loading User...</ClerkLoading>
        </div>
      </header>
    </>
  )
}
