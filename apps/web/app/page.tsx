"use client"

import { BackgroundPattern1 } from "@workspace/ui/components/background-pattern1"
import { useTheme } from "next-themes"
import { useIsMounted } from "@workspace/ui/hooks/useIsMounted"

export default function Page() {
  const { resolvedTheme } = useTheme()
  const isMounted = useIsMounted()

  if (!isMounted()) return null

  return (
    <>
      <BackgroundPattern1
        className={resolvedTheme == "light" ? "fadeBottom" : "fadeBottomDark"}
      />
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          Coming soon...
        </div>
      </div>
    </>
  )
}
