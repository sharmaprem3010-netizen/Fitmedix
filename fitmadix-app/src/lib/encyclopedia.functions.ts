import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const ENCYCLOPEDIA_PROMPTS = {
  food: `You are an AI Food Encyclopedia.
The user is asking about a food item or ingredient.
Respond with a JSON object exactly matching this structure:
{
  "name": "Food Name (with emoji)",
  "description": "Short, friendly description (2-3 sentences)",
  "health_rating": "good" | "okay" | "improve",
  "calories": "Approx calories per 100g or standard serving",
  "nutrients": {
    "protein": "grams or description",
    "carbs": "grams or description",
    "fat": "grams or description",
    "fiber": "grams or description"
  },
  "benefits": ["Benefit 1", "Benefit 2"],
  "warnings": ["Warning 1 if any, else empty list"]
}
Keep language simple (5th-grade level).`,

  medicine: `You are an AI Medicine Encyclopedia.
The user is asking about a medication or drug.
Respond with a JSON object exactly matching this structure:
{
  "name": "Medicine Name (generic & common brand)",
  "description": "Simple explanation of what it is and how it works (2-3 sentences)",
  "uses": ["Use 1", "Use 2"],
  "dosage_tips": "General advice on how it's usually taken (always add: follow doctor's orders)",
  "side_effects": [
    { "effect": "Effect name", "severity": "mild" | "moderate" | "severe" }
  ],
  "warnings": ["Important interaction or contraindication 1"]
}
Keep language simple (5th-grade level). Never prescribe.`,

  disease: `You are an AI Disease & Condition Encyclopedia.
The user is asking about a medical condition or disease.
Respond with a JSON object exactly matching this structure:
{
  "name": "Condition Name",
  "description": "Simple explanation of the condition (2-3 sentences)",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "causes": ["Cause 1", "Cause 2"],
  "prevention": ["Prevention tip 1", "Prevention tip 2"],
  "treatments": ["Common treatment 1", "Common treatment 2"],
  "when_to_see_doctor": "Clear advice on when this requires medical attention",
  "is_emergency": true | false
}
Keep language simple (5th-grade level). Never diagnose.`,
};

export const searchEncyclopedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { query: string; type: "food" | "medicine" | "disease"; language?: string }) =>
      z
        .object({
          query: z.string().min(1).max(500),
          type: z.enum(["food", "medicine", "disease"]),
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
    const langInstruction = `Respond in ${languageMap[data.language ?? "en"]}.`;

    const systemPrompt = ENCYCLOPEDIA_PROMPTS[data.type] + "\n\n" + langInstruction;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: `Search for: ${data.query}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit — please try again in a moment.");
      throw new Error(`AI error: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as any;
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error("Could not parse AI response.");
    }
  });
