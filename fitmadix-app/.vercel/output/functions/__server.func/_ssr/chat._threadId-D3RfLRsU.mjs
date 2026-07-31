import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-JnDgNciN.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as ArrowLeft, b as ArrowUp, f as Menu, g as HeartPulse, h as LoaderCircle, i as Trash2, l as Plus, n as User, p as LogOut, r as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { i as useServerFn, n as deleteThread, r as sendChatMessage, t as createThread } from "./ai-doctor.functions-CFg1QxLu.mjs";
import { t as Route } from "./chat._threadId-CSn3wKP0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat._threadId-D3RfLRsU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatThread() {
	const { threadId } = Route.useParams();
	const navigate = useNavigate();
	const send = useServerFn(sendChatMessage);
	const create = useServerFn(createThread);
	const remove = useServerFn(deleteThread);
	const [threads, setThreads] = (0, import_react.useState)([]);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [loadingMsgs, setLoadingMsgs] = (0, import_react.useState)(true);
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const scrollRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("threads").select("id, title, updated_at").order("updated_at", { ascending: false }).then(({ data }) => setThreads(data ?? []));
	}, []);
	(0, import_react.useEffect)(() => {
		setLoadingMsgs(true);
		setMessages([]);
		supabase.from("messages").select("id, role, content, created_at").eq("thread_id", threadId).order("created_at", { ascending: true }).then(({ data, error }) => {
			if (error) toast.error(error.message);
			setMessages(data ?? []);
			setLoadingMsgs(false);
			setTimeout(() => inputRef.current?.focus(), 50);
		});
	}, [threadId]);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, busy]);
	const submit = async (e) => {
		e?.preventDefault();
		const text = input.trim();
		if (!text || busy) return;
		setInput("");
		setBusy(true);
		const tempId = `tmp-${Date.now()}`;
		setMessages((m) => [...m, {
			id: tempId,
			role: "user",
			content: text,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		try {
			const { reply } = await send({ data: {
				threadId,
				message: text
			} });
			setMessages((m) => [...m, {
				id: `a-${Date.now()}`,
				role: "assistant",
				content: reply,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}]);
			supabase.from("threads").select("id, title, updated_at").order("updated_at", { ascending: false }).then(({ data }) => setThreads(data ?? []));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to send");
			setMessages((m) => m.filter((x) => x.id !== tempId));
			setInput(text);
		} finally {
			setBusy(false);
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	};
	const newThread = async () => {
		try {
			const { id } = await create();
			navigate({
				to: "/chat/$threadId",
				params: { threadId: id }
			});
			setSidebarOpen(false);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to create");
		}
	};
	const removeThread = async (id) => {
		if (!confirm("Delete this consultation?")) return;
		try {
			await remove({ data: { threadId: id } });
			const next = threads.filter((t) => t.id !== id);
			setThreads(next);
			if (id === threadId) if (next.length) navigate({
				to: "/chat/$threadId",
				params: { threadId: next[0].id }
			});
			else newThread();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to delete");
		}
	};
	const signOut = async () => {
		await supabase.auth.signOut();
		navigate({
			to: "/",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface transition-transform md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2 font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-3.5 w-3.5" })
								}),
								"Fit",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: "madix"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSidebarOpen(false),
							className: "grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary md:hidden",
							"aria-label": "Close menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: newThread,
						className: "mx-3 mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New consultation"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex-1 overflow-y-auto px-2 pb-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 pb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground",
								children: "Recent"
							}),
							threads.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-4 text-xs text-muted-foreground",
								children: "No consultations yet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-0.5",
								children: threads.map((t) => {
									const active = t.id === threadId;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: `group flex items-center gap-1 rounded-lg px-1 ${active ? "bg-accent" : "hover:bg-secondary"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/chat/$threadId",
											params: { threadId: t.id },
											onClick: () => setSidebarOpen(false),
											className: `min-w-0 flex-1 truncate px-2 py-2 text-sm ${active ? "text-accent-foreground font-medium" : "text-foreground"}`,
											title: t.title,
											children: t.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeThread(t.id),
											className: "grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100",
											"aria-label": "Delete consultation",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})]
									}, t.id);
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							className: "flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), " Profile"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: signOut,
							className: "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign out"]
						})]
					})
				]
			}),
			sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-foreground/20 md:hidden",
				onClick: () => setSidebarOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "glass flex items-center justify-between border-b border-border px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSidebarOpen(true),
								className: "grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary md:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex min-w-0 items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									className: "hidden items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:inline-flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Home"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "AI doctor · general information only"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-border/60 bg-chart-4/5 px-4 py-2 text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-chart-4" }), "Not a substitute for a real doctor. For emergencies call your local emergency number."]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scrollRef,
						className: "flex-1 overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto max-w-2xl px-4 py-6",
							children: loadingMsgs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center py-16",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
							}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Welcome, { onPick: (t) => setInput(t) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubble, {
									role: m.role,
									content: m.content
								}, m.id)), busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubble, {
									role: "assistant",
									content: "",
									typing: true
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "border-t border-border bg-background px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto flex max-w-2xl items-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: inputRef,
								value: input,
								onChange: (e) => setInput(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										submit();
									}
								},
								rows: 1,
								placeholder: "Describe your symptoms…",
								className: "min-h-11 max-h-40 flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none ring-primary/40 focus:ring-2",
								disabled: busy
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy || !input.trim(),
								className: "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-50",
								"aria-label": "Send",
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-2 max-w-2xl text-center text-[10px] text-muted-foreground",
							children: "AI can make mistakes. Verify important info with a licensed clinician."
						})]
					})
				]
			})
		]
	});
}
function Welcome({ onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-2xl font-semibold tracking-tight",
				children: "How are you feeling today?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Describe your symptoms in your own words. I'll ask a couple of follow-ups."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-6 grid max-w-lg gap-2 text-left",
				children: [
					"I've had a headache for 3 days, mostly behind my eyes.",
					"My throat has been sore since yesterday and I feel a bit warm.",
					"I've been feeling short of breath after climbing stairs.",
					"I have a rash on my forearm that itches."
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onPick(p),
					className: "rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant",
					children: p
				}, p))
			})
		]
	});
}
function Bubble({ role, content, typing }) {
	const isUser = role === "user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex gap-3 ${isUser ? "justify-end" : "justify-start"}`,
		children: [
			!isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-soft ${isUser ? "bg-gradient-primary text-primary-foreground" : "border border-border bg-card text-foreground"}`,
				children: typing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, { delay: .15 }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, { delay: .3 })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleMarkdown, { text: content })
			}),
			isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" })
			})
		]
	});
}
function Dot({ delay = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current",
		style: { animationDelay: `${delay}s` }
	});
}
function SimpleMarkdown({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 leading-relaxed",
		children: text.split(/\n{2,}/).map((block, i) => {
			const lines = block.split("\n");
			if (lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-disc space-y-1 pl-5",
				children: lines.map((l, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: formatInline(l.replace(/^\s*([-*•]|\d+\.)\s+/, "")) }, j))
			}, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap",
				children: formatInline(block)
			}, i);
		})
	});
}
function formatInline(t) {
	const parts = [];
	const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
	let last = 0;
	let m;
	while (m = regex.exec(t)) {
		if (m.index > last) parts.push(t.slice(last, m.index));
		const tok = m[0];
		if (tok.startsWith("**")) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tok.slice(2, -2) }, m.index));
		else parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded bg-muted px-1 py-0.5 text-xs",
			children: tok.slice(1, -1)
		}, m.index));
		last = m.index + tok.length;
	}
	if (last < t.length) parts.push(t.slice(last));
	return parts;
}
//#endregion
export { ChatThread as component };
