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
  const [analysisParts, setAnalysisParts] = useState<any[]>([]);

  async function analyzeTossup() {
    const res = await fetch("/api/analyze-tossup", {
      method: "POST",
      body: JSON.stringify({
        tossup: tu.question_sanitized,
        answer: tu.answer,
      }),
    });

    const json = await res.json();

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

  return (
    <Card key={i} className="text-lg">
      {(TUH == 0 || i == 0) &&
        (analyzedTUI !== i ? (
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
          analyzedTUI === i && (
            <>
              <p>
                {analysisParts.map((part, i) => (
                  <React.Fragment key={i}>
                    {part.analysis ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <mark>{part.text}</mark>
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
        <div className="flex w-full justify-between">
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
              {!(analyzedTUI == i)
                ? analysisParts == null
                  ? "Analyze"
                  : "Show analysis"
                : "Hide analysis"}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
