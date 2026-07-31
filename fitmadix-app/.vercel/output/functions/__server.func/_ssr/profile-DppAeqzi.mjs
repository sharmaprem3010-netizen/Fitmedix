import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-JnDgNciN.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as ArrowLeft, c as Save, h as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DppAeqzi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [p, setP] = (0, import_react.useState)({
		display_name: "",
		age: null,
		sex: "",
		medical_history: "",
		allergies: ""
	});
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(async ({ data }) => {
			if (!data.user) return;
			const { data: row } = await supabase.from("profiles").select("display_name, age, sex, medical_history, allergies").eq("id", data.user.id).maybeSingle();
			if (row) setP(row);
			setLoading(false);
		});
	}, []);
	const save = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) throw new Error("Not signed in");
			const { error } = await supabase.from("profiles").update({
				display_name: p.display_name,
				age: p.age,
				sex: p.sex,
				medical_history: p.medical_history,
				allergies: p.allergies
			}).eq("id", u.user.id);
			if (error) throw error;
			toast.success("Profile saved");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl px-4 py-8 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => navigate({ to: "/chat" }),
					className: "mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to chat"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card p-8 shadow-elegant",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold tracking-tight",
							children: "Your profile"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "The AI uses these details in every consultation to personalize its guidance. All fields are optional."
						}),
						loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center py-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: save,
							className: "mt-6 grid gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "input",
										value: p.display_name ?? "",
										onChange: (e) => setP({
											...p,
											display_name: e.target.value
										}),
										placeholder: "Your name"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Age",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 0,
											max: 130,
											className: "input",
											value: p.age ?? "",
											onChange: (e) => setP({
												...p,
												age: e.target.value ? Number(e.target.value) : null
											}),
											placeholder: "e.g. 32"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
										label: "Sex",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "input",
											value: p.sex ?? "",
											onChange: (e) => setP({
												...p,
												sex: e.target.value
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Prefer not to say"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "female",
													children: "Female"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "male",
													children: "Male"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "other",
													children: "Other"
												})
											]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Known medical history",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "input min-h-24",
										value: p.medical_history ?? "",
										onChange: (e) => setP({
											...p,
											medical_history: e.target.value
										}),
										placeholder: "e.g. asthma, hypertension"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
									label: "Allergies",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "input min-h-20",
										value: p.allergies ?? "",
										onChange: (e) => setP({
											...p,
											allergies: e.target.value
										}),
										placeholder: "e.g. penicillin, peanuts"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: saving,
									className: "mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-70",
									children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "Save profile"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/chat",
					className: "mt-6 inline-block text-sm text-muted-foreground hover:text-foreground",
					children: "Continue to chat →"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.input{width:100%;border-radius:0.75rem;border:1px solid var(--color-border);background:var(--color-background);padding:0.6rem 0.9rem;font-size:0.875rem;outline:none;transition:box-shadow .2s}.input:focus{box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 30%,transparent)}` })]
	});
}
function F({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-foreground",
			children: label
		}), children]
	});
}
//#endregion
export { ProfilePage as component };
