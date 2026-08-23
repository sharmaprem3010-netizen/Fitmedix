import { r as __toESM } from "../_runtime.mjs";
import { o as require_react } from "./react+tanstack__react-query.mjs";
//#region node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
//#endregion
//#region node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
//#endregion
//#region node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region node_modules/lucide-react/dist/esm/Icon.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Icon = (0, import_react.forwardRef)(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => (0, import_react.createElement)("svg", {
	ref,
	...defaultAttributes,
	width: size,
	height: size,
	stroke: color,
	strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
	className: mergeClasses("lucide", className),
	...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
	...rest
}, [...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]));
//#endregion
//#region node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createLucideIcon = (iconName, iconNode) => {
	const Component = (0, import_react.forwardRef)(({ className, ...props }, ref) => (0, import_react.createElement)(Icon, {
		ref,
		iconNode,
		className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
		...props
	}));
	Component.displayName = toPascalCase(iconName);
	return Component;
};
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Activity = createLucideIcon("activity", [["path", {
	d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
	key: "169zse"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Apple = createLucideIcon("apple", [["path", {
	d: "M12 6.528V3a1 1 0 0 1 1-1h0",
	key: "11qiee"
}], ["path", {
	d: "M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21",
	key: "110c12"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowLeft = createLucideIcon("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowRight = createLucideIcon("arrow-right", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "m12 5 7 7-7 7",
	key: "xquz4c"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowUpRight = createLucideIcon("arrow-up-right", [["path", {
	d: "M7 7h10v10",
	key: "1tivn9"
}], ["path", {
	d: "M7 17 17 7",
	key: "1vkiza"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowUp = createLucideIcon("arrow-up", [["path", {
	d: "m5 12 7-7 7 7",
	key: "hav0vg"
}], ["path", {
	d: "M12 19V5",
	key: "x0mq9r"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Biohazard = createLucideIcon("biohazard", [
	["circle", {
		cx: "12",
		cy: "11.9",
		r: "2",
		key: "e8h31w"
	}],
	["path", {
		d: "M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6",
		key: "17bolr"
	}],
	["path", {
		d: "m8.9 10.1 1.4.8",
		key: "15ezny"
	}],
	["path", {
		d: "M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5",
		key: "wtwa5u"
	}],
	["path", {
		d: "m15.1 10.1-1.4.8",
		key: "1r0b28"
	}],
	["path", {
		d: "M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2",
		key: "m7qszh"
	}],
	["path", {
		d: "M12 13.9v1.6",
		key: "zfyyim"
	}],
	["path", {
		d: "M13.5 5.4c-1-.2-2-.2-3 0",
		key: "1bi9q0"
	}],
	["path", {
		d: "M17 16.4c.7-.7 1.2-1.6 1.5-2.5",
		key: "1rhjqw"
	}],
	["path", {
		d: "M5.5 13.9c.3.9.8 1.8 1.5 2.5",
		key: "8gsud3"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var BookOpen = createLucideIcon("book-open", [["path", {
	d: "M12 7v14",
	key: "1akyts"
}], ["path", {
	d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
	key: "ruj8y"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Bot = createLucideIcon("bot", [
	["path", {
		d: "M12 8V4H8",
		key: "hb8ula"
	}],
	["rect", {
		width: "16",
		height: "12",
		x: "4",
		y: "8",
		rx: "2",
		key: "enze0r"
	}],
	["path", {
		d: "M2 14h2",
		key: "vft8re"
	}],
	["path", {
		d: "M20 14h2",
		key: "4cs60a"
	}],
	["path", {
		d: "M15 13v2",
		key: "1xurst"
	}],
	["path", {
		d: "M9 13v2",
		key: "rq6x2g"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Brain = createLucideIcon("brain", [
	["path", {
		d: "M12 18V5",
		key: "adv99a"
	}],
	["path", {
		d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",
		key: "1e3is1"
	}],
	["path", {
		d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",
		key: "1gqd8o"
	}],
	["path", {
		d: "M17.997 5.125a4 4 0 0 1 2.526 5.77",
		key: "iwvgf7"
	}],
	["path", {
		d: "M18 18a4 4 0 0 0 2-7.464",
		key: "efp6ie"
	}],
	["path", {
		d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",
		key: "1gq6am"
	}],
	["path", {
		d: "M6 18a4 4 0 0 1-2-7.464",
		key: "k1g0md"
	}],
	["path", {
		d: "M6.003 5.125a4 4 0 0 0-2.526 5.77",
		key: "q97ue3"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Calculator = createLucideIcon("calculator", [
	["rect", {
		width: "16",
		height: "20",
		x: "4",
		y: "2",
		rx: "2",
		key: "1nb95v"
	}],
	["line", {
		x1: "8",
		x2: "16",
		y1: "6",
		y2: "6",
		key: "x4nwl0"
	}],
	["line", {
		x1: "16",
		x2: "16",
		y1: "14",
		y2: "18",
		key: "wjye3r"
	}],
	["path", {
		d: "M16 10h.01",
		key: "1m94wz"
	}],
	["path", {
		d: "M12 10h.01",
		key: "1nrarc"
	}],
	["path", {
		d: "M8 10h.01",
		key: "19clt8"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}],
	["path", {
		d: "M8 14h.01",
		key: "6423bh"
	}],
	["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}],
	["path", {
		d: "M8 18h.01",
		key: "lrp35t"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Camera = createLucideIcon("camera", [["path", {
	d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
	key: "18u6gg"
}], ["circle", {
	cx: "12",
	cy: "13",
	r: "3",
	key: "1vg3eu"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChartLine = createLucideIcon("chart-line", [["path", {
	d: "M3 3v16a2 2 0 0 0 2 2h16",
	key: "c24i48"
}], ["path", {
	d: "m19 9-5 5-4-4-3 3",
	key: "2osh9i"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Check = createLucideIcon("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronDown = createLucideIcon("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronLeft = createLucideIcon("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronRight = createLucideIcon("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleCheck = createLucideIcon("circle-check", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ClipboardList = createLucideIcon("clipboard-list", [
	["rect", {
		width: "8",
		height: "4",
		x: "8",
		y: "2",
		rx: "1",
		ry: "1",
		key: "tgr4d6"
	}],
	["path", {
		d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
		key: "116196"
	}],
	["path", {
		d: "M12 11h4",
		key: "1jrz19"
	}],
	["path", {
		d: "M12 16h4",
		key: "n85exb"
	}],
	["path", {
		d: "M8 11h.01",
		key: "1dfujw"
	}],
	["path", {
		d: "M8 16h.01",
		key: "18s6g9"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Clock = createLucideIcon("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Cpu = createLucideIcon("cpu", [
	["path", {
		d: "M12 20v2",
		key: "1lh1kg"
	}],
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M17 20v2",
		key: "1rnc9c"
	}],
	["path", {
		d: "M17 2v2",
		key: "11trls"
	}],
	["path", {
		d: "M2 12h2",
		key: "1t8f8n"
	}],
	["path", {
		d: "M2 17h2",
		key: "7oei6x"
	}],
	["path", {
		d: "M2 7h2",
		key: "asdhe0"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "M20 17h2",
		key: "1fpfkl"
	}],
	["path", {
		d: "M20 7h2",
		key: "1o8tra"
	}],
	["path", {
		d: "M7 20v2",
		key: "4gnj0m"
	}],
	["path", {
		d: "M7 2v2",
		key: "1i4yhu"
	}],
	["rect", {
		x: "4",
		y: "4",
		width: "16",
		height: "16",
		rx: "2",
		key: "1vbyd7"
	}],
	["rect", {
		x: "8",
		y: "8",
		width: "8",
		height: "8",
		rx: "1",
		key: "z9xiuo"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Droplet = createLucideIcon("droplet", [["path", {
	d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
	key: "c7niix"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Droplets = createLucideIcon("droplets", [["path", {
	d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
	key: "1ptgy4"
}], ["path", {
	d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
	key: "1sl1rz"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Dumbbell = createLucideIcon("dumbbell", [
	["path", {
		d: "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z",
		key: "9m4mmf"
	}],
	["path", {
		d: "m2.5 21.5 1.4-1.4",
		key: "17g3f0"
	}],
	["path", {
		d: "m20.1 3.9 1.4-1.4",
		key: "1qn309"
	}],
	["path", {
		d: "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z",
		key: "1t2c92"
	}],
	["path", {
		d: "m9.6 14.4 4.8-4.8",
		key: "6umqxw"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Flame = createLucideIcon("flame", [["path", {
	d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
	key: "1slcih"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var HeartPulse = createLucideIcon("heart-pulse", [["path", {
	d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
	key: "mvr1a0"
}], ["path", {
	d: "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27",
	key: "auskq0"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Heart = createLucideIcon("heart", [["path", {
	d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
	key: "mvr1a0"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var House = createLucideIcon("house", [["path", {
	d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
	key: "5wwlr5"
}], ["path", {
	d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
	key: "r6nss1"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LayoutDashboard = createLucideIcon("layout-dashboard", [
	["rect", {
		width: "7",
		height: "9",
		x: "3",
		y: "3",
		rx: "1",
		key: "10lvy0"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "14",
		y: "3",
		rx: "1",
		key: "16une8"
	}],
	["rect", {
		width: "7",
		height: "9",
		x: "14",
		y: "12",
		rx: "1",
		key: "1hutg5"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "3",
		y: "16",
		rx: "1",
		key: "ldoo1y"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Leaf = createLucideIcon("leaf", [["path", {
	d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
	key: "nnexq3"
}], ["path", {
	d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
	key: "mt58a7"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LoaderCircle = createLucideIcon("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Lock = createLucideIcon("lock", [["rect", {
	width: "18",
	height: "11",
	x: "3",
	y: "11",
	rx: "2",
	ry: "2",
	key: "1w4ew1"
}], ["path", {
	d: "M7 11V7a5 5 0 0 1 10 0v4",
	key: "fwvmzm"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LogOut = createLucideIcon("log-out", [
	["path", {
		d: "m16 17 5-5-5-5",
		key: "1bji2h"
	}],
	["path", {
		d: "M21 12H9",
		key: "dn1m92"
	}],
	["path", {
		d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
		key: "1uf3rs"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MapPin = createLucideIcon("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Menu = createLucideIcon("menu", [
	["path", {
		d: "M4 5h16",
		key: "1tepv9"
	}],
	["path", {
		d: "M4 12h16",
		key: "1lakjw"
	}],
	["path", {
		d: "M4 19h16",
		key: "1djgab"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessagesSquare = createLucideIcon("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessageSquare = createLucideIcon("message-square", [["path", {
	d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
	key: "18887p"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MicOff = createLucideIcon("mic-off", [
	["path", {
		d: "M12 19v3",
		key: "npa21l"
	}],
	["path", {
		d: "M15 9.34V5a3 3 0 0 0-5.68-1.33",
		key: "1gzdoj"
	}],
	["path", {
		d: "M16.95 16.95A7 7 0 0 1 5 12v-2",
		key: "cqa7eg"
	}],
	["path", {
		d: "M18.89 13.23A7 7 0 0 0 19 12v-2",
		key: "16hl24"
	}],
	["path", {
		d: "m2 2 20 20",
		key: "1ooewy"
	}],
	["path", {
		d: "M9 9v3a3 3 0 0 0 5.12 2.12",
		key: "r2i35w"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Mic = createLucideIcon("mic", [
	["path", {
		d: "M12 19v3",
		key: "npa21l"
	}],
	["path", {
		d: "M19 10v2a7 7 0 0 1-14 0v-2",
		key: "1vc78b"
	}],
	["rect", {
		x: "9",
		y: "2",
		width: "6",
		height: "13",
		rx: "3",
		key: "s6n7sd"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Moon = createLucideIcon("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Navigation = createLucideIcon("navigation", [["polygon", {
	points: "3 11 22 2 13 21 11 13 3 11",
	key: "1ltx0t"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Pause = createLucideIcon("pause", [["rect", {
	x: "14",
	y: "3",
	width: "5",
	height: "18",
	rx: "1",
	key: "kaeet6"
}], ["rect", {
	x: "5",
	y: "3",
	width: "5",
	height: "18",
	rx: "1",
	key: "1wsw3u"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Phone = createLucideIcon("phone", [["path", {
	d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
	key: "9njp5v"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Pill = createLucideIcon("pill", [["path", {
	d: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",
	key: "wa1lgi"
}], ["path", {
	d: "m8.5 8.5 7 7",
	key: "rvfmvr"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Play = createLucideIcon("play", [["path", {
	d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
	key: "10ikf1"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Plus = createLucideIcon("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RefreshCw = createLucideIcon("refresh-cw", [
	["path", {
		d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
		key: "v9h5vc"
	}],
	["path", {
		d: "M21 3v5h-5",
		key: "1q7to0"
	}],
	["path", {
		d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
		key: "3uifl3"
	}],
	["path", {
		d: "M8 16H3v5",
		key: "1cv678"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RotateCcw = createLucideIcon("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Save = createLucideIcon("save", [
	["path", {
		d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
		key: "1c8476"
	}],
	["path", {
		d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
		key: "1ydtos"
	}],
	["path", {
		d: "M7 3v4a1 1 0 0 0 1 1h7",
		key: "t51u73"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Scale = createLucideIcon("scale", [
	["path", {
		d: "M12 3v18",
		key: "108xh3"
	}],
	["path", {
		d: "m19 8 3 8a5 5 0 0 1-6 0zV7",
		key: "zcdpyk"
	}],
	["path", {
		d: "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1",
		key: "1yorad"
	}],
	["path", {
		d: "m5 8 3 8a5 5 0 0 1-6 0zV7",
		key: "eua70x"
	}],
	["path", {
		d: "M7 21h10",
		key: "1b0cd5"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ScanLine = createLucideIcon("scan-line", [
	["path", {
		d: "M3 7V5a2 2 0 0 1 2-2h2",
		key: "aa7l1z"
	}],
	["path", {
		d: "M17 3h2a2 2 0 0 1 2 2v2",
		key: "4qcy5o"
	}],
	["path", {
		d: "M21 17v2a2 2 0 0 1-2 2h-2",
		key: "6vwrx8"
	}],
	["path", {
		d: "M7 21H5a2 2 0 0 1-2-2v-2",
		key: "ioqczr"
	}],
	["path", {
		d: "M7 12h10",
		key: "b7w52i"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Search = createLucideIcon("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Send = createLucideIcon("send", [["path", {
	d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
	key: "1ffxy3"
}], ["path", {
	d: "m21.854 2.147-10.94 10.939",
	key: "12cjpa"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Settings = createLucideIcon("settings", [["path", {
	d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
	key: "1i5ecw"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ShieldCheck = createLucideIcon("shield-check", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SkipForward = createLucideIcon("skip-forward", [["path", {
	d: "M21 4v16",
	key: "7j8fe9"
}], ["path", {
	d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
	key: "zs4d6"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sparkles = createLucideIcon("sparkles", [
	["path", {
		d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
		key: "1s2grr"
	}],
	["path", {
		d: "M20 2v4",
		key: "1rf3ol"
	}],
	["path", {
		d: "M22 4h-4",
		key: "gwowj6"
	}],
	["circle", {
		cx: "4",
		cy: "20",
		r: "2",
		key: "6kqj1y"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Stethoscope = createLucideIcon("stethoscope", [
	["path", {
		d: "M11 2v2",
		key: "1539x4"
	}],
	["path", {
		d: "M5 2v2",
		key: "1yf1q8"
	}],
	["path", {
		d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",
		key: "rb5t3r"
	}],
	["path", {
		d: "M8 15a6 6 0 0 0 12 0v-3",
		key: "x18d4x"
	}],
	["circle", {
		cx: "20",
		cy: "10",
		r: "2",
		key: "ts1r5v"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sun = createLucideIcon("sun", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}],
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M12 20v2",
		key: "1lh1kg"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "m17.66 17.66 1.41 1.41",
		key: "ptbguv"
	}],
	["path", {
		d: "M2 12h2",
		key: "1t8f8n"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m6.34 17.66-1.41 1.41",
		key: "1m8zz5"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sunrise = createLucideIcon("sunrise", [
	["path", {
		d: "M12 2v8",
		key: "1q4o3n"
	}],
	["path", {
		d: "m4.93 10.93 1.41 1.41",
		key: "2a7f42"
	}],
	["path", {
		d: "M2 18h2",
		key: "j10viu"
	}],
	["path", {
		d: "M20 18h2",
		key: "wocana"
	}],
	["path", {
		d: "m19.07 10.93-1.41 1.41",
		key: "15zs5n"
	}],
	["path", {
		d: "M22 22H2",
		key: "19qnx5"
	}],
	["path", {
		d: "m8 6 4-4 4 4",
		key: "ybng9g"
	}],
	["path", {
		d: "M16 18a4 4 0 0 0-8 0",
		key: "1lzouq"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sunset = createLucideIcon("sunset", [
	["path", {
		d: "M12 10V2",
		key: "16sf7g"
	}],
	["path", {
		d: "m4.93 10.93 1.41 1.41",
		key: "2a7f42"
	}],
	["path", {
		d: "M2 18h2",
		key: "j10viu"
	}],
	["path", {
		d: "M20 18h2",
		key: "wocana"
	}],
	["path", {
		d: "m19.07 10.93-1.41 1.41",
		key: "15zs5n"
	}],
	["path", {
		d: "M22 22H2",
		key: "19qnx5"
	}],
	["path", {
		d: "m16 6-4 4-4-4",
		key: "6wukr"
	}],
	["path", {
		d: "M16 18a4 4 0 0 0-8 0",
		key: "1lzouq"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Trash2 = createLucideIcon("trash-2", [
	["path", {
		d: "M10 11v6",
		key: "nco0om"
	}],
	["path", {
		d: "M14 11v6",
		key: "outv1u"
	}],
	["path", {
		d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
		key: "miytrc"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
		key: "e791ji"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TrendingUp = createLucideIcon("trending-up", [["path", {
	d: "M16 7h6v6",
	key: "box55l"
}], ["path", {
	d: "m22 7-8.5 8.5-5-5L2 17",
	key: "1t1m79"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TriangleAlert = createLucideIcon("triangle-alert", [
	["path", {
		d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
		key: "wmoenq"
	}],
	["path", {
		d: "M12 9v4",
		key: "juzpu7"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Trophy = createLucideIcon("trophy", [
	["path", {
		d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",
		key: "1n3hpd"
	}],
	["path", {
		d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",
		key: "rfe1zi"
	}],
	["path", {
		d: "M18 9h1.5a1 1 0 0 0 0-5H18",
		key: "7xy6bh"
	}],
	["path", {
		d: "M4 22h16",
		key: "57wxv0"
	}],
	["path", {
		d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
		key: "1mhfuq"
	}],
	["path", {
		d: "M6 9H4.5a1 1 0 0 1 0-5H6",
		key: "tex48p"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var User = createLucideIcon("user", [["path", {
	d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
	key: "975kel"
}], ["circle", {
	cx: "12",
	cy: "7",
	r: "4",
	key: "17ys0d"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var UtensilsCrossed = createLucideIcon("utensils-crossed", [
	["path", {
		d: "m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8",
		key: "n7qcjb"
	}],
	["path", {
		d: "M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7",
		key: "d0u48b"
	}],
	["path", {
		d: "m2.1 21.8 6.4-6.3",
		key: "yn04lh"
	}],
	["path", {
		d: "m19 5-7 7",
		key: "194lzd"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Utensils = createLucideIcon("utensils", [
	["path", {
		d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",
		key: "cjf0a3"
	}],
	["path", {
		d: "M7 2v20",
		key: "1473qp"
	}],
	["path", {
		d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7",
		key: "j28e5"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Volume2 = createLucideIcon("volume-2", [
	["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}],
	["path", {
		d: "M16 9a5 5 0 0 1 0 6",
		key: "1q6k2b"
	}],
	["path", {
		d: "M19.364 18.364a9 9 0 0 0 0-12.728",
		key: "ijwkga"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var VolumeX = createLucideIcon("volume-x", [
	["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}],
	["line", {
		x1: "22",
		x2: "16",
		y1: "9",
		y2: "15",
		key: "1ewh16"
	}],
	["line", {
		x1: "16",
		x2: "22",
		y1: "9",
		y2: "15",
		key: "5ykzw1"
	}]
]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var X = createLucideIcon("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
/**
* @license lucide-react v0.575.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Zap = createLucideIcon("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]);
//#endregion
export { Clock as $, Phone as A, LogOut as B, Scale as C, Plus as D, RefreshCw as E, MicOff as F, House as G, LoaderCircle as H, MessageSquare as I, Flame as J, Heart as K, MessagesSquare as L, Navigation as M, Moon as N, Play as O, Mic as P, Cpu as Q, Menu as R, ScanLine as S, RotateCcw as T, Leaf as U, Lock as V, LayoutDashboard as W, Droplets as X, Dumbbell as Y, Droplet as Z, SkipForward as _, Apple as _t, Utensils as a, Check as at, Send as b, Trophy as c, Calculator as ct, Trash2 as d, BookOpen as dt, ClipboardList as et, Sunset as f, Biohazard as ft, Sparkles as g, ArrowLeft as gt, Stethoscope as h, ArrowRight as ht, Volume2 as i, ChevronDown as it, Pause as j, Pill as k, TriangleAlert as l, Brain as lt, Sun as m, ArrowUpRight as mt, X as n, ChevronRight as nt, UtensilsCrossed as o, ChartLine as ot, Sunrise as p, ArrowUp as pt, HeartPulse as q, VolumeX as r, ChevronLeft as rt, User as s, Camera as st, Zap as t, CircleCheck as tt, TrendingUp as u, Bot as ut, ShieldCheck as v, Activity as vt, Save as w, Search as x, Settings as y, MapPin as z };
