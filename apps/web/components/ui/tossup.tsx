"use client";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
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

  return (
    <Card className="relative text-lg wrap-break-word">
      {loadingAnalysis && i == 0 && (
        <div className="absolute z-12 flex h-full w-full items-center justify-center">
          <div>
            <h3>Loading Analysis...</h3>
            <p>This may take up to a minute.</p>
          </div>
        </div>
      )}
      <div className={clsx(loadingAnalysis && i == 0 && "blur-sm")}>
        {(TUH == 0 || i == 0) &&
          (analyzedTUI !== i || analysisParts == null ? (
            <p className="leading-relaxed">
              <>
                {displayedWords.map((word, i) => (
                  <span key={i} className={word.isBold ? "font-bold" : ""}>
                    {word.text}{" "}
                  </span>
                ))}
              </>
            </p>
          ) : (
            analyzedTUI === i &&
            analysisParts && (
              <>
                <p>
                  {analysisParts.map((part, i) => (
                    <React.Fragment key={i}>
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
              </>
            )
          ))}
        {(tossupAnswered || i !== 0) && (
          <div
            className={clsx(
              "flex w-full justify-between",
              tossupAnswered && i == 0 && "mt-4"
            )}
          >
            <p>
              Answer: <span dangerouslySetInnerHTML={{ __html: tu.answer }} />
            </p>
            {tossupAnswered && i == 0 && (
              <Button
                variant={"link"}
                onClick={
                  analyzedTUI == i
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
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
