import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-doctor.functions-CHx6Dyn3.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SYSTEM_PROMPT = `You are "Fitmadix", a careful, empathetic AI health assistant that responds in the voice of a general practitioner. You are NOT a licensed physician.

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
var messageSchema = objectType({
	role: enumType([
		"user",
		"assistant",
		"system"
	]),
	content: stringType()
});
var sendChatMessage_createServerFn_handler = createServerRpc({
	id: "7ddaba5d84d2ff0d123cdacd6de1b71d5aea46e670a669c57f8be1659179c5be",
	name: "sendChatMessage",
	filename: "src/lib/ai-doctor.functions.ts"
}, (opts) => sendChatMessage.__executeServer(opts));
var sendChatMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	threadId: stringType().uuid(),
	message: stringType().min(1).max(4e3)
}).parse(input)).handler(sendChatMessage_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: thread, error: threadErr } = await supabase.from("threads").select("id, title").eq("id", data.threadId).maybeSingle();
	if (threadErr || !thread) throw new Error("Thread not found");
	const { data: profile } = await supabase.from("profiles").select("display_name, age, sex, medical_history, allergies").eq("id", userId).maybeSingle();
	const { data: history } = await supabase.from("messages").select("role, content").eq("thread_id", data.threadId).order("created_at", { ascending: true });
	const { error: insertErr } = await supabase.from("messages").insert({
		thread_id: data.threadId,
		user_id: userId,
		role: "user",
		content: data.message
	});
	if (insertErr) throw new Error(insertErr.message);
	const messages = [
		{
			role: "system",
			content: SYSTEM_PROMPT + (profile ? `\n\nPatient profile:\n- Name: ${profile.display_name ?? "N/A"}\n- Age: ${profile.age ?? "N/A"}\n- Sex: ${profile.sex ?? "N/A"}\n- Known history: ${profile.medical_history ?? "None reported"}\n- Allergies: ${profile.allergies ?? "None reported"}` : "")
		},
		...(history ?? []).map((m) => messageSchema.parse(m)),
		{
			role: "user",
			content: data.message
		}
	];
	const apiKey = process.env.LOVABLE_API_KEY;
	if (!apiKey) throw new Error("AI is not configured");
	const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			model: "google/gemini-2.5-flash",
			messages
		})
	});
	if (!res.ok) {
		const text = await res.text();
		if (res.status === 429) throw new Error("Rate limit — please try again in a moment.");
		if (res.status === 402) throw new Error("AI credits exhausted. Please contact support.");
		throw new Error(`AI error: ${text.slice(0, 200)}`);
	}
	const reply = (await res.json()).choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a reply.";
	await supabase.from("messages").insert({
		thread_id: data.threadId,
		user_id: userId,
		role: "assistant",
		content: reply
	});
	if (thread.title === "New consultation") {
		const title = data.message.slice(0, 60);
		await supabase.from("threads").update({ title }).eq("id", data.threadId);
	} else await supabase.from("threads").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", data.threadId);
	return { reply };
});
var createThread_createServerFn_handler = createServerRpc({
	id: "d04d2127b90fd3052537b0ae24c01c7af90b727ed22f80df634fc62eec51e94d",
	name: "createThread",
	filename: "src/lib/ai-doctor.functions.ts"
}, (opts) => createThread.__executeServer(opts));
var createThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createThread_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("threads").insert({ user_id: context.userId }).select("id").single();
	if (error) throw new Error(error.message);
	return { id: data.id };
});
var deleteThread_createServerFn_handler = createServerRpc({
	id: "314e84aeacb9ad9b57d161ce51c85a4658c07cb69bff661cb78d2e54fd9dd8cf",
	name: "deleteThread",
	filename: "src/lib/ai-doctor.functions.ts"
}, (opts) => deleteThread.__executeServer(opts));
var deleteThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ threadId: stringType().uuid() }).parse(input)).handler(deleteThread_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("threads").delete().eq("id", data.threadId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { createThread_createServerFn_handler, deleteThread_createServerFn_handler, sendChatMessage_createServerFn_handler };
