import { r as __toESM } from "../_runtime.mjs";
import { O as isRedirect, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-NGrWDxwe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-doctor.functions-CFg1QxLu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var sendChatMessage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	threadId: stringType().uuid(),
	message: stringType().min(1).max(4e3)
}).parse(input)).handler(createSsrRpc("7ddaba5d84d2ff0d123cdacd6de1b71d5aea46e670a669c57f8be1659179c5be"));
var createThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d04d2127b90fd3052537b0ae24c01c7af90b727ed22f80df634fc62eec51e94d"));
var deleteThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ threadId: stringType().uuid() }).parse(input)).handler(createSsrRpc("314e84aeacb9ad9b57d161ce51c85a4658c07cb69bff661cb78d2e54fd9dd8cf"));
//#endregion
export { useServerFn as i, deleteThread as n, sendChatMessage as r, createThread as t };
