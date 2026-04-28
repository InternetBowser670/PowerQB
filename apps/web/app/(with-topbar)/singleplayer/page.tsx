"use client"

import { Button } from "@workspace/ui/components/button"
import { Pause, SkipForward, CogIcon } from "lucide-react"
import { useState } from "react"

export default function Page() {
  // https://www.qbreader.org/tools/api-docs/schemas/#tossup

  // standard abbv. for tossups heard
  // 0 = not started, inclusive
  const [TUH, setTUH] = useState(0)
  // not yet const [activeTossup, setActiveTossup] = useState(0)

  const tossups = [
    {
      title: "2023 Politics & History with a side of Memes (5)",
      qText: (
        <>
          <span className="font-bold">
            EricVanWilderman and Juniper are YouTubers who primarily make
            content on this game. Easter eggs within this game include the
            ‘Vault of Secrets’ and a hidden level known as ‘The Challenge’. The
            2.0 Update to this game added moving objects and a new robot
            gamemode. Robert Topala is the sole developer of this game, although
            he typically goes under his online username ‘RobTop’. Difficulties
            (*)
          </span>{" "}
          in this game include Easy, Normal, Insane, and Demon levels. Levels in
          this game include ‘Back on Track’ and ‘Stereo Madness’. FTP, name this
          game, the most popular 2d side-scrolling platformer on the App Store.
        </>
      ),
    },
  ]

  function startGame() {
    setTUH(1)
  }

  return (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex h-full w-full flex-col gap-4 p-4">
          <h4>
            {TUH !== 0
              ? `Tossup ${TUH} | ${tossups[TUH - 1]!.title}`
              : "Not started"}
          </h4>
          <hr />
          <div>
            <p>{TUH === 0 ? 'Press "Start" to begin' : tossups[TUH - 1]!.qText}</p>
          </div>
        </div>
        <div className="m-4 flex gap-4 p-4">
          <Button onClick={startGame}>{TUH === 0 ? "Start" : "Next"}</Button>
          <Button variant={"secondary"}>
            <SkipForward />
          </Button>
          <Button variant={"secondary"}>
            <Pause />
          </Button>
          <Button variant={"secondary"}>
            <CogIcon />
          </Button>
        </div>
      </div>
    </>
  )
}
