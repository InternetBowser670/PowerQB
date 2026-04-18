"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import SplitText from "./SplitText"
import { Link as ScrollLink } from "react-scroll"
import { useRouter } from "next/navigation"

const PatternPlaceholder = () => {
  const router = useRouter();

  return (
    <div className="relative z-10">
      <div className="container py-28 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <Badge variant="secondary">PowerQB.com</Badge>
          <div className="max-w-3xl">
            <h1 className="mb-6 font-body text-4xl font-medium tracking-tight text-pretty text-foreground md:text-5xl lg:text-6xl">
              A new method to practice{" "}
              <SplitText
                text="quiz bowl."
                delay={50}
                tag="span"
                className="block! overflow-visible! font-heading italic"
              />
            </h1>
            <p className="mx-auto max-w-2xl font-light tracking-tighter text-pretty text-muted-foreground md:text-lg lg:text-xl">
              A configurable tossup and bonus reader and analyzer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => router.push("/dashboard")}>Get Started</Button>
            <ScrollLink to="learnMore" smooth={true} duration={500}>
              <Button variant="secondary">Learn More</Button>
            </ScrollLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PatternPlaceholder }
