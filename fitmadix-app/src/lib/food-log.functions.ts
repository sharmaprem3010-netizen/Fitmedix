import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const FOOD_SEARCH_PROMPT = `You are a nutrition database. The user will provide a food item description.
Respond with a JSON object containing the estimated nutritional info for a standard serving.
Structure:
{
  "name": "Proper name of food",
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "serving_size": "e.g. 1 cup, 100g, 1 slice"
}`;

export const searchFoodLogItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { query: string }) =>
    z.object({ query: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured (GEMINI_API_KEY missing)");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: FOOD_SEARCH_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: `Provide nutrition for: ${data.query}` }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to search food item.");
    }

    const json = await res.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    try {
      const parsed = JSON.parse(rawText);
      return {
        name: parsed.name || data.query,
        calories: Number(parsed.calories) || 0,
        protein_g: Number(parsed.protein_g) || 0,
        carbs_g: Number(parsed.carbs_g) || 0,
        fat_g: Number(parsed.fat_g) || 0,
        serving_size: parsed.serving_size || "1 serving",
      };
    } catch {
      throw new Error("Could not parse AI response.");
    }
  });
