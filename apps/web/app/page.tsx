"use client"

import { BackgroundPattern1 } from "@workspace/ui/components/background-pattern1"
import { useTheme } from "next-themes"
import { useIsMounted } from "@workspace/ui/hooks/useIsMounted"
import {
  ClerkLoading,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
import { Button } from "@workspace/ui/components/button"
import TextLogo from "@workspace/ui/components/branding/text-logo"
import { Element } from "react-scroll"

export default function Page() {
  const { resolvedTheme } = useTheme()
  const isMounted = useIsMounted()

  if (!isMounted || !resolvedTheme) return null

  return (
    <>
      <header className="absolute top-0 right-0 z-20 flex h-16 w-full items-center justify-between gap-4 border-b border-dashed bg-accent/10 p-4">
        <div className="flex gap-4">
          <TextLogo />
        </div>
        <div className="flex gap-4">
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
              <Button variant="default">Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <ClerkLoading>Loading User...</ClerkLoading>
        </div>
      </header>
      <BackgroundPattern1
        className={resolvedTheme == "light" ? "fadeBottom" : "fadeBottomDark"}
      />
      <Element name="learnMore">
        <div className="flex min-h-svh w-full items-center justify-center p-6">
          <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
            <h2>Coming soon...</h2>
            <p>Feel free to make an account.</p>
          </div>
        </div>
      </Element>
    </>
  )
}
