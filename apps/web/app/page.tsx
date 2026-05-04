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
import Link from "next/link"
import { useRouter } from "next/navigation"
import EbbinghausChart from "@/components/ui/ebbinghaus-chart"
import { Card } from "@workspace/ui/components/card"
import GridPattern from "@workspace/ui/components/ui/grid-pattern"
import { motion, useScroll, useTransform } from "motion/react"
import { useEffect, useRef } from "react"

function Section2() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const normalized = useTransform(scrollYProgress, [0.125, 0.5], [0, 1])

  const { foregroundX, foregroundY, backgroundY } = useTransform(
    normalized,
    [0, 1],
    {
      foregroundY: [400, 0],
      foregroundX: [-200, 0],
      backgroundY: [200, 0],
    },
    { clamp: false }
  )

  useEffect(() => {
    const unsubscribe = backgroundY.on("change", (v) => {
      console.log(v)
    })
    return unsubscribe
  }, [backgroundY])

  return (
    <Element name="learnMore">
      <div
        ref={ref}
        className="relative flex min-h-svh w-full items-center overflow-hidden p-6"
      >
        <motion.div
          className="absolute inset-x-0 -top-[200px] h-[calc(100%+200px)]"
          style={{ y: backgroundY }}
        >
          <GridPattern className="h-full w-full opacity-20" />
        </motion.div>

        <motion.div
          style={{ x: foregroundX, y: foregroundY }}
          className="z-2 flex max-w-xs min-w-0 flex-col gap-4 pl-[10%] text-sm leading-loose sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl xl:gap-8 2xl:max-w-2xl"
        >
          <h2 className="lg:text-6xl">Using AI to accelerate learning</h2>
          <p className="lg:text-lg">
            By the use of analysis and research, PowerQB is able to teach quiz
            bowl topics like no other resource.
          </p>
        </motion.div>
        <motion.div
          style={{ y: foregroundY }}
          className="absolute top-1/2 left-1/2 z-1 w-[60svw] translate-x-1/10 -translate-y-1/2 -rotate-10 overflow-visible! mask-[linear-gradient(to_right,black_10%,transparent_80%)] [-webkit-mask-image:linear-gradient(to_right,black_10%,transparent_80%)]"
        >
          <div className="overflow-visible">
            <Card className="flex h-full w-full justify-center overflow-visible! border-2 bg-card p-2">
              <EbbinghausChart />
            </Card>
          </div>
        </motion.div>
      </div>
    </Element>
  )
}

export default function Page() {
  const { resolvedTheme } = useTheme()
  const isMounted = useIsMounted()
  const router = useRouter()

  if (!isMounted || !resolvedTheme) return null

  return (
    <>
      <header className="absolute top-0 right-0 z-20 flex h-16 w-full items-center justify-between gap-4 border-b border-dashed bg-accent/10 p-4">
        <Link href="/" className="flex gap-4">
          <TextLogo />
        </Link>
        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton>
              <Button variant="default">Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Show when="signed-in">
              <Button onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <div className="flex aspect-square! h-[28px] justify-center">
                <UserButton />
              </div>
            </Show>
          </Show>
          <ClerkLoading>Loading User...</ClerkLoading>
        </div>
      </header>
      <BackgroundPattern1
        className={resolvedTheme == "light" ? "fadeBottom" : "fadeBottomDark"}
      />
      <Section2 />
    </>
  )
}
