"use client"

import { Button } from "@workspace/ui/components/button"
import { Pause, SkipForward, CogIcon, PlayIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { isTypingTarget } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

export default function Page() {
  // https://www.qbreader.org/tools/api-docs/schemas/#tossup

  // standard abbv. for tossups heard
  // 0 = not started, inclusive
  const [TUH, setTUH] = useState(0)
  const [allWords, setAllWords] = useState<{ text: string; isBold: boolean }[]>(
    []
  )
  const [displayedWords, setDisplayedWords] = useState<
    { text: string; isBold: boolean }[]
  >([])
  const [isPaused, setIsPaused] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tossups, setTossups] = useState<any[]>([])

  const isFinished = TUH > 0 && displayedWords.length === allWords.length

  async function fetchNewTossup() {
    const res = await fetch(
      "https://www.qbreader.org/api/random-tossup?powermarkOnly=true"
    )
    const json = await res.json()
    const tu = json.tossups[0]

    const parts = tu.question_sanitized.split("(*)")
    const powerWords = parts[0]
      .split(" ")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((w: any) => ({ text: w, isBold: true }))
    const regularWords = parts[1]
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parts[1].split(" ").map((w: any) => ({ text: w, isBold: false }))
      : []

    setTossups((prev) => [...prev, tu])
    setTUH((prev) => prev + 1)
    setAllWords([...powerWords, { text: "(*)", isBold: true }, ...regularWords])
    setDisplayedWords([])
    setIsPaused(false)
  }

  useEffect(() => {
    if (TUH > 0 && displayedWords.length < allWords.length && !isPaused) {
      const intervalId = setInterval(() => {
        setDisplayedWords((prev) => {
          const nextWord = allWords[prev.length]
          if (!nextWord) return prev
          return [...prev, nextWord]
        })
      }, 100)

      return () => clearInterval(intervalId)
    }
  }, [TUH, displayedWords.length, allWords, isPaused])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      if (event.key.toLowerCase() == "p") {
        setIsPaused((prev) => !prev)
      }

      if (event.key.toLowerCase() == "s") {
        setDisplayedWords(allWords)
      }

      if (event.key.toLowerCase() == "n") {
        fetchNewTossup()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [setIsPaused, setDisplayedWords, allWords])

  return (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex h-full w-full flex-col gap-4 p-4">
          <h4>
            {TUH !== 0
              ? `Tossup ${TUH} | ${tossups[TUH - 1]!.set.name} Packet ${tossups[TUH - 1]!.packet.number} Question ${tossups[TUH - 1]!.number}`
              : "Not started"}
          </h4>
          <hr />
          <div>
            <p className="text-lg leading-relaxed">
              {TUH === 0
                ? 'Press "Start" to begin'
                : displayedWords.map((word, i) => (
                    <span key={i} className={word.isBold ? "font-bold" : ""}>
                      {word.text}{" "}
                    </span>
                  ))}
            </p>
          </div>
        </div>
        <div className="m-4 flex justify-between p-4">
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    if (TUH === 0 || isPaused || isFinished) fetchNewTossup()
                  }}
                >
                  {TUH === 0 ? "Start" : "Next"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Shortcut: </p>
                <kbd>n</kbd>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={() => setDisplayedWords(allWords)}
                >
                  <SkipForward />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Shortcut: </p>
                <kbd>s</kbd>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <PlayIcon /> : <Pause />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Shortcut: </p>
                <kbd>p</kbd>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"secondary"}>
                  <CogIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Shortcut: </p>
                <kbd>e</kbd>
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            <Button>Buzz</Button>
          </div>
        </div>
      </div>
    </>
  )
}
