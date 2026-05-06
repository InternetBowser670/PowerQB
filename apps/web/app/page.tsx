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
import { useRef } from "react"
import clsx from "clsx"

function Section2() {
  const { resolvedTheme } = useTheme()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const { progress, foregroundY, backgroundY } = useTransform(
    scrollYProgress,
    [0, 0.2, 0.9, 1],
    {
      progress: ["0%", "0%", "100%", "100%"],
      foregroundY: [600, 100, -100, -600],
      backgroundY: [100, 50, -50, -100],
    },
    { clamp: false }
  )

  return (
    resolvedTheme && (
      <Element name="learnMore">
        <div ref={ref} className="relative h-[300vh] w-full">
          <div
            className={clsx(
              "sticky top-0 flex h-svh w-full items-center overflow-hidden p-6",
              resolvedTheme == "light" ? "fadeBottom" : "fadeBottomDark"
            )}
          >
            <motion.div className="absolute top-0 left-0 z-20 h-[10px] w-full bg-card">
              <motion.div
                className="h-full bg-accent"
                style={{ width: progress }}
              ></motion.div>
            </motion.div>
            <motion.div
              className="absolute inset-x-0 -top-[200px] h-[calc(100%+400px)]"
              style={{ y: backgroundY }}
            >
              <GridPattern
                className="h-full w-full opacity-20"
                width={40}
                height={40}
              />
            </motion.div>

            <motion.div
              style={{ y: foregroundY }}
              className="z-2 flex max-w-xs min-w-0 flex-col gap-4 pl-[10%] text-sm leading-loose sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl xl:gap-8 2xl:max-w-2xl"
            >
              <h2 className="lg:text-6xl">Using AI to accelerate learning</h2>
              <p className="lg:text-lg">
                By the use of analysis and research, PowerQB is able to teach
                quiz bowl topics like no other resource.
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
        </div>
      </Element>
    )
  )
}

function Section3() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  })

  const { foregroundY } = useTransform(
    scrollYProgress,
    [0, 1],
    {
      foregroundY: [400, 0],
      backgroundY: [200, 0],
    },
    { clamp: false }
  )

  return (
    <Element name="footer">
      <div
        ref={ref}
        className="min-h-50svh relative flex w-full items-center overflow-hidden p-0"
      >
        <motion.div
          style={{ y: foregroundY }}
          className="z-2 flex h-[600px] w-full flex-col items-center justify-center overflow-hidden border-t p-6 backdrop-blur-[1px]"
        >
          <h2 className="flex flex-1 items-center justify-center text-center font-cursive text-[20vw] leading-none italic opacity-10">
            PowerQB
          </h2>
          <p className="opacity-10 lg:text-lg">InternetBowser, 2026</p>
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
      <Section3 />
    </>
  )
}
