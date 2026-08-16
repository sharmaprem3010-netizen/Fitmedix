import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const PRESCRIPTION_PROMPT = `You are a medical prescription reader AI assistant called Fitmadix.

The user has uploaded a photo of a medical prescription. Analyze it carefully and extract all information.

Your response MUST be valid JSON with this exact structure:
{
  "medicines": [
    {
      "name": "Medicine name as written",
      "dosage": "e.g. 500mg",
      "timing": "morning|afternoon|evening|night|morning_and_night|three_times_daily",
      "withFood": true or false,
      "explanation": "Simple one-line explanation of what this medicine is for, in very easy language"
    }
  ],
  "summary": "A 2-3 sentence friendly summary explaining the entire prescription in very simple, easy-to-understand language. Speak as if explaining to someone who has never been to a doctor.",
  "warnings": "Any important warnings like drug interactions or side effects, in simple language. Say 'None' if not applicable.",
  "nextSteps": "What the patient should do next — e.g. 'Take these medicines for 5 days. If you still feel sick after 5 days, go back to the doctor.'"
}

Rules:
- If you cannot read the prescription clearly, say so in the summary and set medicines to an empty array.
- NEVER make up medicine names. Only report what you can actually read.
- Keep all explanations at a 5th-grade reading level.
- Respond ONLY with the JSON object. No markdown, no code fences, no extra text.`;

export const analyzePrescription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { imageBase64: string; language?: string }) =>
    z
      .object({
        imageBase64: z.string().min(100).max(10_000_000),
        language: z.enum(["en", "hi", "bn"]).optional().default("en"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured (GEMINI_API_KEY missing)");

    const languageMap: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिंदी)",
      bn: "Bengali (বাংলা)",
    };
    const langInstruction = `Respond in ${languageMap[data.language ?? "en"]}. All explanations, summaries, and warnings must be in this language.`;

    // Extract the base64 data and mime type
    const match = data.imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) throw new Error("Invalid image data");
    const mimeType = match[1];
    const base64Data = match[2];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: PRESCRIPTION_PROMPT + "\n\n" + langInstruction }],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: "Please read this prescription and explain what the medicines are, when to take them, and what I should do next.",
                },
              ],
            },
          ],
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit — please try again in a moment.");
      throw new Error(`AI error: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as any;
    const rawText =
      json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Parse the JSON response, handling potential markdown code fences
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    try {
      const parsed = JSON.parse(cleaned);
      return {
        medicines: parsed.medicines ?? [],
        summary: parsed.summary ?? "Could not read the prescription clearly.",
        warnings: parsed.warnings ?? "None",
        nextSteps: parsed.nextSteps ?? "Please consult your doctor.",
      };
    } catch {
      return {
        medicines: [],
        summary: rawText || "Could not analyze the prescription. Please try taking a clearer photo.",
        warnings: "None",
        nextSteps: "Please try again with a clearer photo, or show the prescription to a pharmacist.",
      };
    }
  });
