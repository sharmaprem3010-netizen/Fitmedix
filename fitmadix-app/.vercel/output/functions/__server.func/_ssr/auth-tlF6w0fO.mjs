import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-JnDgNciN.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as Route } from "./auth-TLadDj7W.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-tlF6w0fO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const { mode: initialMode, redirect } = Route.useSearch();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)(initialMode ?? "signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [language, setLanguage] = (0, import_react.useState)("EN");
	const [showLanguageModal, setShowLanguageModal] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({
				to: redirect ?? "/chat",
				replace: true
			});
		});
	}, [navigate, redirect]);
	const submit = async (e) => {
		e.preventDefault();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Enter a valid email");
		if (password.length < 6) return toast.error("Password must be at least 6 characters");
		setLoading(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: `${window.location.origin}/chat`,
						data: { display_name: displayName || email.split("@")[0] }
					}
				});
				if (error) throw error;
				toast.success("Account created — welcome!");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Signed in");
			}
			navigate({
				to: redirect ?? "/chat",
				replace: true
			});
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Something went wrong";
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: `${window.location.origin}/chat` }
			});
			if (error) throw error;
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to sign in with Google";
			toast.error(msg);
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh items-center justify-center px-4 py-10",
		style: { backgroundColor: "#9cc4a4" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md mx-auto relative rounded-[24px]",
			style: {
				backgroundColor: "#e4eed7",
				padding: "30px 30px 40px",
				boxShadow: "0 15px 35px rgba(0,0,0,0.15), 5px 10px 0px rgba(0,0,0,0.05)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						justifyContent: "center",
						marginTop: "-20px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/doctor_3d.png",
						alt: "Doctor",
						style: {
							width: "180px",
							height: "180px",
							borderRadius: "50%",
							objectFit: "cover",
							objectPosition: "top center"
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-6 mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[2.2rem] font-[800] m-0 leading-tight",
						style: { color: "#2b4c6a" },
						children: mode === "signin" ? "Sign in" : "Sign up"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "px-[14px] py-[6px] rounded-[20px] text-[0.8rem] font-bold transition-colors whitespace-nowrap",
						style: {
							backgroundColor: "rgba(42, 135, 133, 0.15)",
							color: "#2a8785",
							border: "1px solid rgba(42, 135, 133, 0.3)"
						},
						onClick: () => setShowLanguageModal(true),
						type: "button",
						children: ["🌐 ", language]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-[15px]",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-[15px] top-1/2 -translate-y-1/2 text-[#333] w-[18px] h-[18px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "w-full h-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "12",
											cy: "7",
											r: "4"
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Full Name",
									value: displayName,
									onChange: (e) => setDisplayName(e.target.value),
									required: true,
									className: "sage-input w-full py-[16px] pl-[45px] pr-[16px] rounded-[12px] text-[#333] font-medium outline-none transition-all text-[1rem]",
									style: {
										backgroundColor: "#c8dbc5",
										border: "1px solid rgba(0,0,0,0.05)",
										boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-[15px] top-1/2 -translate-y-1/2 text-[#333] w-[18px] h-[18px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "w-full h-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "22,6 12,13 2,6" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									placeholder: "Email address",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true,
									className: "sage-input w-full py-[16px] pl-[45px] pr-[16px] rounded-[12px] text-[#333] font-medium outline-none transition-all text-[1rem]",
									style: {
										backgroundColor: "#c8dbc5",
										border: "1px solid rgba(0,0,0,0.05)",
										boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-[15px] top-1/2 -translate-y-1/2 text-[#333] w-[18px] h-[18px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "w-full h-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "3",
											y: "11",
											width: "18",
											height: "11",
											rx: "2",
											ry: "2"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									placeholder: "Enter password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true,
									minLength: 6,
									className: "sage-input w-full py-[16px] pl-[45px] pr-[16px] rounded-[12px] text-[#333] font-medium outline-none transition-all text-[1rem]",
									style: {
										backgroundColor: "#c8dbc5",
										border: "1px solid rgba(0,0,0,0.05)",
										boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: loading,
								className: "w-full py-[16px] rounded-[12px] text-white font-[700] text-[1.1rem] flex items-center justify-center gap-2 mt-[10px] transition-transform hover:-translate-y-[1px]",
								style: {
									backgroundColor: "#2a8785",
									boxShadow: "0 4px 10px rgba(42, 135, 133, 0.4)"
								},
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-5 h-5 animate-spin" }), mode === "signin" ? "Log in" : "Sign up"]
							}),
							mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-[15px] text-[0.85rem]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-[#000] font-[600] hover:underline bg-transparent border-none p-0 cursor-pointer",
									children: "Forget password?"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative my-[20px] text-center text-[0.85rem] text-[#666]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "relative z-10 px-2",
								style: { backgroundColor: "#e4eed7" },
								children: "or continue with"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-0 w-[30%] h-px bg-black/10 -z-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 right-0 w-[30%] h-px bg-black/10 -z-0" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-[15px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleGoogleLogin,
							disabled: loading,
							className: "flex-1 flex items-center justify-center gap-[10px] p-[12px] bg-white border border-black/10 rounded-[12px] font-[600] text-[#333] hover:bg-[#f9f9f9] transition-colors shadow-[0_2px_5px_rgba(0,0,0,0.05)] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 24 24",
								className: "w-[20px] h-[20px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "#4285F4",
										d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "#34A853",
										d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "#FBBC05",
										d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										fill: "#EA4335",
										d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									})
								]
							}), "Google"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: true,
							className: "flex-1 flex items-center justify-center gap-[10px] p-[12px] bg-white border border-black/10 rounded-[12px] font-[600] text-[#333] hover:bg-[#f9f9f9] transition-colors shadow-[0_2px_5px_rgba(0,0,0,0.05)] opacity-50 cursor-not-allowed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 24",
								className: "w-[20px] h-[20px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "currentColor",
									d: "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.54.04 2.87.72 3.61 1.83-3.14 1.88-2.65 6.03.35 7.28-.7 1.76-1.55 3.36-2.63 4.82zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
								})
							}), "Apple"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center mt-[24px] text-[0.9rem]",
						style: { color: "var(--text-secondary)" },
						children: [
							mode === "signin" ? "Don't have an account?" : "Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
								className: "text-[#000] font-[600] hover:underline bg-transparent border-none p-0 cursor-pointer",
								children: mode === "signin" ? "Sign Up" : "Sign In"
							})
						]
					})
				] }),
				showLanguageModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 bg-black/60 backdrop-blur-[10px] z-[9999] flex items-center justify-center",
					onClick: () => setShowLanguageModal(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#0f1423] p-[40px] rounded-[24px] w-[90%] max-w-[400px] shadow-[0_25px_50px_rgba(0,0,0,0.5)] border border-white/10",
						onClick: (e) => e.stopPropagation(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center text-white text-xl font-[700] mb-[25px]",
							children: "Select Language"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-[15px]",
							children: [
								"EN",
								"ES",
								"FR",
								"HI",
								"ZH"
							].map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setLanguage(lang);
									setShowLanguageModal(false);
								},
								className: `p-[15px] rounded-[12px] font-[600] transition-all border ${lang === language ? "bg-[#00b4d8]/20 border-[#00b4d8] text-[#00b4d8]" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"}`,
								children: lang
							}, lang))
						})]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .sage-input:focus {
          border-color: #2a8785 !important;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05), 0 0 0 3px rgba(42, 135, 133, 0.2) !important;
        }
        .sage-input::placeholder {
          color: #555;
        }
      ` })]
	});
}
//#endregion
export { AuthPage as component };
