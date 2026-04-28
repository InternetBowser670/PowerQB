import Topbar from "@/components/ui/topbar"
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"

export default function TopbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen">
      <Topbar />
      <div className="flex h-[calc(100svh-64px)] flex-col">
        <Show when={"signed-in"}>{children}</Show>
        <Show when={"signed-out"}>
          <div className="flex h-full w-full items-center justify-center">
            <Card className="max-w-2/3">
              <h1>You&apos;re not signed in.</h1>
              <div className="flex gap-4">
                <SignInButton />
                <SignUpButton>
                  <Button variant="default">Sign Up</Button>
                </SignUpButton>
              </div>
            </Card>
          </div>
        </Show>
      </div>
    </div>
  )
}
