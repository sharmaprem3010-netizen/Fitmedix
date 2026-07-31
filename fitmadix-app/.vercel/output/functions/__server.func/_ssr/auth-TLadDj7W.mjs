import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-TLadDj7W.js
var $$splitComponentImporter = () => import("./auth-tlF6w0fO.mjs");
var search = objectType({
	mode: enumType(["signin", "signup"]).optional(),
	redirect: stringType().optional()
});
var Route = createFileRoute("/auth")({
	validateSearch: (s) => search.parse(s),
	head: () => ({ meta: [{ title: "Sign in — Fitmadix" }, {
		name: "description",
		content: "Sign in or create your Fitmadix account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
