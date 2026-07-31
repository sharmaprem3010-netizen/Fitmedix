//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-NGrWDxwe.js
var manifest = {
	"314e84aeacb9ad9b57d161ce51c85a4658c07cb69bff661cb78d2e54fd9dd8cf": {
		functionName: "deleteThread_createServerFn_handler",
		importer: () => import("./_ssr/ai-doctor.functions-CHx6Dyn3.mjs")
	},
	"7ddaba5d84d2ff0d123cdacd6de1b71d5aea46e670a669c57f8be1659179c5be": {
		functionName: "sendChatMessage_createServerFn_handler",
		importer: () => import("./_ssr/ai-doctor.functions-CHx6Dyn3.mjs")
	},
	"d04d2127b90fd3052537b0ae24c01c7af90b727ed22f80df634fc62eec51e94d": {
		functionName: "createThread_createServerFn_handler",
		importer: () => import("./_ssr/ai-doctor.functions-CHx6Dyn3.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
