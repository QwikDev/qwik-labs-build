"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@builder.io/qwik/jsx-runtime");
const qwik = require("@builder.io/qwik");
const z = require("zod");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const z__namespace = /* @__PURE__ */ _interopNamespaceDefault(z);
const InsightsError = /* @__PURE__ */ z__namespace.object({
  manifestHash: z__namespace.string(),
  url: z__namespace.string(),
  timestamp: z__namespace.number(),
  source: z__namespace.string(),
  line: z__namespace.number(),
  column: z__namespace.number(),
  message: z__namespace.string(),
  error: z__namespace.string(),
  stack: z__namespace.string()
});
const InsightSymbol = /* @__PURE__ */ z__namespace.object({
  symbol: z__namespace.string(),
  route: z__namespace.string(),
  delay: z__namespace.number(),
  latency: z__namespace.number(),
  timeline: z__namespace.number(),
  interaction: z__namespace.boolean()
});
const InsightsPayload = /* @__PURE__ */ z__namespace.object({
  qVersion: z__namespace.string(),
  manifestHash: z__namespace.string(),
  publicApiKey: z__namespace.string(),
  // we retain nullable for older clients
  previousSymbol: z__namespace.string().optional().nullable(),
  symbols: z__namespace.array(InsightSymbol)
});
InsightSymbol._type;
InsightsPayload._type;
InsightsError._type;
const insightsPing = qwik.sync$(() => ((window1, document1, location1, navigator1, performance1, round, JSON_stringify) => {
  var publicApiKey = __QI_KEY__, postUrl = __QI_URL__, getAttribute_s = "getAttribute", querySelector_s = "querySelector", manifest_s = "manifest", manifest_hash_s = `${manifest_s}-hash`, manifestHash_s = `${manifest_s}Hash`, version_s = "version", publicApiKey_s = "publicApiKey", sendBeacon_s = "sendBeacon", symbol_s = "symbol", length_s = "length", addEventListener_s = "addEventListener", route_s = "route", error_s = "error", stack_s = "stack", message_s = "message", symbols_s = `${symbol_s}s`, qVersion = document1[querySelector_s](`[q\\:${version_s}]`)?.[getAttribute_s](`q:${version_s}`) || "unknown", manifestHash = document1[querySelector_s](`[q\\:${manifest_hash_s}]`)?.[getAttribute_s](`q:${manifest_hash_s}`) || "dev", qSymbols = [], existingSymbols = /* @__PURE__ */ new Set(), flushSymbolIndex = 0, lastReqTime = 0, timeoutID, qRouteChangeTime = performance1.now(), qRouteEl = document1[querySelector_s](`[q\\:${route_s}]`), flush = () => {
    timeoutID = void 0;
    if (qSymbols[length_s] > flushSymbolIndex) {
      var payload = {
        qVersion,
        [publicApiKey_s]: publicApiKey,
        [manifestHash_s]: manifestHash,
        previousSymbol: flushSymbolIndex == 0 ? void 0 : qSymbols[flushSymbolIndex - 1][symbol_s],
        [symbols_s]: qSymbols.slice(flushSymbolIndex)
      };
      navigator1[sendBeacon_s](postUrl, JSON_stringify(payload));
      flushSymbolIndex = qSymbols[length_s];
    }
  }, debounceFlush = () => {
    timeoutID != void 0 && clearTimeout(timeoutID);
    timeoutID = setTimeout(flush, 1e3);
  };
  window1.qSymbolTracker = {
    [symbols_s]: qSymbols,
    [publicApiKey_s]: publicApiKey
  };
  if (qRouteEl) {
    new MutationObserver((mutations) => {
      var mutation = mutations.find((m) => m.attributeName === `q:${route_s}`);
      if (mutation) {
        qRouteChangeTime = performance1.now();
      }
    }).observe(qRouteEl, {
      attributes: true
    });
  }
  document1[addEventListener_s]("visibilitychange", () => document1.visibilityState === "hidden" && flush());
  document1[addEventListener_s](`q${symbol_s}`, (_event) => {
    var event = _event, detail = event.detail, symbolRequestTime = detail.reqTime, symbolDeliveredTime = event.timeStamp, symbol = detail[symbol_s];
    if (!existingSymbols.has(symbol)) {
      existingSymbols.add(symbol);
      var route = qRouteEl?.[getAttribute_s](`q:${route_s}`) || "/";
      qSymbols.push({
        [symbol_s]: symbol,
        [route_s]: route,
        delay: round(0 - lastReqTime + symbolRequestTime),
        latency: round(symbolDeliveredTime - symbolRequestTime),
        timeline: round(0 - qRouteChangeTime + symbolRequestTime),
        interaction: !!detail.element
      });
      lastReqTime = symbolDeliveredTime;
      debounceFlush();
    }
  });
  window1[addEventListener_s](error_s, (event) => {
    var error = event[error_s];
    if (!(error && typeof error === "object")) {
      return;
    }
    var payload = {
      url: `${location1}`,
      [manifestHash_s]: manifestHash,
      timestamp: (/* @__PURE__ */ new Date()).getTime(),
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      [message_s]: event[message_s],
      [error_s]: message_s in error ? error[message_s] : `${error}`,
      [stack_s]: stack_s in error ? error[stack_s] || "" : ""
    };
    navigator1[sendBeacon_s](`${postUrl}${error_s}/`, JSON_stringify(payload));
  });
})(window, document, location, navigator, performance, Math.round, JSON.stringify));
const Insights = qwik.component$(({ publicApiKey, postUrl }) => {
  if (!publicApiKey) {
    return null;
  }
  return (
    // the script will set the variables before the qinit event
    /* @__PURE__ */ jsxRuntime.jsx("script", {
      "document:onQInit$": insightsPing,
      dangerouslySetInnerHTML: `__QI_KEY__=${JSON.stringify(publicApiKey)};__QI_URL__=${JSON.stringify(postUrl || `https://insights.qwik.dev/api/v1/${publicApiKey}/post/`)}`
    })
  );
});
const untypedAppUrl = function appUrl(route, params, paramsPrefix = "") {
  const path = route.split("/");
  for (let i = 0; i < path.length; i++) {
    const segment = path[i];
    if (segment.startsWith("[") && segment.endsWith("]")) {
      const isSpread = segment.startsWith("[...");
      const key = segment.substring(segment.startsWith("[...") ? 4 : 1, segment.length - 1);
      const value = params ? params[paramsPrefix + key] || params[key] : "";
      path[i] = isSpread ? value : encodeURIComponent(value);
    }
    if (segment.startsWith("(") && segment.endsWith(")")) {
      path.splice(i, 1);
    }
  }
  let url = path.join("/");
  let baseURL = "/";
  if (baseURL) {
    if (!baseURL.endsWith("/")) {
      baseURL += "/";
    }
    while (url.startsWith("/")) {
      url = url.substring(1);
    }
    url = baseURL + url;
  }
  return url;
};
function omitProps(obj, keys) {
  const omittedObj = {};
  for (const key in obj) {
    if (!key.startsWith("param:") && !keys.includes(key)) {
      omittedObj[key] = obj[key];
    }
  }
  return omittedObj;
}
const json = `function runQwikJsonDebug(t,s,e){const n=()=>{const n=JSON.parse(s.querySelector('script[type="qwik/json"]').textContent),r=s.querySelector('script[q\\\\:func="qwik/json"]')?.qFuncs||[],o=e(s,n,r);t.qwikJson=o,console.log(o)};s.querySelector('script[type="qwik/json"]')?n():s.addEventListener("DOMContentLoaded",n)}function qwikJsonDebug(t,s,e){class n{constructor(t,s=[]){this.__id=t,this.__backRefs=s}}class r extends n{constructor(t,s){super(t),this.__id=t,this.__value=s}}class o extends n{constructor(t,s){super(t),this.__id=t,this.__value=s}}class i extends n{constructor(t,s){super(t),this.__id=t,this.__value=s}}class c extends n{constructor(t){super(t),this.__id=t}}class l extends n{constructor(t){super(t),this.__id=t}}class a extends Array{constructor(t){super(),this.__backRefs=[],this.__id=t}}class u extends n{constructor(t,s,e,n){super(t),this.__id=t,this.flags=s,this.index=e,this.obj=n}}class p{constructor(t,s){this.event=t,this.qrl=s}}class f{constructor(){this.element=null,this.props=null,this.componentQrl=null,this.listeners=[],this.seq=[],this.tasks=null,this.contexts=null,this.scopeIds=null}}class h{constructor(t,s,e){this.element=t,this.refMap=s,this.listeners=e}}class d extends n{constructor(t,s){super(t),this.__id=t,this.qrl=s}}class _ extends n{constructor(t,s,e){super(t),this.__id=t,this.id=s,this.prop=e}}class b extends n{constructor(t,s,e){super(t),this.__id=t,this.fn=s,this.args=e}}class w extends n{constructor(t,s,e,n){super(t),this.__id=t,this.chunk=s,this.symbol=e,this.capture=n}}const k=function(){const s=new Map,e=t.createTreeWalker(t.firstElementChild,NodeFilter.SHOW_COMMENT|NodeFilter.SHOW_ELEMENT);for(let t=e.firstChild();null!==t;t=e.nextNode()){const e=E(t);e&&s.set(e,t)}return s}(),y={},x={},g=[];return s.objs.forEach((t,s)=>m(s,null)),Object.keys(s.ctx).forEach(t=>function(t){const e=s.ctx[t],n=x[t]=new f,r=n.element=k.get(t)||null;if(q(r)){const e=O(s.refs[t]," ",t=>m(t,r));n.listeners=j(e,r)}else if(N(r)){const t=new Map;r.textContent.split(" ").forEach(s=>{const[e,n]=s.split("=");t.set(e,n)});const s=t.get("q:sstyle");s&&(n.scopeIds=s.split("|"))}if(e.h){const[t,s]=e.h.split(" ").map(t=>t?m(t,n):null);n.componentQrl=t,n.props=s}if(e.c){const t=n.contexts=new Map;for(const s of e.c.split(" ")){const[e,r]=s.split("=");t.set(e,m(r,n))}}e.s&&(n.seq=e.s.split(" ").map(t=>m(C(t),n)));e.w&&(n.tasks=e.w.split(" ").map(t=>m(C(t),n)))}(t)),Object.keys(s.refs).forEach(t=>function(t){const e=s.refs[t],n=k.get(t)||null;if(q(n)){const s=O(e," ",t=>m(t,n)),r=j(s,n);y[t]=new h(n,s,r)}}(t)),s.subs,{refs:y,ctx:x,objs:g,subs:[]};function m(t,n){if("string"==typeof t){if(t.startsWith("#")){const s=k.get(t.substring(1));return s.__backRefs||(s.__backRefs=[]),-1===s.__backRefs.indexOf(n)&&s.__backRefs.push(n),s}const s=C(t);if(isNaN(s))throw new Error("Invalid index: "+t);t=s}for(;g.length<t;)g.push(null);let p=g[t];if(!p){const f=s.objs[t];let h=f;if("number"==typeof h)p=new r(t,h);else if("boolean"==typeof h)p=new o(t,h);else if(void 0===h)p=new c(t);else if("object"==typeof h){p=Array.isArray(h)?new a(t):new l(t);for(const t in h)Object.prototype.hasOwnProperty.call(h,t)&&(p[t]=m(C(h[t]),p))}else{if("string"!=typeof f)throw new Error("Unexpected type: "+JSON.stringify(f));{const s=f.substring(1);switch(f.charCodeAt(0)){case 1:h=new c(t);break;case 2:const[r,o,...l]=s.split(/[#[\\]\\s]/);p=new w(t,r,o,l.map(t=>m(C(t),n)));break;case 3:const[a,k,y]=s.split(" "),x=[1&C(a)?"Visible":"",2&C(a)?"Task":"",4&C(a)?"Resource":"",8&C(a)?"Computed":"",16&C(a)?"Dirty":"",32&C(a)?"Cleanup":""].filter(Boolean).join("|");p=new u(t,x,C(k),m(y,n));break;case 18:p=m(s,n);break;case 17:const g=s.split(" "),E=e[C(g.pop().substring(1))];p=new b(t,E,g.map(t=>m(t,n)));break;case 5:p=new URL(s),p.__id=t,p.__backRefs=[];break;case 16:p=new d(t,s);break;case 19:const[q,N]=s.split(" ");p=new _(t,q,N);break;case 4:case 6:case 22:case 7:case 14:case 21:case 20:case 23:case 24:case 25:case 26:case 15:throw new Error("Not Implemented: "+f.charCodeAt(0).toString(16)+" "+JSON.stringify(f));default:p=new i(t,f)}}}g[t]=p}return n&&p&&-1===p.__backRefs.indexOf(n)&&p.__backRefs.push(n),p}function E(t){if(q(t))return t.getAttribute("q:id");if(N(t)){const s=t.nodeValue||"";if(s.startsWith("t="))return s.substring(2);if(s.startsWith("qv ")){const t=s.split(" ");for(let s=0;s<t.length;s++){const e=t[s];if(e.startsWith("q:id="))return e.substring(5)}}return null}throw new Error("Unexpected node type: "+t.nodeType)}function q(t){return t&&"object"==typeof t&&t.nodeType===Node.ELEMENT_NODE}function N(t){return t&&"object"==typeof t&&t.nodeType===Node.COMMENT_NODE}function O(t,s,e){return t?t.split(s).map(e):[]}function j(t,s){const e=s.attributes,n=[];for(let s=0;s<e.length;s++){const{name:r,value:o}=e.item(s);if(r.startsWith("on:")||r.startsWith("on-window:")||r.startsWith("on-document:")){const s=o.split("\\n");for(const e of s){const[s,o,i]=e.split(/[#[\\]]/),c=new w(-1,s,o,(i||"").split(" ").map(s=>t[parseInt(s,10)]));n.push(new p(r,c))}}}return n}function C(t){return parseInt(t,36)}}runQwikJsonDebug(window,document,qwikJsonDebug)`;
exports.InsightSymbol = InsightSymbol;
exports.Insights = Insights;
exports.InsightsError = InsightsError;
exports.InsightsPayload = InsightsPayload;
exports.devtoolsJsonSRC = json;
exports.omitProps = omitProps;
exports.untypedAppUrl = untypedAppUrl;
