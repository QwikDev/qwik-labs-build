import { jsx } from "@builder.io/qwik/jsx-runtime";
import { sync$, component$ } from "@builder.io/qwik";
import { z } from "zod";
const InsightsError = /* @__PURE__ */ z.object({
  manifestHash: z.string(),
  url: z.string(),
  timestamp: z.number(),
  source: z.string(),
  line: z.number(),
  column: z.number(),
  message: z.string(),
  error: z.string(),
  stack: z.string()
});
const InsightSymbol = /* @__PURE__ */ z.object({
  symbol: z.string(),
  route: z.string(),
  delay: z.number(),
  latency: z.number(),
  timeline: z.number(),
  interaction: z.boolean()
});
const InsightsPayload = /* @__PURE__ */ z.object({
  qVersion: z.string(),
  manifestHash: z.string(),
  publicApiKey: z.string(),
  // we retain nullable for older clients
  previousSymbol: z.string().optional().nullable(),
  symbols: z.array(InsightSymbol)
});
InsightSymbol._type;
InsightsPayload._type;
InsightsError._type;
const insightsPing = sync$(() => ((window1, document1, location1, navigator1, performance1, round, JSON_stringify) => {
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
const Insights = component$(({ publicApiKey, postUrl }) => {
  if (!publicApiKey) {
    return null;
  }
  return (
    // the script will set the variables before the qinit event
    /* @__PURE__ */ jsx("script", {
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
function runQwikJsonDebug(window2, document2, debug) {
  const parseQwikJSON = () => {
    const rawData = JSON.parse(document2.querySelector('script[type="qwik/json"]').textContent);
    const derivedFns = document2.querySelector('script[q\\:func="qwik/json"]')?.qFuncs || [];
    const debugData = debug(document2, rawData, derivedFns);
    window2.qwikJson = debugData;
    console.log(debugData);
  };
  if (document2.querySelector('script[type="qwik/json"]')) {
    parseQwikJSON();
  } else {
    document2.addEventListener("DOMContentLoaded", parseQwikJSON);
  }
}
function qwikJsonDebug(document2, qwikJson, derivedFns) {
  class Base {
    constructor(__id, __backRefs = []) {
      this.__id = __id;
      this.__backRefs = __backRefs;
    }
  }
  class number_ extends Base {
    constructor(__id, __value) {
      super(__id), this.__id = __id, this.__value = __value;
    }
  }
  class boolean_ extends Base {
    constructor(__id, __value) {
      super(__id), this.__id = __id, this.__value = __value;
    }
  }
  class string_ extends Base {
    constructor(__id, __value) {
      super(__id), this.__id = __id, this.__value = __value;
    }
  }
  class undefined_ extends Base {
    constructor(__id) {
      super(__id), this.__id = __id;
    }
  }
  class Object_ extends Base {
    constructor(__id) {
      super(__id), this.__id = __id;
    }
  }
  class Array_ extends Array {
    constructor(__id) {
      super();
      this.__backRefs = [];
      this.__id = __id;
    }
  }
  class Task extends Base {
    constructor(__id, flags, index, obj) {
      super(__id), this.__id = __id, this.flags = flags, this.index = index, this.obj = obj;
    }
  }
  class Listener {
    constructor(event, qrl) {
      this.event = event;
      this.qrl = qrl;
    }
  }
  class QContext {
    constructor() {
      this.element = null;
      this.props = null;
      this.componentQrl = null;
      this.listeners = [];
      this.seq = [];
      this.tasks = null;
      this.contexts = null;
      this.scopeIds = null;
    }
  }
  class QRefs {
    constructor(element, refMap, listeners) {
      this.element = element;
      this.refMap = refMap;
      this.listeners = listeners;
    }
  }
  class Component extends Base {
    constructor(__id, qrl) {
      super(__id), this.__id = __id, this.qrl = qrl;
    }
  }
  class SignalWrapper extends Base {
    constructor(__id, id, prop) {
      super(__id), this.__id = __id, this.id = id, this.prop = prop;
    }
  }
  class DerivedSignal extends Base {
    constructor(__id, fn, args) {
      super(__id), this.__id = __id, this.fn = fn, this.args = args;
    }
  }
  class QRL extends Base {
    constructor(__id, chunk, symbol, capture) {
      super(__id), this.__id = __id, this.chunk = chunk, this.symbol = symbol, this.capture = capture;
    }
  }
  const nodeMap = getNodeMap();
  const refs = {};
  const contexts = {};
  const objs = [];
  const subs = [];
  qwikJson.objs.forEach((_, idx) => getObject(idx, null));
  Object.keys(qwikJson.ctx).forEach((idx) => getContext(idx));
  Object.keys(qwikJson.refs).forEach((idx) => getRef(idx));
  qwikJson.subs;
  return {
    refs,
    ctx: contexts,
    objs,
    subs
  };
  function getContext(idx) {
    const rawCtx = qwikJson.ctx[idx];
    const ctx = contexts[idx] = new QContext();
    const node = ctx.element = nodeMap.get(idx) || null;
    if (isElement(node)) {
      const rawRefs = qwikJson.refs[idx];
      const refMap = splitParse(rawRefs, " ", (id) => getObject(id, node));
      ctx.listeners = getDomListeners(refMap, node);
    } else if (isComment(node)) {
      const attrs = /* @__PURE__ */ new Map();
      node.textContent.split(" ").forEach((keyValue) => {
        const [key, value] = keyValue.split("=");
        attrs.set(key, value);
      });
      const sstyle = attrs.get("q:sstyle");
      if (sstyle) {
        ctx.scopeIds = sstyle.split("|");
      }
    }
    if (rawCtx.h) {
      const [qrl, props] = rawCtx.h.split(" ").map((h) => h ? getObject(h, ctx) : null);
      ctx.componentQrl = qrl;
      ctx.props = props;
    }
    if (rawCtx.c) {
      const contexts2 = ctx.contexts = /* @__PURE__ */ new Map();
      for (const part of rawCtx.c.split(" ")) {
        const [key, value] = part.split("=");
        contexts2.set(key, getObject(value, ctx));
      }
    }
    if (rawCtx.s) {
      ctx.seq = rawCtx.s.split(" ").map((s) => getObject(parseNumber(s), ctx));
    }
    if (rawCtx.w) {
      ctx.tasks = rawCtx.w.split(" ").map((s) => getObject(parseNumber(s), ctx));
    }
  }
  function getRef(idx) {
    const rawRefs = qwikJson.refs[idx];
    const node = nodeMap.get(idx) || null;
    if (isElement(node)) {
      const refMap = splitParse(rawRefs, " ", (id) => getObject(id, node));
      const listeners = getDomListeners(refMap, node);
      refs[idx] = new QRefs(node, refMap, listeners);
    }
  }
  function getObject(idx, parent) {
    if (typeof idx == "string") {
      if (idx.startsWith("#")) {
        const node = nodeMap.get(idx.substring(1));
        if (!node.__backRefs) {
          node.__backRefs = [];
        }
        if (node.__backRefs.indexOf(parent) === -1) {
          node.__backRefs.push(parent);
        }
        return node;
      }
      const num = parseNumber(idx);
      if (isNaN(num)) {
        throw new Error("Invalid index: " + idx);
      }
      idx = num;
    }
    while (objs.length < idx) {
      objs.push(null);
    }
    let obj = objs[idx];
    if (!obj) {
      const rawValue = qwikJson.objs[idx];
      let value = rawValue;
      if (typeof value === "number") {
        obj = new number_(idx, value);
      } else if (typeof value === "boolean") {
        obj = new boolean_(idx, value);
      } else if (typeof value === "undefined") {
        obj = new undefined_(idx);
      } else if (typeof value === "object") {
        obj = Array.isArray(value) ? new Array_(idx) : new Object_(idx);
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            obj[key] = getObject(parseNumber(value[key]), obj);
          }
        }
      } else if (typeof rawValue === "string") {
        const data = rawValue.substring(1);
        switch (rawValue.charCodeAt(0)) {
          case 1:
            value = new undefined_(idx);
            break;
          case 2:
            const [chunk, symbol, ...capture] = data.split(/[#[\]\s]/);
            obj = new QRL(idx, chunk, symbol, capture.map((id2) => getObject(parseNumber(id2), parent)));
            break;
          case 3:
            const [flags, index, objId] = data.split(" ");
            const flagString = [
              parseNumber(flags) & 1 << 0 ? "Visible" : "",
              parseNumber(flags) & 1 << 1 ? "Task" : "",
              parseNumber(flags) & 1 << 2 ? "Resource" : "",
              parseNumber(flags) & 1 << 3 ? "Computed" : "",
              parseNumber(flags) & 1 << 4 ? "Dirty" : "",
              parseNumber(flags) & 1 << 5 ? "Cleanup" : ""
            ].filter(Boolean).join("|");
            obj = new Task(idx, flagString, parseNumber(index), getObject(objId, parent));
            break;
          case 18:
            obj = getObject(data, parent);
            break;
          case 17:
            const fnParts = data.split(" ");
            const fn = derivedFns[parseNumber(fnParts.pop().substring(1))];
            obj = new DerivedSignal(idx, fn, fnParts.map((id2) => getObject(id2, parent)));
            break;
          case 5:
            obj = new URL(data);
            obj.__id = idx;
            obj.__backRefs = [];
            break;
          case 16:
            obj = new Component(idx, data);
            break;
          case 19:
            const [id, prop] = data.split(" ");
            obj = new SignalWrapper(idx, id, prop);
            break;
          case 4:
          case 6:
          case 22:
          case 7:
          case 14:
          case 21:
          case 20:
          case 23:
          case 24:
          case 25:
          case 26:
          case 15:
            throw new Error("Not Implemented: " + rawValue.charCodeAt(0).toString(16) + " " + JSON.stringify(rawValue));
          // console.error((value = 'Not Implemented: ' + rawValue.charCodeAt(0)));
          // break;
          default:
            obj = new string_(idx, rawValue);
        }
      } else {
        throw new Error("Unexpected type: " + JSON.stringify(rawValue));
      }
      objs[idx] = obj;
    }
    if (parent && obj && obj.__backRefs.indexOf(parent) === -1) {
      obj.__backRefs.push(parent);
    }
    return obj;
  }
  function getNodeMap() {
    const map = /* @__PURE__ */ new Map();
    const walker = document2.createTreeWalker(document2.firstElementChild, NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT);
    for (let node = walker.firstChild(); node !== null; node = walker.nextNode()) {
      const id = getId(node);
      id && map.set(id, node);
    }
    return map;
  }
  function getId(node) {
    if (isElement(node)) {
      return node.getAttribute("q:id");
    } else if (isComment(node)) {
      const text = node.nodeValue || "";
      if (text.startsWith("t=")) {
        return text.substring(2);
      } else if (text.startsWith("qv ")) {
        const parts = text.split(" ");
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (part.startsWith("q:id=")) {
            return part.substring(5);
          }
        }
      }
      return null;
    } else {
      throw new Error("Unexpected node type: " + node.nodeType);
    }
  }
  function isElement(node) {
    return node && typeof node == "object" && node.nodeType === Node.ELEMENT_NODE;
  }
  function isComment(node) {
    return node && typeof node == "object" && node.nodeType === Node.COMMENT_NODE;
  }
  function splitParse(text, sep, fn) {
    if (!text) {
      return [];
    }
    return text.split(sep).map(fn);
  }
  function getDomListeners(refMap, containerEl) {
    const attributes = containerEl.attributes;
    const listeners = [];
    for (let i = 0; i < attributes.length; i++) {
      const { name, value } = attributes.item(i);
      if (name.startsWith("on:") || name.startsWith("on-window:") || name.startsWith("on-document:")) {
        const urls = value.split("\n");
        for (const url of urls) {
          const [chunk, symbol, capture] = url.split(/[#[\]]/);
          const qrl = new QRL(-1, chunk, symbol, (capture || "").split(" ").map((id) => refMap[parseInt(id, 10)]));
          listeners.push(new Listener(name, qrl));
        }
      }
    }
    return listeners;
  }
  function parseNumber(value) {
    return parseInt(value, 36);
  }
}
const devtoolsJsonSRC = `${runQwikJsonDebug}
${qwikJsonDebug}
runQwikJsonDebug(window, document, qwikJsonDebug);`;
export {
  InsightSymbol,
  Insights,
  InsightsError,
  InsightsPayload,
  devtoolsJsonSRC,
  omitProps,
  untypedAppUrl
};
