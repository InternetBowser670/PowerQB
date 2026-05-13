import { NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { z } from "zod";

const ansSchema = z.object({
  analyzedTossupParts: z.array(
    z.object({
      text: z.string(),
      analysis: z.string().optional(),
    })
  ),
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { tossup, answer } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",

      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },

        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,

          required: ["analyzedTossupParts"],

          properties: {
            analyzedTossupParts: {
              type: Type.ARRAY,

              items: {
                type: Type.OBJECT,

                required: ["text"],

                properties: {
                  text: {
                    type: Type.STRING,
                  },

                  analysis: {
                    type: Type.STRING,
                  },
                },
              },
            },
          },
        },
      },

      contents: [
        {
          role: "user",

          parts: [
            {
              text: `
You will be provided with a quizbowl tossup.

Deconstruct the tossup into sequential parts.

Each part must contain:
- text
- optional analysis

Rules:
- Parts must remain in order
- Parts must not overlap
- Do NOT include the answer anywhere
- Analysis should explain clues useful for identifying the answer
- Only attach analysis to especially important clues
- Leave many parts without analysis
- Analysis can be detailed
- Keep analyzed text spans reasonably short with good space between them, for instance if there was a tossup saying "The modern method of synthesizing this compound performs oxidation in the presence of a vanadium oxide catalyst to yield a dehydrated dimer of this compound which fumes," you could put analysis for dehydrated dimer.
- If a part ends with a period include a space after it.

Tossup:
"${tossup}"

Answer (DO NOT INCLUDE):
"${answer}"
              `,
            },
          ],
        },
      ],
    });

    const rawText = response.text
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!rawText) {
      return NextResponse.json(
        {
          error: "Model returned empty response",
        },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(rawText);

    const validated = ansSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
