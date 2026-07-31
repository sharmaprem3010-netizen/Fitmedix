import { r as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-JnDgNciN.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as Activity, _ as ChevronRight, a as Sun, d as MessagesSquare, f as Menu, m as Lock, o as Stethoscope, r as TriangleAlert, s as ShieldCheck, t as X, u as Moon, v as Check, x as ArrowRight, y as Brain } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C_ay4C5o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useTheme() {
	const [theme, setTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const initial = (typeof window !== "undefined" ? localStorage.getItem("fitmadix-theme") : null) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		setTheme(initial);
		document.documentElement.classList.toggle("dark", initial === "dark");
	}, []);
	const toggle = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		document.documentElement.classList.toggle("dark", next === "dark");
		localStorage.setItem("fitmadix-theme", next);
	};
	return {
		theme,
		toggle
	};
}
function useSession() {
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
		return () => sub.subscription.unsubscribe();
	}, []);
	return signedIn;
}
function Logo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2 font-semibold tracking-tight",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-base leading-none",
				children: "F"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-lg",
			children: ["Fit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary",
				children: "madix"
			})]
		})]
	});
}
function Nav() {
	const { theme, toggle } = useTheme();
	const signedIn = useSession();
	const [open, setOpen] = (0, import_react.useState)(false);
	const links = [
		{
			href: "#features",
			label: "Features"
		},
		{
			href: "#how",
			label: "How it works"
		},
		{
			href: "#safety",
			label: "Safety"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "glass sticky top-0 z-50 border-b border-border/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-8 md:flex",
					"aria-label": "Primary",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: l.label
					}, l.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggle,
							"aria-label": "Toggle theme",
							className: "grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
							children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
						}),
						signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/chat",
							className: "hidden items-center gap-1 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:inline-flex",
							children: ["Open chat ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline",
							children: "Sign in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auth",
							search: { mode: "signup" },
							className: "hidden items-center gap-1 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:inline-flex",
							children: ["Get started ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "grid h-9 w-9 place-items-center rounded-full border border-border md:hidden",
							"aria-label": "Open menu",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border/60 bg-background md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3",
				children: [links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: l.href,
					onClick: () => setOpen(false),
					className: "rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary",
					children: l.label
				}, l.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: signedIn ? "/chat" : "/auth",
					onClick: () => setOpen(false),
					className: "mt-2 rounded-full bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background",
					children: signedIn ? "Open chat" : "Get started"
				})]
			})
		})]
	});
}
function Hero() {
	const signedIn = useSession();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "top",
		className: "bg-hero relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-4 pt-16 pb-16 text-center sm:px-6 sm:pt-24 sm:pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-float-up inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "Clinical-Grade AI Assistant"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "animate-float-up mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl",
					style: { animationDelay: "80ms" },
					children: [
						"Your personal ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "AI doctor,"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden sm:block" }),
						" anytime."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "animate-float-up mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg",
					style: { animationDelay: "160ms" },
					children: "Describe how you feel and Fitmadix walks you through possible causes, red-flag warnings, and next steps — grounded in general medical knowledge and clear about its limits."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-float-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
					style: { animationDelay: "240ms" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: signedIn ? "/chat" : "/auth",
						search: signedIn ? void 0 : { mode: "signup" },
						className: "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-elegant transition-transform hover:-translate-y-0.5 sm:w-auto",
						children: [signedIn ? "Continue your consultation" : "Start a free consultation", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#safety",
						className: "inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto",
						children: "Read safety notice"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-float-up mt-8 flex items-start gap-2 rounded-2xl border border-border bg-background/60 p-4 text-left text-xs text-muted-foreground shadow-soft",
					style: { animationDelay: "320ms" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-chart-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: "Not medical advice."
					}), " Fitmadix is an AI assistant, not a licensed physician. For emergencies, call your local emergency number immediately."] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-float-up mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border/60 pt-8",
					style: { animationDelay: "400ms" },
					children: [
						{
							icon: ShieldCheck,
							label: "HIPAA",
							sub: "Compliant"
						},
						{
							icon: Check,
							label: "GDPR",
							sub: "Ready"
						},
						{
							icon: Lock,
							label: "E2EE",
							sub: "Encrypted"
						}
					].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-base tracking-wide text-foreground",
								children: b.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-widest text-muted-foreground",
								children: b.sub
							})]
						})]
					}, b.label))
				})
			]
		})
	});
}
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "features",
		className: "mx-auto max-w-6xl px-4 py-24 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-primary",
					children: "What it does"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-semibold sm:text-5xl",
					children: "A thoughtful first opinion, on tap."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground",
					children: "Fitmadix isn't a booking tool or a clinic — it's an AI you can talk to like a doctor friend, whenever a question comes up."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: [
				{
					icon: Brain,
					title: "Symptom analysis",
					desc: "Describe what you feel in your own words. The AI asks clarifying questions like a real intake."
				},
				{
					icon: Stethoscope,
					title: "Doctor-style guidance",
					desc: "Possible causes, home care tips, and when to seek in-person care — explained plainly."
				},
				{
					icon: TriangleAlert,
					title: "Red-flag warnings",
					desc: "Clear alerts for emergency symptoms so you never miss something serious."
				},
				{
					icon: MessagesSquare,
					title: "Saved consultations",
					desc: "Every conversation is saved to your account so you can pick up where you left off."
				},
				{
					icon: Activity,
					title: "Personalized to you",
					desc: "Add age, sex, allergies, and history once — the AI uses it in every reply."
				},
				{
					icon: ShieldCheck,
					title: "Private by default",
					desc: "Your chats are only visible to you. Encrypted in transit and at rest."
				}
			].map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "group relative rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-lg font-medium",
						children: it.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: it.desc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "absolute right-5 top-6 h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" })
				]
			}, it.title))
		})]
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "how",
		className: "border-y border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-24 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-primary",
					children: "How it works"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-semibold sm:text-4xl",
					children: "Three steps to an answer."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-12 grid gap-6 sm:grid-cols-3",
				children: [
					{
						n: "01",
						title: "Create your account",
						desc: "Sign up with email and add a basic profile so the AI can tailor its answers."
					},
					{
						n: "02",
						title: "Describe your symptoms",
						desc: "Chat naturally. The AI asks follow-up questions the way a good doctor would."
					},
					{
						n: "03",
						title: "Get clear guidance",
						desc: "Possible causes, self-care steps, and when to seek professional help — with warnings when it matters."
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm text-primary",
							children: s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-xl font-medium",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: s.desc
						})
					]
				}, s.n))
			})]
		})
	});
}
function Safety() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "safety",
		className: "mx-auto max-w-4xl px-4 py-24 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 place-items-center rounded-xl bg-chart-4/15 text-chart-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold sm:text-3xl",
					children: "Important safety notice"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-4 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Fitmadix is an AI assistant powered by large language models. It is designed for",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: " general educational and informational purposes only"
						}),
						" ",
						"and is not a substitute for professional medical advice, diagnosis, or treatment."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "Always seek the advice of a qualified healthcare provider"
					}), " with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you read here."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: [
							"If you may be having a medical emergency, call your local emergency number immediately.",
							"Do not rely on Fitmadix for prescriptions, dosing, or diagnosis of serious conditions.",
							"AI can make mistakes. Verify important information with a licensed clinician."
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t })]
						}, t))
					})
				]
			})]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Fitmadix"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#safety",
						className: "hover:text-foreground",
						children: "Safety"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#features",
						className: "hover:text-foreground",
						children: "Features"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "hover:text-foreground",
						children: "Sign in"
					})
				]
			})]
		})
	});
}
function LandingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Safety, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { LandingPage as component };
