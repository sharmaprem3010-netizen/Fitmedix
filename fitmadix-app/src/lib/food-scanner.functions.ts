import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const FOOD_ANALYSIS_PROMPT = `You are a friendly nutritionist AI assistant called Fitmadix.

The user has taken a photo of their meal/food. Analyze it and provide simple, friendly dietary advice.

Your response MUST be valid JSON with this exact structure:
{
  "items": ["item1", "item2", "item3"],
  "healthRating": "good" or "okay" or "improve",
  "advice": "A friendly 2-3 sentence dietary advice. Be encouraging, not critical. Use simple language.",
  "calories_estimate": "Approximate calorie range, e.g. '350-450 calories'",
  "nutrients": {
    "protein": "low|medium|high",
    "fiber": "low|medium|high",
    "carbs": "low|medium|high"
  },
  "suggestion": "One simple, actionable suggestion to make this meal healthier. e.g. 'Add some green vegetables next time!'"
}

Rules:
- "good" = balanced, nutritious meal. "okay" = acceptable but could be better. "improve" = too much junk/sugar/oil.
- If you cannot identify the food, say so in the advice and set items to an empty array.
- Be warm and encouraging, never shaming. Talk like a supportive friend.
- Keep all language at a 5th-grade reading level.
- Respond ONLY with the JSON object. No markdown, no code fences, no extra text.`;

export const analyzeFood = createServerFn({ method: "POST" })
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
    const langInstruction = `Respond in ${languageMap[data.language ?? "en"]}. All advice and suggestions must be in this language.`;

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
            parts: [{ text: FOOD_ANALYSIS_PROMPT + "\n\n" + langInstruction }],
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
                  text: "What food is this? Is it healthy? What should I know about this meal?",
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
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let cleaned = rawText.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    try {
      const parsed = JSON.parse(cleaned);
      return {
        items: parsed.items ?? [],
        healthRating: parsed.healthRating ?? "okay",
        advice: parsed.advice ?? "Could not analyze the food.",
        calories_estimate: parsed.calories_estimate ?? "Unknown",
        nutrients: parsed.nutrients ?? { protein: "medium", fiber: "medium", carbs: "medium" },
        suggestion: parsed.suggestion ?? "Try to include a variety of foods in your diet!",
      };
    } catch {
      return {
        items: [],
        healthRating: "okay" as const,
        advice: rawText || "Could not analyze the food. Please try taking a clearer photo.",
        calories_estimate: "Unknown",
        nutrients: { protein: "medium", fiber: "medium", carbs: "medium" },
        suggestion: "Try taking a clearer photo of your meal!",
      };
    }
  });
