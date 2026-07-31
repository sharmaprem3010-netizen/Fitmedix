import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-JnDgNciN.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as LoaderCircle, l as Plus } from "../_libs/lucide-react.mjs";
import { i as useServerFn, t as createThread } from "./ai-doctor.functions-CFg1QxLu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat.index-CxwC1VME.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatIndex() {
	const navigate = useNavigate();
	const create = useServerFn(createThread);
	const [threads, setThreads] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.from("threads").select("id, title, updated_at").order("updated_at", { ascending: false }).then(({ data, error }) => {
			if (error) toast.error(error.message);
			setThreads(data ?? []);
			if (!data || data.length === 0) startNew();
			else navigate({
				to: "/chat/$threadId",
				params: { threadId: data[0].id },
				replace: true
			});
		});
	}, []);
	const startNew = async () => {
		setCreating(true);
		try {
			const { id } = await create();
			navigate({
				to: "/chat/$threadId",
				params: { threadId: id },
				replace: true
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to create consultation");
		} finally {
			setCreating(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 text-sm text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
				creating || threads === null ? "Loading…" : "Redirecting…",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: startNew,
					className: "mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-foreground hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New consultation"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-xs hover:underline",
					children: "Back home"
				})
			]
		})
	});
}
//#endregion
export { ChatIndex as component };
