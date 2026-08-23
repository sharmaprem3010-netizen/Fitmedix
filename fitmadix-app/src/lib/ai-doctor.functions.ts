import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const SYSTEM_PROMPT = `You are "Fitmadix", a careful, empathetic AI health assistant that responds in the voice of a general practitioner. You are NOT a licensed physician.

Rules on every reply:
1. Start by acknowledging the concern briefly and, if needed, ask 1–2 focused clarifying questions.
2. Give a plain-language explanation of the most likely possibilities (not a definitive diagnosis).
3. Suggest reasonable self-care where safe.
4. Clearly list "red-flag" symptoms that should prompt urgent in-person care or emergency services.
5. Always end with a short disclaimer that this is general information, not a diagnosis, and encourage seeing a licensed clinician when appropriate.

Never:
- Prescribe specific prescription medications or dosages.
- Claim certainty about a diagnosis.
- Provide instructions that could enable self-harm.

If the user describes a medical emergency (chest pain, stroke signs, severe bleeding, suicidal ideation, difficulty breathing, anaphylaxis, etc.), your FIRST line must instruct them to call their local emergency number immediately.

Format responses in short paragraphs and bullet lists. Use Markdown.`;

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { threadId: string; message: string }) =>
    z.object({ threadId: z.string().uuid(), message: z.string().min(1).max(4000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify thread belongs to user
    const { data: thread, error: threadErr } = await supabase
      .from("threads")
      .select("id, title")
      .eq("id", data.threadId)
      .maybeSingle();
    if (threadErr || !thread) throw new Error("Thread not found");

    // Load profile for personalization
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, age, sex, medical_history, allergies")
      .eq("id", userId)
      .maybeSingle();

    // Load full history
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });

    // Insert user message
    const { error: insertErr } = await supabase.from("messages").insert({
      thread_id: data.threadId,
      user_id: userId,
      role: "user",
      content: data.message,
    });
    if (insertErr) throw new Error(insertErr.message);

    const profileBlock = profile
      ? `\n\nPatient profile:\n- Name: ${profile.display_name ?? "N/A"}\n- Age: ${profile.age ?? "N/A"}\n- Sex: ${profile.sex ?? "N/A"}\n- Known history: ${profile.medical_history ?? "None reported"}\n- Allergies: ${profile.allergies ?? "None reported"}`
      : "";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT + profileBlock },
      ...(history ?? []).map((m) => messageSchema.parse(m)),
      { role: "user", content: data.message },
    ];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured (GEMINI_API_KEY missing)");

    const systemInstruction = SYSTEM_PROMPT + profileBlock;

    const geminiContents = [
      ...(history ?? []).map((m) => messageSchema.parse(m)),
      { role: "user", content: data.message },
    ]
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: geminiContents,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit — please try again in a moment.");
      throw new Error(`AI error: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as any;
    const reply =
      json.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm sorry, I couldn't generate a reply.";

    await supabase.from("messages").insert({
      thread_id: data.threadId,
      user_id: userId,
      role: "assistant",
      content: reply,
    });

    // Auto-title thread from first user message
    if (thread.title === "New consultation") {
      const title = data.message.slice(0, 60);
      await supabase.from("threads").update({ title }).eq("id", data.threadId);
    } else {
      await supabase
        .from("threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", data.threadId);
    }

    return { reply };
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads")
      .insert({ user_id: context.userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { threadId: string }) =>
    z.object({ threadId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("threads").delete().eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
