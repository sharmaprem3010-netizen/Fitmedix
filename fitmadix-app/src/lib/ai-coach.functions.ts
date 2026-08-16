import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ─────────────────────────────────────────
// AI Workout Generator
// ─────────────────────────────────────────

const WORKOUT_SYSTEM_PROMPT = `You are Coach Madix, an elite sports science and conditioning AI. Generate evidence-based workout routines.

Rules:
1. Return ONLY valid JSON matching this exact schema (no markdown, no code fences):
{
  "title": "string",
  "summary": "string",
  "splitOverview": "string",
  "exercises": [
    {
      "name": "string",
      "category": "Chest|Back|Legs|Shoulders|Arms|Core|Cardio|Full Body",
      "sets": number,
      "reps": "string",
      "restSeconds": number,
      "reasoning": "string"
    }
  ]
}
2. Include 5-8 exercises per routine.
3. Base exercise selection on the user's goal, experience level, and available equipment.
4. Provide specific set/rep/rest schemes appropriate for the stated goal.`;

export const generateAIWorkoutServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { goal: string; experienceLevel: string; daysPerWeek: number; equipment: string; targetFocus: string }) =>
    z.object({
      goal: z.string(),
      experienceLevel: z.string(),
      daysPerWeek: z.number(),
      equipment: z.string(),
      targetFocus: z.string(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured (GEMINI_API_KEY missing)");

    const userPrompt = `Generate a workout routine with these parameters:
- Primary Goal: ${data.goal}
- Experience Level: ${data.experienceLevel}
- Training Days per Week: ${data.daysPerWeek}
- Available Equipment: ${data.equipment}
- Target Focus / Split Type: ${data.targetFocus}

Return ONLY the JSON object, no other text.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: WORKOUT_SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

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
      throw new Error("Failed to parse AI response into workout plan");
    }
  });

// ─────────────────────────────────────────
// AI Meal Plan Generator
// ─────────────────────────────────────────

const MEAL_SYSTEM_PROMPT = `You are Coach Madix, an elite sports nutrition AI. Generate science-based meal plans.

Rules:
1. Return ONLY valid JSON matching this exact schema (no markdown, no code fences):
{
  "title": "string",
  "dailyCalories": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "meals": [
    {
      "mealName": "string",
      "timeSlot": "string",
      "description": "string",
      "ingredients": ["string"],
      "macros": { "calories": number, "protein": number, "carbs": number, "fat": number }
    }
  ]
}
2. Include 4-6 meals per day.
3. All macro totals should sum to approximately the target calories.
4. Use whole, accessible foods.`;

export const generateAIMealPlanServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { calorieTarget: number; dietType: string; goal: string; allergies: string }) =>
    z.object({
      calorieTarget: z.number(),
      dietType: z.string(),
      goal: z.string(),
      allergies: z.string(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured (GEMINI_API_KEY missing)");

    const userPrompt = `Generate a daily meal plan with these parameters:
- Target Calories: ${data.calorieTarget} kcal
- Dietary Focus: ${data.dietType}
- Goal: ${data.goal}
- Allergies/Restrictions: ${data.allergies || 'None'}

Return ONLY the JSON object, no other text.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: MEAL_SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI error: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as any;
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error("Failed to parse AI response into meal plan");
    }
  });

// ─────────────────────────────────────────
// AI Coach Chat
// ─────────────────────────────────────────

const COACH_SYSTEM_PROMPT = `You are Coach Madix, an elite sports science and conditioning AI advisor. You specialize in:
- Exercise form and technique
- Workout programming and periodization
- Sports nutrition and supplementation
- Recovery and injury prevention
- Plateau breaking strategies

Rules:
1. Give concise, evidence-based answers.
2. Use bullet points for actionable advice.
3. Reference scientific principles when applicable.
4. If asked about medical conditions, advise consulting a healthcare provider.
5. Keep responses focused and under 300 words.`;

export const askAICoachServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { query: string; context: string }) =>
    z.object({
      query: z.string().min(1).max(2000),
      context: z.string(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured (GEMINI_API_KEY missing)");

    const userPrompt = `User context: ${data.context}\n\nQuestion: ${data.query}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: COACH_SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit — please try again in a moment.");
      throw new Error(`AI error: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as any;
    const reply = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't generate a response. Please try again.";
    
    return { reply };
  });
