"use client";

import { Button } from "@workspace/ui/components/button";
import { Pause, SkipForward, CogIcon, PlayIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { isTypingTarget } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { motion, AnimatePresence } from "motion/react";
import { v4 } from "uuid";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { useForm } from "react-hook-form";
import checkAnswer from "qb-answer-checker";
import TossupCard from "@/components/ui/tossup";

export default function Page() {
  // https://www.qbreader.org/tools/api-docs/schemas/#tossup

  // standard abbv. for tossups heard
  // 0 = not started, inclusive
  const [TUH, setTUH] = useState(0);
  const [allWords, setAllWords] = useState<{ text: string; isBold: boolean }[]>(
    []
  );
  const [displayedWords, setDisplayedWords] = useState<
    { text: string; isBold: boolean }[]
  >([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isFetchingTossup, setIsFetchingTossup] = useState(false);
  const [loadingBarKey, setLoadingBarKey] = useState(v4());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tossups, setTossups] = useState<any[]>([]);

  const [progressBarWidth, setProgressBarWidth] = useState("0%");
  const [isAnswering, setIsAnswering] = useState(false);
  const [tossupAnswered, setTossupAnswered] = useState(false);
  const [ansPlaceHolder, setAnsPlaceholder] = useState("Answer");

  const [score, setScore] = useState(0);

  const isFinished = TUH > 0 && displayedWords.length === allWords.length;

  // debug option
  const forcePromptable = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function toReversed(arr: any[]) {
    return [...arr].reverse();
  }

  const answerInputForm = useForm({
    defaultValues: { answer: "" },
  });

  function onSubmitAnswer(values: { answer: string }) {
    const check = checkAnswer(toReversed(tossups)[0].answer, values.answer);

    answerInputForm.reset();

    if (check.directive == "accept") {
      // scoring
      if (toReversed(displayedWords)[0].isBold == true) {
        setScore((prev) => prev + 15);
      } else {
        setScore((prev) => prev + 10);
      }
    } else if (check.directive == "reject") {
      if (!isFinished) {
        setScore((prev) => prev - 5);
      }
    } else if (check.directive == "prompt") {
      if (check.directedPrompt) setAnsPlaceholder(check.directedPrompt);
      else setAnsPlaceholder("Prompt");
      return;
    }

    setIsAnswering(false);
    setTossupAnswered(true);
    setDisplayedWords(allWords);
  }

  const fetchNewTossup = useCallback(async () => {
    if (isFetchingTossup) return;

    setIsAnswering(false);
    setProgressBarWidth("0%");
    setLoadingBarKey(v4());
    setIsFetchingTossup(true);
    setTimeout(() => setProgressBarWidth("90%"), 100);

    try {
      const res = await fetch(
        !forcePromptable
          ? "https://www.qbreader.org/api/random-tossup?powermarkOnly=true"
          : "https://www.qbreader.org/api/query?powermarkOnly=true&searchType=answer&questionType=tossup&queryString=Bronny James [or LeBron James Jr. or LeBron Raymone James Jr.; prompt on James; reject “LeBron James”]"
      );
      const json = await res.json();
      const tu = !forcePromptable
        ? json.tossups[0]
        : json.tossups.questionArray[0];

      const parts = tu.question_sanitized.split("(*)");
      const powerWords = parts[0]
        .split(" ")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((w: any) => ({ text: w, isBold: true }));
      const regularWords = parts[1]
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          parts[1].split(" ").map((w: any) => ({ text: w, isBold: false }))
        : [];

      setTossups((prev) => [...prev, tu]);
      setTossupAnswered(false);
      setTUH((prev) => prev + 1);
      setAllWords([
        ...powerWords,
        { text: "(*)", isBold: true },
        ...regularWords,
      ]);
      setDisplayedWords([]);
      setIsPaused(false);
      setProgressBarWidth("100%");
    } catch (error) {
      console.error(error);
    } finally {
      setProgressBarWidth("100%");
      setAnsPlaceholder("Answer");
      setTimeout(() => {
        setIsFetchingTossup(false);
      }, 1);
    }
  }, [forcePromptable, isFetchingTossup]);

  const buzz = useCallback(() => {
    if (TUH == 0 || displayedWords.length == 0 || tossupAnswered || isAnswering)
      return;

    setIsAnswering(true);
    setIsPaused(true);
  }, [TUH, displayedWords.length, isAnswering, tossupAnswered]);

  useEffect(() => {
    if (TUH > 0 && displayedWords.length < allWords.length && !isPaused) {
      const intervalId = setInterval(() => {
        setDisplayedWords((prev) => {
          if (prev.length + 1 === allWords.length) {
            setTossups((prev) => {
              if (prev.length === 0) return prev;

              const newState = [...prev];
              const lastIndex = newState.length - 1;

              newState[lastIndex] = {
                ...newState[lastIndex],
                doneReading: true,
              };

              return newState;
            });
          }
          const nextWord = allWords[prev.length];
          if (!nextWord) return prev;
          return [...prev, nextWord];
        });
      }, 140);

      return () => clearInterval(intervalId);
    }
  }, [TUH, displayedWords.length, allWords, isPaused]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key.toLowerCase() == "p") {
        setIsPaused((prev) => !prev);
      }

      if (event.key.toLowerCase() == "s") {
        setDisplayedWords(allWords);
        setTossupAnswered(true);
      }

      if (event.key.toLowerCase() == "n") {
        fetchNewTossup();
      }

      if (event.key.toLowerCase() == " ") {
        buzz();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsPaused, setDisplayedWords, allWords, fetchNewTossup, buzz]);

  return (
    <>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex h-full w-full flex-col gap-4 overflow-y-auto! p-4">
          <div className="flex items-center justify-between">
            <h4>
              {TUH !== 0
                ? `Tossup ${TUH} | ${tossups[TUH - 1]!.set.name} Packet ${tossups[TUH - 1]!.packet.number} Question ${tossups[TUH - 1]!.number}`
                : "Not started"}
            </h4>
            <div>
              <h3 className="text-sm">
                <span className="mr-1 text-4xl">{score}</span>Points
              </h3>
            </div>
          </div>
          <hr className="mb-0" />
          <AnimatePresence>
            {isAnswering && (
              <form onSubmit={answerInputForm.handleSubmit(onSubmitAnswer)}>
                <InputGroup>
                  <InputGroupInput
                    autoFocus
                    placeholder={ansPlaceHolder}
                    {...answerInputForm.register("answer")}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      className="p-2"
                      type="submit"
                      variant="secondary"
                    >
                      Submit
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </form>
            )}
          </AnimatePresence>
          <div className="relative flex grow flex-col gap-4 pt-[15px]">
            {TUH == 0 && <p>Press &quot;Start&quot; to begin</p>}
            {toReversed(tossups).map((tu, i) => (
              <TossupCard
                key={`${tu.set.name}-${tu.packet.number}-${tu.number}`}
                i={i}
                tu={tu}
                TUH={TUH}
                displayedWords={displayedWords}
                tossupAnswered={tossupAnswered}
              />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 z-10 h-[15px] w-full overflow-hidden">
          <AnimatePresence>
            {isFetchingTossup && (
              <motion.div
                key={loadingBarKey + " tossup-progress"}
                className="h-full bg-primary"
                initial={{ y: 15, width: "0%" }}
                animate={{
                  y: 0,
                  width: progressBarWidth,
                }}
                exit={{
                  y: 15,
                  transition: {
                    y: { type: "spring", stiffness: 300, damping: 30 },
                  },
                }}
                transition={{
                  width: {
                    duration: progressBarWidth === "100%" ? 0.3 : 5,
                    ease: "easeOut",
                  },
                  y: { type: "spring", stiffness: 300, damping: 30 },
                }}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="bottom-0 w-full border-t-2 border-dashed border-foreground backdrop-blur-md">
          <div className="flex w-full justify-between p-6">
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      if (TUH === 0 || isPaused || isFinished) fetchNewTossup();
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
              <Button onClick={buzz}>Buzz</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
