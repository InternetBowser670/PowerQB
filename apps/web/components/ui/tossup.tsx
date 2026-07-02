"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import React from "react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import clsx from "clsx";

export default function TossupCard({
  i,
  tu,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TUH,
  displayedWords,
  tossupAnswered,
}: {
  i: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tu: any;
  TUH: number;
  displayedWords: { text: string; isBold: boolean }[];
  tossupAnswered: boolean;
}) {
  const [analyzedTUI, setAnalyzedTUI] = useState<null | number>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysisParts, setAnalysisParts] = useState<any[] | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function analyzeTossup() {
    setLoadingAnalysis(true);
    const res = await fetch("/api/analyze-tossup", {
      method: "POST",
      body: JSON.stringify({
        tossup: tu.question_sanitized,
        answer: tu.answer,
      }),
    });

    const json = await res.json();

    setLoadingAnalysis(false);
    setAnalysisParts(json.analyzedTossupParts);
    setAnalyzedTUI(i);
  }

  function toggleAnalysis() {
    if (analyzedTUI === i) {
      setAnalyzedTUI(null);
    } else {
      setAnalyzedTUI(i);
    }
  }

  const hasAnalysis = analysisParts && analysisParts.length > 0;

  return i === 0 ? (
    <Card className="relative text-lg wrap-break-word">
      {loadingAnalysis && (
        <div className="absolute z-10 flex h-full w-full items-center justify-center">
          <div>
            <h3>Loading Analysis...</h3>
            <p>This may take up to a minute.</p>
          </div>
        </div>
      )}

      <div className={clsx(loadingAnalysis && "blur-sm")}>
        {analyzedTUI !== i || analysisParts == null ? (
          <p className="leading-relaxed">
            {displayedWords.map((word, index) => (
              <span key={index} className={word.isBold ? "font-bold" : ""}>
                {word.text}{" "}
              </span>
            ))}
          </p>
        ) : (
          <p>
            {analysisParts.map((part, index) => (
              <React.Fragment key={index}>
                {part.analysis ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <mark className="mx-0.5 rounded-md bg-primary px-0.5">
                        {part.text}
                      </mark>
                    </TooltipTrigger>
                    <TooltipContent>{part.analysis}</TooltipContent>
                  </Tooltip>
                ) : (
                  <span>{part.text}</span>
                )}
              </React.Fragment>
            ))}
          </p>
        )}

        {tossupAnswered && (
          <div className="mt-4 flex w-full justify-between">
            <p>
              Answer: <span dangerouslySetInnerHTML={{ __html: tu.answer }} />
            </p>

            <Button
              variant="link"
              onClick={
                analyzedTUI === i
                  ? toggleAnalysis
                  : analysisParts == null
                    ? analyzeTossup
                    : toggleAnalysis
              }
            >
              {analyzedTUI !== i
                ? hasAnalysis
                  ? "Show analysis"
                  : "Analyze"
                : "Hide analysis"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  ) : (
    <Card className="p-0 text-lg wrap-break-word">
      <CardHeader className="--mb-(--card-spacing) h-fit! bg-accent px-0 py-1 wrap-break-word!">
        <Button
          className="text-md cursor-pointer justify-start p-0! hover:bg-transparent! focus:outline-none px-4!"
          onClick={() => setExpanded(!expanded)}
          variant={"ghost"}
        >
          <span dangerouslySetInnerHTML={{ __html: tu.answer }} />
        </Button>
      </CardHeader>

      {expanded && (
        <>
          <CardContent className="!">
            <p dangerouslySetInnerHTML={{ __html: tu.question }} />
          </CardContent>
          <CardFooter className="pb-6 text-[15px] text-white/75">
            <div className="flex w-full justify-between">
              <p>
                {tu.set.name} / {tu.category} /{" "}
                {tu.subcategory ?? "No subcategory"}
              </p>
              <p>Packet {tu.packet.number} / Question {tu.number}</p>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
