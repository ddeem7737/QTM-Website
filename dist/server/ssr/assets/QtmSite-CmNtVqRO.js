import { a as ReadonlyURLSearchParams, c as __toESM, o as require_react, s as stripBasePath, t as require_jsx_runtime } from "../index.js";
import worldMap from "@svg-maps/world";
//#region node_modules/vinext/dist/shims/navigation.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var _SERVER_INSERTED_HTML_CTX_KEY = Symbol.for("vinext.serverInsertedHTMLContext");
function getServerInsertedHTMLContext() {
	if (typeof import_react.createContext !== "function") return null;
	const globalState = globalThis;
	if (!globalState[_SERVER_INSERTED_HTML_CTX_KEY]) globalState[_SERVER_INSERTED_HTML_CTX_KEY] = import_react.createContext(null);
	return globalState[_SERVER_INSERTED_HTML_CTX_KEY] ?? null;
}
getServerInsertedHTMLContext();
var _READONLY_SEARCH_PARAMS = Symbol("vinext.navigation.readonlySearchParams");
var _READONLY_SEARCH_PARAMS_SOURCE = Symbol("vinext.navigation.readonlySearchParamsSource");
var _GLOBAL_ACCESSORS_KEY = Symbol.for("vinext.navigation.globalAccessors");
var _GLOBAL_HYDRATION_CONTEXT_KEY = Symbol.for("vinext.navigation.clientHydrationContext");
function _getGlobalAccessors() {
	return globalThis[_GLOBAL_ACCESSORS_KEY];
}
function _getClientHydrationContext() {
	const globalState = globalThis;
	if (Object.prototype.hasOwnProperty.call(globalState, _GLOBAL_HYDRATION_CONTEXT_KEY)) return globalState[_GLOBAL_HYDRATION_CONTEXT_KEY] ?? null;
}
var _serverContext = null;
var _getServerContext = () => {
	if (typeof window !== "undefined") {
		const hydrationContext = _getClientHydrationContext();
		return hydrationContext !== void 0 ? hydrationContext : _serverContext;
	}
	const g = _getGlobalAccessors();
	return g ? g.getServerContext() : _serverContext;
};
var isServer = typeof window === "undefined";
var _CLIENT_NAV_STATE_KEY = Symbol.for("vinext.clientNavigationState");
function getClientNavigationState() {
	if (isServer) return null;
	const globalState = window;
	globalState[_CLIENT_NAV_STATE_KEY] ??= {
		listeners: /* @__PURE__ */ new Set(),
		cachedSearch: window.location.search,
		cachedReadonlySearchParams: new ReadonlyURLSearchParams(window.location.search),
		cachedPathname: stripBasePath(window.location.pathname, ""),
		clientParams: {},
		clientParamsJson: "{}",
		pendingClientParams: null,
		pendingClientParamsJson: null,
		pendingPathname: null,
		pendingPathnameNavId: null,
		originalPushState: window.history.pushState.bind(window.history),
		originalReplaceState: window.history.replaceState.bind(window.history),
		patchInstalled: false,
		hasPendingNavigationUpdate: false,
		suppressUrlNotifyCount: 0,
		navigationSnapshotActiveCount: 0
	};
	return globalState[_CLIENT_NAV_STATE_KEY];
}
function notifyNavigationListeners() {
	const state = getClientNavigationState();
	if (!state) return;
	for (const fn of state.listeners) fn();
}
var _cachedEmptyServerSearchParams = null;
var _cachedEmptyClientSearchParams = null;
/**
* Get cached search params snapshot for useSyncExternalStore.
* Note: Returns cached value from ClientNavigationState, not live window.location.search.
* The cache is updated by syncCommittedUrlStateFromLocation() after navigation commits.
* This ensures referential stability and prevents infinite re-renders.
* External pushState/replaceState while URL notifications are suppressed won't
* be visible until the next commit.
*/
function getSearchParamsSnapshot() {
	const cached = getClientNavigationState()?.cachedReadonlySearchParams;
	if (cached) return cached;
	if (_cachedEmptyClientSearchParams === null) _cachedEmptyClientSearchParams = new ReadonlyURLSearchParams();
	return _cachedEmptyClientSearchParams;
}
function syncCommittedUrlStateFromLocation() {
	const state = getClientNavigationState();
	if (!state) return false;
	let changed = false;
	const pathname = stripBasePath(window.location.pathname, "");
	if (pathname !== state.cachedPathname) {
		state.cachedPathname = pathname;
		changed = true;
	}
	const search = window.location.search;
	if (search !== state.cachedSearch) {
		state.cachedSearch = search;
		state.cachedReadonlySearchParams = new ReadonlyURLSearchParams(search);
		changed = true;
	}
	return changed;
}
function getServerSearchParamsSnapshot() {
	const ctx = _getServerContext();
	if (!ctx) {
		if (_cachedEmptyServerSearchParams === null) _cachedEmptyServerSearchParams = new ReadonlyURLSearchParams();
		return _cachedEmptyServerSearchParams;
	}
	const source = ctx.searchParams;
	const cached = ctx[_READONLY_SEARCH_PARAMS];
	const cachedSource = ctx[_READONLY_SEARCH_PARAMS_SOURCE];
	if (cached && cachedSource === source) return cached;
	const readonly = new ReadonlyURLSearchParams(source);
	ctx[_READONLY_SEARCH_PARAMS] = readonly;
	ctx[_READONLY_SEARCH_PARAMS_SOURCE] = source;
	return readonly;
}
var _CLIENT_NAV_RENDER_CTX_KEY = Symbol.for("vinext.clientNavigationRenderContext");
function getClientNavigationRenderContext() {
	if (typeof import_react.createContext !== "function") return null;
	const globalState = globalThis;
	if (!globalState[_CLIENT_NAV_RENDER_CTX_KEY]) globalState[_CLIENT_NAV_RENDER_CTX_KEY] = import_react.createContext(null);
	return globalState[_CLIENT_NAV_RENDER_CTX_KEY] ?? null;
}
function useClientNavigationRenderSnapshot() {
	const ctx = getClientNavigationRenderContext();
	if (!ctx || typeof import_react.useContext !== "function") return null;
	try {
		return import_react.useContext(ctx);
	} catch {
		return null;
	}
}
function subscribeToNavigation(cb) {
	const state = getClientNavigationState();
	if (!state) return () => {};
	state.listeners.add(cb);
	return () => {
		state.listeners.delete(cb);
	};
}
/**
* Returns the current search params as a read-only URLSearchParams.
*/
function useSearchParams() {
	if (isServer) return getServerSearchParamsSnapshot();
	const renderSnapshot = useClientNavigationRenderSnapshot();
	const searchParams = import_react.useSyncExternalStore(subscribeToNavigation, getSearchParamsSnapshot, getServerSearchParamsSnapshot);
	if (renderSnapshot && (getClientNavigationState()?.navigationSnapshotActiveCount ?? 0) > 0) return renderSnapshot.searchParams;
	return searchParams;
}
/**
* Commit pending client navigation state to committed snapshots.
*
* navId is optional: callers that don't own pendingPathname (for example,
* superseded pre-paint cleanup) may pass undefined to flush URL/params state
* without clearing pendingPathname owned by the active navigation. Such callers
* must opt in explicitly if they also own an activated render snapshot.
*/
function commitClientNavigationState(navId, options) {
	if (isServer) return;
	const state = getClientNavigationState();
	if (!state) return;
	if ((navId !== void 0 || options?.releaseSnapshot === true) && state.navigationSnapshotActiveCount > 0) state.navigationSnapshotActiveCount -= 1;
	const urlChanged = syncCommittedUrlStateFromLocation();
	if (state.pendingClientParams !== null && state.pendingClientParamsJson !== null) {
		state.clientParams = state.pendingClientParams;
		state.clientParamsJson = state.pendingClientParamsJson;
		state.pendingClientParams = null;
		state.pendingClientParamsJson = null;
	}
	if (state.pendingPathnameNavId === null || navId !== void 0 && state.pendingPathnameNavId === navId) {
		state.pendingPathname = null;
		state.pendingPathnameNavId = null;
	}
	const shouldNotify = urlChanged || state.hasPendingNavigationUpdate;
	state.hasPendingNavigationUpdate = false;
	if (shouldNotify) notifyNavigationListeners();
}
/**
* Restore scroll position from a history state object (used on popstate).
*
* When an RSC navigation is in flight (back/forward triggers both this
* handler and the browser entry's popstate handler which calls
* __VINEXT_RSC_NAVIGATE__), we must wait for the new content to render
* before scrolling. Otherwise the user sees old content flash at the
* restored scroll position.
*
* This handler fires before the browser entry's popstate handler (because
* navigation.ts is loaded before hydration completes), so we defer via a
* microtask to give the browser entry handler a chance to set
* __VINEXT_RSC_PENDING__. Promise.resolve() schedules a microtask
* that runs after all synchronous event listeners have completed.
*/
function restoreScrollPosition(state) {
	if (state && typeof state === "object" && "__vinext_scrollY" in state) {
		const { __vinext_scrollX: x, __vinext_scrollY: y } = state;
		Promise.resolve().then(() => {
			const pending = window.__VINEXT_RSC_PENDING__ ?? null;
			if (pending) pending.then(() => {
				requestAnimationFrame(() => {
					window.scrollTo(x, y);
				});
			});
			else requestAnimationFrame(() => {
				window.scrollTo(x, y);
			});
		});
	}
}
if (!isServer) {
	const state = getClientNavigationState();
	if (state && !state.patchInstalled) {
		state.patchInstalled = true;
		window.addEventListener("popstate", (event) => {
			if (typeof window.__VINEXT_RSC_NAVIGATE__ !== "function") {
				commitClientNavigationState();
				restoreScrollPosition(event.state);
			}
		});
		window.history.pushState = function patchedPushState(data, unused, url) {
			state.originalPushState.call(window.history, data, unused, url);
			if (state.suppressUrlNotifyCount === 0) commitClientNavigationState();
		};
		window.history.replaceState = function patchedReplaceState(data, unused, url) {
			state.originalReplaceState.call(window.history, data, unused, url);
			if (state.suppressUrlNotifyCount === 0) commitClientNavigationState();
		};
	}
}
//#endregion
//#region app/data.ts
var products = [
	{
		slug: "timing-belts",
		name: "Timing Belts",
		family: "Power Transmission Belts",
		description: "Rubber and polyurethane synchronous belts for precise power transmission, conveying and positioning applications.",
		suppliers: [
			"Megadyne",
			"Continental / ContiTech",
			"Wilhelm Herm. Müller",
			"Ammeraal Beltech"
		],
		industries: [
			"Packaging",
			"Tobacco",
			"Food & Beverage",
			"Paper & Printing",
			"Automotive & Tire",
			"Elevators",
			"Robotics & Automation"
		],
		materials: [
			"Rubber",
			"Polyurethane",
			"Steel cord",
			"Aramid cord"
		],
		subcategories: [
			"Polyurethane Open End",
			"Polyurethane Endless",
			"Rubber Open End",
			"Rubber Endless"
		],
		profiles: [
			"HTD",
			"STD",
			"RPP",
			"SLV",
			"GLD",
			"TTM",
			"CXP",
			"CXA",
			"XL",
			"L",
			"H",
			"XH",
			"XXH",
			"T2.5",
			"T5",
			"T10",
			"T20",
			"AT3",
			"AT5",
			"AT10",
			"AT20",
			"R",
			"B",
			"ATP",
			"ATK",
			"ATG",
			"QST"
		],
		benefits: [
			"Precise synchronous transmission",
			"Custom coatings, cleats and guides",
			"Application-specific tension cords",
			"Product-selection support"
		],
		image: "/assets/partnership-megadyne-pu-new.png"
	},
	{
		slug: "v-belts",
		name: "V-Belts",
		family: "Power Transmission Belts",
		description: "A complete range of classical, narrow, wrapped, raw-edge, banded and specialty V-belts for industrial and agricultural drives.",
		suppliers: ["Megadyne", "Continental / ContiTech"],
		industries: [
			"Oil & Gas",
			"Agriculture",
			"Mining",
			"Stone & Ceramics",
			"Glass",
			"Wood Processing",
			"Elevators"
		],
		materials: [
			"Rubber",
			"Aramid reinforcement",
			"Textile wrap"
		],
		subcategories: [
			"Rubber Raw Edge",
			"Rubber Wrapped",
			"Rubber Banded"
		],
		profiles: [
			"Z",
			"A",
			"B",
			"C",
			"D",
			"E",
			"SPZ",
			"SPA",
			"SPB",
			"SPC",
			"3V",
			"5V",
			"8V",
			"AA",
			"BB",
			"CC",
			"Variable-speed profiles",
			"Agricultural profiles"
		],
		benefits: [
			"Broad application coverage",
			"Oil- and heat-resistant options",
			"Antistatic options",
			"High-power configurations"
		],
		image: "/assets/partnership-megadyne-vbelts-new.png"
	},
	{
		slug: "conveyor-belts",
		name: "Conveyor Belts",
		family: "Conveyor and Process Belts",
		description: "Premium and cost-effective conveyor and process belting for hygienic, high-speed and demanding industrial applications.",
		suppliers: ["Ammeraal Beltech", "Sampla"],
		industries: [
			"Food & Beverage",
			"Packaging",
			"Tobacco",
			"Paper & Printing",
			"Material Handling & Logistics",
			"Wood Processing",
			"Textile",
			"Recycling",
			"Airports & Baggage Handling"
		],
		materials: [
			"PU",
			"PVC",
			"Polyester",
			"Silicone",
			"Cotton",
			"Polyolefin",
			"Felt",
			"Fabric"
		],
		subcategories: [
			"PU",
			"PVC",
			"Polyester",
			"Silicone",
			"Cotton",
			"Polyolefin",
			"Felt",
			"Elastic",
			"Nonwoven",
			"Food-Grade",
			"Process Belts",
			"Airport and Logistics"
		],
		benefits: [
			"Custom fabrication",
			"Cleats, sidewalls and guides",
			"Endless splicing",
			"On-site technical support"
		],
		image: "/assets/partner-products/ammeraal-synthetic.webp"
	},
	{
		slug: "modular-belts",
		name: "Modular Belts",
		family: "Modular Conveying",
		description: "UNI modular belting, sprockets and accessories for cleanability, reliable handling and configurable conveying layouts.",
		suppliers: ["UNI Modular / Ammeraal Beltech"],
		industries: [
			"Food & Beverage",
			"Packaging",
			"Automotive & Tire",
			"Material Handling & Logistics",
			"Airports & Baggage Handling",
			"Robotics & Automation"
		],
		materials: [
			"Polypropylene",
			"Polyethylene",
			"Acetal",
			"Polyamide",
			"Engineering polymers"
		],
		subcategories: [
			"Straight-Running",
			"Radius",
			"Flush-Grid",
			"Flat-Top",
			"Friction-Top",
			"Roller-Top",
			"Spiral",
			"Side-Flexing"
		],
		benefits: [
			"Wear resistance",
			"High load capacity",
			"Easy cleaning",
			"Hygienic design",
			"Long service life"
		],
		image: "/assets/partner-products/uni-straight.webp"
	},
	{
		slug: "roller-chains",
		name: "Roller Chains",
		family: "Mechanical Power Transmission",
		description: "Roller and conveyor chains for dependable mechanical transmission and material movement.",
		suppliers: ["Challenge Power Transmission"],
		industries: [
			"Agriculture",
			"Mining",
			"Material Handling & Logistics",
			"Packaging"
		],
		materials: ["Steel", "Stainless steel"],
		subcategories: [
			"Roller Chains",
			"Conveyor Chains",
			"Attachment Chains",
			"Special Chains"
		],
		image: "/assets/products/roller-chain.jpg"
	},
	{
		slug: "sprockets",
		name: "Sprockets",
		family: "Mechanical Power Transmission",
		description: "Sprockets and matched mechanical components for chain and belt-drive systems.",
		suppliers: ["Challenge Power Transmission"],
		industries: [
			"Agriculture",
			"Material Handling & Logistics",
			"Mining",
			"Oil & Gas"
		],
		materials: [
			"Steel",
			"Cast iron",
			"Engineering polymers"
		],
		subcategories: [
			"Chain Sprockets",
			"Timing Pulleys",
			"V-Belt Pulleys",
			"Bushes"
		],
		image: "/assets/products/sprocket.jpg"
	},
	{
		slug: "bearings",
		name: "Bearings & Components",
		family: "Metal Parts",
		description: "Bearings, couplings, tensioners, bushes and related metal parts selected for the application.",
		suppliers: ["Multi-brand supply"],
		industries: [
			"Oil & Gas",
			"Mining",
			"Automotive & Tire",
			"Material Handling & Logistics"
		],
		materials: ["Steel", "Engineering polymers"],
		subcategories: [
			"Bearings",
			"Couplings",
			"Tensioners",
			"Bushes",
			"Metal Parts"
		],
		image: "/assets/products/bearings.jpg"
	}
];
var suppliers = [
	{
		slug: "megadyne",
		name: "Megadyne",
		short: "Power transmission belts",
		mark: "MEGADYNE_LOGO",
		relationship: "QTM Group is a Megadyne MegaPartner and a trusted regional distributor of Megadyne power transmission solutions.",
		products: [
			"Timing belts",
			"V-belts",
			"Polyurethane belts",
			"Rubber belts",
			"Power transmission solutions"
		],
		url: "https://megadynegroup.com/"
	},
	{
		slug: "continental",
		name: "Continental / ContiTech",
		short: "Industrial drive solutions",
		mark: "CONTINENTAL_LOGO",
		relationship: "QTM Group has served as a regional representative of ContiTech since 2023.",
		products: [
			"V-belts",
			"Timing belts",
			"Power transmission belts",
			"Industrial drive solutions"
		],
		url: "https://www.continental-industry.com/global/en"
	},
	{
		slug: "ammeraal-beltech",
		name: "Ammeraal Beltech",
		short: "Conveyor, process and flat belts",
		mark: "AMMERAAL_LOGO",
		relationship: "QTM Group supplies Ammeraal Beltech conveying and process solutions, including RAPPLON® flat belts and UNI modular belts.",
		products: [
			"Conveyor belts",
			"Process belts",
			"RAPPLON® flat belts",
			"UNI Modular Belts",
			"Timing belts where applicable"
		],
		url: "https://ammeraalbeltech.com/"
	},
	{
		slug: "sampla",
		name: "Sampla",
		short: "Cost-effective conveyor solutions",
		mark: "SAMPLA_LOGO",
		relationship: "QTM Group represents Sampla solutions as a cost-effective conveyor-belt range without compromising quality and performance.",
		products: [
			"Conveyor belts",
			"Process belts",
			"Cost-effective industrial conveying solutions"
		],
		url: "https://sampla.com/"
	},
	{
		slug: "uni-modular",
		name: "UNI Modular",
		short: "Modular conveying",
		mark: "UNI_MODULAR_LOGO",
		relationship: "UNI Modular is presented as the modular-belt product family of Ammeraal Beltech, supplied regionally through QTM Group.",
		products: [
			"Modular belts",
			"Sprockets",
			"Accessories",
			"Spiral and side-flexing solutions"
		],
		url: "https://ammeraalbeltech.com/en-us/products/modular-belts/"
	},
	{
		slug: "challenge",
		name: "Challenge Power Transmission",
		short: "Chains and components",
		mark: "CHALLENGE_LOGO",
		relationship: "QTM Group supplies Challenge mechanical power transmission products for industrial applications.",
		products: [
			"Roller chains",
			"Conveyor chains",
			"Sprockets",
			"Mechanical power transmission components"
		],
		url: "https://challengept.com/"
	},
	{
		slug: "whm",
		name: "Wilhelm Herm. Müller",
		short: "Customized drive technology",
		mark: "WHM_LOGO",
		relationship: "QTM Group was officially authorized in 2026 to represent Wilhelm Herm. Müller products and business interests across the region.",
		products: [
			"Timing belts",
			"Flat belts",
			"Drive technology",
			"Customized power transmission solutions"
		],
		url: "https://whm.net/en/"
	}
];
var industries = [
	"Oil & Gas",
	"Packaging",
	"Tobacco",
	"Food & Beverage",
	"Paper & Printing",
	"Agriculture",
	"Automotive & Tire",
	"Mining",
	"Stone & Ceramics",
	"Glass",
	"Wood Processing",
	"Material Handling & Logistics",
	"Elevators",
	"Textile",
	"Recycling",
	"Airports & Baggage Handling",
	"Robotics & Automation"
].map((name) => ({
	name,
	slug: name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}));
var industryDetails = {
	"oil-and-gas": {
		overview: "Heavy-duty power transmission and conveying solutions for demanding oil and gas operations.",
		applications: [
			"Compressors and pumps",
			"Cooling systems",
			"Shale-handling equipment",
			"Auxiliary drives"
		],
		challenges: [
			"Continuous operation",
			"Oil and heat exposure",
			"High loads",
			"Remote-site reliability"
		]
	},
	packaging: {
		overview: "Precision belts and components for high-speed forming, filling, sealing, folding and end-of-line equipment.",
		applications: [
			"Folder gluers",
			"Vertical form-fill-seal",
			"Carton handling",
			"End-of-line systems"
		],
		challenges: [
			"Accurate positioning",
			"High cycle rates",
			"Low downtime",
			"Consistent tracking"
		]
	},
	tobacco: {
		overview: "Clean, precise belting for high-speed tobacco processing, conveying and packaging equipment.",
		applications: [
			"Primary processing",
			"Cigarette manufacturing",
			"Machine tapes",
			"Packaging lines"
		],
		challenges: [
			"Precise tracking",
			"Clean operation",
			"High speed",
			"Consistent product handling"
		]
	},
	"food-and-beverage": {
		overview: "Hygienic conveying and reliable power transmission for processing, packaging and handling lines.",
		applications: [
			"Processing lines",
			"Packaging equipment",
			"Cooling and freezing",
			"Product handling"
		],
		challenges: [
			"Hygiene",
			"Washdown resistance",
			"Product release",
			"Traceability"
		]
	},
	"paper-and-printing": {
		overview: "High-speed belts and machine tapes for accurate paper handling, printing and converting.",
		applications: [
			"Printing presses",
			"Folder gluers",
			"Paper converting",
			"Feeder and delivery systems"
		],
		challenges: [
			"High-speed accuracy",
			"Grip consistency",
			"Low marking",
			"Reliable tracking"
		]
	},
	agriculture: {
		overview: "Durable drive and conveying components for seasonal, dusty and demanding agricultural operations.",
		applications: [
			"Harvesting equipment",
			"Sorting lines",
			"Processing machinery",
			"Auxiliary drives"
		],
		challenges: [
			"Dust",
			"Shock loads",
			"Outdoor exposure",
			"Seasonal uptime"
		]
	},
	"automotive-and-tire": {
		overview: "Reliable conveying and power transmission for vehicle, component and tire manufacturing.",
		applications: [
			"Tire production",
			"Assembly lines",
			"Component handling",
			"Robotic cells"
		],
		challenges: [
			"Process consistency",
			"Abrasion resistance",
			"Accurate movement",
			"Production uptime"
		]
	},
	mining: {
		overview: "Robust belt and mechanical transmission solutions for abrasive, high-load mining applications.",
		applications: [
			"Crushers and screens",
			"Conveying systems",
			"Pumps and ventilation",
			"Processing equipment"
		],
		challenges: [
			"Abrasive material",
			"Heavy loads",
			"Dust contamination",
			"Continuous duty"
		]
	},
	"stone-and-ceramics": {
		overview: "Application-specific belts for abrasive materials, precision conveying and high-temperature production environments.",
		applications: [
			"Ceramic processing",
			"Stone cutting",
			"Finishing lines",
			"Sorting and conveying"
		],
		challenges: [
			"Abrasion",
			"Temperature",
			"Accurate positioning",
			"Surface protection"
		]
	},
	glass: {
		overview: "Reliable conveying and power transmission for glass forming, processing and handling lines.",
		applications: [
			"Container-glass production",
			"Flat-glass processing",
			"Inspection lines",
			"Product handling"
		],
		challenges: [
			"Heat",
			"Fragile-product handling",
			"Surface protection",
			"Process consistency"
		]
	},
	"wood-processing": {
		overview: "Durable conveying and drive solutions for cutting, sanding, profiling and furniture production.",
		applications: [
			"Panel processing",
			"Sanding machines",
			"Edge banders",
			"Material transfer"
		],
		challenges: [
			"Dust",
			"Grip",
			"Accurate feeding",
			"Abrasion resistance"
		]
	},
	"material-handling-and-logistics": {
		overview: "Efficient belting and conveying components for warehouses, distribution centres and material-flow systems.",
		applications: [
			"Warehouse conveyors",
			"Sorting systems",
			"Pallet handling",
			"Distribution lines"
		],
		challenges: [
			"Reliable tracking",
			"High throughput",
			"Load variation",
			"Low maintenance"
		]
	},
	elevators: {
		overview: "Dependable belt and transmission solutions for elevator and vertical-transport equipment.",
		applications: [
			"Elevator drives",
			"Door systems",
			"Auxiliary mechanisms",
			"Maintenance replacement"
		],
		challenges: [
			"Safety",
			"Low noise",
			"Reliable operation",
			"Long service life"
		]
	},
	textile: {
		overview: "High-speed process and transmission belts for textile production and nonwoven machinery.",
		applications: [
			"Spinning and weaving",
			"Machine tapes",
			"Nonwoven processing",
			"Finishing lines"
		],
		challenges: [
			"High speed",
			"Low vibration",
			"Accurate tracking",
			"Clean operation"
		]
	},
	recycling: {
		overview: "Durable conveying and transmission solutions for sorting, recovery and recycling systems.",
		applications: [
			"Sorting lines",
			"Waste conveyors",
			"Material separation",
			"Processing equipment"
		],
		challenges: [
			"Contamination",
			"Impact",
			"Abrasion",
			"Variable loads"
		]
	},
	"airports-and-baggage-handling": {
		overview: "Reliable conveyor and drive solutions for airport baggage movement, sorting and security systems.",
		applications: [
			"Check-in conveyors",
			"Baggage sorting",
			"Security screening",
			"Arrival carousels"
		],
		challenges: [
			"Continuous availability",
			"Accurate tracking",
			"Variable loads",
			"Passenger-area reliability"
		]
	},
	"robotics-and-automation": {
		overview: "Precision synchronous and conveying solutions for automated production and robotic systems.",
		applications: [
			"Linear positioning",
			"Robotic cells",
			"Automated assembly",
			"Pick-and-place systems"
		],
		challenges: [
			"Positioning accuracy",
			"Repeatability",
			"Low maintenance",
			"High cycle rates"
		]
	}
};
var news = [
	{
		slug: "regional-technical-network",
		category: "Company News",
		supplier: "QTM Group",
		title: "Strengthening Regional Technical Support",
		excerpt: "A draft update about how QTM connects international product expertise with responsive regional coordination.",
		status: "Draft — date to be confirmed"
	},
	{
		slug: "product-identification-guide",
		category: "Technical Articles",
		supplier: "Multi-brand",
		title: "What to Send When Identifying an Industrial Belt",
		excerpt: "A practical draft guide covering markings, dimensions, machine details and photographs.",
		status: "Draft — date to be confirmed"
	},
	{
		slug: "supplier-network-update",
		category: "Partnerships",
		supplier: "Megadyne",
		title: "Inside QTM’s Multi-Brand Supplier Network",
		excerpt: "A draft overview of how one regional contact can help customers compare suitable industrial solutions.",
		status: "Draft — date to be confirmed"
	},
	{
		slug: "conveyor-selection-basics",
		category: "Industry Insights",
		supplier: "Ammeraal Beltech",
		title: "Conveyor Belt Selection: The Application Comes First",
		excerpt: "A draft technical note on matching belt construction to process demands.",
		status: "Draft — date to be confirmed"
	}
];
var productFamilies = [
	{
		name: "Power Transmission Belts",
		items: [
			"Timing Belts",
			"V-Belts",
			"Specialty Belts"
		]
	},
	{
		name: "Conveyor and Process Belts",
		items: [
			"PU Conveyor Belts",
			"PVC Conveyor Belts",
			"Polyester Belts",
			"Silicone Belts",
			"Cotton Belts",
			"Polyolefin Belts",
			"Felt Belts",
			"Elastic Belts",
			"Nonwoven Belts",
			"Fabric Belts",
			"Food-Grade Belts",
			"Process Belts",
			"Seamless Belts",
			"Airport and Logistics Belts"
		]
	},
	{
		name: "Modular Conveying",
		items: [
			"Straight-Running Modular Belts",
			"Radius Modular Belts",
			"Flat-Top Belts",
			"Flush-Grid Belts",
			"Friction-Top Belts",
			"Roller-Top Belts",
			"Rubber-Top Belts",
			"Spiral Belts",
			"Side-Flexing Belts",
			"Modular Belt Accessories"
		]
	},
	{
		name: "Metal Parts",
		items: [
			"Bearings",
			"Couplings",
			"Tensioners",
			"Bushes",
			"Metal Parts"
		]
	}
];
var timingBeltTypes = [
	"Polyurethane Open End",
	"Polyurethane Endless",
	"Rubber Open End",
	"Rubber Endless"
];
function findProduct(slug) {
	return products.find((p) => p.slug === slug);
}
function findSupplier(slug) {
	return suppliers.find((s) => s.slug === slug);
}
function findIndustry(slug) {
	return industries.find((i) => i.slug === slug);
}
function slugify(value) {
	return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
//#endregion
//#region app/components/QtmSite.tsx
var import_jsx_runtime = require_jsx_runtime();
var Arrow = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	className: "interface-arrow",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 16 16",
		focusable: "false",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.5 12.5 12.5 3.5M5.5 3.5h7v7" })
	})
});
var Chevron = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	"aria-hidden": "true",
	children: "⌄"
});
var CascadeChevron = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	className: "cascade-chevron",
	viewBox: "0 0 12 12",
	"aria-hidden": "true",
	focusable: "false",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m4 2 4 4-4 4" })
});
var originalText = /* @__PURE__ */ new WeakMap();
var russianCopy = {
	"Home": "Главная",
	"About Us": "О нас",
	"Products": "Продукция",
	"Industries": "Отрасли",
	"Suppliers": "Партнёры",
	"Our Network": "Наша сеть",
	"Contact Us": "Контакты",
	"News": "Новости",
	"Request a Quote": "Запросить предложение",
	"B2B Login": "Вход B2B",
	"Check Our Products": "Посмотреть продукцию",
	"Explore": "Подробнее",
	"Contact QTM": "Связаться с QTM",
	"Industrial Solutions.": "Промышленные решения.",
	"Delivered Regionally.": "Региональная поставка.",
	"QTM Group is a leading regional supplier of, industrial, agricultural and conveyor belts. In addition to belting solutions, we provide roller chains, sprockets, bearings, and a comprehensive range of industrial spare parts.": "QTM Group — ведущий региональный поставщик промышленных, сельскохозяйственных и конвейерных ремней. Помимо ременных решений, мы поставляем роликовые цепи, звёздочки, подшипники и широкий ассортимент промышленных запасных частей.",
	"MegaPartner": "МегаПартнёр",
	"STRATEGIC PARTNERSHIPS": "СТРАТЕГИЧЕСКИЕ ПАРТНЁРСТВА",
	"MEGAPARTNER": "МЕГАПАРТНЁР",
	"Our partnership": "Наше партнёрство",
	"Product solutions": "Продуктовые решения",
	"In addition to Megadyne, QTM Group represents other leading brands within the": "Помимо Megadyne, QTM Group представляет другие ведущие бренды группы",
	"including...": "включая...",
	"Our Partners": "Наши партнёры",
	"Global Products. Regional Market Knowledge.": "Мировые продукты. Региональная экспертиза.",
	"A Network Built Around the Markets We Serve": "Сеть, созданная вокруг рынков, которые мы обслуживаем",
	"REGIONAL COVERAGE": "РЕГИОНАЛЬНОЕ ПОКРЫТИЕ",
	"Hover over a highlighted region to explore QTM’s regional reach.": "Наведите курсор на выделенный регион, чтобы увидеть географию работы QTM.",
	"Central Asia": "Центральная Азия",
	"Middle East": "Ближний Восток",
	"Caucasus & Moldova": "Кавказ и Молдова",
	"Mongolia": "Монголия",
	"Regional Distribution": "Региональная дистрибуция",
	"OEM & End-User Support": "Поддержка OEM и конечных клиентов",
	"Cross-Border Coordination": "Международная координация",
	"START A CONVERSATION": "НАЧНИТЕ ДИАЛОГ",
	"Need a Product, Replacement or Technical Solution?": "Нужен продукт, замена или техническое решение?",
	"Send Product Details": "Отправить данные продукта",
	"Contact": "Контакты",
	"Support": "Поддержка",
	"Privacy Policy": "Политика конфиденциальности",
	"Cookie Policy": "Политика cookie",
	"Terms": "Условия использования",
	"QTM Group is proud to be a Megadyne MegaPartner and a trusted regional distributor of Megadyne power transmission solutions.": "QTM Group гордится статусом MegaPartner Megadyne и является надёжным региональным дистрибьютором решений Megadyne для передачи мощности.",
	"Our partnership connects Megadyne’s broad industrial portfolio with regional distributors, OEMs, maintenance teams and end users. QTM supports product identification, technical selection, commercial coordination and dependable follow-up for demanding power transmission applications.": "Наше партнёрство делает широкий промышленный ассортимент Megadyne доступным региональным дистрибьюторам, OEM-производителям, сервисным службам и конечным пользователям. QTM помогает с идентификацией, техническим подбором и коммерческой координацией.",
	"Visit Megadyne": "Посетить Megadyne",
	"MEGASYNC™ Rubber belts": "Резиновые ремни MEGASYNC™",
	"Polyurethane timing belts": "Полиуретановые зубчатые ремни",
	"V-belt": "Клиновой ремень",
	"Official Megadyne product page": "Официальная страница продукта Megadyne",
	"High-performance synchronous solutions for precision and demanding industrial drives.": "Высокоэффективные синхронные решения для точных и нагруженных промышленных приводов.",
	"Wear-resistant belt technology for accurate, clean and efficient power transmission.": "Износостойкие ременные технологии для точной, чистой и эффективной передачи мощности.",
	"Reliable, versatile power transmission for industrial drives across a broad range of applications.": "Надёжная и универсальная передача мощности для широкого спектра промышленных приводов.",
	"Configurable solutions for linear motion, positioning and transport applications.": "Конфигурируемые решения для линейного движения, позиционирования и транспортировки.",
	"QTM Group represents Ammeraal Beltech, connecting customers with advanced conveyor, process and high-performance flat-belt solutions for demanding industrial applications.": "QTM Group представляет Ammeraal Beltech и предлагает передовые конвейерные, технологические и высокоэффективные плоские ремни для сложных промышленных применений.",
	"Through Sampla, QTM Group provides reliable conveyor and process belting for food, logistics, packaging and general manufacturing, supported by practical regional product selection.": "Благодаря Sampla QTM Group поставляет надёжные конвейерные и технологические ленты для пищевой промышленности, логистики, упаковки и общего производства.",
	"QTM Group supplies UNI modular belts, sprockets and accessories for hygienic, configurable and efficient conveying systems across food and industrial production.": "QTM Group поставляет модульные ленты UNI, звёздочки и комплектующие для гигиеничных, гибких и эффективных конвейерных систем.",
	"QTM Group represents Challenge Power Transmission with an extensive portfolio of roller chains, sprockets and mechanical power transmission components for industrial maintenance and OEM requirements.": "QTM Group представляет Challenge Power Transmission с широким ассортиментом роликовых цепей, звёздочек и механических компонентов для промышленного обслуживания и OEM.",
	"Customers benefit from QTM’s regional communication, product identification, application review and commercial coordination.": "Клиенты получают региональную поддержку QTM, помощь в идентификации продукции, анализе применения и коммерческой координации.",
	"Conveyor & process belts": "Конвейерные и технологические ленты",
	"RAPPLON® flat belts": "Плоские ремни RAPPLON®",
	"Specialty belt solutions": "Специализированные ременные решения",
	"Light-duty conveyor belts": "Лёгкие конвейерные ленты",
	"Specialized process belts": "Специализированные технологические ленты",
	"Flat-belt solutions": "Решения с плоскими ремнями",
	"Modular conveyor belts": "Модульные конвейерные ленты",
	"Matched sprockets & accessories": "Подходящие звёздочки и комплектующие",
	"Complete conveying systems": "Комплексные конвейерные системы",
	"Roller chains": "Роликовые цепи",
	"Precision sprockets": "Прецизионные звёздочки",
	"Mechanical components": "Механические компоненты",
	"Since 2023, QTM Group has served as a regional representative of ContiTech, a leading manufacturer of high-quality industrial power transmission belts.": "С 2023 года QTM Group является региональным представителем ContiTech — ведущего производителя высококачественных промышленных приводных ремней.",
	"QTM gives customers responsive regional access to Continental’s extensive drive-belt portfolio, supporting application review, belt identification and product selection for industrial, agricultural and OEM requirements.": "QTM предоставляет клиентам оперативный региональный доступ к широкому ассортименту приводных ремней Continental и помогает с анализом применения, идентификацией и подбором продукции.",
	"Visit ContiTech": "Посетить ContiTech",
	"Industrial V-belts": "Промышленные клиновые ремни",
	"Rubber synchronous belts": "Резиновые синхронные ремни",
	"Polyurethane timing belts": "Полиуретановые зубчатые ремни",
	"Wrapped, raw-edge and heavy-duty solutions for smooth, reliable power transmission.": "Обёрнутые, формованные и усиленные решения для плавной и надёжной передачи мощности.",
	"Precision timing belts engineered for durability and accuracy.": "Прецизионные зубчатые ремни, рассчитанные на долговечность и точность.",
	"Maintenance-free, abrasion-resistant solutions for precise drives.": "Не требующие обслуживания, износостойкие решения для точных приводов.",
	"Since 2026 we are proud to announce QTM Group received authorization from Wilhelm Herm. Müller Group to represent their interests in the region.": "С 2026 года QTM Group с гордостью представляет интересы Wilhelm Herm. Müller Group в регионе на основании официальной авторизации.",
	"Since 2026, QTM Group has been officially authorized by the Wilhelm Herm. Müller Group to represent its products and business interests across the region.": "С 2026 года QTM Group официально уполномочена Wilhelm Herm. Müller Group представлять её продукцию и деловые интересы в регионе.",
	"In 2026, QTM Group was officially authorized by the Wilhelm Herm. Müller Group (WHM) to represent its products and business interests across the region. We are proud to begin this partnership and bring WHM’s advanced drive-technology solutions closer to our customers.": "В 2026 году QTM Group получила официальную авторизацию Wilhelm Herm. Müller Group (WHM) на представление её продукции и деловых интересов в регионе. Мы гордимся этим партнёрством и делаем передовые приводные технологии WHM ближе к нашим клиентам.",
	"Visit WHM": "Посетить WHM",
	"PU timing-belt systems": "Системы полиуретановых зубчатых ремней",
	"Synchronous pulleys": "Синхронные шкивы",
	"Endless drive belts": "Бесконечные приводные ремни",
	"BRECO® and BRECOFLEX® solutions for precision drives and transport.": "Решения BRECO® и BRECOFLEX® для точных приводов и транспортировки.",
	"Standard and tailor-made components matched to the belt system.": "Стандартные и индивидуальные компоненты, согласованные с ременной системой.",
	"Homogeneous endless belts with excellent running characteristics.": "Однородные бесконечные ремни с превосходными ходовыми характеристиками.",
	"Industrial solutions across CIS, Central Asia and the Middle East": "Промышленные решения в СНГ, Центральной Азии и на Ближнем Востоке",
	"QUALITY TEAM MANAGEMENT": "QUALITY TEAM MANAGEMENT",
	"AMMEGA GROUP": "ГРУППА AMMEGA",
	"AMMEGA GROUP PARTNERS": "ПАРТНЁРЫ ГРУППЫ AMMEGA",
	"Explore the partnership": "Подробнее о партнёрстве",
	"Official website": "Официальный сайт",
	"Global industrial technology. Regional expertise and dependable support.": "Мировые промышленные технологии. Региональная экспертиза и надёжная поддержка.",
	"Explore": "Разделы"
};
function AutoTranslate({ language }) {
	(0, import_react.useEffect)(() => {
		const translate = (root) => {
			const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
			const nodes = [];
			while (walker.nextNode()) nodes.push(walker.currentNode);
			nodes.forEach((node) => {
				const parent = node.parentElement;
				if (!parent || [
					"SCRIPT",
					"STYLE",
					"TEXTAREA",
					"INPUT",
					"OPTION"
				].includes(parent.tagName)) return;
				if (!originalText.has(node)) originalText.set(node, node.nodeValue || "");
				const source = originalText.get(node) || "";
				const trimmed = source.trim();
				const translated = language === "ru" ? russianCopy[trimmed] : void 0;
				node.nodeValue = translated ? source.replace(trimmed, translated) : source;
			});
		};
		const apply = (root) => {
			observer?.disconnect();
			translate(root);
			observer?.observe(document.body, {
				childList: true,
				subtree: true,
				characterData: true
			});
		};
		const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => apply(mutation.target)));
		translate(document.body);
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true
		});
		document.documentElement.lang = language;
		return () => observer.disconnect();
	}, [language]);
	return null;
}
function Logo({ light = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className: `logo ${light ? "logo-light" : ""}`,
		href: "/",
		"aria-label": "QTM Group home",
		"data-asset": "QTM_LOGO_DARK",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			className: "header-logo-image",
			src: "/assets/qtm-group-logo-transparent.png",
			alt: "QTM Group"
		})
	});
}
function Button({ href, children, secondary = false, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		className: `button ${secondary ? "button-secondary" : ""} ${className}`,
		href,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
	});
}
function SectionHeading({ number, eyebrow, title, copy, inverse = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `section-heading ${inverse ? "inverse" : ""}`,
		children: [
			(number || eyebrow) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "eyebrow",
				children: [number && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: number }), eyebrow]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
			copy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "section-copy",
				children: copy
			})
		]
	});
}
function Breadcrumbs({ parts, plain = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "breadcrumbs",
		"aria-label": "Breadcrumb",
		children: [plain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: "/",
			children: "Home"
		}), parts.map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "/" }), plain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: part.label }) : part.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: part.href,
			children: part.label
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: part.label })] }, part.label))]
	});
}
function Header({ path, language, onLanguageChange }) {
	const [mega, setMega] = (0, import_react.useState)(false);
	const [mobile, setMobile] = (0, import_react.useState)(false);
	const [mobileProducts, setMobileProducts] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)(false);
	const [headerHidden, setHeaderHidden] = (0, import_react.useState)(false);
	const [flagTooltip, setFlagTooltip] = (0, import_react.useState)(null);
	const megaRef = (0, import_react.useRef)(null);
	const nav = [
		["Home", "/"],
		["About Us", "/about-us"],
		["Products", "/products"],
		["Industries", "/industries"],
		["Suppliers", "/suppliers"],
		["Our Network", "/our-network"],
		["B2B", "/b2b"],
		["Contact Us", "/contact-us"],
		["News", "/news"]
	];
	const regionalFlags = [
		["am", "Armenia"],
		["ge", "Georgia"],
		["md", "Moldova"],
		["kz", "Kazakhstan"],
		["kg", "Kyrgyzstan"],
		["uz", "Uzbekistan"],
		["tj", "Tajikistan"],
		["tm", "Turkmenistan"],
		["mn", "Mongolia"],
		["sa", "Saudi Arabia"],
		["ae", "United Arab Emirates"],
		["bh", "Bahrain"],
		["om", "Oman"],
		["qa", "Qatar"],
		["eg", "Egypt"],
		["lb", "Lebanon"]
	];
	(0, import_react.useEffect)(() => {
		const close = (event) => {
			if (megaRef.current && !megaRef.current.contains(event.target)) setMega(false);
		};
		document.addEventListener("mousedown", close);
		return () => document.removeEventListener("mousedown", close);
	}, []);
	(0, import_react.useEffect)(() => {
		setMega(false);
		setMobile(false);
		setHeaderHidden(false);
	}, [path]);
	(0, import_react.useEffect)(() => {
		let previousScroll = Math.max(window.scrollY, 0);
		let frame = 0;
		const updateHeader = () => {
			const currentScroll = Math.max(window.scrollY, 0);
			const difference = currentScroll - previousScroll;
			if (mobile || search || mega || currentScroll < 80) setHeaderHidden(false);
			else if (difference > 6) setHeaderHidden(true);
			else if (difference < -6) setHeaderHidden(false);
			previousScroll = currentScroll;
			frame = 0;
		};
		const handleScroll = () => {
			if (!frame) frame = window.requestAnimationFrame(updateHeader);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, [
		mobile,
		search,
		mega
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			className: "skip-link",
			href: "#main",
			children: "Skip to content"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: `site-header${headerHidden ? " header-hidden" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "utility",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container utility-inner",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "utility-region",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Industrial solutions across CIS, Central Asia and the Middle East" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "utility-flags",
								"aria-label": "Countries served by QTM Group",
								children: regionalFlags.map(([code, country]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									className: "utility-flag",
									src: code === "eg" ? "/assets/flags/egypt.svg" : code === "lb" ? "/assets/flags/lebanon.svg" : `https://flagcdn.com/w40/${code}.png`,
									alt: `${country} flag`,
									onMouseEnter: (event) => setFlagTooltip({
										country,
										x: event.clientX,
										y: event.clientY
									}),
									onMouseMove: (event) => setFlagTooltip({
										country,
										x: event.clientX,
										y: event.clientY
									}),
									onMouseLeave: () => setFlagTooltip(null)
								}, country))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "mailto:info@qtm-group.com",
								children: "info@qtm-group.com"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "tel:+37443552522",
								children: "+374 43 552522"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "language-select",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Select language"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Select language",
									value: language,
									onChange: (event) => onLanguageChange(event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "en",
										children: "EN"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ru",
										children: "RU"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/b2b",
								children: "B2B Login"
							})
						] })]
					})
				}),
				flagTooltip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flag-tooltip",
					role: "tooltip",
					style: {
						left: flagTooltip.x + 12,
						top: flagTooltip.y + 14
					},
					children: flagTooltip.country
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "main-nav",
					ref: megaRef,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container nav-inner",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "desktop-nav",
								"aria-label": "Main navigation",
								children: nav.map(([label, href]) => label === "Products" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "desktop-products",
									onMouseLeave: () => setMega(false),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: `${path.startsWith("/products") ? "active" : ""}`,
										"aria-expanded": mega,
										"aria-controls": "product-mega-menu",
										onClick: () => setMega(!mega),
										onMouseEnter: () => setMega(true),
										children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chevron, {})]
									}), mega && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
										id: "product-mega-menu",
										className: "cascade-menu",
										"aria-label": "Product categories",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "cascade-level cascade-level-root",
											children: [productFamilies.map((familyItem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "cascade-item",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: `/products?category=${slugify(familyItem.name)}`,
													children: [familyItem.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CascadeChevron, {})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
													className: "cascade-level cascade-submenu",
													children: familyItem.name === "Power Transmission Belts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
															className: "cascade-item",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
																href: "/products/timing-belts",
																children: ["Timing Belts", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CascadeChevron, {})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
																className: "cascade-level cascade-submenu",
																children: timingBeltTypes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
																	href: `/products/timing-belts/${slugify(item)}`,
																	children: item
																}) }, item))
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
															className: "cascade-item",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
																href: "/products/v-belts",
																children: ["V-Belts", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CascadeChevron, {})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
																className: "cascade-level cascade-submenu",
																children: vBeltFamilies.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
																	href: item.href,
																	children: item.name
																}) }, item.name))
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
															href: "/products?category=specialty-belts",
															children: "Specialty Belts"
														}) })
													] }) : familyItem.items.map((item) => {
														const linked = products.find((product) => product.name === item || product.name.replace(" & Components", "") === item);
														return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
															href: linked ? `/products/${linked.slug}` : `/products?category=${slugify(item)}`,
															children: item
														}) }, item);
													})
												})]
											}, familyItem.name)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
												className: "cascade-all-products",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: "/products",
													children: "View all products"
												})
											})]
										})
									})]
								}, label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: (href === "/" ? path === "/" : path.startsWith(href)) ? "active" : "",
									href,
									children: label
								}, label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "nav-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "search-button",
										"aria-label": "Open search",
										onClick: () => setSearch(!search),
										children: "⌕"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										href: "/request-a-quote",
										className: "header-quote-button",
										children: "Request a Quote"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "menu-button",
										type: "button",
										onClick: () => setMobile(true),
										"aria-label": "Open navigation",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
										]
									})
								]
							})
						]
					}), search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
						className: "header-search",
						action: "/search",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "header-search",
									children: "Search products, suppliers and industries"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "header-search",
									name: "q",
									autoFocus: true,
									placeholder: "Try “timing belt” or “packaging”"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									children: ["Search ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Close search",
									onClick: () => setSearch(false),
									children: "×"
								})
							]
						})
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mobile-drawer ${mobile ? "open" : ""}`,
			"aria-hidden": !mobile,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "drawer-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobile(false),
						"aria-label": "Close navigation",
						children: "×"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Mobile navigation",
					children: nav.map(([label, href]) => label === "Products" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mobile-accordion",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMobileProducts(!mobileProducts),
							"aria-expanded": mobileProducts,
							"aria-controls": "mobile-products-tree",
							children: ["Products ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chevron, {})]
						}), mobileProducts && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mobile-product-tree",
							id: "mobile-products-tree",
							children: [productFamilies.map((familyItem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "mobile-product-family",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: [familyItem.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CascadeChevron, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mobile-product-children",
									children: [familyItem.name !== "Power Transmission Belts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "mobile-view-all",
										href: `/products?category=${slugify(familyItem.name)}`,
										children: ["View all ", familyItem.name]
									}), familyItem.name === "Power Transmission Belts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
											className: "mobile-product-family mobile-product-subfamily",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: ["Timing Belts", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CascadeChevron, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mobile-product-children",
												children: timingBeltTypes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: `/products/timing-belts/${slugify(item)}`,
													children: item
												}, item))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
											className: "mobile-product-family mobile-product-subfamily",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: ["V-Belts", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CascadeChevron, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mobile-product-children",
												children: vBeltFamilies.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: item.href,
													children: item.name
												}, item.name))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "/products?category=specialty-belts",
											children: "Specialty Belts"
										})
									] }) : familyItem.items.map((item) => {
										const linked = products.find((product) => product.name === item || product.name.replace(" & Components", "") === item);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: linked ? `/products/${linked.slug}` : `/products?category=${slugify(item)}`,
											children: item
										}, item);
									})]
								})]
							}, familyItem.name)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "mobile-all-products",
								href: "/products",
								children: "View all products"
							})]
						})]
					}, label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href,
						children: label
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "drawer-language",
					"aria-label": "Language",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: language === "en" ? "active" : "",
						onClick: () => onLanguageChange("en"),
						children: "English"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: language === "ru" ? "active" : "",
						onClick: () => onLanguageChange("ru"),
						children: "Русский"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					href: "/request-a-quote",
					children: "Request a Quote"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "drawer-login",
					href: "/b2b",
					children: "B2B Customer Login"
				})
			]
		}),
		mobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "drawer-backdrop",
			"aria-label": "Close navigation",
			onClick: () => setMobile(false)
		})
	] });
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "footer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-clean",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "footer-brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Global industrial technology. Regional expertise and dependable support." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Contact" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "mailto:info@qtm-group.com",
							children: "info@qtm-group.com"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "tel:+37443552522",
							children: "+374 43 552522"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Explore" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/products",
							children: "Products"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/industries",
							children: "Industries"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/our-network",
							children: "Our Network"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/suppliers",
							children: "Suppliers"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Support" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/request-a-quote",
							children: "Request a Quote"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/contact-us",
							children: "Contact Us"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/b2b",
							children: "B2B Login"
						})
					] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-bottom",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Quality Team Management"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/privacy-policy",
						children: "Privacy Policy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/cookie-policy",
						children: "Cookie Policy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/terms",
						children: "Terms"
					})
				] })]
			})]
		})
	});
}
function HomePage() {
	const [videoOpen, setVideoOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const elements = Array.from(document.querySelectorAll("[data-home-reveal]"));
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
			elements.forEach((element) => element.classList.add("is-visible"));
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: .08,
			rootMargin: "0px 0px -9%"
		});
		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!videoOpen) return;
		const closeOnEscape = (event) => {
			if (event.key === "Escape") setVideoOpen(false);
		};
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", closeOnEscape);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, [videoOpen]);
	const homePartners = [
		{
			name: "Megadyne",
			logo: "/assets/partners/megadyne.svg"
		},
		{
			name: "Ammeraal Beltech",
			logo: "/assets/partners/ammeraal-beltech.svg"
		},
		{
			name: "Sampla",
			logo: "/assets/partners/sampla.svg"
		},
		{
			name: "UNI Modular",
			logo: "/assets/partners/uni.png"
		},
		{
			name: "Challenge Power Transmission",
			logo: "/assets/partners/challenge.png"
		},
		{
			name: "Continental / ContiTech",
			logo: "/assets/partners/continental.png"
		},
		{
			name: "Wilhelm Herm. Müller",
			logo: "/assets/partners/whm.png"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "hero",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "QTM GROUP" }), "QUALITY TEAM MANAGEMENT"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Industrial Solutions. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Delivered Regionally." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM Group is a leading regional supplier of, industrial, agricultural and conveyor belts. In addition to belting solutions, we provide roller chains, sprockets, bearings, and a comprehensive range of industrial spare parts." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "button-row",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							href: "/products",
							children: "Check Our Products"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hero-media",
				role: "img",
				"aria-label": "Industrial power transmission belts operating inside a factory"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section partnership-story",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "section-heading megapartner-heading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/megapartner-heading.png",
						alt: "MegaPartner"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "principal-partnership-stack",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "principal-partnership megadyne-partnership",
							"data-home-reveal": true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "principal-brand-head reversed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "brand-head-copy",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "megadyne-partnership-statement",
												children: "QTM Group is proud to be MegaPartner and trusted regional distributor of Megadyne power transmission products."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Our partnership connects Megadyne’s broad industrial portfolio with regional distributors, OEMs, maintenance teams and end users. QTM supports product identification, technical selection, commercial coordination and dependable follow-up for demanding power transmission applications." }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												className: "text-link",
												href: "https://megadynegroup.com/en/",
												target: "_blank",
												rel: "noreferrer",
												children: ["Visit Megadyne ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "principal-logo-stage megapartner-stage",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
											className: "megapartner-animation-frame",
											src: "/megapartner-drive.html",
											title: "MegaPartner and QTM belt-driven gear animation",
											loading: "eager"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "megadyne-logo-stage-swapped",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "megadyne-logo-link",
										href: "https://megadynegroup.com/en/",
										target: "_blank",
										rel: "noreferrer",
										"aria-label": "Visit Megadyne official website",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/assets/partners/megadyne.svg",
											alt: "Megadyne logo"
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "principal-products",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "principal-product-link",
											href: "https://megadynegroup.com/en/products/timing-belts/rubber-endless/",
											target: "_blank",
											rel: "noreferrer",
											"aria-label": "View MEGASYNC Rubber belts on the official Megadyne website",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "product-visual",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "/assets/partnership-megadyne-rubber-new.png",
													alt: "Megadyne MEGASYNC Rubber timing belts"
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "MEGASYNC™ Rubber belts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "High-performance synchronous solutions for precision and demanding industrial drives." })] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "principal-product-link",
											href: "https://megadynegroup.com/en/products/timing-belts/polyurethane-endless/",
											target: "_blank",
											rel: "noreferrer",
											"aria-label": "View polyurethane timing belts on the official Megadyne website",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "product-visual",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "/assets/partnership-megadyne-pu-new.png",
													alt: "Megadyne polyurethane timing belts"
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Polyurethane timing belts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wear-resistant belt technology for accurate, clean and efficient power transmission." })] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "principal-product-link",
											href: "https://megadynegroup.com/en/products/v-belts/",
											target: "_blank",
											rel: "noreferrer",
											"aria-label": "View V-belts on the official Megadyne website",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "product-visual",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "/assets/partnership-megadyne-vbelts-extra.png",
													alt: "Megadyne EXTRA V-belts"
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "V-belt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reliable, versatile power transmission for industrial drives across a broad range of applications." })] })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
									className: "megadyne-launch-banner",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "megadyne-launch-link",
										href: "https://megadynegroup.com/en/products/v-belts/rubber-raw-edge/megav-dynamic-max/",
										target: "_blank",
										rel: "noreferrer",
										"aria-label": "View MEGAV Dynamic-MAX on the official Megadyne website",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/assets/megadyne-dynamic-max-feature.png",
											alt: "New Megadyne MEGAV Dynamic-MAX belts"
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "megadyne-video-feature",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "megadyne-video-preview",
										type: "button",
										onClick: () => setVideoOpen(true),
										"aria-label": "Play the MEGAV Dynamic-MAX product video",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "https://i.ytimg.com/vi/IylNg8HXlbs/maxresdefault.jpg",
											alt: "MEGAV Dynamic-MAX product video preview"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "megadyne-video-play",
											"aria-hidden": "true",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "play-triangle" })
										})]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ammega-introduction",
							"data-home-reveal": true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: [
								"In addition to Megadyne, QTM Group represents other leading brands within the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "ammega-inline-link",
									href: "https://ammega.com/",
									target: "_blank",
									rel: "noreferrer",
									children: "AMMEGA Group"
								}),
								", including..."
							] })
						}),
						[
							{
								slug: "ammeraal",
								name: "Ammeraal Beltech",
								logo: "/assets/partners/trimmed/ammeraal-beltech.webp",
								url: "https://ammeraalbeltech.com/",
								copy: "QTM Group represents Ammeraal Beltech, connecting customers with advanced conveyor, process and high-performance flat-belt solutions for demanding industrial applications.",
								images: [[
									"/assets/partner-products/ammeraal-synthetic.webp",
									"Synthetic conveyor belts",
									"https://ammeraalbeltech.com/en/products/synthetic-belts/"
								], [
									"/assets/partner-products/ammeraal-surface.webp",
									"Specialty belt surfaces",
									"https://ammeraalbeltech.com/en/products/synthetic-belts/coating-materials/"
								]]
							},
							{
								slug: "sampla",
								name: "Sampla",
								logo: "/assets/partners/trimmed/sampla.webp",
								url: "https://sampla.com/",
								copy: "Through Sampla, QTM Group provides reliable conveyor and process belting for food, logistics, packaging and general manufacturing, supported by practical regional product selection.",
								images: [[
									"/assets/partner-products/sampla-fabcon-r.webp",
									"FABCON fabric conveyor belts",
									"https://sampla.com/item/fabcon/"
								], [
									"/assets/partner-products/sampla-fabcon-b.webp",
									"FABCON process belts",
									"https://sampla.com/item/fabcon/"
								]]
							},
							{
								slug: "uni",
								name: "UNI Modular Belts",
								logo: "/assets/partners/trimmed/uni.webp",
								url: "https://ammeraalbeltech.com/en/products/modular-belts/",
								copy: "QTM Group supplies UNI modular belts, sprockets and accessories for hygienic, configurable and efficient conveying systems across food and industrial production.",
								images: [[
									"/assets/partner-products/uni-straight.webp",
									"Straight-running modular belts",
									"https://ammeraalbeltech.com/en/products/modular-belts/straight-running/"
								], [
									"/assets/partner-products/uni-flex.webp",
									"Side-flexing modular belts",
									"https://ammeraalbeltech.com/en/products/modular-belts/side-flexing-belts/"
								]]
							},
							{
								slug: "challenge",
								name: "Challenge Power Transmission",
								logo: "/assets/partners/trimmed/challenge.webp",
								url: "https://www.challengept.com/",
								copy: "QTM Group represents Challenge Power Transmission with an extensive portfolio of roller chains, sprockets and mechanical power transmission components for industrial maintenance and OEM requirements.",
								images: [[
									"/assets/partner-products/challenge-chain.webp",
									"Industrial roller chains",
									"https://www.challengept.com/products/rollerChain.php"
								], [
									"/assets/partner-products/challenge-sprocket.webp",
									"Precision sprockets",
									"https://www.challengept.com/products/bsSprockets.php"
								]]
							}
						].map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `principal-partnership ammega-partnership ammega-${brand.slug}`,
							"data-home-reveal": true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ammega-brand-logo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: brand.url,
									target: "_blank",
									rel: "noreferrer",
									"aria-label": `Visit ${brand.name}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: brand.logo,
										alt: `${brand.name} logo`
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ammega-brand-content",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: brand.copy }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Customers benefit from QTM’s regional communication, product identification, application review and commercial coordination." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "text-link",
										href: brand.url,
										target: "_blank",
										rel: "noreferrer",
										children: [
											"Visit ",
											brand.name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ammega-products",
									children: brand.images.map(([image, label, productUrl]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "ammega-product-link",
										href: productUrl,
										target: "_blank",
										rel: "noreferrer",
										"aria-label": `View ${label} on the official ${brand.name} website`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: image,
											alt: `${brand.name} ${label}`
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: label })] }, label))
								})]
							})]
						}, brand.name)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "principal-partnership contitech-partnership",
							"data-home-reveal": true,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "principal-logo-stage",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "principal-logo-link",
										href: "https://www.continental-industry.com/global/en",
										target: "_blank",
										rel: "noreferrer",
										"aria-label": "Visit ContiTech official website",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/assets/partners/continental.png",
											alt: "Continental ContiTech logo"
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "principal-copy single-copy",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Since 2023, QTM Group has served as a regional representative of ContiTech, a leading manufacturer of high-quality industrial power transmission belts." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM gives customers responsive regional access to Continental’s extensive drive-belt portfolio, supporting application review, belt identification and product selection for industrial, agricultural and OEM requirements." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											className: "text-link",
											href: "https://www.continental-industry.com/global/en",
											target: "_blank",
											rel: "noreferrer",
											children: ["Visit ContiTech ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
										})
									] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "principal-products",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "principal-product-link",
											href: "https://www.continental-industry.com/global/en/products-solutions/power-transmission/v-belts",
											target: "_blank",
											rel: "noreferrer",
											"aria-label": "View industrial V-belts on the official Continental website",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "product-visual",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "/assets/partnership-conti-v.jpg",
													alt: "Continental industrial V-belt construction"
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Industrial V-belts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wrapped, raw-edge and heavy-duty solutions for smooth, reliable power transmission." })] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "principal-product-link",
											href: "https://www.continental-industry.com/global/en/products-solutions/power-transmission/synchronous-belts-rubber",
											target: "_blank",
											rel: "noreferrer",
											"aria-label": "View rubber synchronous belts on the official Continental website",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "product-visual",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "/assets/partnership-conti-rubber.jpg",
													alt: "Continental rubber synchronous belt construction"
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Rubber synchronous belts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Precision timing belts engineered for durability and accuracy." })] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "principal-product-link",
											href: "https://www.continental-industry.com/global/en/products-solutions/power-transmission/synchronous-belts-pu",
											target: "_blank",
											rel: "noreferrer",
											"aria-label": "View polyurethane timing belts on the official Continental website",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "product-visual",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "/assets/partnership-conti-pu.jpg",
													alt: "Continental polyurethane synchronous belts"
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Polyurethane timing belts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Maintenance-free, abrasion-resistant solutions for precise drives." })] })] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "principal-partnership whm-partnership",
							"data-home-reveal": true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "principal-logo-stage",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "principal-logo-link",
									href: "https://whm.net/en/",
									target: "_blank",
									rel: "noreferrer",
									"aria-label": "Visit Wilhelm Herm. Müller official website",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/assets/partners/whm.png",
										alt: "Wilhelm Herm. Müller logo"
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "whm-content-grid",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "principal-copy whm-copy",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Since 2026 we are proud to announce QTM Group received authorization from Wilhelm Herm. Müller Group to represent their interests in the region." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "In 2026, QTM Group was officially authorized by the Wilhelm Herm. Müller Group (WHM) to represent its products and business interests across the region. We are proud to begin this partnership and bring WHM’s advanced drive-technology solutions closer to our customers." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											className: "text-link",
											href: "https://whm.net/en/",
											target: "_blank",
											rel: "noreferrer",
											children: ["Visit WHM ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
									className: "whm-product-showcase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "whm-product-art",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: "/assets/whm-breco-timing-belts.png",
												alt: "BRECOFLEX and BRECO polyurethane timing belts"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												className: "whm-logo-hit whm-logo-hit-brecoflex",
												href: "https://www.brecoflex.com/",
												target: "_blank",
												rel: "noreferrer",
												"aria-label": "Visit the official BRECOFLEX website"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												className: "whm-logo-hit whm-logo-hit-breco",
												href: "https://www.breco.de/",
												target: "_blank",
												rel: "noreferrer",
												"aria-label": "Visit the official BRECO website"
											})
										]
									})
								})]
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "home-partners",
			"aria-labelledby": "partners-title",
			"data-home-reveal": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "partners-title",
					id: "partners-title",
					children: "Our Partners"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "partner-marquee",
				"aria-label": "QTM partner brands",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "partner-marquee-track",
					children: [...homePartners, ...homePartners].map((partner, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "partner-logo-item",
						"aria-hidden": index >= homePartners.length,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: partner.logo,
							alt: index < homePartners.length ? `${partner.name} logo` : ""
						})
					}, `${partner.name}-${index}`))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "home-final-reveal",
			"data-home-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
		}),
		videoOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "video-modal",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "MEGAV Dynamic-MAX product video",
			onMouseDown: (event) => {
				if (event.target === event.currentTarget) setVideoOpen(false);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "video-modal-content",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "video-modal-close",
					type: "button",
					onClick: () => setVideoOpen(false),
					"aria-label": "Close video",
					autoFocus: true,
					children: "×"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "video-modal-frame",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: "https://www.youtube-nocookie.com/embed/IylNg8HXlbs?autoplay=1&rel=0",
						title: "MEGAV Dynamic-MAX product video",
						allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
						allowFullScreen: true
					})
				})]
			})
		})
	] });
}
function ProductCard({ product, featured = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `product-card ${featured ? "featured" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "product-image-frame",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "product-image",
				href: `/products/${product.slug}`,
				style: { backgroundImage: `url(${product.image})` },
				"aria-label": `View ${product.name}`
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "product-card-body",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mono-label",
					children: product.family
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `/products/${product.slug}`,
					children: product.name
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: product.description }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "product-meta",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [product.subcategories.length, " subcategories"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.suppliers.slice(0, 2).join(" · ") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "text-link",
					href: `/products/${product.slug}`,
					children: ["Explore ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
				})
			]
		})]
	});
}
function FinalCta() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "final-cta",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "START A CONVERSATION" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Need a Product, Replacement or Technical Solution?" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "button-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							href: "/request-a-quote",
							children: "Request a Quote"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							href: "/product-identification",
							secondary: true,
							children: "Send Product Details"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "text-link light",
							href: "/contact-us",
							children: ["Contact QTM ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
						})
					]
				})
			]
		})
	});
}
function SupportBlock() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "about-story-closing",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "eyebrow",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "RESPONSIVE SUPPORT" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "With a strong commitment to quality, reliability, and customer satisfaction, the QTM Group team provides responsive technical and commercial assistance 24/7." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			href: "/contact-us",
			children: "Contact QTM"
		})]
	});
}
function PageHero({ eyebrow, title, copy, parts, plainBreadcrumbs = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "page-hero",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, {
					parts,
					plain: plainBreadcrumbs
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: eyebrow })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: copy })
			]
		})
	});
}
function AboutPage() {
	const aboutIndustries = [
		"Oil & Gas",
		"Packaging",
		"Tobacco",
		"Food & Beverage",
		"Paper & Printing",
		"Agriculture",
		"Automotive & Tire",
		"Mining",
		"Stone & Ceramics",
		"Glass",
		"Wood Processing",
		"Material Handling & Logistics",
		"Elevators",
		"Textile",
		"Recycling",
		"Airports & Baggage Handling",
		"Robotics & Automation"
	];
	(0, import_react.useEffect)(() => {
		const elements = Array.from(document.querySelectorAll("[data-about-reveal]"));
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
			elements.forEach((element) => element.classList.add("is-visible"));
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: .08,
			rootMargin: "0px 0px -9%"
		});
		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "about-intro",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "about-hero-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { parts: [{ label: "About Us" }] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Welcome to QTM" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Established in 2020, QTM Group (Quality Team Management) is a trusted provider of industrial power transmission and conveying solutions across Central Asia, the Middle East, and the CIS region." })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "about-hero-media",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/assets/about-qtm-warehouse.png",
				alt: "QTM industrial belt warehouse"
			})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section about-story-section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container about-story-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "about-story-masthead",
					"data-about-reveal": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "about-story-title",
						children: "About Us"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "about-story-feature",
					"data-about-reveal": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: "about-story-image",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/assets/about-team-working.webp",
							alt: "Technical specialists inspect an industrial belt"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "about-story-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "WHAT WE SUPPLY" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Proven products for demanding industries." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We specialize in supplying high-quality industrial and agricultural belts, industrial spare parts, and tailored technical solutions. Through strategic partnerships with leading global manufacturers, we deliver proven products to regional distributors, resellers, OEMs, and end users across a broad range of industries." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "text-link about-products-link",
								href: "/products",
								children: ["View Our Products ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "about-story-feature about-industries-feature",
					"data-about-reveal": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "about-industries-gallery",
						"aria-label": "QTM Group industries and factory applications",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
								className: "about-industries-tile about-industries-overview",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/assets/about-industries-overview-cool-v1.webp",
									alt: "Overview of industrial applications supported by QTM Group"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
								className: "about-industries-tile",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/assets/about-qtm-bobst-safety-cool-v1.webp",
									alt: "QTM Group specialists wearing protective hard hats at a BOBST packaging and printing line"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
								className: "about-industries-tile",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/assets/about-industry-paper-cool-v1.webp",
									alt: "QTM Group team at a paper production line"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
								className: "about-industries-tile",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/assets/about-industry-tobacco-cool-v1.webp",
									alt: "QTM Group team at a HUANI tobacco production line"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
								className: "about-industries-tile",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/assets/about-industry-ceramics-cool-v1.webp",
									alt: "QTM Group team at a BMR ceramics production line"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
								className: "about-industries-tile",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/assets/about-industry-beverage-v1.webp",
									alt: "QTM Group team at a KHS beverage production line"
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "about-story-copy about-industries-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "INDUSTRIES WE SERVE" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Belting solutions across critical industries." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM Group’s core business is supplying industrial, power transmission, and conveyor belt solutions across a wide range of industries:" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "about-industry-list",
								children: aboutIndustries.map((industry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `/industries/${slugify(industry)}`,
									children: industry
								}) }, industry))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We support these industries with reliable solutions for power transmission, conveying, processing, production lines, automated systems, and material handling applications, working with leading international belt manufacturers and industrial partners." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "text-link about-industries-link",
								href: "/industries",
								children: ["View All Industries ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "about-story-feature about-story-feature-reverse about-support-feature",
					"data-about-reveal": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: "about-story-image",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/assets/about-business-meeting.webp",
							alt: "Business professionals discussing technical plans around a conference table"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "about-story-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "HOW WE SUPPORT" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "International quality, delivered with regional confidence." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Our strength lies in combining international product quality with regional market expertise, dependable logistics, and professional technical support. We work closely with our customers to identify the right solutions, ensure timely delivery, reduce operational downtime, and support long-term business success." })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "about-story-closing",
					"data-about-reveal": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "RESPONSIVE SUPPORT" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "With a strong commitment to quality, reliability, and customer satisfaction, the QTM Group team provides responsive technical and commercial assistance 24/7." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						href: "/contact-us",
						children: "Contact QTM"
					})]
				})
			]
		})
	})] });
}
function ProductCatalogue() {
	const requestedCategory = useSearchParams().get("category") || "";
	const categoryFamily = productFamilies.find((entry) => slugify(entry.name) === requestedCategory || entry.items.some((item) => slugify(item) === requestedCategory));
	const categoryProduct = products.find((product) => product.slug === requestedCategory || slugify(product.name) === requestedCategory);
	const initialFamily = categoryFamily?.name || categoryProduct?.family || "All categories";
	const [query, setQuery] = (0, import_react.useState)("");
	const [family, setFamily] = (0, import_react.useState)(initialFamily);
	const [supplier, setSupplier] = (0, import_react.useState)("All suppliers");
	const [industry, setIndustry] = (0, import_react.useState)("All industries");
	const [material, setMaterial] = (0, import_react.useState)("All materials");
	const [application, setApplication] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setFamily(initialFamily);
	}, [initialFamily]);
	const changeFamily = (value) => {
		setFamily(value);
		const url = new URL(window.location.href);
		if (value === "All categories") url.searchParams.delete("category");
		else url.searchParams.set("category", slugify(value));
		window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
	};
	const filtered = products.filter((p) => p.family !== "Mechanical Power Transmission" && (!query || `${p.name} ${p.description} ${p.subcategories.join(" ")}`.toLowerCase().includes(query.toLowerCase())) && (family === "All categories" || p.family === family) && (supplier === "All suppliers" || p.suppliers.some((s) => s.includes(supplier))) && (industry === "All industries" || p.industries.includes(industry)) && (material === "All materials" || p.materials.includes(material)) && (!application || `${p.industries.join(" ")} ${p.description}`.toLowerCase().includes(application.toLowerCase())));
	const materials = [...new Set(products.flatMap((p) => p.materials))].sort();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "catalogue-controls",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "catalogue-search",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search catalogue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "catalogue-search",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Product, profile or subcategory"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Product category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					name: "family-filter",
					value: family,
					onChange: (e) => changeFamily(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All categories" }), productFamilies.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: f.name }, f.name))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Supplier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					name: "supplier-filter",
					value: supplier,
					onChange: (e) => setSupplier(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All suppliers" }), [
						"Megadyne",
						"Continental",
						"Ammeraal Beltech",
						"Sampla",
						"Challenge Power Transmission",
						"Wilhelm Herm. Müller"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Industry" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					name: "industry-filter",
					value: industry,
					onChange: (e) => setIndustry(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All industries" }), industries.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: i.name }, i.slug))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Belt material" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					name: "material-filter",
					value: material,
					onChange: (e) => setMaterial(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All materials" }), materials.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: m }, m))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Application" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "application-filter",
					value: application,
					onChange: (e) => setApplication(e.target.value),
					placeholder: "e.g. packaging"
				})] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "catalogue-results-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "results-count",
				children: [filtered.length, " product categories"]
			}), family !== "All categories" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => changeFamily("All categories"),
				children: [
					"Clear ",
					family,
					" filter"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "catalogue-grid",
			children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
		}),
		filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "empty-state",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "No exact match found" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Try a broader term, or send the product details to QTM for identification." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					href: "/product-identification",
					children: "Ask QTM"
				})
			]
		})
	] });
}
function ProductsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "PRODUCT PORTFOLIO",
			title: "Industrial Solutions, Organized Around Your Application",
			copy: "Search and filter QTM’s multi-brand portfolio by product, supplier or industry. Exact specifications are confirmed for each inquiry.",
			parts: [{ label: "Products" }]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCatalogue, {})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
	] });
}
var timingOverviewFamilies = [
	{
		name: "Polyurethane Open End",
		href: "/products/timing-belts/polyurethane-open-end",
		image: "/assets/partnership-megadyne-open.png",
		copy: "Open-length polyurethane belts for linear motion, positioning and synchronized conveying."
	},
	{
		name: "Polyurethane Endless",
		href: "/products/timing-belts/polyurethane-endless",
		image: "/assets/products/polyurethane-endless-hero-red-synchroflex.png",
		copy: "Moulded, truly endless and high-performance PU belts for precise power transmission."
	},
	{
		name: "Rubber Open End",
		href: "/products/timing-belts/rubber-open-end",
		image: "/assets/partnership-megadyne-open.png",
		copy: "Rubber open-length belts for reversing drives, accurate movement and controlled linear systems."
	},
	{
		name: "Rubber Endless",
		href: "/products/timing-belts/rubber-endless",
		image: "/assets/partnership-megadyne-rubber-new.png",
		copy: "Classic and high-power synchronous rubber belts for industrial drive applications."
	}
];
var vBeltFamilies = [{
	name: "Rubber Wrapped",
	href: "/products/v-belts/rubber-wrapped",
	image: "/assets/partnership-megadyne-vbelts-new.png",
	copy: "Traditional wrapped-construction V-belts for established machinery and broad industrial drive applications."
}, {
	name: "Rubber Banded",
	href: "/products/v-belts/rubber-banded",
	image: "/assets/partnership-megadyne-vbelts-extra.png",
	copy: "Multiple V-belts bonded together for synchronized multi-row power transmission."
}];
function useTimingReveal() {
	(0, import_react.useEffect)(() => {
		const elements = Array.from(document.querySelectorAll("[data-timing-reveal]"));
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
			elements.forEach((element) => element.classList.add("is-visible"));
			return;
		}
		const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		}), {
			threshold: .08,
			rootMargin: "0px 0px -9%"
		});
		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);
}
function TimingBeltsPage() {
	const product = findProduct("timing-belts");
	useTimingReveal();
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "timing-overview-hero",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container timing-overview-hero-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "timing-overview-copy",
					"data-timing-reveal": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { parts: [
							{
								label: "Products",
								href: "/products"
							},
							{
								label: "Power Transmission Belts",
								href: "/products?category=power-transmission-belts"
							},
							{ label: "Timing Belts" }
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "POWER TRANSMISSION BELTS" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Timing Belts" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Rubber and polyurethane synchronous belts selected for precise motion, reliable engagement and clean power transmission across industrial machinery." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "button-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								href: "/request-a-quote?product=timing-belts",
								children: "Request a Quote"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								href: "/product-identification?product=timing-belts",
								secondary: true,
								children: "Identify a Belt"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "timing-hero-stage",
					"aria-label": "Timing belt product families",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "timing-hero-rings",
							"aria-hidden": "true",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
							className: "timing-hero-main",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/assets/hero.png",
								alt: "Industrial timing belt range"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "timing-floating-card timing-floating-card-red",
							href: "/products/timing-belts/rubber-endless",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rubber Endless" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/assets/partnership-megadyne-rubber-new.png",
								alt: "Rubber endless timing belt"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "timing-floating-card timing-floating-card-light",
							href: "/products/timing-belts/polyurethane-endless",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PU Endless" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/assets/products/polyurethane-endless-hero-red-synchroflex.png",
								alt: "Polyurethane endless timing belt"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "timing-hero-stat",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Timing belt groups" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "timing-profile-pulse",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AT" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "T" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HTD" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RPP" })
							]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section timing-overview-types",
			"data-timing-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-section-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "PRODUCT RANGE" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Choose the timing belt construction." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM connects customers with open-length, endless, polyurethane and rubber timing-belt solutions from leading manufacturers." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "timing-type-grid",
					children: timingOverviewFamilies.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "timing-type-card",
						href: item.href,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.image,
								alt: `${item.name} timing belt range`,
								loading: "lazy",
								decoding: "async"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.copy })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
						]
					}, item.name))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "timing-overview-dark",
			"data-timing-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container timing-overview-dark-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "SELECTION SUPPORT" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Matched around the machine, load and operating environment." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM helps compare material, profile, tension member, backing and surface options before final product selection." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "timing-support-list",
					children: [
						"Application review",
						"Belt identification",
						"Profile matching",
						"Coatings and cleats",
						"Pulley compatibility",
						"Regional supply support"
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item }, item))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section timing-profile-strip",
			"data-timing-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-section-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "COMMON PROFILES" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Broad profile coverage for industrial drives." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Availability covers compact pitch belts, metric profiles, double-sided constructions and high-performance tooth forms." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "profile-grid",
					children: product.profiles?.map((profile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: profile }, profile))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section timing-overview-support",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportBlock, {})
			})
		})
	] });
}
function VBeltsPage() {
	useTimingReveal();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "timing-overview-hero",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container timing-overview-hero-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "timing-overview-copy",
					"data-timing-reveal": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { parts: [
							{
								label: "Products",
								href: "/products"
							},
							{
								label: "Power Transmission Belts",
								href: "/products?category=power-transmission-belts"
							},
							{ label: "V-Belts" }
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "POWER TRANSMISSION BELTS" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "V-Belts" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Classical, narrow and specialized V-belt profiles for reliable power transmission across industrial machinery, agricultural equipment and adjustable-speed drives." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "button-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								href: "/request-a-quote?product=v-belts",
								children: "Request a Quote"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								href: "/product-identification?product=v-belts",
								secondary: true,
								children: "Identify a Belt"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "timing-hero-stage",
					"aria-label": "V-belt product families",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "timing-hero-rings",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: "timing-hero-main",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/assets/partnership-megadyne-vbelts-new.png",
							alt: "V-belt product portfolio"
						})
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "V-BELT CATEGORIES",
					title: "Select a V-Belt Type"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "catalogue-grid",
					children: vBeltFamilies.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: item.href,
						className: "product-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "product-card-visual",
								style: { backgroundImage: `url(${item.image})` },
								role: "img",
								"aria-label": item.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "product-card-copy",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.copy })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "product-card-arrow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
							})
						]
					}, item.href))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
	] });
}
var vBeltDetailPages = {
	"rubber-wrapped": {
		titleTop: "Rubber",
		titleBottom: "Wrapped V-Belts",
		eyebrow: "",
		quote: "v-belts",
		heroImage: "/assets/partnership-megadyne-vbelts-new.png",
		heroCopy: [
			"Time-Proven Wrapped V-Belts - Sourced Through QTM",
			"Rubber wrapped V-belts remain the standard choice for industrial power transmission worldwide, delivering consistent and dependable performance across thousands of established applications.",
			"A textile wrap cover protects the rubber body against abrasion, oil and heat, while the internal cord provides reliable tensile strength across classical and narrow sections alike.",
			"Through QTM, customers can access the Megadyne wrapped range: Oleostatic Gold, Oleostatic, Extra, Esaflex and XDV2/MXV."
		],
		profileTitle: "Rubber Wrapped Profile Range",
		profileCopy: "Standard wrapped sections covering light-duty to heavy industrial drives.",
		families: [
			{
				family: "Oleostatic Gold",
				official: "https://megadynegroup.com/en/products/v-belts/rubber-wrapped/oleostatic-gold/",
				linkImage: "/assets/partnership-megadyne-vbelts-new.png",
				description: "Premium classical wrapped V-belt with oil- and heat-resistant compounds for demanding industrial drives.",
				profiles: [
					"Z",
					"A",
					"B",
					"C",
					"D"
				]
			},
			{
				family: "Oleostatic",
				official: "https://megadynegroup.com/en/products/v-belts/rubber-wrapped/oleostatic/",
				linkImage: "/assets/partnership-megadyne-vbelts-new.png",
				description: "Standard classical wrapped V-belt offering reliable oil- and heat-resistant performance for general industrial use.",
				profiles: [
					"Z",
					"A",
					"B",
					"C",
					"D",
					"E"
				]
			},
			{
				family: "Extra",
				official: "https://megadynegroup.com/en/products/v-belts/rubber-wrapped/extra/",
				linkImage: "/assets/partnership-megadyne-vbelts-extra.png",
				description: "Wrapped narrow-section V-belt built for higher power density in compact industrial and agricultural drives.",
				profiles: [
					"SPZ",
					"SPA",
					"SPB",
					"SPC"
				]
			},
			{
				family: "Esaflex",
				official: "https://megadynegroup.com/en/products/v-belts/rubber-wrapped/esaflex/",
				linkImage: "/assets/partnership-megadyne-vbelts-new.png",
				description: "Flexible wrapped narrow V-belt engineered for smooth running and dependable service life on standard drives.",
				profiles: [
					"SPZ",
					"SPA",
					"SPB",
					"SPC"
				]
			},
			{
				family: "XDV2/MXV",
				official: "https://megadynegroup.com/en/products/v-belts/rubber-wrapped/xdv2-mxv/",
				linkImage: "/assets/partnership-megadyne-vbelts-new.png",
				description: "Wrapped variable-speed V-belt for adjustable-pulley transmission systems requiring smooth, continuous speed control.",
				profiles: ["XDV2", "MXV"]
			}
		],
		benefits: [
			"Proven reliability in industrial equipment",
			"Protective textile cover",
			"Cost-effective operation",
			"Easy maintenance and replacement",
			"Wide pulley compatibility"
		]
	},
	"rubber-banded": {
		titleTop: "Rubber",
		titleBottom: "Banded V-Belts",
		eyebrow: "",
		quote: "v-belts",
		heroImage: "/assets/partnership-megadyne-vbelts-extra.png",
		heroCopy: [
			"Synchronized Multi-Belt Drives - Sourced Through QTM",
			"Rubber banded V-belts consist of multiple individual belts rigidly bonded together along their length, keeping the strands aligned through demanding multi-pulley drive systems.",
			"Factory-bonded construction helps the belts share load evenly, reducing slippage and uneven wear compared with loose multi-belt sets.",
			"Through QTM, customers can access the Megadyne Rubber Pluriband range for heavy-duty machinery and industrial power transmission."
		],
		profileTitle: "Rubber Banded Profile Range",
		profileCopy: "Bonded multi-belt sections available across classical and narrow profiles.",
		families: [{
			family: "Rubber Pluriband",
			official: "https://megadynegroup.com/en/products/v-belts/rubber-banded/pluriband/",
			linkImage: "/assets/partnership-megadyne-vbelts-extra.png",
			description: "Factory-bonded multi-belt construction for synchronized power transmission across heavy-duty, multi-pulley drive systems.",
			profiles: [
				"Banded A",
				"Banded B",
				"Banded C",
				"Banded SPA",
				"Banded SPB",
				"Banded SPC"
			]
		}],
		benefits: [
			"Perfect synchronization",
			"Even load distribution",
			"No belt slippage",
			"Consistent power transmission",
			"Reduced maintenance"
		]
	}
};
function VBeltDetailPage({ slug }) {
	const page = vBeltDetailPages[slug];
	(0, import_react.useEffect)(() => {
		const elements = Array.from(document.querySelectorAll("[data-openend-reveal]"));
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
			elements.forEach((element) => element.classList.add("is-visible"));
			return;
		}
		const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		}), {
			threshold: .1,
			rootMargin: "0px 0px -8%"
		});
		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "openend-hero openend-hero--brand-split",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "openend-hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, {
						plain: true,
						parts: [
							{
								label: "Products",
								href: "/products"
							},
							{
								label: "V-Belts",
								href: "/products/v-belts"
							},
							{ label: `${page.titleTop} ${page.titleBottom}` }
						]
					}),
					page.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: page.eyebrow })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						page.titleTop,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						page.titleBottom
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: "openend-mobile-hero-media",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: page.heroImage,
							alt: `${page.titleTop} ${page.titleBottom} belt portfolio`
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "openend-hero-description",
						children: page.heroCopy.map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: index === 0 ? "lead" : void 0,
							children: paragraph
						}, paragraph))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "openend-mobile-overview",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: ["More about this range ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chevron, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: page.heroCopy.slice(2).map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, paragraph)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "button-row",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "hero-quote-link",
							href: `/request-a-quote?product=${page.quote}`,
							children: ["Request a Quote ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "openend-hero-media",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: page.heroImage,
					alt: `${page.titleTop} ${page.titleBottom} by Megadyne`
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-profiles",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "openend-section-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "PROFILE RANGE" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: page.profileTitle }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: page.profileCopy })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "openend-profiles-intro",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Profiles" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"With our extensive selection of ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "V-belts" }),
							", QTM covers most of the profiles commonly used across the ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "belting industry" }),
							", providing solutions for a wide range of industrial applications."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "openend-profile-catalog",
						children: page.families.map((family) => "sectionHeader" in family ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `vbelt-megav-heading${family.sectionHeader.toLowerCase().includes("continental") ? " vbelt-conti-heading" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: family.sectionHeader.toLowerCase().includes("continental") ? "Continental Raw Edge Range" : "Premium Raw Edge Platform" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: family.sectionHeader }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: family.sectionCopy })
							]
						}, family.sectionHeader) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "openend-profile-family",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "openend-profile-family-head",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: family.family }), family.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "vbelt-new-badge",
										children: family.badge
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: `openend-profile-official openend-profile-official--media${family.badge ? " vbelt-new-product-link" : ""}`,
									href: family.official,
									target: "_blank",
									rel: "noreferrer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "openend-profile-link-image",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: family.linkImage,
												alt: "",
												loading: "lazy",
												decoding: "async"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "openend-profile-link-copy",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: family.family }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: family.description })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "openend-profile-picture-grid",
									children: family.profiles.map((profile) => {
										const profileName = Array.isArray(profile) ? profile[0] : profile;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: Array.isArray(profile) ? profile[1] : family.linkImage,
											alt: `${family.family} ${profileName} V-belt profile`,
											loading: "lazy",
											decoding: "async"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: profileName })] }, `${family.family}-${profileName}`);
									})
								})
							]
						}, family.family))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "dark-feature",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container detail-columns",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "KEY ADVANTAGES",
					title: "Why Choose These V-Belts",
					inverse: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Each V-belt type is engineered for specific performance requirements and operating conditions." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "dark-list",
					children: page.benefits.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item }, item))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container detail-columns",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "CONSTRUCTION & MATERIALS",
					title: "Technical Selection Support"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Share your machinery, duty cycle and performance requirements with QTM. Our team will identify the optimal V-belt solution." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Standard constructions" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "check-list dark-check",
						children: [
							"Natural rubber compounds",
							"Synthetic rubber options",
							"Reinforced core configurations",
							"Wrapped and raw-edge designs",
							"Cogged or smooth surfaces"
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "QTM Support" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "check-list dark-check",
						children: [
							"Belt selection guidance",
							"Pulley matching",
							"Application review",
							"Technical documentation",
							"Regional availability"
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section light-section",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "TECHNICAL INQUIRY",
					title: "Tell Us About Your V-Belt Application"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, {
					kind: "product",
					product: "V-Belts"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-support",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportBlock, {})
			})
		})
	] });
}
var megalinearProfiles = [
	{
		group: "Inch trapezoidal",
		profiles: [
			"MXL",
			"XL",
			"L",
			"H",
			"XH"
		]
	},
	{
		group: "Metric trapezoidal",
		profiles: [
			"T2.5",
			"T5",
			"T10",
			"T20"
		]
	},
	{
		group: "AT high-performance",
		profiles: [
			"AT3",
			"AT5",
			"AT10",
			"AT20"
		]
	},
	{
		group: "RPP",
		profiles: [
			"RPP5",
			"RPP8",
			"RPP14",
			"RPP14 XHP"
		]
	},
	{
		group: "STD",
		profiles: ["STD5", "STD8"]
	},
	{
		group: "MTD",
		profiles: [
			"MTD3",
			"MTD5",
			"MTD8",
			"MTD14"
		]
	},
	{
		group: "Special profiles",
		profiles: [
			"HG",
			"TG5",
			"TG10K6",
			"TG10K13",
			"TG20",
			"ATG5",
			"ATG10K6",
			"ATG10K13",
			"ATG20",
			"P1",
			"P2",
			"P3",
			"P4"
		]
	}
];
var megalinearStyles = [
	[
		"MEGALINEAR",
		"Standard open-length polyurethane range for precision linear motion and conveying.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear/"
	],
	[
		"MEGALINEAR FC",
		"Food-contact construction for food processing and packaging applications.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-fc/"
	],
	[
		"MEGALINEAR FC-S",
		"Sealed-edge, encapsulated-cord construction for hygienic and wash-down duties.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-fc-s/"
	],
	[
		"MEGALINEAR XMD",
		"Blue metal- and X-ray-detectable belt construction for enhanced food safety.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-xmd/"
	],
	[
		"MegaEco Biobased",
		"A lower-impact range using polyurethane sourced partly from vegetable-based raw materials.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-megaeco-biobased/"
	],
	[
		"MEGALINEAR QST",
		"Quiet self-tracking offset-tooth design for reduced noise and controlled positioning.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-qst/"
	],
	[
		"MEGALINEAR GW",
		"High-load construction with high-tension steel cords for lifting and material handling.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-gw/"
	],
	[
		"MEGALINEAR XHP2",
		"Reinforced RPP14 and MTD14 options developed for demanding heavy-load systems.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear-xhp2/"
	],
	[
		"MEGAC4T",
		"Adaptable open-ended belt platform designed for interchangeable conveying profiles.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megac4t/"
	],
	[
		"MEGALINEAR P3.3",
		"Traction-belt construction developed for elevator applications.",
		"https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/traction-belt-megalinear-p3-3/"
	]
];
var megalinearImages = {
	hero: "https://dam.ammega.com/api/file/redirect/8b6b3c4f-b6ac-4f38-bfa5-2f6c2f75cb74",
	overview: "https://dam.ammega.com/api/file/redirect/e2e77231-2c11-4fce-a661-002e4241dabe",
	components: "https://dam.ammega.com/api/file/redirect/0e83362b-3d45-44d7-a8b6-7d46c5490484",
	mxl: "https://dam.ammega.com/api/file/redirect/87d66649-5d45-4889-b59a-b59526ef2140",
	t5: "https://dam.ammega.com/api/file/redirect/65b1bad5-b12a-46d9-9541-5061221a34e0",
	at10: "https://dam.ammega.com/api/file/redirect/de76a9ef-8fe4-43df-bf3f-b3569d93e954"
};
function PolyurethaneOpenEndPage() {
	(0, import_react.useEffect)(() => {
		const elements = Array.from(document.querySelectorAll("[data-openend-reveal]"));
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
			elements.forEach((element) => element.classList.add("is-visible"));
			return;
		}
		const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		}), {
			threshold: 0,
			rootMargin: "0px 0px -8%"
		});
		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "openend-hero",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "openend-hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { parts: [
						{
							label: "Products",
							href: "/products"
						},
						{
							label: "Timing Belts",
							href: "/products/timing-belts"
						},
						{ label: "Polyurethane Open End" }
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "MEGADYNE · MEGALINEAR" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"Polyurethane",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Open End Belts"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Precision open-length timing belts for linear motion, positioning and synchronous conveying—configured around the machine and application." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "button-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "hero-quote-link",
							href: "/request-a-quote?product=polyurethane-open-end",
							children: ["Request a Quote ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "text-link light",
							href: "https://megadynegroup.com/en/products/timing-belts/polyurethane-open-end/megalinear/",
							target: "_blank",
							rel: "noreferrer",
							children: ["Official MEGALINEAR page ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "openend-hero-media",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: megalinearImages.hero,
					alt: "Megadyne MEGALINEAR polyurethane open-ended timing belt"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-introduction",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container openend-intro-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "openend-intro-image",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: megalinearImages.overview,
						alt: "MEGALINEAR open-ended polyurethane timing belt overview"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-intro-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "MEGALINEAR OPEN LENGTH" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Stable, precise movement over long travel." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "MEGALINEAR open-length timing belts use thermoplastic polyurethane for wear and abrasion resistance. Parallel zinc-coated steel tension members provide high breaking load and very low elongation, supporting dependable motion under high tractive effort." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tight manufacturing tolerances provide dimensional stability. Nylon fabric can be added on the teeth and/or belt back, while an extra polyurethane backing can protect the belt when moving aggressive or heavy products." })
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "openend-technical",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-section-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "TECHNICAL PREVIEW" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Inside the belt construction." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A concise view of the standard MEGALINEAR construction and available running-surface options." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-technical-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: megalinearImages.components,
						alt: "Technical preview of MEGALINEAR belt body and steel cord construction"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "openend-component-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Polyurethane body" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "White thermoplastic polyurethane, 92 ShA, selected for flexibility and resistance to wear, shock and surge loading." })] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Tension members" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "High-strength S and Z parallel zinc-coated steel cords provide load capacity, dimensional stability and extremely low elongation." })] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Running surfaces" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nylon fabric is available on the teeth and/or back to refine friction, noise and running behaviour for the application." })] })] })
						]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-profiles",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "openend-section-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "PROFILE RANGE" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "From compact positioning to heavy-duty linear motion." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Profile availability covers classic trapezoidal, metric, curvilinear and application-specific tooth forms." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "openend-profile-visuals",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: megalinearImages.mxl,
								alt: "MEGALINEAR MXL tooth profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "MXL · Compact precision" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: megalinearImages.t5,
								alt: "MEGALINEAR T5 tooth profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "T5 · Metric trapezoidal" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: megalinearImages.at10,
								alt: "MEGALINEAR AT10 tooth profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "AT10 · High-performance positioning" })] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "openend-profile-groups",
						children: megalinearProfiles.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: group.group }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: group.profiles.map((profile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: profile }, profile)) })] }, group.group))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-family",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-section-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "MEGALINEAR FAMILY" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Specialized constructions for different duties." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Beyond the standard belt, the open-end family includes dedicated solutions for hygiene, detection, noise, tracking, sustainability and heavy loading." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "openend-family-grid",
					children: megalinearStyles.map(([name, description, url], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: url,
						target: "_blank",
						rel: "noreferrer",
						"aria-label": `View ${name} on the official Megadyne website`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
						]
					}, name))
				})]
			})
		})
	] });
}
var timingBeltDetailPages = {
	"polyurethane-endless": {
		titleTop: "Polyurethane",
		titleBottom: "Endless Belts",
		eyebrow: "",
		heroCopy: [
			"Precision Polyurethane Timing Belts — Sourced Through QTM",
			"QTM brings together some of the most advanced polyurethane timing belt technologies available today.",
			"Our portfolio includes premium sleeved and cut-to-length timing belts, engineered for precision, reliability, and demanding industrial applications.",
			"Through QTM, customers can access a comprehensive range of Megaflex, Brecoflex, Synchroflex, Megapower, and carbon-corded Synchrochain belts.",
			"Whether you require a standard timing belt, a customized cut belt, or a high-performance carbon-corded solution, QTM provides access to proven belt technologies designed to deliver accurate power transmission, long service life, and consistent performance."
		],
		heroFullVisible: true,
		quote: "polyurethane-endless",
		official: "https://megadynegroup.com/en/products/timing-belts/polyurethane-endless/",
		hero: "/assets/products/polyurethane-endless-hero-red-synchroflex.png",
		overview: "https://dam.ammega.com/api/file/redirect/5c433035-f42d-4dd2-bd46-c143c976c8da",
		components: "https://dam.ammega.com/api/file/redirect/2906f96f-35f9-4417-b424-2e78546f729a",
		introEyebrow: "MOULDED & TRULY ENDLESS",
		introTitle: "Continuous construction for controlled, reliable motion.",
		intro: ["Megadyne polyurethane endless belts combine accurate tooth geometry with strong tensile members for synchronous transmission and positioning. MEGAPOWER belts are moulded endless, while MEGAFLEX belts use continuous spiral steel cords and are manufactured to the required length.", "The range supports light precision drives through high-load and high-speed transmission. Tooth fabrics, back coatings and application-specific compounds extend the construction for conveying, food contact and demanding operating environments."],
		technicalIntro: "A concise view of the polyurethane body and continuous tensile reinforcement used across the endless range.",
		componentsList: [
			["Polyurethane body", "Thermoset polyurethane is used for MEGAPOWER; MEGAFLEX uses wear-resistant thermoplastic polyurethane for flexibility and dependable tooth engagement."],
			["Continuous tensile members", "Helically wound steel cords provide high breaking load, low elongation and stable belt length. Alternative cord materials are available for specific duties."],
			["Application surfaces", "Optional tooth fabric and special back coatings can refine friction, noise, grip and protection when conveying demanding products."]
		],
		profileTitle: "Moulded profiles and a broad truly endless range.",
		profileCopy: "The combined MEGAPOWER and MEGAFLEX portfolio covers compact pitches, classic profiles, double-sided constructions and high-performance tooth forms.",
		visuals: [
			["https://dam.ammega.com/api/file/redirect/be201cda-547e-4b22-8058-df9ba10debb5", "XL · Compact imperial"],
			["https://dam.ammega.com/api/file/redirect/7a0d97b3-fdd3-477d-98bd-dddc1f17a338", "T5 · Metric precision"],
			["https://dam.ammega.com/api/file/redirect/55490a8d-9ff5-471f-a9eb-a4d08869fcfe", "AT10 · High-performance drive"]
		],
		profiles: [{
			group: "MEGAPOWER 2",
			profiles: [
				"T5",
				"T5 DD",
				"T10",
				"T10 DD",
				"AT5",
				"AT10"
			]
		}, {
			group: "MEGAFLEX",
			profiles: [
				"XL",
				"XL DD",
				"L",
				"L DD",
				"H",
				"H DD",
				"XH",
				"XH DD",
				"T5",
				"T5 DD",
				"T10",
				"T10 DD",
				"T20",
				"T20 DD",
				"AT5",
				"AT5 DD",
				"AT10",
				"AT10 DD",
				"AT15",
				"AT20",
				"AT20 DD",
				"MTD8",
				"RPP5",
				"RPP8",
				"RPP8 DD",
				"RPP14",
				"RPP14 DD",
				"ATG10",
				"P2"
			]
		}],
		familyEyebrow: "POLYURETHANE ENDLESS PORTFOLIO",
		familyTitle: "A further range for precision drives.",
		familyCopy: "Explore the BRECOflex polyurethane endless range through its official product source.",
		families: []
	},
	"rubber-open-end": {
		titleTop: "Rubber",
		titleBottom: "Open End Belts",
		eyebrow: "",
		heroCopy: "Open-length rubber timing belts for reversing drives, accurate positioning and controlled linear movement.",
		quote: "rubber-open-end",
		official: "https://megadynegroup.com/en/products/timing-belts/rubber-open-end/",
		hero: "/assets/rubber-open-end-hero-full-scene.png",
		overview: "https://dam.ammega.com/api/file/redirect/4b8286e1-2540-48d2-8d0d-748d7b420adb",
		components: "https://dam.ammega.com/api/file/redirect/63f5a361-c15b-49b4-ba82-9a35df183090",
		introEyebrow: "MEGASYNC™ OPEN LENGTH",
		introTitle: "Accurate reversing motion without chain or cable.",
		intro: ["Megadyne rubber open-ended timing belts are designed for reversing drives where rotational movement must be converted into linear motion with dependable positioning accuracy.", "The range combines rubber belt bodies with fiberglass or steel tensile members. Its synchronous tooth engagement provides a clean alternative to chain or cable for lifting, machine tools and material-handling systems."],
		technicalIntro: "A practical view of the belt body, reinforcement and tooth-facing construction used for linear drives.",
		componentsList: [
			["Rubber body", "Special polychloroprene-based or EPDM rubber compounds form the belt body and support accurate tooth engagement."],
			["Tensile members", "High-modulus fiberglass or steel cords carry the load. RPP STEEL uses high-strength S and Z steel reinforcement for very limited elongation."],
			["Back & tooth fabric", "The back cushion protects the tensile members and permits backside idlers; treated nylon fabric protects the teeth and supports torque capacity."]
		],
		profileTitle: "Open-end RPP profiles for controlled linear motion.",
		profileCopy: "RPP open-length rubber profiles support accurate reversing movement, stable tooth engagement and dependable traction in long-travel applications.",
		visuals: [
			["https://dam.ammega.com/api/file/redirect/143d56d6-4736-4e6c-8cce-fcdeb3cbe4b0", "MXL · Compact positioning"],
			["https://dam.ammega.com/api/file/redirect/6fa696de-94d7-4ffd-b33f-c049de2ba44e", "RPP3 · Curvilinear profile"],
			["https://dam.ammega.com/api/file/redirect/39b477fc-73cc-441e-8052-decee2dad456", "SLV5 · Linear drive profile"]
		],
		profiles: [
			{
				group: "Inch profiles",
				profiles: [
					"MXL",
					"XL",
					"L",
					"H"
				]
			},
			{
				group: "RPP profiles",
				profiles: [
					"RPP3",
					"RPP5",
					"RPP8"
				]
			},
			{
				group: "SLV / STD profiles",
				profiles: [
					"SLV5",
					"SLV8",
					"STD8"
				]
			},
			{
				group: "RPP STEEL",
				profiles: ["RPP 8M", "RPP 14M"]
			}
		],
		familyEyebrow: "RUBBER OPEN END FAMILY",
		familyTitle: "Two constructions for controlled linear motion.",
		familyCopy: "Choose the standard open-ended family or steel-cord RPP construction according to load and elongation requirements.",
		families: []
	},
	"rubber-endless": {
		titleTop: "Rubber Endless",
		titleBottom: "Timing Belts",
		eyebrow: "",
		heroCopy: [
			"With our extensive selection of timing belts, QTM covers virtually all profiles commonly used across the belting industry, providing reliable solutions for a wide range of industrial applications.",
			"Through the comprehensive Megadyne and Continental ContiTech rubber timing belt ranges, QTM can supply a complete selection of profiles and sizes required by customers worldwide. Our portfolio includes RPP, HTD, STD, and RPC profiles, along with other standard and application-specific configurations.",
			"From high-precision power transmission to demanding industrial drive systems, QTM provides timing belt solutions engineered for reliability, efficiency, accurate synchronization, and long service life."
		],
		heroFullVisible: true,
		quote: "rubber-endless",
		official: "https://megadynegroup.com/en/products/timing-belts/rubber-endless/",
		hero: "/assets/megadyne-conti-colab.jpg",
		overview: "https://dam.ammega.com/api/file/redirect/a36c89f0-a936-4fd6-adc3-598b9302583b",
		components: "https://dam.ammega.com/api/file/redirect/d48dd440-0ada-4e6c-a4b8-61e3782efef2",
		introEyebrow: "MEGASYNC™ ENDLESS",
		introTitle: "Synchronous power transmission from standard to extreme duty.",
		intro: ["The MEGASYNC™ rubber endless range combines accurate tooth meshing with reinforced rubber compounds and continuous tensile cords. It covers traditional machinery, compact drive upgrades and high-power applications across a broad spectrum of industries.", "Classic RPP and Imperial constructions sit alongside Silver3, Gold2 and Titanium performance families. Dedicated variants extend the range for paint systems and very high-speed operation."],
		technicalIntro: "The classic MEGASYNC™ construction combines a reinforced rubber body, continuous cords and a protected tooth surface.",
		componentsList: [
			["Reinforced rubber body", "Application-specific chloroprene, NBR or HNBR compounds provide tooth rigidity, flexibility and resistance for the selected duty."],
			["Continuous cords", "Helically wound fiberglass, high-performance glass or carbon cords provide tensile strength and stable synchronous engagement."],
			["Tooth-facing fabric", "Wear-resistant, low-friction fabric protects the tooth surface, supports torque transfer and reduces pulley wear."]
		],
		profileTitle: "",
		profileCopy: "",
		pillarTitle: "Megadyne Endless Timing Belts",
		pillarImage: "/assets/megadyne-pillar.png",
		pillarCopy: ["QTM's endless timing belt program is built around the Megadyne MEGASYNC™ portfolio, giving customers one dependable regional source for classic, upgraded and high-performance rubber constructions.", "Each family shares a common reinforced rubber body and continuous tensile cord construction, so pulleys, mounting dimensions and installation practices carry across the range as duty requirements change."],
		rangeTitle: "Profiles",
		rangeImage: "/assets/standart-range.png",
		rangeCopy: ["The standard range covers everything from light-duty positioning belts to heavy industrial drives, manufactured as continuous, joint-free loops for smooth, vibration-free running.", "RPP, Imperial, Silver3, Gold2 and Titanium sections are all available off the shelf, with QTM's technical team on hand to confirm the exact pitch, width and length for your machine."],
		comparisonIndexImage: "/assets/comparison-index.png",
		comparisonIndexCopy: "Compare power ratings, tooth engagement and service life at a glance. The performance index shows how Silver3, Gold2 and Titanium scale up from standard duty to extreme, high-torque applications on the same pitch.",
		visuals: [
			["https://dam.ammega.com/api/file/redirect/05d9fa86-ef72-4406-801c-0ed4010e7aff", "RPP3 · Compact synchronous drive"],
			["https://dam.ammega.com/api/file/redirect/18941fb2-21c5-4b02-abf7-3ed7dae2f059", "RPP8 · Industrial transmission"],
			["https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2", "RPP14 DD · Double-sided duty"]
		],
		profiles: [
			{
				group: "RPP single-sided",
				profiles: [
					"RPP3",
					"RPP5",
					"RPP8",
					"RPP14"
				]
			},
			{
				group: "RPP double-sided",
				profiles: [
					"RPP5 DD",
					"RPP8 DD",
					"RPP14 DD"
				]
			},
			{
				group: "Imperial",
				profiles: [
					"MXL",
					"XL",
					"XL DD",
					"L",
					"L DD",
					"H",
					"H DD",
					"XH",
					"XXH"
				]
			},
			{
				group: "Silver3",
				profiles: [
					"5M",
					"8M",
					"14M",
					"8M DD",
					"14M DD"
				]
			},
			{
				group: "Gold2",
				profiles: [
					"5M",
					"8M",
					"14M",
					"8M DD",
					"14M DD"
				]
			},
			{
				group: "High-performance",
				profiles: [
					"Titanium",
					"Titanium Speed",
					"MEGAPAINT"
				]
			}
		],
		familyEyebrow: "MEGASYNC™ FAMILY",
		familyTitle: "A rubber timing belt for every performance level.",
		familyCopy: "Each family row links directly to its official Megadyne product page.",
		families: []
	}
};
var polyurethaneEndlessProfilePictures = [
	{
		family: "MEGAPOWER 2",
		official: "https://megadynegroup.com/en/products/timing-belts/polyurethane-endless/megapower/megapower2/",
		linkImage: "/assets/polyurethane-profile-belts.png",
		description: "Moulded endless polyurethane belt for light synchronized drives and precise power transmission.",
		profiles: [
			["T5", "https://dam.ammega.com/api/file/redirect/95971488-58bb-4554-adc2-99c68f672520"],
			["T5 DD", "https://dam.ammega.com/api/file/redirect/b402fe43-5372-4066-93c4-d0092a70e060"],
			["T10", "https://dam.ammega.com/api/file/redirect/a5f7866f-d0be-49a1-84b9-8ef17386f928"],
			["T10 DD", "https://dam.ammega.com/api/file/redirect/2663ae30-5be8-41f1-bb7e-17dcac13febf"],
			["AT5", "https://dam.ammega.com/api/file/redirect/c945402f-1769-4cc8-b334-e607ea0b66c5"],
			["AT10", "https://dam.ammega.com/api/file/redirect/de76a9ef-8fe4-43df-bf3f-b3569d93e954"]
		]
	},
	{
		family: "MEGAFLEX",
		official: "https://megadynegroup.com/en/products/timing-belts/polyurethane-endless/megaflex/megaflex/",
		linkImage: "/assets/megapower-white-background.png",
		description: "Truly endless thermoplastic polyurethane belt for high-load, high-speed transmission and conveying.",
		profiles: [
			["XL", "https://dam.ammega.com/api/file/redirect/be201cda-547e-4b22-8058-df9ba10debb5"],
			["XL DD", "https://dam.ammega.com/api/file/redirect/f82c988c-8049-48cb-aef1-d7e07eb4bfc1"],
			["L", "https://dam.ammega.com/api/file/redirect/0ccfcfcd-ab69-48f1-929f-4e47859e1e6b"],
			["L DD", "https://dam.ammega.com/api/file/redirect/e85fb589-0a74-48c8-bd01-3435e121c2ed"],
			["H", "https://dam.ammega.com/api/file/redirect/00c58aa0-1656-4f05-93a7-3ba63835342d"],
			["H DD", "https://dam.ammega.com/api/file/redirect/a4e27cf2-43c8-4e3d-9855-ac8b080d7926"],
			["XH", "https://dam.ammega.com/api/file/redirect/90514e76-ac86-4eb4-b1bd-1c8ebd91462f"],
			["XH DD", "https://dam.ammega.com/api/file/redirect/3539d45e-63a8-473b-8ae0-618b99ace1f6"],
			["T5", "https://dam.ammega.com/api/file/redirect/7a0d97b3-fdd3-477d-98bd-dddc1f17a338"],
			["T5 DD", "https://dam.ammega.com/api/file/redirect/9820aba9-c435-4045-83ae-3b92089d1b64"],
			["T10", "https://dam.ammega.com/api/file/redirect/c5f9e775-720b-4fdc-8f4c-a56058ac3cf6"],
			["T10 DD", "https://dam.ammega.com/api/file/redirect/424aef2e-c843-4e00-a147-8858e3e16500"],
			["T20", "https://dam.ammega.com/api/file/redirect/d7f0eccc-c1b3-4585-87e2-6c385903b0f5"],
			["T20 DD", "https://dam.ammega.com/api/file/redirect/0c4ef2ed-09d7-441d-a070-044968bb3185"],
			["AT5", "https://dam.ammega.com/api/file/redirect/7546f965-0886-4a81-a849-dd8bb122c618"],
			["AT5 DD", "https://dam.ammega.com/api/file/redirect/2a24ad88-d40b-44dd-9c0a-31a80e6fd85a"],
			["AT10", "https://dam.ammega.com/api/file/redirect/55490a8d-9ff5-471f-a9eb-a4d08869fcfe"],
			["AT10 DD", "https://dam.ammega.com/api/file/redirect/190a4a27-95f8-4986-ae7a-254e59866126"],
			["AT15", "https://dam.ammega.com/api/file/redirect/d65863bf-169f-4efd-b2bd-3ddf178e16d0"],
			["AT20", "https://dam.ammega.com/api/file/redirect/7d48353c-3395-4c6c-8c16-08e58d0403df"],
			["AT20 DD", "https://dam.ammega.com/api/file/redirect/3161cf49-d93a-400c-8d55-21d59f46b5eb"],
			["MTD8", "https://dam.ammega.com/api/file/redirect/6657ef96-47de-40df-800d-0043bdc40693"],
			["RPP5", "https://dam.ammega.com/api/file/redirect/148fc75e-0f9e-48eb-a3c1-a10da8cf7bcc"],
			["RPP8", "https://dam.ammega.com/api/file/redirect/60c1b5a4-d1a4-4db3-a40c-8337c018a624"],
			["RPP8 DD", "https://dam.ammega.com/api/file/redirect/c51bd336-9997-495d-bbe3-b9283e7aeb85"],
			["RPP14", "https://dam.ammega.com/api/file/redirect/8ba368e3-5ffb-42c9-b92e-ff21b42678c4"],
			["RPP14 DD", "https://dam.ammega.com/api/file/redirect/9e12ada8-4bbb-4501-8697-a8dd96990e11"],
			["ATG10", "https://dam.ammega.com/api/file/redirect/e58d5262-9a6c-4e3e-af31-c4d2bef2b62c"],
			["P2", "https://dam.ammega.com/api/file/redirect/84ddd4a5-298f-4fc4-9423-041306be40e6"]
		]
	},
	{
		family: "CONTI® SYNCHROFLEX",
		official: "https://www.continental-industry.com/getattachment/a7bf8704-bcc7-4995-bde4-407ca5f45353/Datasheet_CONTI_SYNCHROFLEX_EN.pdf",
		linkImage: "/assets/conti-synchroflex-link.png",
		description: "CONTI® SYNCHROFLEX polyurethane timing belts are designed for precise, reliable power transmission across a wide range of industrial applications. The range includes single-sided and double-sided (DL) configurations, providing flexibility for precision drive and conveying applications.",
		profiles: [
			["AT3", "/assets/conti-synchroflex-profiles/at3.png"],
			["AT5", "/assets/conti-synchroflex-profiles/at5.png"],
			["AT10", "/assets/conti-synchroflex-profiles/at10.png"],
			["AT20", "/assets/conti-synchroflex-profiles/at20.png"],
			["T2", "/assets/conti-synchroflex-profiles/t2.png"],
			["T2.5", "/assets/conti-synchroflex-profiles/t2-5.png"],
			["T2.5-DL", "/assets/conti-synchroflex-profiles/t2-5-dl.png"],
			["T5", "/assets/conti-synchroflex-profiles/t5.png"],
			["T5-DL", "/assets/conti-synchroflex-profiles/t5-dl.png"],
			["T10", "/assets/conti-synchroflex-profiles/t10.png"],
			["T10-DL", "/assets/conti-synchroflex-profiles/t10-dl.png"],
			["T20", "/assets/conti-synchroflex-profiles/t20.png"],
			["M (MXL)", "/assets/conti-synchroflex-profiles/m-mxl.png"],
			["K1", "/assets/conti-synchroflex-profiles/k1.png"],
			["K1.5", "/assets/conti-synchroflex-profiles/k1-5.png"]
		]
	},
	{
		family: "CONTI® SYNCHROFLEX GEN III",
		official: "https://www.continental-industry.com/getattachment/a7bf8704-bcc7-4995-bde4-407ca5f45353/Datasheet_CONTI_SYNCHROFLEX_EN.pdf",
		linkImage: "/assets/conti-synchroflex-gen3.png",
		description: "CONTI® SYNCHROFLEX GEN III polyurethane timing belts provide accurate, reliable power transmission for demanding industrial positioning and conveying applications.",
		profiles: [
			["AT3", "/assets/conti-synchroflex-profiles/at3.png"],
			["AT5", "/assets/conti-synchroflex-profiles/at5.png"],
			["AT10", "/assets/conti-synchroflex-profiles/at10.png"],
			["AT20", "/assets/conti-synchroflex-profiles/at20.png"]
		]
	},
	{
		family: "CONTI® SYNCHROCHAIN Carbon",
		official: "https://www.continental-industry.com/in/en/products-solutions/power-transmission/synchronous-belts-pu",
		linkImage: "/assets/conti-synchrochain-carbon-link.png",
		description: "Heavy-duty polyurethane timing belt with carbon tension members, engineered for high torque, high dynamic loads and reliable power transmission in demanding industrial drives.",
		profiles: [["CTD C8M", "/assets/ctd-c8m-profile.jpg"], ["CTD C14M", "/assets/ctd-c14m-profile.jpg"]]
	},
	{
		family: "BRECOFLEX®",
		official: "https://www.brecoflex.com/product-category/timing-belts",
		linkImage: "/assets/brecoflex-link.png",
		description: "Truly endless polyurethane timing belts for precision power transmission, positioning and high-performance industrial drives.",
		profiles: [
			["AT3", "/assets/brecoflex-profiles/at3.svg"],
			["AT5", "/assets/brecoflex-profiles/at5.svg"],
			["AT10", "/assets/brecoflex-profiles/at10.svg"],
			["AT20", "/assets/brecoflex-profiles/at20.svg"],
			["ATL10", "/assets/brecoflex-profiles/atl10.svg"],
			["T5", "/assets/brecoflex-profiles/t5.svg"],
			["T10", "/assets/brecoflex-profiles/t10.svg"],
			["T10 DL", "/assets/brecoflex-profiles/t10-dl.svg"],
			["T20", "/assets/brecoflex-profiles/t20.svg"],
			["XL", "/assets/brecoflex-profiles/xl.svg"],
			["L", "/assets/brecoflex-profiles/l.svg"],
			["H", "/assets/brecoflex-profiles/h.svg"],
			["ATN10", "/assets/brecoflex-profiles/atn10.svg"],
			["BAT10", "/assets/brecoflex-profiles/bat10.svg"],
			["SAT10", "/assets/brecoflex-profiles/sat10.svg"],
			["BATK10", "/assets/brecoflex-profiles/batk10.svg"],
			["SFAT10", "/assets/brecoflex-profiles/sfat10.svg"],
			["ATK10", "/assets/brecoflex-profiles/atk10.svg"]
		]
	}
];
var rubberOpenEndProfilePictures = [{
	family: "MEGASYNC™ Rubber Open End RPP",
	official: "https://megadynegroup.com/en/products/timing-belts/rubber-open-end/rubber-open-end/",
	linkImage: "/assets/rubber-open-end-rpp-hero.png",
	description: "Open-ended RPP rubber timing belts for linear drives, positioning systems, lifting applications and controlled reciprocating movement.",
	profiles: [
		["RPP3", "https://dam.ammega.com/api/file/redirect/6fa696de-94d7-4ffd-b33f-c049de2ba44e"],
		["RPP5", "https://dam.ammega.com/api/file/redirect/148fc75e-0f9e-48eb-a3c1-a10da8cf7bcc"],
		["RPP8", "https://dam.ammega.com/api/file/redirect/60c1b5a4-d1a4-4db3-a40c-8337c018a624"]
	]
}, {
	family: "MEGASYNC™ RPP STEEL",
	official: "https://megadynegroup.com/en/products/timing-belts/rubber-open-end/rpp-steel/",
	linkImage: "/assets/megasync-rpp-steel-link.png",
	description: "Steel-cord open-ended RPP construction for higher traction loads, reduced elongation and demanding industrial linear-motion systems.",
	profiles: [["RPP 8M", "https://dam.ammega.com/api/file/redirect/60c1b5a4-d1a4-4db3-a40c-8337c018a624"], ["RPP 14M", "https://dam.ammega.com/api/file/redirect/8ba368e3-5ffb-42c9-b92e-ff21b42678c4"]]
}];
var rubberEndlessProfilePictures = [
	{
		family: "MEGASYNC™ Imperial",
		official: "https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-imperial-imperial-dd/",
		linkImage: "/assets/megasync-imperial-link.png",
		description: "Classic imperial rubber timing belts for established machinery and replacement drives.",
		profiles: [
			["MXL", "https://dam.ammega.com/api/file/redirect/143d56d6-4736-4e6c-8cce-fcdeb3cbe4b0"],
			["XL", "https://dam.ammega.com/api/file/redirect/be201cda-547e-4b22-8058-df9ba10debb5"],
			["L", "https://dam.ammega.com/api/file/redirect/0ccfcfcd-ab69-48f1-929f-4e47859e1e6b"],
			["H", "https://dam.ammega.com/api/file/redirect/00c58aa0-1656-4f05-93a7-3ba63835342d"],
			["XH", "https://dam.ammega.com/api/file/redirect/90514e76-ac86-4eb4-b1bd-1c8ebd91462f"]
		]
	},
	{
		family: "MEGASYNC™ RPP",
		official: "https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-rpp-and-rpp-dd/",
		linkImage: "/assets/megasync-rpp-link.png",
		description: "Classic parabolic-profile rubber timing belts for a broad range of synchronous drives.",
		profiles: [["RPP3, RPP5, RPP8, RPP14", "https://dam.ammega.com/api/file/redirect/05d9fa86-ef72-4406-801c-0ed4010e7aff"], ["RPP5 DD, RPP8 DD, RPP14 DD", "https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2"]]
	},
	{
		family: "MEGASYNC™ Silver3",
		official: "https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-silver3-silver3-dd/",
		linkImage: "/assets/megasync-silver3-link.png",
		description: "The new SILVER3 belt is made from high-quality, innovative materials. After extensive research and development, a synchronous belt was created that offers excellent performance and reliability.",
		profiles: [["SLV3 5M, SLV3 8M, SLV3 14M", "https://dam.ammega.com/api/file/redirect/05d9fa86-ef72-4406-801c-0ed4010e7aff"], ["SLV3 5M DD, SLV3 8M DD, SLV3 14M DD", "https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2"]]
	},
	{
		family: "MEGASYNC™ Gold2",
		official: "https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-gold2-and-gold2-dd/",
		linkImage: "/assets/megasync-gold2-link.png",
		description: "High-performance RPC construction for increased torque capacity and compact drive upgrades.",
		profiles: [["GLD 5M, GLD 8M, GLD 14M", "https://dam.ammega.com/api/file/redirect/05d9fa86-ef72-4406-801c-0ed4010e7aff"], ["GLD 5M DD, GLD 8M DD, GLD 14M DD", "https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2"]]
	},
	{
		family: "MEGASYNC™ Titanium",
		official: "https://megadynegroup.com/en/products/timing-belts/rubber-endless/megasync-titanium/",
		linkImage: "/assets/megasync-titanium-link.png",
		description: "Megadyne Titanium is a high-performance carbon-cord timing belt engineered for increased specific power, lower weight, reduced noise and maintenance-free operation.",
		profiles: [["TTM 8M, TTM 14M", "https://dam.ammega.com/api/file/redirect/18941fb2-21c5-4b02-abf7-3ed7dae2f059"], ["TTM 8M DD, TTM 14M DD", "https://dam.ammega.com/api/file/redirect/70438726-994f-46d5-acd7-35fccb8fa1e2"]]
	}
];
function TimingProfileFamily({ family }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `openend-profile-family${family.family === "CONTI® SYNCHROCHAIN Carbon" ? " carbon-profile-family" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "openend-profile-family-head",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: family.family })
			}),
			family.family.startsWith("CONTI®") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "continental-family-description",
				children: family.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: `openend-profile-official openend-profile-official--media${family.family === "BRECOFLEX®" || family.family === "CONTI® SYNCHROCHAIN Carbon" || family.family.startsWith("CONTI® SYNCHROFLEX") ? " openend-profile-official--image-right" : ""}`,
				href: family.official,
				target: "_blank",
				rel: "noreferrer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "openend-profile-link-image",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: family.linkImage,
							alt: "",
							loading: "lazy",
							decoding: "async"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "openend-profile-link-copy",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: family.family }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: family.description })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `openend-profile-picture-grid${family.profiles.length <= 2 ? " openend-profile-picture-grid--center" : ""}`,
				children: family.profiles.map(([profile, src]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: `${family.family} ${profile} timing belt profile`,
					loading: "lazy",
					decoding: "async"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: profile })] }, `${family.family}-${profile}`))
			}),
			family.family === "BRECOFLEX®" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "continental-profile-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/brecoflex-detail.png",
					alt: "BRECOFLEX polyurethane timing belts",
					loading: "lazy",
					decoding: "async"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "BRECOFLEX® Timing Belts" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "BRECOFLEX® belts are truly endless polyurethane timing belts built for precise, low-maintenance power transmission in compact and demanding machine designs." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The range covers standard AT and T profiles as well as imperial and specialty self-guiding options for positioning, conveying and synchronized drive applications." })
				] })]
			}),
			family.family === "CONTI® SYNCHROFLEX GEN III" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "continental-profile-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/conti-synchroflex-profile-detail.png",
					alt: "CONTI SYNCHROFLEX GEN III polyurethane timing belt profile",
					loading: "lazy",
					decoding: "async"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "CONTI® SYNCHROFLEX GEN III" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "CONTI® SYNCHROFLEX GEN III is a polyurethane timing belt range designed for accurate positioning, dependable repeatability and efficient power transmission in industrial machinery." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Its AT tooth profiles combine precise engagement with strong, wear-resistant performance for automated drives and conveying applications." })
				] })]
			}),
			family.family === "CONTI® SYNCHROCHAIN Carbon" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "continental-profile-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/conti-synchrochain-carbon-detail.png",
					alt: "CONTI SYNCHROCHAIN Carbon timing belt detail",
					loading: "lazy",
					decoding: "async"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "CONTI® SYNCHROCHAIN Carbon" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "CONTI® SYNCHROCHAIN Carbon is engineered for high-torque synchronous drives where strength, precision and long service life are critical." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Its carbon tension members and CTD tooth profiles support demanding dynamic loads while maintaining reliable engagement in heavy industrial applications." })
				] })]
			})
		]
	});
}
function RubberPerformanceTechnical({ family }) {
	if (![
		"MEGASYNC™ Silver3",
		"MEGASYNC™ Gold2",
		"MEGASYNC™ Titanium"
	].includes(family)) return null;
	const titanium = family.endsWith("Titanium");
	const items = titanium ? [
		"HNBR Rubber Backing",
		"HNBR Rubber Teeth",
		"100% Carbon Fiber Cords",
		"High-Performance Tooth Facing Fabric",
		"Special Anti-Friction Treatment"
	] : [
		"NBR body",
		"NBR back",
		"Glass cords",
		"Nylon fabric",
		"External special film"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section openend-technical profile-family-technical",
		"data-openend-reveal": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-section-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "TECHNICAL PREVIEW" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: family })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-technical-grid openend-technical-grid--compact",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "internal-structure-image-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "internal-structure-label internal-structure-label--above",
							children: "INTERNAL STRUCTURE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/assets/silver3-gld2-description.png",
							alt: `${family} internal construction`,
							loading: "lazy",
							decoding: "async"
						}) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "openend-component-list internal-structure-list",
						children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index + 1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item }) })] }, item))
					})]
				}),
				titanium && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "feature-columns",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "feature-column",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Belt Body" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "HNBR elastomer increases tooth rigidity and shear resistance." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Exceptional resistance to flex fatigue." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Wide working temperature range from -40°C to +120°C, with peaks up to +140°C." })
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "feature-column",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: "Tension Members" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "100%" }), " carbon cord technology for extreme dimensional stability."] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Maintenance-free with no need to re-tension." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Accurate tooth meshing reduces abrasion, vibration and noise." })
						] })]
					})]
				})
			]
		})
	}), titanium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section light-section mechanism-showcase-section",
		"data-openend-reveal": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mechanism-showcase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/gold-slv-rpp-mechanism.jpg",
					alt: "Silver3, Gold2 and Titanium on a Real Industrial Drive",
					loading: "lazy",
					decoding: "async"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "MEGASYNC™ IN THE DRIVE" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Silver3, Gold2 and Titanium on a Real Industrial Drive" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "MEGASYNC™ belts are engineered to perform side by side on the same machine—from cost-effective Silver3 replacement duty through Gold2 upgrades to Titanium’s extreme-duty carbon-cord construction." })
				] })]
			})
		})
	})] });
}
function TimingBeltDetailPage({ slug }) {
	const page = timingBeltDetailPages[slug];
	const catalog = slug === "polyurethane-endless" ? polyurethaneEndlessProfilePictures : slug === "rubber-open-end" ? rubberOpenEndProfilePictures : rubberEndlessProfilePictures;
	(0, import_react.useEffect)(() => {
		const elements = Array.from(document.querySelectorAll("[data-openend-reveal]"));
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
			elements.forEach((element) => element.classList.add("is-visible"));
			return;
		}
		const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		}), {
			threshold: .1,
			rootMargin: "0px 0px -8%"
		});
		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "openend-hero openend-hero--brand-split" + (slug === "rubber-open-end" ? " openend-hero--rubber-open" : "") + ("heroFullVisible" in page && page.heroFullVisible ? " openend-hero--full-visible" : ""),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "openend-hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, {
						plain: true,
						parts: [
							{
								label: "Products",
								href: "/products"
							},
							{
								label: "Timing Belts",
								href: "/products/timing-belts"
							},
							{ label: page.titleTop + " " + page.titleBottom }
						]
					}),
					page.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: page.eyebrow })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						page.titleTop,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						page.titleBottom
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
						className: "openend-mobile-hero-media",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: page.hero,
							alt: page.titleTop + " " + page.titleBottom + " belt portfolio"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "openend-hero-description",
						children: Array.isArray(page.heroCopy) ? page.heroCopy.map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: index === 0 ? "lead" : void 0,
							children: paragraph
						}, paragraph)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: page.heroCopy })
					}),
					Array.isArray(page.heroCopy) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "openend-mobile-overview",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { children: ["More about this range ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chevron, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: page.heroCopy.slice(2).map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, paragraph)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "button-row",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "hero-quote-link",
							href: "/request-a-quote?product=" + page.quote,
							children: ["Request a Quote ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "openend-hero-media",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: page.hero,
					alt: page.titleTop + " " + page.titleBottom + " by Megadyne"
				})
			})]
		}),
		"pillarImage" in page && page.pillarImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-introduction",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container openend-intro-grid pillar-intro-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "openend-intro-image",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: page.pillarImage,
						alt: page.pillarTitle
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-intro-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "MEGASYNC™ ENDLESS RANGE" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: page.pillarTitle }),
						page.pillarCopy.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, paragraph))
					]
				})]
			})
		}),
		"rangeImage" in page && page.rangeImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-introduction openend-introduction--reverse",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container openend-intro-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-intro-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "STANDARD RANGE" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: page.rangeTitle }),
						page.rangeCopy.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph }, paragraph))
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "openend-intro-image",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: page.rangeImage,
						alt: page.rangeTitle
					})
				})]
			})
		}),
		"comparisonIndexImage" in page && page.comparisonIndexImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-technical",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-section-head openend-section-head--center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "SELECTION GUIDE" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Performance Comparison Index" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: page.comparisonIndexCopy })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
					className: "comparison-index-figure",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: page.comparisonIndexImage,
						alt: "Megadyne timing belt performance comparison index"
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-profiles",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [page.profileTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-section-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: page.profileTitle }), page.profileCopy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: page.profileCopy })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "openend-profile-catalog" + (slug === "rubber-open-end" ? " rubber-openend-profile-catalog" : ""),
					children: catalog.map((family) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimingProfileFamily, { family }), slug === "rubber-endless" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RubberPerformanceTechnical, { family: family.family })] }, family.family))
				})]
			})
		}),
		page.families.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-family",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "openend-section-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: page.familyEyebrow })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: page.familyTitle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: page.familyCopy })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "openend-family-grid openend-family-grid--unnumbered",
					children: page.families.map(([name, description, url]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: url,
						target: "_blank",
						rel: "noreferrer",
						"aria-label": "View the official " + name + " product source",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
					}, name))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section openend-support",
			"data-openend-reveal": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportBlock, {})
			})
		})
	] });
}
function ProductPage({ slug }) {
	const product = findProduct(slug);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {});
	const isTiming = slug === "timing-belts";
	const isV = slug === "v-belts";
	const isConveyor = slug === "conveyor-belts";
	const isModular = slug === "modular-belts";
	const extras = isTiming ? [
		"Open-ended belts",
		"Endless welded belts",
		"Truly endless belts",
		"Steel tension cords",
		"Kevlar or aramid tension cords",
		"Coatings",
		"Cleats",
		"Guides",
		"Perforations",
		"Special backings",
		"Precision machining"
	] : isConveyor ? [
		"Custom fabrication",
		"Cleats",
		"Sidewalls",
		"Guides",
		"Tracking profiles",
		"Perforation",
		"Precision machining",
		"Endless splicing",
		"Installation",
		"On-site technical support",
		"Belt selection",
		"Application engineering"
	] : isModular ? [
		"Plastic sprockets",
		"Stainless-steel sprockets",
		"Wear strips",
		"Guide rails",
		"Flights and cleats",
		"Side guards",
		"Hold-down components",
		"Curved-conveyor accessories",
		"Spiral-conveyor accessories"
	] : product.subcategories;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			plainBreadcrumbs: true,
			eyebrow: product.family,
			title: product.name,
			copy: product.description,
			parts: [
				{
					label: "Products",
					href: "/products"
				},
				{
					label: product.family,
					href: `/products?category=${slugify(product.family)}`
				},
				{ label: product.name }
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "product-intro",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container product-intro-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "detail-image",
					style: { backgroundImage: `url(${product.image})` },
					role: "img",
					"aria-label": `Industrial ${product.name.toLowerCase()}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "SUPPLIER NETWORK" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: product.suppliers.join(" · ") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM helps customers identify, select and source a suitable solution for the machine, duty and operating environment." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "tag-list",
						children: product.industries.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x }, x))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "button-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							href: `/request-a-quote?product=${slug}`,
							children: "Request a Quote"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							href: `/product-identification?product=${slug}`,
							secondary: true,
							children: "Identify a Belt"
						})]
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "PRODUCT RANGE",
						title: isTiming ? "Timing Belt Types" : isV ? "V-Belt Categories and Standard Profiles" : `Complete ${product.name} Range`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "technical-grid",
						children: product.subcategories.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							id: slugify(item),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(i + 1).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item })]
						}, item))
					}),
					product.profiles && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "subheading",
						children: "Profiles and sections"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "profile-grid",
						children: product.profiles.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: x }, x))
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "dark-feature",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container detail-columns",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: isModular ? "ACCESSORIES" : "CONFIGURATION & SERVICES",
					title: "Configured Around the Application",
					inverse: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Final suitability, specifications and availability are confirmed by QTM for each application." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "dark-list",
					children: extras.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x }, x))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container detail-columns",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "MATERIALS & BENEFITS",
					title: "Technical Selection Support"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Share operating conditions, dimensions and machine details so the QTM team can compare appropriate constructions." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Materials / surfaces" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "check-list dark-check",
						children: product.materials.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
					}),
					product.benefits && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Product advantages" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "check-list dark-check",
						children: product.benefits.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
					})] })
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section light-section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "TECHNICAL INQUIRY",
					title: `Tell Us About Your ${product.name}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, {
					kind: "product",
					product: product.name
				})]
			})
		})
	] });
}
var supplierLogos = {
	megadyne: "/assets/partners/megadyne.svg",
	continental: "/assets/partners/continental.png",
	"ammeraal-beltech": "/assets/partners/trimmed/ammeraal-beltech.webp",
	sampla: "/assets/partners/trimmed/sampla.webp",
	"uni-modular": "/assets/partners/trimmed/uni.webp",
	challenge: "/assets/partners/trimmed/challenge.webp",
	whm: "/assets/partners/whm.png"
};
function SupplierDirectory({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `supplier-directory ${compact ? "compact" : ""}`,
		children: suppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `supplier-logo-panel supplier-logo-${s.slug}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: supplierLogos[s.slug],
				alt: `${s.name} logo`
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "supplier-directory-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mono-label",
					children: s.short
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: s.relationship }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "supplier-links",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `/suppliers/${s.slug}`,
						children: ["Supplier page ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: s.url,
						target: "_blank",
						rel: "noreferrer",
						children: [
							s.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
						]
					})]
				})
			]
		})] }, s.slug))
	});
}
function SuppliersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "GLOBAL SUPPLIER NETWORK",
			title: "Several International Manufacturers. One QTM Relationship.",
			copy: "QTM is independent and clearly presents each approved supplier relationship, product area and official external source.",
			parts: [{ label: "Suppliers" }]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierDirectory, {})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
	] });
}
var principalPartnerships = {
	megadyne: {
		logo: "/assets/partners/megadyne.svg",
		label: "MEGADYNE MEGAPARTNER",
		headline: "Power Transmission Expertise, Delivered Regionally.",
		intro: ["QTM Group is proud to be a Megadyne MegaPartner and a trusted regional distributor of Megadyne power transmission solutions."],
		detail: "Through this strategic relationship, QTM connects Megadyne’s broad industrial portfolio with regional distributors, OEMs, maintenance teams and end users. We support product identification, technical selection, commercial coordination and dependable follow-up for demanding power transmission applications.",
		images: [
			{
				src: "/assets/partnership-megadyne-rubber.png",
				label: "MEGASYNC™ rubber timing belts"
			},
			{
				src: "/assets/partnership-megadyne-pu.png",
				label: "Polyurethane endless timing belts"
			},
			{
				src: "/assets/partnership-megadyne-open.png",
				label: "Open-ended timing belts"
			}
		]
	},
	continental: {
		logo: "/assets/partners/continental.png",
		label: "CONTITECH PARTNERSHIP · SINCE 2023",
		headline: "Proven Industrial Drive Technology for the Region.",
		intro: ["Since 2023, QTM Group has also served as a regional representative of ContiTech, a leading manufacturer of high-quality industrial power transmission belts."],
		detail: "QTM helps regional customers access ContiTech industrial drive solutions with responsive local coordination. Our team supports application review, belt identification and product selection across industrial, agricultural and OEM requirements.",
		images: [
			{
				src: "/assets/partnership-conti-v.jpg",
				label: "Continental industrial V-belts"
			},
			{
				src: "/assets/partnership-conti-rubber.jpg",
				label: "Rubber synchronous belts"
			},
			{
				src: "/assets/partnership-conti-pu.jpg",
				label: "Polyurethane synchronous belts"
			}
		]
	},
	whm: {
		logo: "/assets/partners/whm.png",
		label: "AUTHORIZED WHM REPRESENTATIVE · SINCE 2026",
		headline: "Advanced Drive Technology, Closer to Our Customers.",
		intro: ["Since 2026 we are proud to announce QTM group received authorization from Wilhelm Herm. Muller group representing their interests in the region.", "In 2026, QTM Group was officially authorized by the Wilhelm Herm. Müller Group (WHM) to represent its products and business interests across the region. We are proud to begin this partnership and bring WHM’s advanced drive-technology solutions closer to our customers."],
		detail: "The partnership combines WHM’s specialized drive-technology capabilities with QTM’s regional market knowledge and customer support. Together, we can address standard and customized belt requirements with closer technical and commercial coordination.",
		images: [
			{
				src: "/assets/partnership-whm-timing.jpg",
				label: "PU timing-belt systems"
			},
			{
				src: "/assets/partnership-whm-pulleys.jpg",
				label: "Synchronous pulleys and components"
			},
			{
				src: "/assets/partnership-whm-esband.jpg",
				label: "Endless drive and conveyor belts"
			}
		]
	}
};
function PrincipalPartnershipPage({ slug }) {
	const s = findSupplier(slug);
	const profile = principalPartnerships[slug];
	if (!s || !profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "partnership-page-hero",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { parts: [{
					label: "Suppliers",
					href: "/suppliers"
				}, { label: s.name }] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "partnership-hero-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: profile.label })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: profile.headline }),
						profile.intro.map((copy, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: copy }, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "button-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								href: `/request-a-quote?supplier=${slug}`,
								children: "Discuss a Requirement"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "text-link light",
								href: s.url,
								target: "_blank",
								rel: "noreferrer",
								children: [
									s.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
								]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "partnership-hero-logo",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: profile.logo,
							alt: `${s.name} logo`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Strategic regional partnership" })]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container partnership-editorial",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					number: "01",
					eyebrow: "OUR PARTNERSHIP",
					title: `QTM Group × ${s.name}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "partnership-long-copy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: profile.detail }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Customers benefit from one responsive regional contact for inquiries, product matching and coordination with the manufacturer. Final specifications and availability are confirmed for every application." })]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "partnership-gallery",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "PRODUCT TECHNOLOGY",
						title: "Solutions Available Through QTM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "partnership-gallery-grid",
						children: profile.images.map((image, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { backgroundImage: `url(${image.src})` } }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(i + 1).padStart(2, "0") }), image.label] })] }, image.src + image.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "partnership-product-list",
						children: s.products.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x }, x))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section partnership-contact",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "REGIONAL SUPPORT" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Let’s review your application." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "button-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						href: `/request-a-quote?supplier=${slug}`,
						children: "Request a Quote"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						href: "/contact-us",
						secondary: true,
						children: "Contact QTM"
					})]
				})]
			})
		})
	] });
}
function SupplierPage({ slug }) {
	if (principalPartnerships[slug]) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrincipalPartnershipPage, { slug });
	const s = findSupplier(slug);
	if (!s) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {});
	const related = products.filter((p) => p.suppliers.some((x) => x.includes(s.name.split(" /")[0]) || s.name.includes(x.split(" /")[0])));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "SUPPLIER NETWORK",
			title: s.name,
			copy: s.relationship,
			parts: [{
				label: "Suppliers",
				href: "/suppliers"
			}, { label: s.name }]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container supplier-detail",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "large-logo-placeholder",
					"data-asset": s.mark,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "PRODUCT AREAS",
						title: "Solutions Available Through QTM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "line-list",
						children: s.products.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "button-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							href: `/request-a-quote?supplier=${slug}`,
							children: "Request a Quote"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							href: "/contact-us",
							secondary: true,
							children: "Contact QTM"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "official-website",
						href: s.url,
						target: "_blank",
						rel: "noreferrer",
						children: [
							s.name,
							" website ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
						]
					})
				] })]
			})
		}),
		related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section light-section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "RELATED PRODUCTS",
					title: `Explore ${s.name} Product Areas`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "catalogue-grid",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
	] });
}
function IndustriesPage() {
	const loop = [...industries, ...industries];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "about-intro industries-hero-intro",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "about-hero-copy industries-hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { parts: [{ label: "Industries" }] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Industries" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Applications First. Products Selected Around Them." })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "about-hero-media industries-hero-media",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/qtm-industries-panorama-v2.png",
					alt: "Core industrial applications served by QTM Group"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "section industries-page-intro",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					number: "01",
					eyebrow: "QTM'S CORE INDUSTRIES",
					title: "Belting Solutions for the Industries We Serve"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "industry-marquee",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "industry-scroller",
					children: loop.map((industry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `/industries/${industry.slug}`,
						"aria-hidden": i >= industries.length,
						tabIndex: i >= industries.length ? -1 : void 0,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(i % industries.length + 1).padStart(2, "0") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: industry.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
						]
					}, `${industry.slug}-${i}`))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section light-section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					number: "02",
					eyebrow: "CORE INDUSTRIES",
					title: "Explore by Application"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "industry-directory",
					children: industries.map((i, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `/industries/${i.slug}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: i.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Applications, product families and technical support" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
						]
					}, i.slug))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
	] });
}
var coverageRegions = {
	"Central Asia": [
		"kz",
		"kg",
		"tj",
		"tm",
		"uz"
	],
	"Middle East": [
		"ae",
		"bh",
		"eg",
		"lb",
		"om",
		"qa",
		"sa"
	],
	"Caucasus & Moldova": [
		"am",
		"ge",
		"md"
	],
	"Mongolia": ["mn"]
};
function WorldCoverageMap() {
	const [active, setActive] = (0, import_react.useState)("Central Asia");
	const regionFor = (id) => Object.entries(coverageRegions).find(([, ids]) => ids.includes(id))?.[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "world-coverage-map",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: worldMap.viewBox,
				role: "img",
				"aria-label": "World map highlighting QTM coverage in Central Asia, the Middle East, Mongolia, the Caucasus and Moldova",
				children: [worldMap.locations.filter((location) => !regionFor(location.id)).map((location) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: "map-country",
					d: location.path
				}, location.id)), Object.entries(coverageRegions).map(([region, ids]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
					className: `map-region ${region === "Mongolia" ? "mongolia-region" : ""} ${active === region ? "active" : ""}`,
					tabIndex: 0,
					role: "button",
					"aria-label": region,
					onMouseEnter: () => setActive(region),
					onFocus: () => setActive(region),
					onClick: () => setActive(region),
					children: worldMap.locations.filter((location) => ids.includes(location.id)).map((location) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: location.path }, location.id))
				}, region))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "map-region-label",
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "QTM NETWORK" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: active }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: {
						"Central Asia": "Kazakhstan · Kyrgyzstan · Tajikistan · Turkmenistan · Uzbekistan",
						"Middle East": "Saudi Arabia · United Arab Emirates · Bahrain · Oman · Qatar · Egypt · Lebanon",
						"Caucasus & Moldova": "Armenia · Georgia · Moldova",
						"Mongolia": "Dedicated highlighted market coverage"
					}[active] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "map-legend",
				children: Object.keys(coverageRegions).map((region) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: active === region ? "active" : "",
					onMouseEnter: () => setActive(region),
					onFocus: () => setActive(region),
					onClick: () => setActive(region),
					children: region
				}, region))
			})
		]
	});
}
function NetworkPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "OUR NETWORK",
			title: "Global Products. Regional Market Knowledge.",
			copy: "QTM connects international manufacturers with distributors, OEMs and industrial customers across Central Asia, the Middle East, Mongolia, the Caucasus and selected Eastern European markets.",
			parts: [{ label: "Our Network" }]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "network-map-section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "network-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						number: "01",
						eyebrow: "REGIONAL COVERAGE",
						title: "A Network Built Around the Markets We Serve",
						copy: "Hover over a highlighted region to explore QTM’s regional reach."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						href: "/contact-us",
						secondary: true,
						children: "Contact QTM"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldCoverageMap, {})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container network-capabilities",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Regional Distribution" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Coordinating premium industrial products with regional distributors and resellers." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "OEM & End-User Support" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Helping customers identify and select suitable solutions for real applications." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Cross-Border Coordination" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Responsive technical and commercial communication across diverse markets." })
					] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {})
	] });
}
function IndustryPage({ slug }) {
	const i = findIndustry(slug);
	if (!i) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {});
	const details = industryDetails[slug] || {
		overview: `Industrial belt, conveying and mechanical power transmission support for ${i.name.toLowerCase()} applications.`,
		applications: [
			"Production equipment",
			"Conveying systems",
			"Auxiliary drives",
			"Maintenance replacement"
		],
		challenges: [
			"Reliability",
			"Correct material selection",
			"Downtime reduction",
			"Regional availability"
		]
	};
	const relevant = products.filter((p) => p.industries.some((x) => slugify(x) === slug)).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "INDUSTRY SOLUTION",
			title: i.name,
			copy: details.overview,
			parts: [{
				label: "Industries",
				href: "/industries"
			}, { label: i.name }]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container detail-columns",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "COMMON APPLICATIONS",
					title: "Where QTM Can Support"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "line-list",
					children: details.applications.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "OPERATIONAL CHALLENGES",
					title: "Selection Starts with the Duty"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "line-list",
					children: details.challenges.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section light-section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "RELEVANT PRODUCTS",
					title: `Solutions for ${i.name}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "catalogue-grid",
					children: (relevant.length ? relevant : products.slice(0, 4)).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "TECHNICAL SUPPORT",
					title: "Discuss Your Application"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, {
					kind: "quote",
					product: i.name
				})]
			})
		})
	] });
}
var fieldSets = {
	contact: [
		"First name*",
		"Last name*",
		"Company*",
		"Email*",
		"Phone",
		"Country*",
		"Inquiry type*",
		"Product category",
		"Supplier",
		"Message*"
	],
	quote: [
		"Contact name*",
		"Company*",
		"Email*",
		"Phone",
		"Country*",
		"Product category*",
		"Product name",
		"Product code",
		"Belt marking",
		"Profile",
		"Length",
		"Width",
		"Quantity*",
		"Machine manufacturer",
		"Machine model",
		"Application*",
		"Required delivery date",
		"Message"
	],
	product: [
		"Contact name*",
		"Company*",
		"Email*",
		"Phone",
		"Belt marking",
		"Belt section",
		"Top width",
		"Height",
		"Length",
		"Quantity*",
		"Machine manufacturer",
		"Machine model",
		"Application*"
	],
	b2b: [
		"First name*",
		"Last name*",
		"Company*",
		"Position",
		"Email*",
		"Phone*",
		"Country*",
		"Website",
		"Customer type*",
		"Industries",
		"Products of interest",
		"Message"
	],
	identify: [
		"Contact name*",
		"Company",
		"Email*",
		"Phone",
		"Belt marking",
		"Length",
		"Width",
		"Profile / tooth pitch",
		"Machine manufacturer",
		"Machine model",
		"Application",
		"Additional information"
	]
};
function InquiryForm({ kind, product }) {
	const [status, setStatus] = (0, import_react.useState)("");
	const [errors, setErrors] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors([]);
		const form = new FormData(e.currentTarget);
		const missing = fieldSets[kind].filter((x) => x.endsWith("*") && !String(form.get(slugify(x.replace("*", ""))) || "").trim());
		const email = String(form.get("email") || "");
		if (email && !/^\S+@\S+\.\S+$/.test(email)) missing.push("Valid email");
		setErrors(missing);
		if (missing.length) {
			setLoading(false);
			return;
		}
		try {
			const res = await fetch("/api/submit-inquiry", {
				method: "POST",
				body: form
			});
			const data = await res.json();
			if (res.ok) {
				setStatus(data.message || "Your inquiry has been sent successfully. QTM will review it shortly.");
				e.currentTarget.reset();
			} else setErrors([data.error || "Failed to send inquiry"]);
		} catch (err) {
			setErrors(["Failed to send inquiry. Please try again or contact QTM directly."]);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "inquiry-form",
		onSubmit: submit,
		noValidate: true,
		children: [
			product && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "hidden",
				name: "prefilled-product",
				value: product
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-grid",
				children: [
					fieldSets[kind].map((label) => {
						const clean = label.replace("*", "");
						const name = slugify(clean);
						const large = /message|application|information|interest|industries/i.test(clean);
						const select = /inquiry type|customer type|product category$/i.test(clean);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: large ? "field-wide" : "",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [clean, label.endsWith("*") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: " *" })] }), select ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								name,
								defaultValue: clean === "Product category" && product ? product : "",
								disabled: loading,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									disabled: true,
									children: "Select"
								}), (clean === "Inquiry type" ? [
									"Request a Quote",
									"Product Identification",
									"Technical Support",
									"B2B Access",
									"Supplier Inquiry",
									"Partnership",
									"General Inquiry"
								] : clean === "Customer type" ? [
									"Distributor",
									"Reseller",
									"OEM",
									"End User",
									"Service Company",
									"Other"
								] : products.map((p) => p.name)).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))]
							}) : large ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name,
								rows: 4,
								disabled: loading
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name,
								type: /email/i.test(clean) ? "email" : /delivery date/i.test(clean) ? "date" : "text",
								disabled: loading
							})]
						}, label);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field-wide file-field",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Photograph or document" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								name: "file",
								accept: ".pdf,.jpg,.jpeg,.png,.docx,.xlsx",
								disabled: loading
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "PDF, JPG, PNG, DOCX or XLSX" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "consent field-wide",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "consent",
							required: true,
							disabled: loading
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I consent to QTM processing this inquiry according to the privacy policy. *" })]
					})
				]
			}),
			errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-error",
				role: "alert",
				children: [
					"Please complete: ",
					errors.join(", "),
					"."
				]
			}),
			status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "form-success",
				role: "status",
				children: status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "button",
				type: "submit",
				disabled: loading,
				children: [
					loading ? "Sending..." : "Submit Inquiry",
					" ",
					!loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
				]
			})
		]
	});
}
function ContactPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "CONTACT QTM",
		title: "Tell Us What You Need",
		copy: "Use the form for quotations, product identification, technical support, B2B access, supplier inquiries or partnerships.",
		parts: [{ label: "Contact Us" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container contact-layout",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Central Asia · Middle East · CIS region" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Email" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:info@qtm-group.com",
						children: "info@qtm-group.com"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Phone" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "tel:+37443552522",
						children: "+374 43 552522"
					}) })
				] })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "GENERAL INQUIRY",
				title: "Start a Conversation"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, { kind: "contact" })] })]
		})
	})] });
}
function QuotePage() {
	const slug = useSearchParams().get("product");
	const prefill = slug ? findProduct(slug)?.name || "" : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "REQUEST A QUOTE",
		title: "Share the Product and Application Details",
		copy: "The more information you provide, the more efficiently QTM can review the requirement with the appropriate supplier.",
		parts: [{ label: "Request a Quote" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, {
				kind: "quote",
				product: prefill
			}, prefill)
		})
	})] });
}
function IdentificationPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "PRODUCT IDENTIFICATION",
		title: "Have a Belt but Don’t Know Its Reference?",
		copy: "Send the marking, dimensions, machine model or a clear photograph. QTM will help identify a suitable replacement.",
		parts: [{ label: "Product Identification" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container identification-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "identify-guide",
				children: [
					[
						"01",
						"Photograph",
						"Capture the full belt and a close-up of the marking."
					],
					[
						"02",
						"Dimensions",
						"Share length, width, height and tooth pitch where relevant."
					],
					[
						"03",
						"Machine",
						"Add the manufacturer, model and application."
					],
					[
						"04",
						"Quantity",
						"Tell us how many pieces are required."
					]
				].map(([n, t, c]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: c })
				] }, n))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, { kind: "identify" })]
		})
	})] });
}
function B2BPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "b2b-coming-soon",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container b2b-coming-soon-inner",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "B2B CUSTOMER PORTAL" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "b2b-gear",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 200 200",
						focusable: "false",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							className: "b2b-gear-spin",
							children: [
								Array.from({ length: 12 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "91",
									y: "7",
									width: "18",
									height: "34",
									rx: "3",
									transform: `rotate(${index * 30} 100 100)`
								}, index)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "100",
									cy: "100",
									r: "72"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									className: "b2b-gear-cutout",
									cx: "100",
									cy: "100",
									r: "49"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/qtm-group-logo-transparent.png",
						alt: ""
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Coming Soon" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The QTM B2B customer portal is currently being prepared." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "text-link",
					href: "/",
					children: ["Return to Home ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
				})
			]
		})
	});
}
function NewsCard({ article, featured = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `news-card ${featured ? "featured" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "news-visual",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DRAFT" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mono-label",
				children: [
					article.category,
					" · ",
					article.status
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `/news/${article.slug}`,
				children: article.title
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: article.excerpt }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "text-link",
				href: `/news/${article.slug}`,
				children: ["Read more ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
			})
		] })]
	});
}
function NewsPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("All categories");
	const [supplier, setSupplier] = (0, import_react.useState)("All suppliers");
	const filtered = news.filter((n) => (category === "All categories" || n.category === category) && (supplier === "All suppliers" || n.supplier === supplier) && (!query || `${n.title} ${n.excerpt}`.toLowerCase().includes(query.toLowerCase())));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "NEWS & INSIGHTS",
		title: "QTM News and Industry Updates",
		copy: "Editable draft placeholders for company, supplier, product and technical updates. No unapproved announcements are published.",
		parts: [{ label: "News" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "news-filters",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search articles" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search news"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All categories" }), [...new Set(news.map((n) => n.category))].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Supplier" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: supplier,
							onChange: (e) => setSupplier(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All suppliers" }), [...new Set(news.map((n) => n.supplier))].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: x }, x))]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "news-grid",
					children: filtered.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsCard, {
						article: n,
						featured: i === 0
					}, n.slug))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "pagination",
					"aria-label": "News pages",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-current": "page",
							children: "1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: true,
							children: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "More pages appear when approved articles are added." })
					]
				})
			]
		})
	})] });
}
function NewsArticle({ slug }) {
	const a = news.find((n) => n.slug === slug);
	if (!a) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: a.category,
		title: a.title,
		copy: a.excerpt,
		parts: [{
			label: "News",
			href: "/news"
		}, { label: a.title }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "article-body container",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "draft-banner",
				children: "This is an editable draft placeholder. Publication date, quotations and announcement details must be approved before launch."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Article introduction" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Use this structure for a concise company or technical update. Replace this paragraph with approved QTM content while preserving the clear hierarchy and related links below." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Key information" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Explain the customer relevance, supported products or supplier context without making unsupported performance claims." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "article-cta",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Have a related application?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					href: "/contact-us",
					children: "Contact QTM"
				})]
			})
		]
	})] });
}
function SearchPage() {
	const [q, setQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setQ(new URLSearchParams(window.location.search).get("q") || "");
	}, []);
	const groups = (0, import_react.useMemo)(() => {
		const x = q.toLowerCase();
		return {
			Products: products.filter((p) => `${p.name} ${p.description} ${p.subcategories.join(" ")}`.toLowerCase().includes(x)),
			Suppliers: suppliers.filter((s) => `${s.name} ${s.relationship} ${s.products.join(" ")}`.toLowerCase().includes(x)),
			Industries: industries.filter((i) => i.name.toLowerCase().includes(x)),
			News: news.filter((n) => `${n.title} ${n.excerpt}`.toLowerCase().includes(x))
		};
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "SITE SEARCH",
		title: "Find Products, Suppliers and Industries",
		copy: "Search the structured QTM website catalogue.",
		parts: [{ label: "Search" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "search-page-form",
				onSubmit: (e) => e.preventDefault(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "site-search",
						children: "Search QTM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "site-search",
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Enter a product, supplier or industry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "button",
						children: ["Search ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})]
					})
				]
			}), q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "search-results",
				children: Object.entries(groups).map(([group, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
					group,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: items.length })
				] }), items.map((item) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: group === "Products" ? `/products/${item.slug}` : group === "Suppliers" ? `/suppliers/${item.slug}` : group === "Industries" ? `/industries/${item.slug}` : `/news/${item.slug}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name || item.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.description || item.relationship || item.excerpt || "Industry applications and solutions" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
						]
					}, item.slug);
				})] }, group))
			})]
		})
	})] });
}
var legalUpdated = "Last updated: 5 September 2026";
var legalContact = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: "mailto:info@qtm-group.com",
		children: "info@qtm-group.com"
	}),
	" or ",
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: "tel:+37443552522",
		children: "+374 43 552522"
	})
] });
function PrivacyPolicy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "LEGAL",
		title: "Privacy Policy",
		copy: "How QTM GROUP LLC collects, uses and protects personal data submitted through this website.",
		parts: [{ label: "Privacy Policy" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container legal-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "legal-updated",
					children: legalUpdated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "legal-notice-box",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Placeholder to confirm:" }), " QTM GROUP LLC is identified as a company registered in Armenia, but the registered office address has not been provided. Add the full legal address before final legal approval."] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "1. Who We Are" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This website is operated by QTM GROUP LLC, a company registered in Armenia. QTM Group supplies industrial belts, conveyor belts, power transmission products and related industrial solutions across Armenia, the CIS, Central Asia and the Middle East." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"For privacy questions or requests, contact QTM Group at ",
					legalContact,
					"."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "2. Personal Data We Collect" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We collect personal data that you choose to provide when you contact QTM Group, request a quotation, submit a product identification request, apply for B2B access, send files or communicate with us by email or phone." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Contact details, such as your name, company, position, email address, phone number, country and website." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Commercial inquiry details, such as customer type, product category, product name, supplier interest, quantity, delivery date and message content." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Technical product details, such as belt marking, profile, tooth pitch, dimensions, machine manufacturer, machine model, application and uploaded photographs or documents." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "B2B login or access-request information, such as business identity, role, products of interest and account-related communication." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Basic technical information normally sent by a browser, such as IP address, browser type, device type, page requested, time of request and referring page, where this is recorded by hosting or security logs." })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "3. Forms and Current Submission Setup" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "legal-notice-box",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Current implementation note:" }), " the website source reviewed on 5 September 2026 validates form fields in the browser and displays a confirmation message. No server-side form delivery endpoint was found in the reviewed source. If QTM later connects email delivery, CRM storage, analytics or a B2B account system, this policy should be updated before launch of that feature."] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "4. Analytics and Tracking" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Based on the current website source, QTM Group does not load Google Analytics, Meta Pixel, LinkedIn Insight Tag, advertising pixels or similar analytics scripts. The site stores a language preference in the visitor’s browser using local storage when a visitor selects a language." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The site may load limited third-party resources, including country flag images and embedded media from YouTube’s privacy-enhanced domain when a visitor opens the video player. Those third-party services may receive technical connection information from the visitor’s browser." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "5. How We Use Personal Data" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM Group uses personal data for legitimate business, contractual and pre-contractual purposes, including to:" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "respond to questions, quote requests and technical support inquiries;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "identify belts, components and suitable replacement products;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "review machine, application and product requirements;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "coordinate supply, availability, logistics and commercial follow-up;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "manage B2B access requests and customer relationships;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "protect the website, prevent misuse and maintain business records;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "comply with legal, tax, accounting and regulatory obligations." })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "6. Sharing With Partner Brands and Service Providers" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Where necessary for product selection, technical review, quotation, warranty handling or supply coordination, QTM Group may share relevant inquiry and application details with manufacturer and partner brands, including Megadyne, Ammeraal Beltech, Sampla, Continental / ContiTech and Wilhelm Herm. Müller (WHM). QTM Group shares only the information reasonably needed for the specific inquiry or business purpose." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM Group may also share data with website hosting providers, email providers, IT support, logistics providers, professional advisers and authorities where required by law. QTM Group does not sell personal data." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "7. International Transfers" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Because QTM Group operates across Armenia, the CIS, Central Asia and the Middle East and works with international partner brands, personal data may be processed or reviewed outside your country. Where applicable, QTM Group will use reasonable safeguards and share data only for the business purposes described in this policy." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "8. Storage and Retention" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM Group keeps personal data only as long as reasonably necessary for the purpose for which it was collected, including responding to inquiries, providing quotations, handling customer relationships, maintaining technical records and meeting legal or accounting obligations." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "legal-notice-box",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Placeholder to confirm:" }), " exact retention periods and the exact systems used for CRM, email archives, file storage and B2B accounts have not been confirmed. Inquiry records should be reviewed periodically and deleted or anonymized when no longer needed."] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "9. Security" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM Group aims to use reasonable technical and organizational measures to protect personal data against unauthorized access, loss, misuse or disclosure. No website, email or online storage system can be guaranteed to be completely secure." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "10. Your Rights" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Depending on your location and applicable law, you may have rights to request access to your personal data, correction of inaccurate data, deletion of data, restriction or objection to processing, withdrawal of consent where processing is based on consent, and information about how your data is used." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"To exercise these rights, email ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:info@qtm-group.com",
						children: "info@qtm-group.com"
					}),
					" with your name, company, contact details and the request you want QTM Group to review. QTM Group may need to verify your identity before responding."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "11. Applicable Law" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "As an Armenian company, QTM Group is subject to applicable Armenian law, including the Law of the Republic of Armenia on Protection of Personal Data. If QTM Group offers goods or services to, or monitors the behavior of, individuals in the European Union or United Kingdom, the EU GDPR and/or UK GDPR may apply. Depending on the country of the visitor, customer or transaction, other regional privacy laws may also be relevant, including data protection laws in CIS countries and Gulf markets such as the UAE Personal Data Protection Law and Saudi Arabia’s Personal Data Protection Law." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This policy is intended as website-level transparency information and should be reviewed by qualified legal counsel for each target market before being treated as final legal advice." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "12. Changes to This Policy" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM Group may update this Privacy Policy when website functions, business processes, legal requirements or partner arrangements change. The latest version will be posted on this page with the last-updated date." })
			]
		})
	})] });
}
function CookiePolicy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "LEGAL",
		title: "Cookie Policy",
		copy: "What cookies and similar technologies are used on the QTM Group website.",
		parts: [{ label: "Cookie Policy" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container legal-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "legal-updated",
					children: legalUpdated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "1. Overview" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This Cookie Policy explains how QTM GROUP LLC uses cookies, local storage and similar technologies on this website." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "2. What the Site Currently Uses" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Based on the current website source reviewed on 5 September 2026, QTM Group does not load non-essential analytics cookies, marketing cookies, advertising pixels or behavioral tracking scripts." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "legal-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Technology" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Purpose" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Local storage language preference" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Stores the visitor’s selected language so the site can keep that preference on later visits." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Functional / preference" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Hosting and security logs" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "The hosting environment may process technical request data such as IP address, browser details, requested URL and time of request for security, diagnostics and delivery." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Essential" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Third-party media or external assets" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "Country flag images and the YouTube privacy-enhanced video embed may be requested by the visitor’s browser when those elements are loaded or used." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "External service request" })
						] })
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "3. Essential, Analytics and Marketing Cookies" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Essential technologies" }), " are used to deliver the website, keep it secure and allow normal browser requests."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Analytics technologies" }), " are not currently found in the reviewed website source. If QTM Group adds analytics in the future, the policy should name the tool, explain the purpose and configure consent where required."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Marketing technologies" }), " are not currently found in the reviewed website source. If advertising or retargeting pixels are added, visitors should receive an appropriate consent choice before those tools load."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "4. Cookie Consent Banner" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Because the reviewed website source does not load non-essential cookies or tracking scripts, a cookie consent banner has not been added at this time. If analytics, marketing pixels, heatmaps, chat widgets or other non-essential tracking tools are added later, QTM Group should add a consent banner that lets visitors accept or decline before those tools load." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "5. Managing Cookies and Local Storage" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You can manage cookies and local storage through your browser settings. Most browsers allow you to block cookies, delete existing cookies, clear local storage or set preferences for specific websites. Blocking essential technologies may affect website functionality." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "6. Contact" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"For questions about this Cookie Policy, contact QTM Group at ",
					legalContact,
					"."
				] })
			]
		})
	})] });
}
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		eyebrow: "LEGAL",
		title: "Terms of Service",
		copy: "Rules for using the QTM Group website and requesting information through it.",
		parts: [{ label: "Terms of Service" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container legal-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "legal-updated",
					children: legalUpdated
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "legal-notice-box",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Placeholder to confirm:" }), " QTM GROUP LLC is identified as registered in Armenia, but the full registered office address has not been provided. Add the full legal address before final legal approval."] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "1. About These Terms" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "These Terms of Service govern use of the QTM Group website operated by QTM GROUP LLC, a company registered in Armenia. By using this website, you agree to use it only for lawful business, informational and inquiry purposes." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "2. Website Content" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The website provides information about industrial belts, conveyor belts, power transmission products, partner brands, industries served and QTM Group’s regional support. Product information is provided for general guidance only and does not create a binding quotation, technical guarantee or supply commitment." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Final product suitability, specifications, availability, price, delivery terms and warranty terms must be confirmed in writing by QTM Group or the relevant manufacturer." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "3. Acceptable Use" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You must not use this website to:" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "submit false, misleading, unlawful or malicious information;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "upload files that contain malware, viruses or unlawful material;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "attempt to gain unauthorized access to the website, server, forms, B2B portal or related systems;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "copy, scrape, overload, reverse engineer or interfere with the website or its security;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "misuse QTM Group contact forms, email links or product identification tools for spam or unrelated solicitation;" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "infringe the rights of QTM Group, partner brands or third parties." })
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "4. B2B Access" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Any B2B login or customer portal access is intended only for authorized business users. QTM Group may approve, refuse, suspend or remove B2B access where necessary for security, business, compliance or operational reasons." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "5. Intellectual Property" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "All website design, text, structure, graphics and QTM Group branding are owned by or licensed to QTM GROUP LLC, unless otherwise stated. QTM Group logos and materials may not be copied, modified or used without permission." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Partner names, logos, product names, product images, trademarks and technical materials, including those associated with Megadyne, Ammeraal Beltech, Sampla, Continental / ContiTech, Wilhelm Herm. Müller, BRECO and BRECOFLEX, remain the property of their respective owners." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "6. Third-Party Links" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The website may link to partner manufacturer websites, product data sheets, videos or other third-party resources. QTM Group is not responsible for the content, accuracy, availability, security or privacy practices of third-party websites." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "7. Disclaimer of Liability" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The website is provided on an “as available” basis. QTM Group aims to keep information accurate and useful, but does not guarantee that the website will be uninterrupted, error-free or fully up to date. To the maximum extent permitted by applicable law, QTM Group is not liable for indirect, incidental, consequential or business-loss damages arising from use of the website or reliance on general website information." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nothing in these Terms excludes liability that cannot be excluded under applicable law." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "8. Inquiries, Quotations and Orders" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Submitting a form, email or product identification request does not create a binding contract. A contract, order or supply obligation exists only when confirmed through QTM Group’s accepted commercial process and agreed written terms." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "9. Privacy" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Use of personal data is described in the ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/privacy-policy",
						children: "Privacy Policy"
					}),
					" and ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/cookie-policy",
						children: "Cookie Policy"
					}),
					"."
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "10. Governing Law and Jurisdiction" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "These Terms are governed by the laws of the Republic of Armenia, unless mandatory laws in another jurisdiction apply. Courts of the Republic of Armenia shall have jurisdiction over disputes relating to this website, subject to any mandatory consumer, privacy or trade-law rights that may apply in another country." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "11. Changes to These Terms" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "QTM Group may update these Terms when the website, business processes or legal requirements change. The latest version will be posted on this page with the last-updated date." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "12. Contact" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"For questions about these Terms, contact QTM Group at ",
					legalContact,
					"."
				] })
			]
		})
	})] });
}
function LegalPage({ type }) {
	return type === "privacy-policy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyPolicy, {}) : type === "cookie-policy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookiePolicy, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TermsPage, {});
}
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "not-found",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "eyebrow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "404" }), "PAGE NOT FOUND"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "This route is not available." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Return to the QTM product catalogue or ask the team for help." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "button-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						href: "/products",
						children: "View Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						href: "/contact-us",
						secondary: true,
						children: "Contact QTM"
					})]
				})
			]
		})
	});
}
function QtmSite({ segments = [] }) {
	const [language, setLanguage] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		if (window.localStorage.getItem("qtm-language") === "ru") setLanguage("ru");
	}, []);
	const changeLanguage = (next) => {
		setLanguage(next);
		window.localStorage.setItem("qtm-language", next);
	};
	const path = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
	let page;
	if (path === "/") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomePage, {});
	else if (path === "/about-us") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutPage, {});
	else if (path === "/products") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsPage, {});
	else if (path === "/products/timing-belts") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimingBeltsPage, {});
	else if (path === "/products/timing-belts/polyurethane-open-end") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolyurethaneOpenEndPage, {});
	else if (path === "/products/timing-belts/polyurethane-endless") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimingBeltDetailPage, { slug: "polyurethane-endless" });
	else if (path === "/products/timing-belts/rubber-open-end") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimingBeltDetailPage, { slug: "rubber-open-end" });
	else if (path === "/products/timing-belts/rubber-endless") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimingBeltDetailPage, { slug: "rubber-endless" });
	else if (path === "/products/v-belts") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VBeltsPage, {});
	else if (path === "/products/v-belts/rubber-wrapped") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VBeltDetailPage, { slug: "rubber-wrapped" });
	else if (path === "/products/v-belts/rubber-banded") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VBeltDetailPage, { slug: "rubber-banded" });
	else if (segments[0] === "products" && segments[1]) page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductPage, { slug: segments[1] });
	else if (path === "/suppliers") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuppliersPage, {});
	else if (segments[0] === "suppliers" && segments[1]) page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierPage, { slug: segments[1] });
	else if (path === "/industries") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndustriesPage, {});
	else if (segments[0] === "industries" && segments[1]) page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndustryPage, { slug: segments[1] });
	else if (path === "/our-network") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkPage, {});
	else if (path === "/contact-us") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactPage, {});
	else if (path === "/request-a-quote") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotePage, {});
	else if (path === "/product-identification") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdentificationPage, {});
	else if (path === "/b2b") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(B2BPage, {});
	else if (path === "/news") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsPage, {});
	else if (segments[0] === "news" && segments[1]) page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsArticle, { slug: segments[1] });
	else if (path === "/search") page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPage, {});
	else if ([
		"/privacy-policy",
		"/cookie-policy",
		"/terms"
	].includes(path)) page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { type: segments[0] });
	else page = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoTranslate, { language }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			path,
			language,
			onLanguageChange: changeLanguage
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			id: "main",
			children: page
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
}
//#endregion
export { QtmSite as default };
