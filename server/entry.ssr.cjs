"use strict";
const isServer = true;
/**
 * @license
 * @builder.io/qwik 1.1.5
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
const isNode$1 = (value) => value && "number" == typeof value.nodeType;
const isDocument = (value) => 9 === value.nodeType;
const isElement$1 = (value) => 1 === value.nodeType;
const isQwikElement = (value) => {
  const nodeType = value.nodeType;
  return 1 === nodeType || 111 === nodeType;
};
const isNodeElement = (value) => {
  const nodeType = value.nodeType;
  return 1 === nodeType || 111 === nodeType || 3 === nodeType;
};
const isVirtualElement = (value) => 111 === value.nodeType;
const isText = (value) => 3 === value.nodeType;
const isComment = (value) => 8 === value.nodeType;
const logError = (message, ...optionalParams) => {
  const err = message instanceof Error ? message : createError(message);
  return console.error("%cQWIK ERROR", "", err.stack || err.message, ...printParams(optionalParams)), err;
};
const createError = (message) => new Error(message);
const logErrorAndStop = (message, ...optionalParams) => logError(message, ...optionalParams);
const logWarn = () => {
};
const printParams = (optionalParams) => optionalParams;
const qError = (code, ...parts) => {
  const text = codeToText(code);
  return logErrorAndStop(text, ...parts);
};
const codeToText = (code) => `Code(${code})`;
const createPlatform$1 = () => ({
  isServer,
  importSymbol(containerEl, url, symbolName) {
    {
      const hash = getSymbolHash$1(symbolName);
      const regSym = globalThis.__qwik_reg_symbols?.get(hash);
      if (regSym) {
        return regSym;
      }
    }
    if (!url) {
      throw qError(31, symbolName);
    }
    if (!containerEl) {
      throw qError(30, url, symbolName);
    }
    const urlDoc = toUrl(containerEl.ownerDocument, containerEl, url).toString();
    const urlCopy = new URL(urlDoc);
    urlCopy.hash = "", urlCopy.search = "";
    return import(urlCopy.href).then((mod) => mod[symbolName]);
  },
  raf: (fn) => new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve(fn());
    });
  }),
  nextTick: (fn) => new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    });
  }),
  chunkForSymbol: (symbolName, chunk) => [symbolName, chunk ?? "_"]
});
const toUrl = (doc, containerEl, url) => {
  const baseURI = doc.baseURI;
  const base = new URL(containerEl.getAttribute("q:base") ?? baseURI, baseURI);
  return new URL(url, base);
};
let _platform = /* @__PURE__ */ createPlatform$1();
const setPlatform = (plt) => _platform = plt;
const getPlatform = () => _platform;
const isServerPlatform = () => _platform.isServer;
function assertDefined() {
}
function assertEqual() {
}
function assertTrue() {
}
function assertString() {
}
function assertQwikElement() {
}
function assertElement() {
}
const isSerializableObject = (v) => {
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || null === proto;
};
const isObject = (v) => v && "object" == typeof v;
const isArray = (v) => Array.isArray(v);
const isString = (v) => "string" == typeof v;
const isFunction = (v) => "function" == typeof v;
const isPromise = (value) => value instanceof Promise;
const safeCall = (call, thenFn, rejectFn) => {
  try {
    const promise = call();
    return isPromise(promise) ? promise.then(thenFn, rejectFn) : thenFn(promise);
  } catch (e) {
    return rejectFn(e);
  }
};
const then = (promise, thenFn) => isPromise(promise) ? promise.then(thenFn) : thenFn(promise);
const promiseAll = (promises) => promises.some(isPromise) ? Promise.all(promises) : promises;
const promiseAllLazy = (promises) => promises.length > 0 ? Promise.all(promises) : promises;
const isNotNullable = (v) => null != v;
const delay = (timeout) => new Promise((resolve) => {
  setTimeout(resolve, timeout);
});
const EMPTY_ARRAY = [];
const EMPTY_OBJ = {};
const getDocument = (node) => {
  if ("undefined" != typeof document) {
    return document;
  }
  if (9 === node.nodeType) {
    return node;
  }
  const doc = node.ownerDocument;
  return doc;
};
const QSlot = "q:slot";
const QStyle = "q:style";
const fromCamelToKebabCase = (text) => text.replace(/([A-Z])/g, "-$1").toLowerCase();
const directSetAttribute = (el, prop, value) => el.setAttribute(prop, value);
const directGetAttribute = (el, prop) => el.getAttribute(prop);
const CONTAINER_STATE = Symbol("ContainerState");
const _getContainerState = (containerEl) => {
  let set = containerEl[CONTAINER_STATE];
  return set || (containerEl[CONTAINER_STATE] = set = createContainerState(containerEl, directGetAttribute(containerEl, "q:base") ?? "/")), set;
};
const createContainerState = (containerEl, base) => {
  const containerState = {
    $containerEl$: containerEl,
    $elementIndex$: 0,
    $styleMoved$: false,
    $proxyMap$: /* @__PURE__ */ new WeakMap(),
    $opsNext$: /* @__PURE__ */ new Set(),
    $watchNext$: /* @__PURE__ */ new Set(),
    $watchStaging$: /* @__PURE__ */ new Set(),
    $hostsNext$: /* @__PURE__ */ new Set(),
    $hostsStaging$: /* @__PURE__ */ new Set(),
    $styleIds$: /* @__PURE__ */ new Set(),
    $events$: /* @__PURE__ */ new Set(),
    $serverData$: {},
    $base$: base,
    $renderPromise$: void 0,
    $hostsRendering$: void 0,
    $pauseCtx$: void 0,
    $subsManager$: null
  };
  return containerState.$subsManager$ = createSubscriptionManager(containerState), containerState;
};
const setRef = (value, elm) => {
  if (isFunction(value)) {
    return value(elm);
  }
  if (isObject(value) && "value" in value) {
    return value.value = elm;
  }
  throw qError(32, value);
};
const intToStr = (nu) => nu.toString(36);
const strToInt = (nu) => parseInt(nu, 36);
const getEventName = (attribute) => {
  const colonPos = attribute.indexOf(":");
  return attribute ? attribute.slice(colonPos + 1).replace(/-./g, (x) => x[1].toUpperCase()) : attribute;
};
const ON_PROP_REGEX = /^(on|window:|document:)/;
const PREVENT_DEFAULT = "preventdefault:";
const isOnProp = (prop) => prop.endsWith("$") && ON_PROP_REGEX.test(prop);
const groupListeners = (listeners) => {
  if (0 === listeners.length) {
    return EMPTY_ARRAY;
  }
  if (1 === listeners.length) {
    const listener = listeners[0];
    return [[listener[0], [listener[1]]]];
  }
  const keys = [];
  for (let i = 0; i < listeners.length; i++) {
    const eventName = listeners[i][0];
    keys.includes(eventName) || keys.push(eventName);
  }
  return keys.map((eventName) => [eventName, listeners.filter((l) => l[0] === eventName).map((a) => a[1])]);
};
const setEvent = (existingListeners, prop, input, containerEl) => {
  if (assertTrue(prop.endsWith("$")), prop = normalizeOnProp(prop.slice(0, -1)), input) {
    if (isArray(input)) {
      const processed = input.flat(1 / 0).filter((q) => null != q).map((q) => [prop, ensureQrl(q, containerEl)]);
      existingListeners.push(...processed);
    } else {
      existingListeners.push([prop, ensureQrl(input, containerEl)]);
    }
  }
  return prop;
};
const PREFIXES = ["on", "window:on", "document:on"];
const SCOPED = ["on", "on-window", "on-document"];
const normalizeOnProp = (prop) => {
  let scope = "on";
  for (let i = 0; i < PREFIXES.length; i++) {
    const prefix = PREFIXES[i];
    if (prop.startsWith(prefix)) {
      scope = SCOPED[i], prop = prop.slice(prefix.length);
      break;
    }
  }
  return scope + ":" + (prop = prop.startsWith("-") ? fromCamelToKebabCase(prop.slice(1)) : prop.toLowerCase());
};
const ensureQrl = (value, containerEl) => (value.$setContainer$(containerEl), value);
const getDomListeners = (elCtx, containerEl) => {
  const attributes = elCtx.$element$.attributes;
  const listeners = [];
  for (let i = 0; i < attributes.length; i++) {
    const { name, value } = attributes.item(i);
    if (name.startsWith("on:") || name.startsWith("on-window:") || name.startsWith("on-document:")) {
      const urls = value.split("\n");
      for (const url of urls) {
        const qrl = parseQRL(url, containerEl);
        qrl.$capture$ && inflateQrl(qrl, elCtx), listeners.push([name, qrl]);
      }
    }
  }
  return listeners;
};
function isElement(value) {
  return isNode(value) && 1 === value.nodeType;
}
function isNode(value) {
  return value && "number" == typeof value.nodeType;
}
const QOjectTargetSymbol = Symbol("proxy target");
const QObjectFlagsSymbol = Symbol("proxy flags");
const QObjectManagerSymbol = Symbol("proxy manager");
const _IMMUTABLE = Symbol("IMMUTABLE");
const serializeDerivedSignalFunc = (signal) => {
  const fnBody = signal.$funcStr$;
  let args = "";
  for (let i = 0; i < signal.$args$.length; i++) {
    args += `p${i},`;
  }
  return `(${args})=>(${fnBody})`;
};
var _a$1;
const QObjectSignalFlags = Symbol("proxy manager");
const SignalUnassignedException = Symbol("unassigned signal");
class SignalBase {
}
class SignalImpl extends SignalBase {
  constructor(v, manager, flags) {
    super(), this[_a$1] = 0, this.untrackedValue = v, this[QObjectManagerSymbol] = manager, this[QObjectSignalFlags] = flags;
  }
  valueOf() {
  }
  toString() {
    return `[Signal ${String(this.value)}]`;
  }
  toJSON() {
    return {
      value: this.value
    };
  }
  get value() {
    if (2 & this[QObjectSignalFlags]) {
      throw SignalUnassignedException;
    }
    const sub = tryGetInvokeContext()?.$subscriber$;
    return sub && this[QObjectManagerSymbol].$addSub$(sub), this.untrackedValue;
  }
  set value(v) {
    const manager = this[QObjectManagerSymbol];
    manager && this.untrackedValue !== v && (this.untrackedValue = v, manager.$notifySubs$());
  }
}
_a$1 = QObjectSignalFlags;
class SignalDerived extends SignalBase {
  constructor($func$, $args$, $funcStr$) {
    super(), this.$func$ = $func$, this.$args$ = $args$, this.$funcStr$ = $funcStr$;
  }
  get value() {
    return this.$func$.apply(void 0, this.$args$);
  }
}
class SignalWrapper extends SignalBase {
  constructor(ref, prop) {
    super(), this.ref = ref, this.prop = prop;
  }
  get [QObjectManagerSymbol]() {
    return getProxyManager(this.ref);
  }
  get value() {
    return this.ref[this.prop];
  }
  set value(value) {
    this.ref[this.prop] = value;
  }
}
const isSignal = (obj) => obj instanceof SignalBase;
const getOrCreateProxy = (target, containerState, flags = 0) => {
  const proxy = containerState.$proxyMap$.get(target);
  return proxy || (0 !== flags && setObjectFlags(target, flags), createProxy(target, containerState, void 0));
};
const createProxy = (target, containerState, subs) => {
  assertEqual(unwrapProxy(target)), assertTrue(!containerState.$proxyMap$.has(target));
  const manager = containerState.$subsManager$.$createManager$(subs);
  const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager));
  return containerState.$proxyMap$.set(target, proxy), proxy;
};
const createPropsState = () => {
  const props = {};
  return setObjectFlags(props, 2), props;
};
const setObjectFlags = (obj, flags) => {
  Object.defineProperty(obj, QObjectFlagsSymbol, {
    value: flags,
    enumerable: false
  });
};
class ReadWriteProxyHandler {
  constructor($containerState$, $manager$) {
    this.$containerState$ = $containerState$, this.$manager$ = $manager$;
  }
  deleteProperty(target, prop) {
    if (2 & target[QObjectFlagsSymbol]) {
      throw qError(17);
    }
    return "string" == typeof prop && delete target[prop] && (this.$manager$.$notifySubs$(isArray(target) ? void 0 : prop), true);
  }
  get(target, prop) {
    if ("symbol" == typeof prop) {
      return prop === QOjectTargetSymbol ? target : prop === QObjectManagerSymbol ? this.$manager$ : target[prop];
    }
    const flags = target[QObjectFlagsSymbol] ?? 0;
    const invokeCtx = tryGetInvokeContext();
    const recursive = 0 != (1 & flags);
    const hiddenSignal = target["$$" + prop];
    let subscriber;
    let value;
    if (invokeCtx && (subscriber = invokeCtx.$subscriber$), !(0 != (2 & flags)) || prop in target && !immutableValue(target[_IMMUTABLE]?.[prop]) || (subscriber = null), hiddenSignal ? (value = hiddenSignal.value, subscriber = null) : value = target[prop], subscriber) {
      const isA = isArray(target);
      this.$manager$.$addSub$(subscriber, isA ? void 0 : prop);
    }
    return recursive ? wrap(value, this.$containerState$) : value;
  }
  set(target, prop, newValue) {
    if ("symbol" == typeof prop) {
      return target[prop] = newValue, true;
    }
    const flags = target[QObjectFlagsSymbol] ?? 0;
    if (0 != (2 & flags)) {
      throw qError(17);
    }
    const unwrappedNewValue = 0 != (1 & flags) ? unwrapProxy(newValue) : newValue;
    if (isArray(target)) {
      return target[prop] = unwrappedNewValue, this.$manager$.$notifySubs$(), true;
    }
    const oldValue = target[prop];
    return target[prop] = unwrappedNewValue, oldValue !== unwrappedNewValue && this.$manager$.$notifySubs$(prop), true;
  }
  has(target, property) {
    if (property === QOjectTargetSymbol) {
      return true;
    }
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    return !!hasOwnProperty.call(target, property) || !("string" != typeof property || !hasOwnProperty.call(target, "$$" + property));
  }
  ownKeys(target) {
    const flags = target[QObjectFlagsSymbol] ?? 0;
    if (!(0 != (2 & flags))) {
      let subscriber = null;
      const invokeCtx = tryGetInvokeContext();
      invokeCtx && (subscriber = invokeCtx.$subscriber$), subscriber && this.$manager$.$addSub$(subscriber);
    }
    return isArray(target) ? Reflect.ownKeys(target) : Reflect.ownKeys(target).map((a) => "string" == typeof a && a.startsWith("$$") ? a.slice(2) : a);
  }
  getOwnPropertyDescriptor(target, prop) {
    return isArray(target) || "symbol" == typeof prop ? Object.getOwnPropertyDescriptor(target, prop) : {
      enumerable: true,
      configurable: true
    };
  }
}
const immutableValue = (value) => value === _IMMUTABLE || isSignal(value);
const wrap = (value, containerState) => {
  if (isObject(value)) {
    if (Object.isFrozen(value)) {
      return value;
    }
    const nakedValue = unwrapProxy(value);
    if (nakedValue !== value) {
      return value;
    }
    if (fastSkipSerialize(nakedValue)) {
      return value;
    }
    if (isSerializableObject(nakedValue) || isArray(nakedValue)) {
      const proxy = containerState.$proxyMap$.get(nakedValue);
      return proxy || getOrCreateProxy(nakedValue, containerState, 1);
    }
  }
  return value;
};
const Q_CTX = "_qc_";
const tryGetContext = (element) => element[Q_CTX];
const getContext = (el, containerState) => {
  const ctx = tryGetContext(el);
  if (ctx) {
    return ctx;
  }
  const elCtx = createContext(el);
  const elementID = directGetAttribute(el, "q:id");
  if (elementID) {
    const pauseCtx = containerState.$pauseCtx$;
    if (elCtx.$id$ = elementID, pauseCtx) {
      const { getObject, meta, refs } = pauseCtx;
      if (isElement(el)) {
        const refMap = refs[elementID];
        refMap && (assertTrue(isElement(el)), elCtx.$refMap$ = refMap.split(" ").map(getObject), elCtx.li = getDomListeners(elCtx, containerState.$containerEl$));
      } else {
        const styleIds = el.getAttribute("q:sstyle");
        elCtx.$scopeIds$ = styleIds ? styleIds.split("|") : null;
        const ctxMeta = meta[elementID];
        if (ctxMeta) {
          const seq = ctxMeta.s;
          const host = ctxMeta.h;
          const contexts = ctxMeta.c;
          const watches = ctxMeta.w;
          if (seq && (elCtx.$seq$ = seq.split(" ").map(getObject)), watches && (elCtx.$watches$ = watches.split(" ").map(getObject)), contexts) {
            elCtx.$contexts$ = /* @__PURE__ */ new Map();
            for (const part of contexts.split(" ")) {
              const [key, value] = part.split("=");
              elCtx.$contexts$.set(key, getObject(value));
            }
          }
          if (host) {
            const [renderQrl, props] = host.split(" ");
            if (elCtx.$flags$ = 4, renderQrl && (elCtx.$componentQrl$ = getObject(renderQrl)), props) {
              const propsObj = getObject(props);
              elCtx.$props$ = propsObj, setObjectFlags(propsObj, 2), propsObj[_IMMUTABLE] = getImmutableFromProps(propsObj);
            } else {
              elCtx.$props$ = createProxy(createPropsState(), containerState);
            }
          }
        }
      }
    }
  }
  return elCtx;
};
const getImmutableFromProps = (props) => {
  const immutable = {};
  const target = getProxyTarget(props);
  for (const key in target) {
    key.startsWith("$$") && (immutable[key.slice(2)] = target[key]);
  }
  return immutable;
};
const createContext = (element) => {
  const ctx = {
    $flags$: 0,
    $id$: "",
    $element$: element,
    $refMap$: [],
    li: [],
    $watches$: null,
    $seq$: null,
    $slots$: null,
    $scopeIds$: null,
    $appendStyles$: null,
    $props$: null,
    $vdom$: null,
    $componentQrl$: null,
    $contexts$: null,
    $dynamicSlots$: null,
    $parent$: null,
    $slotParent$: null
  };
  return element[Q_CTX] = ctx, ctx;
};
const cleanupContext = (elCtx, subsManager) => {
  elCtx.$watches$?.forEach((watch) => {
    subsManager.$clearSub$(watch), destroyWatch(watch);
  }), elCtx.$componentQrl$ = null, elCtx.$seq$ = null, elCtx.$watches$ = null;
};
let _context;
const tryGetInvokeContext = () => {
  if (!_context) {
    const context = "undefined" != typeof document && document && document.__q_context__;
    if (!context) {
      return;
    }
    return isArray(context) ? document.__q_context__ = newInvokeContextFromTuple(context) : context;
  }
  return _context;
};
function invoke(context, fn, ...args) {
  const previousContext = _context;
  let returnValue;
  try {
    _context = context, returnValue = fn.apply(this, args);
  } finally {
    _context = previousContext;
  }
  return returnValue;
}
const newInvokeContextFromTuple = (context) => {
  const element = context[0];
  const container = element.closest("[q\\:container]");
  const locale = container?.getAttribute("q:locale") || void 0;
  return newInvokeContext(locale, void 0, element, context[1], context[2]);
};
const newInvokeContext = (locale, hostElement, element, event, url) => {
  const ctx = {
    $seq$: 0,
    $hostElement$: hostElement,
    $element$: element,
    $event$: event,
    $url$: url,
    $locale$: locale,
    $qrl$: void 0,
    $renderCtx$: void 0,
    $subscriber$: void 0,
    $waitOn$: void 0
  };
  return ctx;
};
const untrack = (fn) => invoke(void 0, fn);
const trackInvocation = /* @__PURE__ */ newInvokeContext(void 0, void 0, void 0, "qRender");
const trackSignal = (signal, sub) => (trackInvocation.$subscriber$ = sub, invoke(trackInvocation, () => signal.value));
const SkipRender = Symbol("skip render");
const SSRRaw = () => null;
const InternalSSRStream = () => null;
const setAttribute = (staticCtx, el, prop, value) => {
  staticCtx.$operations$.push({
    $operation$: _setAttribute,
    $args$: [el, prop, value]
  });
};
const _setAttribute = (el, prop, value) => {
  if (null == value || false === value) {
    el.removeAttribute(prop);
  } else {
    const str = true === value ? "" : String(value);
    directSetAttribute(el, prop, str);
  }
};
const setProperty = (staticCtx, node, key, value) => {
  staticCtx.$operations$.push({
    $operation$: _setProperty,
    $args$: [node, key, value]
  });
};
const _setProperty = (node, key, value) => {
  try {
    node[key] = null == value ? "" : value, null == value && isNode$1(node) && isElement$1(node) && node.removeAttribute(key);
  } catch (err) {
    logError(codeToText(6), {
      node,
      key,
      value
    }, err);
  }
};
const createElement = (doc, expectTag, isSvg) => isSvg ? doc.createElementNS(SVG_NS, expectTag) : doc.createElement(expectTag);
const insertBefore = (staticCtx, parent, newChild, refChild) => (staticCtx.$operations$.push({
  $operation$: directInsertBefore,
  $args$: [parent, newChild, refChild || null]
}), newChild);
const insertAfter = (staticCtx, parent, newChild, refChild) => (staticCtx.$operations$.push({
  $operation$: directInsertAfter,
  $args$: [parent, newChild, refChild || null]
}), newChild);
const appendChild = (staticCtx, parent, newChild) => (staticCtx.$operations$.push({
  $operation$: directAppendChild,
  $args$: [parent, newChild]
}), newChild);
const appendHeadStyle = (staticCtx, styleTask) => {
  staticCtx.$containerState$.$styleIds$.add(styleTask.styleId), staticCtx.$postOperations$.push({
    $operation$: _appendHeadStyle,
    $args$: [staticCtx.$containerState$.$containerEl$, styleTask]
  });
};
const _appendHeadStyle = (containerEl, styleTask) => {
  const doc = getDocument(containerEl);
  const isDoc = doc.documentElement === containerEl;
  const headEl = doc.head;
  const style = doc.createElement("style");
  directSetAttribute(style, QStyle, styleTask.styleId), directSetAttribute(style, "hidden", ""), style.textContent = styleTask.content, isDoc && headEl ? directAppendChild(headEl, style) : directInsertBefore(containerEl, style, containerEl.firstChild);
};
const prepend = (staticCtx, parent, newChild) => {
  staticCtx.$operations$.push({
    $operation$: directPrepend,
    $args$: [parent, newChild]
  });
};
const directPrepend = (parent, newChild) => {
  directInsertBefore(parent, newChild, parent.firstChild);
};
const removeNode = (staticCtx, el) => {
  if (isQwikElement(el)) {
    cleanupTree(el, staticCtx, staticCtx.$containerState$.$subsManager$, true);
  }
  staticCtx.$operations$.push({
    $operation$: _removeNode,
    $args$: [el, staticCtx]
  });
};
const _removeNode = (el) => {
  const parent = el.parentElement;
  parent && directRemoveChild(parent, el);
};
const createTemplate = (doc, slotName) => {
  const template = createElement(doc, "q:template", false);
  return directSetAttribute(template, QSlot, slotName), directSetAttribute(template, "hidden", ""), directSetAttribute(template, "aria-hidden", "true"), template;
};
const executeDOMRender = (staticCtx) => {
  for (const op of staticCtx.$operations$) {
    op.$operation$.apply(void 0, op.$args$);
  }
  resolveSlotProjection(staticCtx);
};
const getKey = (el) => directGetAttribute(el, "q:key");
const resolveSlotProjection = (staticCtx) => {
  const subsManager = staticCtx.$containerState$.$subsManager$;
  for (const slotEl of staticCtx.$rmSlots$) {
    const key = getKey(slotEl);
    const slotChildren = getChildren(slotEl, isChildComponent);
    if (slotChildren.length > 0) {
      const sref = slotEl.getAttribute("q:sref");
      const hostCtx = staticCtx.$roots$.find((r) => r.$id$ === sref);
      if (hostCtx) {
        const hostElm = hostCtx.$element$;
        if (hostElm.isConnected) {
          if (getChildren(hostElm, isSlotTemplate).some((node) => directGetAttribute(node, QSlot) === key)) {
            cleanupTree(slotEl, staticCtx, subsManager, false);
          } else {
            const template = createTemplate(staticCtx.$doc$, key);
            for (const child of slotChildren) {
              directAppendChild(template, child);
            }
            directInsertBefore(hostElm, template, hostElm.firstChild);
          }
        } else {
          cleanupTree(slotEl, staticCtx, subsManager, false);
        }
      } else {
        cleanupTree(slotEl, staticCtx, subsManager, false);
      }
    }
  }
  for (const [slotEl, hostElm] of staticCtx.$addSlots$) {
    const key = getKey(slotEl);
    const template = getChildren(hostElm, isSlotTemplate).find((node) => node.getAttribute(QSlot) === key);
    template && (getChildren(template, isChildComponent).forEach((child) => {
      directAppendChild(slotEl, child);
    }), template.remove());
  }
};
const printRenderStats = () => {
};
const newVirtualElement = (doc, isSvg) => {
  const open = doc.createComment("qv ");
  const close = doc.createComment("/qv");
  return new VirtualElementImpl(open, close, isSvg);
};
const parseVirtualAttributes = (str) => {
  if (!str) {
    return {};
  }
  const attributes = str.split(" ");
  return Object.fromEntries(attributes.map((attr) => {
    const index = attr.indexOf("=");
    return index >= 0 ? [attr.slice(0, index), unescape(attr.slice(index + 1))] : [attr, ""];
  }));
};
const serializeVirtualAttributes = (map) => {
  const attributes = [];
  return Object.entries(map).forEach(([key, value]) => {
    attributes.push(value ? `${key}=${escape(value)}` : `${key}`);
  }), attributes.join(" ");
};
const walkerVirtualByAttribute = (el, prop, value) => el.ownerDocument.createTreeWalker(el, 128, {
  acceptNode(c) {
    const virtual = getVirtualElement(c);
    return virtual && directGetAttribute(virtual, prop) === value ? 1 : 2;
  }
});
const queryAllVirtualByAttribute = (el, prop, value) => {
  const walker = walkerVirtualByAttribute(el, prop, value);
  const pars = [];
  let currentNode = null;
  for (; currentNode = walker.nextNode(); ) {
    pars.push(getVirtualElement(currentNode));
  }
  return pars;
};
const escape = (s) => s.replace(/ /g, "+");
const unescape = (s) => s.replace(/\+/g, " ");
const VIRTUAL = ":virtual";
class VirtualElementImpl {
  constructor(open, close, isSvg) {
    this.open = open, this.close = close, this.isSvg = isSvg, this._qc_ = null, this.nodeType = 111, this.localName = VIRTUAL, this.nodeName = VIRTUAL;
    const doc = this.ownerDocument = open.ownerDocument;
    this.$template$ = createElement(doc, "template", false), this.$attributes$ = parseVirtualAttributes(open.data.slice(3)), assertTrue(open.data.startsWith("qv ")), open.__virtual = this;
  }
  insertBefore(node, ref) {
    const parent = this.parentElement;
    if (parent) {
      parent.insertBefore(node, ref || this.close);
    } else {
      this.$template$.insertBefore(node, ref);
    }
    return node;
  }
  remove() {
    const parent = this.parentElement;
    if (parent) {
      const ch = this.childNodes;
      assertEqual(this.$template$.childElementCount), parent.removeChild(this.open), this.$template$.append(...ch), parent.removeChild(this.close);
    }
  }
  appendChild(node) {
    return this.insertBefore(node, null);
  }
  insertBeforeTo(newParent, child) {
    const ch = this.childNodes;
    newParent.insertBefore(this.open, child);
    for (const c of ch) {
      newParent.insertBefore(c, child);
    }
    newParent.insertBefore(this.close, child), assertEqual(this.$template$.childElementCount);
  }
  appendTo(newParent) {
    this.insertBeforeTo(newParent, null);
  }
  get namespaceURI() {
    return this.parentElement?.namespaceURI ?? "";
  }
  removeChild(child) {
    this.parentElement ? this.parentElement.removeChild(child) : this.$template$.removeChild(child);
  }
  getAttribute(prop) {
    return this.$attributes$[prop] ?? null;
  }
  hasAttribute(prop) {
    return prop in this.$attributes$;
  }
  setAttribute(prop, value) {
    this.$attributes$[prop] = value, this.open.data = updateComment(this.$attributes$);
  }
  removeAttribute(prop) {
    delete this.$attributes$[prop], this.open.data = updateComment(this.$attributes$);
  }
  matches(_) {
    return false;
  }
  compareDocumentPosition(other) {
    return this.open.compareDocumentPosition(other);
  }
  closest(query) {
    const parent = this.parentElement;
    return parent ? parent.closest(query) : null;
  }
  querySelectorAll(query) {
    const result = [];
    return getChildren(this, isNodeElement).forEach((el) => {
      isQwikElement(el) && (el.matches(query) && result.push(el), result.concat(Array.from(el.querySelectorAll(query))));
    }), result;
  }
  querySelector(query) {
    for (const el of this.childNodes) {
      if (isElement$1(el)) {
        if (el.matches(query)) {
          return el;
        }
        const v = el.querySelector(query);
        if (null !== v) {
          return v;
        }
      }
    }
    return null;
  }
  get innerHTML() {
    return "";
  }
  set innerHTML(html) {
    const parent = this.parentElement;
    parent ? (this.childNodes.forEach((a) => this.removeChild(a)), this.$template$.innerHTML = html, parent.insertBefore(this.$template$.content, this.close)) : this.$template$.innerHTML = html;
  }
  get firstChild() {
    if (this.parentElement) {
      const first = this.open.nextSibling;
      return first === this.close ? null : first;
    }
    return this.$template$.firstChild;
  }
  get nextSibling() {
    return this.close.nextSibling;
  }
  get previousSibling() {
    return this.open.previousSibling;
  }
  get childNodes() {
    if (!this.parentElement) {
      return Array.from(this.$template$.childNodes);
    }
    const nodes = [];
    let node = this.open;
    for (; (node = node.nextSibling) && node !== this.close; ) {
      nodes.push(node);
    }
    return nodes;
  }
  get isConnected() {
    return this.open.isConnected;
  }
  get parentElement() {
    return this.open.parentElement;
  }
}
const updateComment = (attributes) => `qv ${serializeVirtualAttributes(attributes)}`;
const processVirtualNodes = (node) => {
  if (null == node) {
    return null;
  }
  if (isComment(node)) {
    const virtual = getVirtualElement(node);
    if (virtual) {
      return virtual;
    }
  }
  return node;
};
const getVirtualElement = (open) => {
  const virtual = open.__virtual;
  if (virtual) {
    return virtual;
  }
  if (open.data.startsWith("qv ")) {
    const close = findClose(open);
    return new VirtualElementImpl(open, close, open.parentElement?.namespaceURI === SVG_NS);
  }
  return null;
};
const findClose = (open) => {
  let node = open.nextSibling;
  let stack = 1;
  for (; node; ) {
    if (isComment(node)) {
      if (node.data.startsWith("qv ")) {
        stack++;
      } else if ("/qv" === node.data && (stack--, 0 === stack)) {
        return node;
      }
    }
    node = node.nextSibling;
  }
};
const getRootNode = (node) => null == node ? null : isVirtualElement(node) ? node.open : node;
const createContextId = (name) => /* @__PURE__ */ Object.freeze({
  id: fromCamelToKebabCase(name)
});
const resolveContext = (context, hostCtx, containerState) => {
  const contextID = context.id;
  if (hostCtx) {
    let hostElement = hostCtx.$element$;
    let ctx = hostCtx.$slotParent$ ?? hostCtx.$parent$;
    for (; ctx; ) {
      if (hostElement = ctx.$element$, ctx.$contexts$) {
        const found = ctx.$contexts$.get(contextID);
        if (found) {
          return found;
        }
        if (true === ctx.$contexts$.get("_")) {
          break;
        }
      }
      ctx = ctx.$slotParent$ ?? ctx.$parent$;
    }
    if (hostElement.closest) {
      const value = queryContextFromDom(hostElement, containerState, contextID);
      if (void 0 !== value) {
        return value;
      }
    }
  }
};
const queryContextFromDom = (hostElement, containerState, contextId) => {
  let element = hostElement;
  for (; element; ) {
    let node = element;
    let virtual;
    for (; node && (virtual = findVirtual(node)); ) {
      const contexts = getContext(virtual, containerState)?.$contexts$;
      if (contexts && contexts.has(contextId)) {
        return contexts.get(contextId);
      }
      node = virtual;
    }
    element = element.parentElement;
  }
};
const findVirtual = (el) => {
  let node = el;
  let stack = 1;
  for (; node = node.previousSibling; ) {
    if (isComment(node)) {
      if ("/qv" === node.data) {
        stack++;
      } else if (node.data.startsWith("qv ") && (stack--, 0 === stack)) {
        return getVirtualElement(node);
      }
    }
  }
  return null;
};
const ERROR_CONTEXT = /* @__PURE__ */ createContextId("qk-error");
const handleError = (err, hostElement, rCtx) => {
  const elCtx = tryGetContext(hostElement);
  if (isServerPlatform()) {
    throw err;
  }
  {
    const errorStore = resolveContext(ERROR_CONTEXT, elCtx, rCtx.$static$.$containerState$);
    if (void 0 === errorStore) {
      throw err;
    }
    errorStore.error = err;
  }
};
const executeComponent = (rCtx, elCtx) => {
  elCtx.$flags$ &= -2, elCtx.$flags$ |= 4, elCtx.$slots$ = [], elCtx.li.length = 0;
  const hostElement = elCtx.$element$;
  const componentQRL = elCtx.$componentQrl$;
  const props = elCtx.$props$;
  const newCtx = pushRenderContext(rCtx);
  const iCtx = newInvokeContext(rCtx.$static$.$locale$, hostElement, void 0, "qRender");
  const waitOn = iCtx.$waitOn$ = [];
  newCtx.$cmpCtx$ = elCtx, newCtx.$slotCtx$ = null, iCtx.$subscriber$ = [0, hostElement], iCtx.$renderCtx$ = rCtx, componentQRL.$setContainer$(rCtx.$static$.$containerState$.$containerEl$);
  const componentFn = componentQRL.getFn(iCtx);
  return safeCall(() => componentFn(props), (jsxNode) => waitOn.length > 0 ? Promise.all(waitOn).then(() => 1 & elCtx.$flags$ ? executeComponent(rCtx, elCtx) : {
    node: jsxNode,
    rCtx: newCtx
  }) : 1 & elCtx.$flags$ ? executeComponent(rCtx, elCtx) : {
    node: jsxNode,
    rCtx: newCtx
  }, (err) => err === SignalUnassignedException ? Promise.all(waitOn).then(() => executeComponent(rCtx, elCtx)) : (handleError(err, hostElement, rCtx), {
    node: SkipRender,
    rCtx: newCtx
  }));
};
const createRenderContext = (doc, containerState) => {
  const ctx = {
    $static$: {
      $doc$: doc,
      $locale$: containerState.$serverData$.locale,
      $containerState$: containerState,
      $hostElements$: /* @__PURE__ */ new Set(),
      $operations$: [],
      $postOperations$: [],
      $roots$: [],
      $addSlots$: [],
      $rmSlots$: [],
      $visited$: []
    },
    $cmpCtx$: null,
    $slotCtx$: null
  };
  return ctx;
};
const pushRenderContext = (ctx) => ({
  $static$: ctx.$static$,
  $cmpCtx$: ctx.$cmpCtx$,
  $slotCtx$: ctx.$slotCtx$
});
const serializeClassWithHost = (obj, hostCtx) => hostCtx && hostCtx.$scopeIds$ ? hostCtx.$scopeIds$.join(" ") + " " + serializeClass(obj) : serializeClass(obj);
const serializeClass = (obj) => obj ? isString(obj) ? obj.trim() : isArray(obj) ? obj.reduce((result, o) => {
  const classList = serializeClass(o);
  return classList ? result ? `${result} ${classList}` : classList : result;
}, "") : Object.entries(obj).reduce((result, [key, value]) => value ? result ? `${result} ${key.trim()}` : key.trim() : result, "") : "";
const stringifyStyle = (obj) => {
  if (null == obj) {
    return "";
  }
  if ("object" == typeof obj) {
    if (isArray(obj)) {
      throw qError(0, obj, "style");
    }
    {
      const chunks = [];
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (null != value) {
            const normalizedKey = key.startsWith("--") ? key : fromCamelToKebabCase(key);
            chunks.push(normalizedKey + ":" + value);
          }
        }
      }
      return chunks.join(";");
    }
  }
  return String(obj);
};
const getNextIndex = (ctx) => intToStr(ctx.$static$.$containerState$.$elementIndex$++);
const setQId = (rCtx, elCtx) => {
  const id = getNextIndex(rCtx);
  elCtx.$id$ = id;
};
const jsxToString = (data) => isSignal(data) ? jsxToString(data.value) : null == data || "boolean" == typeof data ? "" : String(data);
function isAriaAttribute(prop) {
  return prop.startsWith("aria-");
}
const shouldWrapFunctional = (res, node) => !!node.key && (!isJSXNode(res) || !isFunction(res.type) && res.key != node.key);
const dangerouslySetInnerHTML = "dangerouslySetInnerHTML";
const serializeSStyle = (scopeIds) => {
  const value = scopeIds.join("|");
  if (value.length > 0) {
    return value;
  }
};
var _a;
const FLUSH_COMMENT = "<!--qkssr-f-->";
class MockElement {
  constructor(nodeType) {
    this.nodeType = nodeType, this[_a] = null;
  }
}
_a = Q_CTX;
const _renderSSR = async (node, opts) => {
  const root = opts.containerTagName;
  const containerEl = createSSRContext(1).$element$;
  const containerState = createContainerState(containerEl, opts.base ?? "/");
  containerState.$serverData$.locale = opts.serverData?.locale;
  const doc = new MockElement(9);
  const rCtx = createRenderContext(doc, containerState);
  const headNodes = opts.beforeContent ?? [];
  const ssrCtx = {
    $static$: {
      $contexts$: [],
      $headNodes$: "html" === root ? headNodes : [],
      $locale$: opts.serverData?.locale,
      $textNodes$: /* @__PURE__ */ new Map()
    },
    $projectedChildren$: void 0,
    $projectedCtxs$: void 0,
    $invocationContext$: void 0
  };
  let qRender = "ssr";
  opts.containerAttributes["q:render"] && (qRender = `${opts.containerAttributes["q:render"]}-${qRender}`);
  const containerAttributes = {
    ...opts.containerAttributes,
    "q:container": "paused",
    "q:version": "1.1.5",
    "q:render": qRender,
    "q:base": opts.base,
    "q:locale": opts.serverData?.locale
  };
  const children = "html" === root ? [node] : [headNodes, node];
  "html" !== root && (containerAttributes.class = "qc📦" + (containerAttributes.class ? " " + containerAttributes.class : "")), opts.serverData && (containerState.$serverData$ = opts.serverData), node = _jsxQ(root, null, containerAttributes, children, 3, null), containerState.$hostsRendering$ = /* @__PURE__ */ new Set(), await Promise.resolve().then(() => renderRoot$1(node, rCtx, ssrCtx, opts.stream, containerState, opts));
};
const renderRoot$1 = async (node, rCtx, ssrCtx, stream, containerState, opts) => {
  const beforeClose = opts.beforeClose;
  return await renderNode(node, rCtx, ssrCtx, stream, 0, beforeClose ? (stream2) => {
    const result = beforeClose(ssrCtx.$static$.$contexts$, containerState, false, ssrCtx.$static$.$textNodes$);
    return processData$1(result, rCtx, ssrCtx, stream2, 0, void 0);
  } : void 0), rCtx;
};
const renderGenerator = async (node, rCtx, ssrCtx, stream, flags) => {
  stream.write(FLUSH_COMMENT);
  const generator = node.props.children;
  let value;
  if (isFunction(generator)) {
    const v = generator({
      write(chunk) {
        stream.write(chunk), stream.write(FLUSH_COMMENT);
      }
    });
    if (isPromise(v)) {
      return v;
    }
    value = v;
  } else {
    value = generator;
  }
  for await (const chunk of value) {
    await processData$1(chunk, rCtx, ssrCtx, stream, flags, void 0), stream.write(FLUSH_COMMENT);
  }
};
const renderNodeVirtual = (node, elCtx, extraNodes, rCtx, ssrCtx, stream, flags, beforeClose) => {
  const props = node.props;
  const renderQrl = props["q:renderFn"];
  if (renderQrl) {
    return elCtx.$componentQrl$ = renderQrl, renderSSRComponent(rCtx, ssrCtx, stream, elCtx, node, flags, beforeClose);
  }
  let virtualComment = "<!--qv" + renderVirtualAttributes(props);
  const isSlot = "q:s" in props;
  const key = null != node.key ? String(node.key) : null;
  isSlot && (assertDefined(rCtx.$cmpCtx$?.$id$), virtualComment += " q:sref=" + rCtx.$cmpCtx$.$id$), null != key && (virtualComment += " q:key=" + key), virtualComment += "-->", stream.write(virtualComment);
  const html = node.props[dangerouslySetInnerHTML];
  if (html) {
    return stream.write(html), void stream.write(CLOSE_VIRTUAL);
  }
  if (extraNodes) {
    for (const node2 of extraNodes) {
      renderNodeElementSync(node2.type, node2.props, stream);
    }
  }
  const promise = walkChildren(node.children, rCtx, ssrCtx, stream, flags);
  return then(promise, () => {
    if (!isSlot && !beforeClose) {
      return void stream.write(CLOSE_VIRTUAL);
    }
    let promise2;
    if (isSlot) {
      const content = ssrCtx.$projectedChildren$?.[key];
      if (content) {
        const [rCtx2, sCtx] = ssrCtx.$projectedCtxs$;
        const newSlotRctx = pushRenderContext(rCtx2);
        newSlotRctx.$slotCtx$ = elCtx, ssrCtx.$projectedChildren$[key] = void 0, promise2 = processData$1(content, newSlotRctx, sCtx, stream, flags);
      }
    }
    return beforeClose && (promise2 = then(promise2, () => beforeClose(stream))), then(promise2, () => {
      stream.write(CLOSE_VIRTUAL);
    });
  });
};
const CLOSE_VIRTUAL = "<!--/qv-->";
const renderAttributes = (attributes) => {
  let text = "";
  for (const prop in attributes) {
    if (prop === dangerouslySetInnerHTML) {
      continue;
    }
    const value = attributes[prop];
    null != value && (text += " " + ("" === value ? prop : prop + '="' + value + '"'));
  }
  return text;
};
const renderVirtualAttributes = (attributes) => {
  let text = "";
  for (const prop in attributes) {
    if ("children" === prop || prop === dangerouslySetInnerHTML) {
      continue;
    }
    const value = attributes[prop];
    null != value && (text += " " + ("" === value ? prop : prop + "=" + value));
  }
  return text;
};
const renderNodeElementSync = (tagName, attributes, stream) => {
  stream.write("<" + tagName + renderAttributes(attributes) + ">");
  if (!!emptyElements[tagName]) {
    return;
  }
  const innerHTML = attributes[dangerouslySetInnerHTML];
  null != innerHTML && stream.write(innerHTML), stream.write(`</${tagName}>`);
};
const renderSSRComponent = (rCtx, ssrCtx, stream, elCtx, node, flags, beforeClose) => (setComponentProps$1(rCtx, elCtx, node.props.props), then(executeComponent(rCtx, elCtx), (res) => {
  const hostElement = elCtx.$element$;
  const newRCtx = res.rCtx;
  const iCtx = newInvokeContext(ssrCtx.$static$.$locale$, hostElement, void 0);
  iCtx.$subscriber$ = [0, hostElement], iCtx.$renderCtx$ = newRCtx;
  const newSSrContext = {
    $static$: ssrCtx.$static$,
    $projectedChildren$: splitProjectedChildren(node.children, ssrCtx),
    $projectedCtxs$: [rCtx, ssrCtx],
    $invocationContext$: iCtx
  };
  const extraNodes = [];
  if (elCtx.$appendStyles$) {
    const array = !!(4 & flags) ? ssrCtx.$static$.$headNodes$ : extraNodes;
    for (const style of elCtx.$appendStyles$) {
      array.push(_jsxQ("style", {
        [QStyle]: style.styleId,
        [dangerouslySetInnerHTML]: style.content,
        hidden: ""
      }, null, null, 0, null));
    }
  }
  const newID = getNextIndex(rCtx);
  const scopeId = elCtx.$scopeIds$ ? serializeSStyle(elCtx.$scopeIds$) : void 0;
  const processedNode = _jsxC(node.type, {
    "q:sstyle": scopeId,
    "q:id": newID,
    children: res.node
  }, 0, node.key);
  return elCtx.$id$ = newID, ssrCtx.$static$.$contexts$.push(elCtx), renderNodeVirtual(processedNode, elCtx, extraNodes, newRCtx, newSSrContext, stream, flags, (stream2) => {
    if (2 & elCtx.$flags$) {
      const placeholderCtx = createSSRContext(1);
      const listeners = placeholderCtx.li;
      listeners.push(...elCtx.li), elCtx.$flags$ &= -3, placeholderCtx.$id$ = getNextIndex(rCtx);
      const attributes = {
        type: "placeholder",
        hidden: "",
        "q:id": placeholderCtx.$id$
      };
      ssrCtx.$static$.$contexts$.push(placeholderCtx);
      const groups = groupListeners(listeners);
      for (const listener of groups) {
        const eventName = normalizeInvisibleEvents(listener[0]);
        attributes[eventName] = serializeQRLs(listener[1], placeholderCtx), registerQwikEvent$1(eventName, rCtx.$static$.$containerState$);
      }
      renderNodeElementSync("script", attributes, stream2);
    }
    return beforeClose ? then(renderQTemplates(rCtx, newSSrContext, ssrCtx, stream2), () => beforeClose(stream2)) : renderQTemplates(rCtx, newSSrContext, ssrCtx, stream2);
  });
}));
const renderQTemplates = (rCtx, ssrCtx, parentSSRCtx, stream) => {
  const projectedChildren = ssrCtx.$projectedChildren$;
  if (projectedChildren) {
    const nodes = Object.keys(projectedChildren).map((slotName) => {
      const value = projectedChildren[slotName];
      if (value) {
        return _jsxQ("q:template", {
          [QSlot]: slotName,
          hidden: "",
          "aria-hidden": "true"
        }, null, value, 0, null);
      }
    });
    return processData$1(nodes, rCtx, parentSSRCtx, stream, 0, void 0);
  }
};
const splitProjectedChildren = (children, ssrCtx) => {
  const flatChildren = flatVirtualChildren(children, ssrCtx);
  if (null === flatChildren) {
    return;
  }
  const slotMap = {};
  for (const child of flatChildren) {
    let slotName = "";
    isJSXNode(child) && (slotName = child.props[QSlot] ?? "");
    let array = slotMap[slotName];
    array || (slotMap[slotName] = array = []), array.push(child);
  }
  return slotMap;
};
const createSSRContext = (nodeType) => {
  const elm = new MockElement(nodeType);
  return createContext(elm);
};
const renderNode = (node, rCtx, ssrCtx, stream, flags, beforeClose) => {
  const tagName = node.type;
  const hostCtx = rCtx.$cmpCtx$;
  if ("string" == typeof tagName) {
    const key = node.key;
    const props = node.props;
    const immutable = node.immutableProps;
    const elCtx = createSSRContext(1);
    const elm = elCtx.$element$;
    const isHead = "head" === tagName;
    let openingElement = "<" + tagName;
    let useSignal = false;
    let hasRef = false;
    let classStr = "";
    let htmlStr = null;
    if (immutable) {
      for (const prop in immutable) {
        let value = immutable[prop];
        if (isOnProp(prop)) {
          setEvent(elCtx.li, prop, value, void 0);
          continue;
        }
        const attrName = processPropKey(prop);
        if (isSignal(value) && (value = trackSignal(value, [1, elm, value, hostCtx.$element$, attrName]), useSignal = true), prop === dangerouslySetInnerHTML) {
          htmlStr = value;
          continue;
        }
        prop.startsWith(PREVENT_DEFAULT) && registerQwikEvent$1(prop.slice(15), rCtx.$static$.$containerState$);
        const attrValue = processPropValue(attrName, value);
        null != attrValue && ("class" === attrName ? classStr = attrValue : "value" === attrName && "textarea" === tagName ? htmlStr = escapeHtml(attrValue) : isSSRUnsafeAttr(attrName) || (openingElement += " " + ("" === value ? attrName : attrName + '="' + escapeAttr(attrValue) + '"')));
      }
    }
    for (const prop in props) {
      let value = props[prop];
      if ("ref" === prop) {
        void 0 !== value && (setRef(value, elm), hasRef = true);
        continue;
      }
      if (isOnProp(prop)) {
        setEvent(elCtx.li, prop, value, void 0);
        continue;
      }
      const attrName = processPropKey(prop);
      if (isSignal(value) && (value = trackSignal(value, [2, hostCtx.$element$, value, elm, attrName]), useSignal = true), prop === dangerouslySetInnerHTML) {
        htmlStr = value;
        continue;
      }
      prop.startsWith(PREVENT_DEFAULT) && registerQwikEvent$1(prop.slice(15), rCtx.$static$.$containerState$);
      const attrValue = processPropValue(attrName, value);
      null != attrValue && ("class" === attrName ? classStr = attrValue : "value" === attrName && "textarea" === tagName ? htmlStr = escapeHtml(attrValue) : isSSRUnsafeAttr(attrName) || (openingElement += " " + ("" === value ? attrName : attrName + '="' + escapeAttr(attrValue) + '"')));
    }
    const listeners = elCtx.li;
    if (hostCtx) {
      if (hostCtx.$scopeIds$?.length) {
        const extra = hostCtx.$scopeIds$.join(" ");
        classStr = classStr ? `${extra} ${classStr}` : extra;
      }
      2 & hostCtx.$flags$ && (listeners.push(...hostCtx.li), hostCtx.$flags$ &= -3);
    }
    if (isHead && (flags |= 1), tagName in invisibleElements && (flags |= 16), tagName in textOnlyElements && (flags |= 8), classStr && (openingElement += ' class="' + escapeAttr(classStr) + '"'), listeners.length > 0) {
      const groups = groupListeners(listeners);
      const isInvisible = 0 != (16 & flags);
      for (const listener of groups) {
        const eventName = isInvisible ? normalizeInvisibleEvents(listener[0]) : listener[0];
        openingElement += " " + eventName + '="' + serializeQRLs(listener[1], elCtx) + '"', registerQwikEvent$1(eventName, rCtx.$static$.$containerState$);
      }
    }
    if (null != key && (openingElement += ' q:key="' + escapeAttr(key) + '"'), hasRef || useSignal || listeners.length > 0) {
      if (hasRef || useSignal || listenersNeedId(listeners)) {
        const newID = getNextIndex(rCtx);
        openingElement += ' q:id="' + newID + '"', elCtx.$id$ = newID;
      }
      ssrCtx.$static$.$contexts$.push(elCtx);
    }
    if (1 & flags && (openingElement += " q:head"), openingElement += ">", stream.write(openingElement), tagName in emptyElements) {
      return;
    }
    if (null != htmlStr) {
      return stream.write(String(htmlStr)), void stream.write(`</${tagName}>`);
    }
    "html" === tagName ? flags |= 4 : flags &= -5, 2 & node.flags && (flags |= 1024);
    const promise = processData$1(node.children, rCtx, ssrCtx, stream, flags);
    return then(promise, () => {
      if (isHead) {
        for (const node2 of ssrCtx.$static$.$headNodes$) {
          renderNodeElementSync(node2.type, node2.props, stream);
        }
        ssrCtx.$static$.$headNodes$.length = 0;
      }
      if (beforeClose) {
        return then(beforeClose(stream), () => {
          stream.write(`</${tagName}>`);
        });
      }
      stream.write(`</${tagName}>`);
    });
  }
  if (tagName === Virtual) {
    const elCtx = createSSRContext(111);
    return elCtx.$parent$ = rCtx.$cmpCtx$, elCtx.$slotParent$ = rCtx.$slotCtx$, hostCtx && 8 & hostCtx.$flags$ && addDynamicSlot(hostCtx, elCtx), renderNodeVirtual(node, elCtx, void 0, rCtx, ssrCtx, stream, flags, beforeClose);
  }
  if (tagName === SSRRaw) {
    return void stream.write(node.props.data);
  }
  if (tagName === InternalSSRStream) {
    return renderGenerator(node, rCtx, ssrCtx, stream, flags);
  }
  const res = invoke(ssrCtx.$invocationContext$, tagName, node.props, node.key, node.flags);
  return shouldWrapFunctional(res, node) ? renderNode(_jsxC(Virtual, {
    children: res
  }, 0, node.key), rCtx, ssrCtx, stream, flags, beforeClose) : processData$1(res, rCtx, ssrCtx, stream, flags, beforeClose);
};
const processData$1 = (node, rCtx, ssrCtx, stream, flags, beforeClose) => {
  if (null != node && "boolean" != typeof node) {
    if (!isString(node) && "number" != typeof node) {
      if (isJSXNode(node)) {
        return renderNode(node, rCtx, ssrCtx, stream, flags, beforeClose);
      }
      if (isArray(node)) {
        return walkChildren(node, rCtx, ssrCtx, stream, flags);
      }
      if (isSignal(node)) {
        const insideText = 8 & flags;
        const hostEl = rCtx.$cmpCtx$?.$element$;
        let value;
        if (hostEl) {
          if (!insideText) {
            const id = getNextIndex(rCtx);
            value = trackSignal(node, 1024 & flags ? [3, "#" + id, node, "#" + id] : [4, hostEl, node, "#" + id]);
            const str = jsxToString(value);
            return ssrCtx.$static$.$textNodes$.set(str, id), void stream.write(`<!--t=${id}-->${escapeHtml(str)}<!---->`);
          }
          value = invoke(ssrCtx.$invocationContext$, () => node.value);
        }
        return void stream.write(escapeHtml(jsxToString(value)));
      }
      return isPromise(node) ? (stream.write(FLUSH_COMMENT), node.then((node2) => processData$1(node2, rCtx, ssrCtx, stream, flags, beforeClose))) : void logWarn();
    }
    stream.write(escapeHtml(String(node)));
  }
};
const walkChildren = (children, rCtx, ssrContext, stream, flags) => {
  if (null == children) {
    return;
  }
  if (!isArray(children)) {
    return processData$1(children, rCtx, ssrContext, stream, flags);
  }
  const len = children.length;
  if (1 === len) {
    return processData$1(children[0], rCtx, ssrContext, stream, flags);
  }
  if (0 === len) {
    return;
  }
  let currentIndex = 0;
  const buffers = [];
  return children.reduce((prevPromise, child, index) => {
    const buffer = [];
    buffers.push(buffer);
    const rendered = processData$1(child, rCtx, ssrContext, prevPromise ? {
      write(chunk) {
        currentIndex === index ? stream.write(chunk) : buffer.push(chunk);
      }
    } : stream, flags);
    const next = () => {
      currentIndex++, buffers.length > currentIndex && buffers[currentIndex].forEach((chunk) => stream.write(chunk));
    };
    return isPromise(rendered) && prevPromise ? Promise.all([rendered, prevPromise]).then(next) : isPromise(rendered) ? rendered.then(next) : prevPromise ? prevPromise.then(next) : void currentIndex++;
  }, void 0);
};
const flatVirtualChildren = (children, ssrCtx) => {
  if (null == children) {
    return null;
  }
  const result = _flatVirtualChildren(children, ssrCtx);
  const nodes = isArray(result) ? result : [result];
  return 0 === nodes.length ? null : nodes;
};
const _flatVirtualChildren = (children, ssrCtx) => {
  if (null == children) {
    return null;
  }
  if (isArray(children)) {
    return children.flatMap((c) => _flatVirtualChildren(c, ssrCtx));
  }
  if (isJSXNode(children) && isFunction(children.type) && children.type !== SSRRaw && children.type !== InternalSSRStream && children.type !== Virtual) {
    const res = invoke(ssrCtx.$invocationContext$, children.type, children.props, children.key, children.flags);
    return flatVirtualChildren(res, ssrCtx);
  }
  return children;
};
const setComponentProps$1 = (rCtx, elCtx, expectProps) => {
  const keys = Object.keys(expectProps);
  const target = createPropsState();
  if (elCtx.$props$ = createProxy(target, rCtx.$static$.$containerState$), 0 === keys.length) {
    return;
  }
  const immutableMeta = target[_IMMUTABLE] = expectProps[_IMMUTABLE] ?? EMPTY_OBJ;
  for (const prop of keys) {
    "children" !== prop && prop !== QSlot && (isSignal(immutableMeta[prop]) ? target["$$" + prop] = immutableMeta[prop] : target[prop] = expectProps[prop]);
  }
};
const processPropKey = (prop) => "htmlFor" === prop ? "for" : prop;
const processPropValue = (prop, value) => "class" === prop ? serializeClass(value) : "style" === prop ? stringifyStyle(value) : isAriaAttribute(prop) || "draggable" === prop || "spellcheck" === prop ? null != value ? String(value) : value : false === value || null == value ? null : true === value ? "" : String(value);
const invisibleElements = {
  head: true,
  style: true,
  script: true,
  link: true,
  meta: true
};
const textOnlyElements = {
  title: true,
  style: true,
  script: true,
  noframes: true,
  textarea: true
};
const emptyElements = {
  area: true,
  base: true,
  basefont: true,
  bgsound: true,
  br: true,
  col: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
const ESCAPE_HTML = /[&<>]/g;
const ESCAPE_ATTRIBUTES = /[&"]/g;
const registerQwikEvent$1 = (prop, containerState) => {
  containerState.$events$.add(getEventName(prop));
};
const escapeHtml = (s) => s.replace(ESCAPE_HTML, (c) => {
  switch (c) {
    case "&":
      return "&amp;";
    case "<":
      return "&lt;";
    case ">":
      return "&gt;";
    default:
      return "";
  }
});
const escapeAttr = (s) => s.replace(ESCAPE_ATTRIBUTES, (c) => {
  switch (c) {
    case "&":
      return "&amp;";
    case '"':
      return "&quot;";
    default:
      return "";
  }
});
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const isSSRUnsafeAttr = (name) => unsafeAttrCharRE.test(name);
const listenersNeedId = (listeners) => listeners.some((l) => l[1].$captureRef$ && l[1].$captureRef$.length > 0);
const addDynamicSlot = (hostCtx, elCtx) => {
  let dynamicSlots = hostCtx.$dynamicSlots$;
  dynamicSlots || (hostCtx.$dynamicSlots$ = dynamicSlots = []), dynamicSlots.includes(elCtx) || dynamicSlots.push(elCtx);
};
const normalizeInvisibleEvents = (eventName) => "on:qvisible" === eventName ? "on-document:qinit" : eventName;
const emitEvent$1 = (el, eventName, detail, bubbles) => {
  "function" == typeof CustomEvent && el && el.dispatchEvent(new CustomEvent(eventName, {
    detail,
    bubbles,
    composed: bubbles
  }));
};
const renderComponent = (rCtx, elCtx, flags) => {
  const justMounted = !(4 & elCtx.$flags$);
  const hostElement = elCtx.$element$;
  const containerState = rCtx.$static$.$containerState$;
  return containerState.$hostsStaging$.delete(elCtx), containerState.$subsManager$.$clearSub$(hostElement), then(executeComponent(rCtx, elCtx), (res) => {
    const staticCtx = rCtx.$static$;
    const newCtx = res.rCtx;
    const iCtx = newInvokeContext(rCtx.$static$.$locale$, hostElement);
    if (staticCtx.$hostElements$.add(hostElement), iCtx.$subscriber$ = [0, hostElement], iCtx.$renderCtx$ = newCtx, justMounted && elCtx.$appendStyles$) {
      for (const style of elCtx.$appendStyles$) {
        appendHeadStyle(staticCtx, style);
      }
    }
    const processedJSXNode = processData(res.node, iCtx);
    return then(processedJSXNode, (processedJSXNode2) => {
      const newVdom = wrapJSX(hostElement, processedJSXNode2);
      const oldVdom = getVdom(elCtx);
      return then(smartUpdateChildren(newCtx, oldVdom, newVdom, flags), () => {
        elCtx.$vdom$ = newVdom;
      });
    });
  });
};
const getVdom = (elCtx) => (elCtx.$vdom$ || (elCtx.$vdom$ = domToVnode(elCtx.$element$)), elCtx.$vdom$);
class ProcessedJSXNodeImpl {
  constructor($type$, $props$, $immutableProps$, $children$, $flags$, $key$) {
    this.$type$ = $type$, this.$props$ = $props$, this.$immutableProps$ = $immutableProps$, this.$children$ = $children$, this.$flags$ = $flags$, this.$key$ = $key$, this.$elm$ = null, this.$text$ = "", this.$signal$ = null, this.$id$ = $type$ + ($key$ ? ":" + $key$ : "");
  }
}
const processNode = (node, invocationContext) => {
  const { key, type, props, children, flags, immutableProps } = node;
  let textType = "";
  if (isString(type)) {
    textType = type;
  } else {
    if (type !== Virtual) {
      if (isFunction(type)) {
        const res = invoke(invocationContext, type, props, key, flags);
        return shouldWrapFunctional(res, node) ? processNode(_jsxC(Virtual, {
          children: res
        }, 0, key), invocationContext) : processData(res, invocationContext);
      }
      throw qError(25, type);
    }
    textType = VIRTUAL;
  }
  let convertedChildren = EMPTY_ARRAY;
  return null != children ? then(processData(children, invocationContext), (result) => (void 0 !== result && (convertedChildren = isArray(result) ? result : [result]), new ProcessedJSXNodeImpl(textType, props, immutableProps, convertedChildren, flags, key))) : new ProcessedJSXNodeImpl(textType, props, immutableProps, convertedChildren, flags, key);
};
const wrapJSX = (element, input) => {
  const children = void 0 === input ? EMPTY_ARRAY : isArray(input) ? input : [input];
  const node = new ProcessedJSXNodeImpl(":virtual", {}, null, children, 0, null);
  return node.$elm$ = element, node;
};
const processData = (node, invocationContext) => {
  if (null != node && "boolean" != typeof node) {
    if (isPrimitive(node)) {
      const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ, null, EMPTY_ARRAY, 0, null);
      return newNode.$text$ = String(node), newNode;
    }
    if (isJSXNode(node)) {
      return processNode(node, invocationContext);
    }
    if (isSignal(node)) {
      const newNode = new ProcessedJSXNodeImpl("#text", EMPTY_OBJ, null, EMPTY_ARRAY, 0, null);
      return newNode.$signal$ = node, newNode;
    }
    if (isArray(node)) {
      const output = promiseAll(node.flatMap((n) => processData(n, invocationContext)));
      return then(output, (array) => array.flat(100).filter(isNotNullable));
    }
    return isPromise(node) ? node.then((node2) => processData(node2, invocationContext)) : node === SkipRender ? new ProcessedJSXNodeImpl(SKIP_RENDER_TYPE, EMPTY_OBJ, null, EMPTY_ARRAY, 0, null) : void logWarn();
  }
};
const isPrimitive = (obj) => isString(obj) || "number" == typeof obj;
const resumeIfNeeded = (containerEl) => {
  "paused" === directGetAttribute(containerEl, "q:container") && (resumeContainer(containerEl), appendQwikDevTools(containerEl));
};
const getPauseState = (containerEl) => {
  const doc = getDocument(containerEl);
  const script = getQwikJSON(containerEl === doc.documentElement ? doc.body : containerEl, "type");
  if (script) {
    return JSON.parse(unescapeText(script.firstChild.data) || "{}");
  }
};
const resumeContainer = (containerEl) => {
  if (!isElement$1(el = containerEl) || !el.hasAttribute("q:container")) {
    return void logWarn();
  }
  var el;
  const pauseState = containerEl._qwikjson_ ?? getPauseState(containerEl);
  if (containerEl._qwikjson_ = null, !pauseState) {
    return void logWarn();
  }
  const doc = getDocument(containerEl);
  const parentJSON = containerEl === doc.documentElement ? doc.body : containerEl;
  const inlinedFunctions = getQwikInlinedFuncs(parentJSON);
  const containerState = _getContainerState(containerEl);
  const elements = /* @__PURE__ */ new Map();
  const text = /* @__PURE__ */ new Map();
  let node = null;
  let container = 0;
  const elementWalker = doc.createTreeWalker(containerEl, 128);
  for (; node = elementWalker.nextNode(); ) {
    const data = node.data;
    if (0 === container) {
      if (data.startsWith("qv ")) {
        const id = getID(data);
        id >= 0 && elements.set(id, node);
      } else if (data.startsWith("t=")) {
        const id = data.slice(2);
        const index = strToInt(id);
        const textNode = getTextNode(node);
        elements.set(index, textNode), text.set(index, textNode.data);
      }
    }
    "cq" === data ? container++ : "/cq" === data && container--;
  }
  const slotPath = 0 !== containerEl.getElementsByClassName("qc📦").length;
  containerEl.querySelectorAll("[q\\:id]").forEach((el2) => {
    if (slotPath && el2.closest("[q\\:container]") !== containerEl) {
      return;
    }
    const id = directGetAttribute(el2, "q:id");
    const index = strToInt(id);
    elements.set(index, el2);
  });
  const parser = createParser(containerState, doc);
  const finalized = /* @__PURE__ */ new Map();
  const revived = /* @__PURE__ */ new Set();
  const getObject = (id) => (assertTrue("string" == typeof id && id.length > 0), finalized.has(id) ? finalized.get(id) : computeObject(id));
  const computeObject = (id) => {
    if (id.startsWith("#")) {
      const elementId = id.slice(1);
      const index2 = strToInt(elementId);
      assertTrue(elements.has(index2));
      const rawElement = elements.get(index2);
      if (isComment(rawElement)) {
        if (!rawElement.isConnected) {
          return void finalized.set(id, void 0);
        }
        const close = findClose(rawElement);
        const virtual = new VirtualElementImpl(rawElement, close, rawElement.parentElement?.namespaceURI === SVG_NS);
        return finalized.set(id, virtual), getContext(virtual, containerState), virtual;
      }
      return isElement$1(rawElement) ? (finalized.set(id, rawElement), getContext(rawElement, containerState), rawElement) : (finalized.set(id, rawElement), rawElement);
    }
    if (id.startsWith("@")) {
      const funcId = id.slice(1);
      const index2 = strToInt(funcId);
      const func = inlinedFunctions[index2];
      return func;
    }
    if (id.startsWith("*")) {
      const elementId = id.slice(1);
      const index2 = strToInt(elementId);
      assertTrue(elements.has(index2));
      const str = text.get(index2);
      return finalized.set(id, str), str;
    }
    const index = strToInt(id);
    const objs = pauseState.objs;
    assertTrue(objs.length > index);
    let value = objs[index];
    isString(value) && (value = value === UNDEFINED_PREFIX ? void 0 : parser.prepare(value));
    let obj = value;
    for (let i = id.length - 1; i >= 0; i--) {
      const transform = OBJECT_TRANSFORMS[id[i]];
      if (!transform) {
        break;
      }
      obj = transform(obj, containerState);
    }
    return finalized.set(id, obj), isPrimitive(value) || revived.has(index) || (revived.add(index), reviveSubscriptions(value, index, pauseState.subs, getObject, containerState, parser), reviveNestedObjects(value, getObject, parser)), obj;
  };
  containerState.$elementIndex$ = 1e5, containerState.$pauseCtx$ = {
    getObject,
    meta: pauseState.ctx,
    refs: pauseState.refs
  }, directSetAttribute(containerEl, "q:container", "resumed"), emitEvent$1(containerEl, "qresume", void 0, true);
};
const reviveSubscriptions = (value, i, objsSubs, getObject, containerState, parser) => {
  const subs = objsSubs[i];
  if (subs) {
    const converted = [];
    let flag = 0;
    for (const sub of subs) {
      if (sub.startsWith("_")) {
        flag = parseInt(sub.slice(1), 10);
      } else {
        const parsed = parseSubscription(sub, getObject);
        parsed && converted.push(parsed);
      }
    }
    if (flag > 0 && setObjectFlags(value, flag), !parser.subs(value, converted)) {
      const proxy = containerState.$proxyMap$.get(value);
      proxy ? getProxyManager(proxy).$addSubs$(converted) : createProxy(value, containerState, converted);
    }
  }
};
const reviveNestedObjects = (obj, getObject, parser) => {
  if (!parser.fill(obj, getObject) && obj && "object" == typeof obj) {
    if (isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = getObject(obj[i]);
      }
    } else if (isSerializableObject(obj)) {
      for (const key in obj) {
        obj[key] = getObject(obj[key]);
      }
    }
  }
};
const unescapeText = (str) => str.replace(/\\x3C(\/?script)/g, "<$1");
const getQwikInlinedFuncs = (parentElm) => {
  const elm = getQwikJSON(parentElm, "q:func");
  return elm?.qFuncs ?? EMPTY_ARRAY;
};
const getQwikJSON = (parentElm, attribute) => {
  let child = parentElm.lastElementChild;
  for (; child; ) {
    if ("SCRIPT" === child.tagName && "qwik/json" === directGetAttribute(child, attribute)) {
      return child;
    }
    child = child.previousElementSibling;
  }
};
const getTextNode = (mark) => {
  const nextNode = mark.nextSibling;
  if (isText(nextNode)) {
    return nextNode;
  }
  {
    const textNode = mark.ownerDocument.createTextNode("");
    return mark.parentElement.insertBefore(textNode, mark), textNode;
  }
};
const appendQwikDevTools = (containerEl) => {
  containerEl.qwik = {
    pause: () => pauseContainer(containerEl),
    state: _getContainerState(containerEl)
  };
};
const getID = (stuff) => {
  const index = stuff.indexOf("q:id=");
  return index > 0 ? strToInt(stuff.slice(index + 5)) : -1;
};
const _jsxQ = (type, mutableProps, immutableProps, children, flags, key) => {
  const processed = null == key ? null : String(key);
  const node = new JSXNodeImpl(type, mutableProps ?? EMPTY_OBJ, immutableProps, children, flags, processed);
  return node;
};
const _jsxC = (type, mutableProps, flags, key) => {
  const processed = null == key ? null : String(key);
  const props = mutableProps ?? EMPTY_OBJ;
  const node = new JSXNodeImpl(type, props, null, props.children, flags, processed);
  return "string" == typeof type && mutableProps && delete mutableProps.children, node;
};
const jsx = (type, props, key) => {
  const processed = null == key ? null : String(key);
  const children = untrack(() => {
    const c = props.children;
    return "string" == typeof type && delete props.children, c;
  });
  isString(type) && "className" in props && (props.class = props.className, delete props.className);
  const node = new JSXNodeImpl(type, props, null, children, 0, processed);
  return node;
};
const SKIP_RENDER_TYPE = ":skipRender";
class JSXNodeImpl {
  constructor(type, props, immutableProps, children, flags, key = null) {
    this.type = type, this.props = props, this.immutableProps = immutableProps, this.children = children, this.flags = flags, this.key = key;
  }
}
const Virtual = (props) => props.children;
const isJSXNode = (n) => n instanceof JSXNodeImpl;
const Fragment = (props) => props.children;
const SVG_NS = "http://www.w3.org/2000/svg";
const CHILDREN_PLACEHOLDER = [];
const smartUpdateChildren = (ctx, oldVnode, newVnode, flags) => {
  assertQwikElement(oldVnode.$elm$);
  const ch = newVnode.$children$;
  if (1 === ch.length && ch[0].$type$ === SKIP_RENDER_TYPE) {
    return void (newVnode.$children$ = oldVnode.$children$);
  }
  const elm = oldVnode.$elm$;
  let filter = isChildComponent;
  if (oldVnode.$children$ === CHILDREN_PLACEHOLDER) {
    "HEAD" === elm.nodeName && (filter = isHeadChildren, flags |= 2);
  }
  const oldCh = getVnodeChildren(oldVnode, filter);
  return oldCh.length > 0 && ch.length > 0 ? diffChildren(ctx, elm, oldCh, ch, flags) : oldCh.length > 0 && 0 === ch.length ? removeChildren(ctx.$static$, oldCh, 0, oldCh.length - 1) : ch.length > 0 ? addChildren(ctx, elm, null, ch, 0, ch.length - 1, flags) : void 0;
};
const getVnodeChildren = (oldVnode, filter) => {
  const oldCh = oldVnode.$children$;
  return oldCh === CHILDREN_PLACEHOLDER ? oldVnode.$children$ = getChildrenVnodes(oldVnode.$elm$, filter) : oldCh;
};
const diffChildren = (ctx, parentElm, oldCh, newCh, flags) => {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  const results = [];
  const staticCtx = ctx.$static$;
  for (; oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx; ) {
    if (null == oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (null == oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (null == newStartVnode) {
      newStartVnode = newCh[++newStartIdx];
    } else if (null == newEndVnode) {
      newEndVnode = newCh[--newEndIdx];
    } else if (oldStartVnode.$id$ === newStartVnode.$id$) {
      results.push(diffVnode(ctx, oldStartVnode, newStartVnode, flags)), oldStartVnode = oldCh[++oldStartIdx], newStartVnode = newCh[++newStartIdx];
    } else if (oldEndVnode.$id$ === newEndVnode.$id$) {
      results.push(diffVnode(ctx, oldEndVnode, newEndVnode, flags)), oldEndVnode = oldCh[--oldEndIdx], newEndVnode = newCh[--newEndIdx];
    } else if (oldStartVnode.$key$ && oldStartVnode.$id$ === newEndVnode.$id$) {
      assertDefined(oldStartVnode.$elm$), assertDefined(oldEndVnode.$elm$), results.push(diffVnode(ctx, oldStartVnode, newEndVnode, flags)), insertAfter(staticCtx, parentElm, oldStartVnode.$elm$, oldEndVnode.$elm$), oldStartVnode = oldCh[++oldStartIdx], newEndVnode = newCh[--newEndIdx];
    } else if (oldEndVnode.$key$ && oldEndVnode.$id$ === newStartVnode.$id$) {
      assertDefined(oldStartVnode.$elm$), assertDefined(oldEndVnode.$elm$), results.push(diffVnode(ctx, oldEndVnode, newStartVnode, flags)), insertBefore(staticCtx, parentElm, oldEndVnode.$elm$, oldStartVnode.$elm$), oldEndVnode = oldCh[--oldEndIdx], newStartVnode = newCh[++newStartIdx];
    } else {
      if (void 0 === oldKeyToIdx && (oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)), idxInOld = oldKeyToIdx[newStartVnode.$key$], void 0 === idxInOld) {
        const newElm = createElm(ctx, newStartVnode, flags, results);
        insertBefore(staticCtx, parentElm, newElm, oldStartVnode?.$elm$);
      } else if (elmToMove = oldCh[idxInOld], elmToMove.$type$ !== newStartVnode.$type$) {
        const newElm = createElm(ctx, newStartVnode, flags, results);
        then(newElm, (newElm2) => {
          insertBefore(staticCtx, parentElm, newElm2, oldStartVnode?.$elm$);
        });
      } else {
        results.push(diffVnode(ctx, elmToMove, newStartVnode, flags)), oldCh[idxInOld] = void 0, assertDefined(elmToMove.$elm$), insertBefore(staticCtx, parentElm, elmToMove.$elm$, oldStartVnode.$elm$);
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (newStartIdx <= newEndIdx) {
    results.push(addChildren(ctx, parentElm, null == newCh[newEndIdx + 1] ? null : newCh[newEndIdx + 1].$elm$, newCh, newStartIdx, newEndIdx, flags));
  }
  let wait = promiseAll(results);
  return oldStartIdx <= oldEndIdx && (wait = then(wait, () => {
    removeChildren(staticCtx, oldCh, oldStartIdx, oldEndIdx);
  })), wait;
};
const getChildren = (elm, filter) => {
  const end = isVirtualElement(elm) ? elm.close : null;
  const nodes = [];
  let node = elm.firstChild;
  for (; (node = processVirtualNodes(node)) && (filter(node) && nodes.push(node), node = node.nextSibling, node !== end); ) {
  }
  return nodes;
};
const getChildrenVnodes = (elm, filter) => getChildren(elm, filter).map(getVnodeFromEl);
const getVnodeFromEl = (el) => isElement$1(el) ? tryGetContext(el)?.$vdom$ ?? domToVnode(el) : domToVnode(el);
const domToVnode = (node) => {
  if (isQwikElement(node)) {
    const t = new ProcessedJSXNodeImpl(node.localName, {}, null, CHILDREN_PLACEHOLDER, 0, getKey(node));
    return t.$elm$ = node, t;
  }
  if (isText(node)) {
    const t = new ProcessedJSXNodeImpl(node.nodeName, EMPTY_OBJ, null, CHILDREN_PLACEHOLDER, 0, null);
    return t.$text$ = node.data, t.$elm$ = node, t;
  }
};
const isHeadChildren = (node) => {
  const type = node.nodeType;
  return 1 === type ? node.hasAttribute("q:head") : 111 === type;
};
const isSlotTemplate = (node) => "Q:TEMPLATE" === node.nodeName;
const isChildComponent = (node) => {
  const type = node.nodeType;
  if (3 === type || 111 === type) {
    return true;
  }
  if (1 !== type) {
    return false;
  }
  const nodeName = node.nodeName;
  return "Q:TEMPLATE" !== nodeName && ("HEAD" === nodeName ? node.hasAttribute("q:head") : "STYLE" !== nodeName || !node.hasAttribute(QStyle));
};
const splitChildren = (input) => {
  const output = {};
  for (const item of input) {
    const key = getSlotName(item);
    (output[key] ?? (output[key] = new ProcessedJSXNodeImpl(VIRTUAL, {
      "q:s": ""
    }, null, [], 0, key))).$children$.push(item);
  }
  return output;
};
const diffVnode = (rCtx, oldVnode, newVnode, flags) => {
  assertEqual(oldVnode.$type$, newVnode.$type$), assertEqual(oldVnode.$key$, newVnode.$key$), assertEqual(oldVnode.$id$, newVnode.$id$);
  const elm = oldVnode.$elm$;
  const tag = newVnode.$type$;
  const staticCtx = rCtx.$static$;
  const containerState = staticCtx.$containerState$;
  const currentComponent = rCtx.$cmpCtx$;
  if (newVnode.$elm$ = elm, "#text" === tag) {
    staticCtx.$visited$.push(elm);
    const signal = newVnode.$signal$;
    return signal && (newVnode.$text$ = jsxToString(trackSignal(signal, [4, currentComponent.$element$, signal, elm]))), void setProperty(staticCtx, elm, "data", newVnode.$text$);
  }
  const props = newVnode.$props$;
  const vnodeFlags = newVnode.$flags$;
  const elCtx = getContext(elm, containerState);
  if (tag !== VIRTUAL) {
    let isSvg = 0 != (1 & flags);
    if (isSvg || "svg" !== tag || (flags |= 1, isSvg = true), props !== EMPTY_OBJ) {
      0 == (1 & vnodeFlags) && (elCtx.li.length = 0);
      const values = oldVnode.$props$;
      newVnode.$props$ = values;
      for (const prop in props) {
        let newValue = props[prop];
        if ("ref" !== prop) {
          if (isOnProp(prop)) {
            const normalized = setEvent(elCtx.li, prop, newValue, containerState.$containerEl$);
            addQwikEvent(staticCtx, elm, normalized);
          } else {
            isSignal(newValue) && (newValue = trackSignal(newValue, [1, currentComponent.$element$, newValue, elm, prop])), "class" === prop ? newValue = serializeClassWithHost(newValue, currentComponent) : "style" === prop && (newValue = stringifyStyle(newValue)), values[prop] !== newValue && (values[prop] = newValue, smartSetProperty(staticCtx, elm, prop, newValue, isSvg));
          }
        } else {
          void 0 !== newValue && setRef(newValue, elm);
        }
      }
    }
    if (2 & vnodeFlags) {
      return;
    }
    isSvg && "foreignObject" === tag && (flags &= -2);
    if (void 0 !== props[dangerouslySetInnerHTML]) {
      return void 0;
    }
    if ("textarea" === tag) {
      return;
    }
    return smartUpdateChildren(rCtx, oldVnode, newVnode, flags);
  }
  if ("q:renderFn" in props) {
    const cmpProps = props.props;
    setComponentProps(containerState, elCtx, cmpProps);
    let needsRender = !!(1 & elCtx.$flags$);
    return needsRender || elCtx.$componentQrl$ || elCtx.$element$.hasAttribute("q:id") || (setQId(rCtx, elCtx), elCtx.$componentQrl$ = cmpProps["q:renderFn"], assertQrl(elCtx.$componentQrl$), needsRender = true), needsRender ? then(renderComponent(rCtx, elCtx, flags), () => renderContentProjection(rCtx, elCtx, newVnode, flags)) : renderContentProjection(rCtx, elCtx, newVnode, flags);
  }
  if ("q:s" in props) {
    return assertDefined(currentComponent.$slots$), void currentComponent.$slots$.push(newVnode);
  }
  if (dangerouslySetInnerHTML in props) {
    setProperty(staticCtx, elm, "innerHTML", props[dangerouslySetInnerHTML]);
  } else if (!(2 & vnodeFlags)) {
    return smartUpdateChildren(rCtx, oldVnode, newVnode, flags);
  }
};
const renderContentProjection = (rCtx, hostCtx, vnode, flags) => {
  if (2 & vnode.$flags$) {
    return;
  }
  const staticCtx = rCtx.$static$;
  const splittedNewChildren = splitChildren(vnode.$children$);
  const slotMaps = getSlotMap(hostCtx);
  for (const key in slotMaps.slots) {
    if (!splittedNewChildren[key]) {
      const slotEl = slotMaps.slots[key];
      const oldCh = getChildrenVnodes(slotEl, isChildComponent);
      if (oldCh.length > 0) {
        const slotCtx = tryGetContext(slotEl);
        slotCtx && slotCtx.$vdom$ && (slotCtx.$vdom$.$children$ = []), removeChildren(staticCtx, oldCh, 0, oldCh.length - 1);
      }
    }
  }
  for (const key in slotMaps.templates) {
    const templateEl = slotMaps.templates[key];
    templateEl && !splittedNewChildren[key] && (slotMaps.templates[key] = void 0, removeNode(staticCtx, templateEl));
  }
  return promiseAll(Object.keys(splittedNewChildren).map((slotName) => {
    const newVdom = splittedNewChildren[slotName];
    const slotCtx = getSlotCtx(staticCtx, slotMaps, hostCtx, slotName, rCtx.$static$.$containerState$);
    const oldVdom = getVdom(slotCtx);
    const slotRctx = pushRenderContext(rCtx);
    const slotEl = slotCtx.$element$;
    slotRctx.$slotCtx$ = slotCtx, slotCtx.$vdom$ = newVdom, newVdom.$elm$ = slotEl;
    let newFlags = -2 & flags;
    slotEl.isSvg && (newFlags |= 1);
    const index = staticCtx.$addSlots$.findIndex((slot) => slot[0] === slotEl);
    return index >= 0 && staticCtx.$addSlots$.splice(index, 1), smartUpdateChildren(slotRctx, oldVdom, newVdom, newFlags);
  }));
};
const addChildren = (ctx, parentElm, before, vnodes, startIdx, endIdx, flags) => {
  const promises = [];
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    const elm = createElm(ctx, ch, flags, promises);
    insertBefore(ctx.$static$, parentElm, elm, before);
  }
  return promiseAllLazy(promises);
};
const removeChildren = (staticCtx, nodes, startIdx, endIdx) => {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = nodes[startIdx];
    ch && (assertDefined(ch.$elm$), removeNode(staticCtx, ch.$elm$));
  }
};
const getSlotCtx = (staticCtx, slotMaps, hostCtx, slotName, containerState) => {
  const slotEl = slotMaps.slots[slotName];
  if (slotEl) {
    return getContext(slotEl, containerState);
  }
  const templateEl = slotMaps.templates[slotName];
  if (templateEl) {
    return getContext(templateEl, containerState);
  }
  const template = createTemplate(staticCtx.$doc$, slotName);
  const elCtx = createContext(template);
  return elCtx.$parent$ = hostCtx, prepend(staticCtx, hostCtx.$element$, template), slotMaps.templates[slotName] = template, elCtx;
};
const getSlotName = (node) => node.$props$[QSlot] ?? "";
const createElm = (rCtx, vnode, flags, promises) => {
  const tag = vnode.$type$;
  const doc = rCtx.$static$.$doc$;
  const currentComponent = rCtx.$cmpCtx$;
  if ("#text" === tag) {
    const signal = vnode.$signal$;
    const elm2 = doc.createTextNode(vnode.$text$);
    if (signal) {
      elm2.data = vnode.$text$ = jsxToString(trackSignal(signal, 4 & flags ? [3, elm2, signal, elm2] : [4, currentComponent.$element$, signal, elm2]));
    }
    return vnode.$elm$ = elm2;
  }
  let elm;
  let isSvg = !!(1 & flags);
  isSvg || "svg" !== tag || (flags |= 1, isSvg = true);
  const isVirtual = tag === VIRTUAL;
  const props = vnode.$props$;
  const staticCtx = rCtx.$static$;
  const containerState = staticCtx.$containerState$;
  isVirtual ? elm = newVirtualElement(doc, isSvg) : "head" === tag ? (elm = doc.head, flags |= 2) : (elm = createElement(doc, tag, isSvg), flags &= -3), 2 & vnode.$flags$ && (flags |= 4), vnode.$elm$ = elm;
  const elCtx = createContext(elm);
  if (elCtx.$parent$ = rCtx.$cmpCtx$, elCtx.$slotParent$ = rCtx.$slotCtx$, isVirtual) {
    if ("q:renderFn" in props) {
      const renderQRL = props["q:renderFn"];
      const target = createPropsState();
      const manager = containerState.$subsManager$.$createManager$();
      const proxy = new Proxy(target, new ReadWriteProxyHandler(containerState, manager));
      const expectProps = props.props;
      if (containerState.$proxyMap$.set(target, proxy), elCtx.$props$ = proxy, expectProps !== EMPTY_OBJ) {
        const immutableMeta = target[_IMMUTABLE] = expectProps[_IMMUTABLE] ?? EMPTY_OBJ;
        for (const prop in expectProps) {
          if ("children" !== prop && prop !== QSlot) {
            const immutableValue2 = immutableMeta[prop];
            isSignal(immutableValue2) ? target["$$" + prop] = immutableValue2 : target[prop] = expectProps[prop];
          }
        }
      }
      setQId(rCtx, elCtx), elCtx.$componentQrl$ = renderQRL;
      const wait = then(renderComponent(rCtx, elCtx, flags), () => {
        let children2 = vnode.$children$;
        if (0 === children2.length) {
          return;
        }
        1 === children2.length && children2[0].$type$ === SKIP_RENDER_TYPE && (children2 = children2[0].$children$);
        const slotMap = getSlotMap(elCtx);
        const p = [];
        const splittedNewChildren = splitChildren(children2);
        for (const slotName in splittedNewChildren) {
          const newVnode = splittedNewChildren[slotName];
          const slotCtx = getSlotCtx(staticCtx, slotMap, elCtx, slotName, staticCtx.$containerState$);
          const slotRctx = pushRenderContext(rCtx);
          const slotEl = slotCtx.$element$;
          slotRctx.$slotCtx$ = slotCtx, slotCtx.$vdom$ = newVnode, newVnode.$elm$ = slotEl;
          let newFlags = -2 & flags;
          slotEl.isSvg && (newFlags |= 1);
          for (const node of newVnode.$children$) {
            const nodeElm = createElm(slotRctx, node, newFlags, p);
            assertDefined(node.$elm$), assertEqual(nodeElm, node.$elm$), appendChild(staticCtx, slotEl, nodeElm);
          }
        }
        return promiseAllLazy(p);
      });
      return isPromise(wait) && promises.push(wait), elm;
    }
    if ("q:s" in props) {
      assertDefined(currentComponent.$slots$), el = elm, null !== (key = vnode.$key$) && directSetAttribute(el, "q:key", key), directSetAttribute(elm, "q:sref", currentComponent.$id$), directSetAttribute(elm, "q:s", ""), currentComponent.$slots$.push(vnode), staticCtx.$addSlots$.push([elm, currentComponent.$element$]);
    } else if (dangerouslySetInnerHTML in props) {
      return setProperty(staticCtx, elm, "innerHTML", props[dangerouslySetInnerHTML]), elm;
    }
  } else {
    if (vnode.$immutableProps$ && setProperties(staticCtx, elCtx, currentComponent, vnode.$immutableProps$, isSvg, true), props !== EMPTY_OBJ && (elCtx.$vdom$ = vnode, vnode.$props$ = setProperties(staticCtx, elCtx, currentComponent, props, isSvg, false)), isSvg && "foreignObject" === tag && (isSvg = false, flags &= -2), currentComponent) {
      const scopedIds = currentComponent.$scopeIds$;
      scopedIds && scopedIds.forEach((styleId) => {
        elm.classList.add(styleId);
      }), 2 & currentComponent.$flags$ && (elCtx.li.push(...currentComponent.li), currentComponent.$flags$ &= -3);
    }
    for (const listener of elCtx.li) {
      addQwikEvent(staticCtx, elm, listener[0]);
    }
    if (void 0 !== props[dangerouslySetInnerHTML]) {
      return elm;
    }
    isSvg && "foreignObject" === tag && (isSvg = false, flags &= -2);
  }
  var el, key;
  let children = vnode.$children$;
  if (0 === children.length) {
    return elm;
  }
  1 === children.length && children[0].$type$ === SKIP_RENDER_TYPE && (children = children[0].$children$);
  const nodes = children.map((ch) => createElm(rCtx, ch, flags, promises));
  for (const node of nodes) {
    directAppendChild(elm, node);
  }
  return elm;
};
const getSlots = (elCtx) => {
  const slots = elCtx.$slots$;
  if (!slots) {
    return assertDefined(elCtx.$element$.parentElement), elCtx.$slots$ = readDOMSlots(elCtx);
  }
  return slots;
};
const getSlotMap = (elCtx) => {
  const slotsArray = getSlots(elCtx);
  const slots = {};
  const templates = {};
  const t = Array.from(elCtx.$element$.childNodes).filter(isSlotTemplate);
  for (const vnode of slotsArray) {
    assertQwikElement(vnode.$elm$), slots[vnode.$key$ ?? ""] = vnode.$elm$;
  }
  for (const elm of t) {
    templates[directGetAttribute(elm, QSlot) ?? ""] = elm;
  }
  return {
    slots,
    templates
  };
};
const readDOMSlots = (elCtx) => {
  const parent = elCtx.$element$.parentElement;
  return queryAllVirtualByAttribute(parent, "q:sref", elCtx.$id$).map(domToVnode);
};
const handleStyle = (ctx, elm, newValue) => (setProperty(ctx, elm.style, "cssText", newValue), true);
const handleClass = (ctx, elm, newValue) => (elm.namespaceURI === SVG_NS ? setAttribute(ctx, elm, "class", newValue) : setProperty(ctx, elm, "className", newValue), true);
const checkBeforeAssign = (ctx, elm, newValue, prop) => (prop in elm && elm[prop] !== newValue && ("SELECT" === elm.tagName ? ctx.$postOperations$.push({
  $operation$: _setProperty,
  $args$: [elm, prop, newValue]
}) : setProperty(ctx, elm, prop, newValue)), true);
const forceAttribute = (ctx, elm, newValue, prop) => (setAttribute(ctx, elm, prop.toLowerCase(), newValue), true);
const setInnerHTML = (ctx, elm, newValue) => (setProperty(ctx, elm, "innerHTML", newValue), true);
const noop = () => true;
const PROP_HANDLER_MAP = {
  style: handleStyle,
  class: handleClass,
  value: checkBeforeAssign,
  checked: checkBeforeAssign,
  href: forceAttribute,
  list: forceAttribute,
  form: forceAttribute,
  tabIndex: forceAttribute,
  download: forceAttribute,
  innerHTML: noop,
  [dangerouslySetInnerHTML]: setInnerHTML
};
const smartSetProperty = (staticCtx, elm, prop, newValue, isSvg) => {
  if (isAriaAttribute(prop)) {
    return void setAttribute(staticCtx, elm, prop, null != newValue ? String(newValue) : newValue);
  }
  const exception = PROP_HANDLER_MAP[prop];
  exception && exception(staticCtx, elm, newValue, prop) || (isSvg || !(prop in elm) ? (prop.startsWith(PREVENT_DEFAULT) && registerQwikEvent(prop.slice(15)), setAttribute(staticCtx, elm, prop, newValue)) : setProperty(staticCtx, elm, prop, newValue));
};
const setProperties = (staticCtx, elCtx, hostCtx, newProps, isSvg, immutable) => {
  const values = {};
  const elm = elCtx.$element$;
  for (const prop in newProps) {
    let newValue = newProps[prop];
    if ("ref" !== prop) {
      if (isOnProp(prop)) {
        setEvent(elCtx.li, prop, newValue, staticCtx.$containerState$.$containerEl$);
      } else {
        if (isSignal(newValue) && (newValue = trackSignal(newValue, immutable ? [1, elm, newValue, hostCtx.$element$, prop] : [2, hostCtx.$element$, newValue, elm, prop])), "class" === prop) {
          if (newValue = serializeClassWithHost(newValue, hostCtx), !newValue) {
            continue;
          }
        } else {
          "style" === prop && (newValue = stringifyStyle(newValue));
        }
        values[prop] = newValue, smartSetProperty(staticCtx, elm, prop, newValue, isSvg);
      }
    } else {
      void 0 !== newValue && setRef(newValue, elm);
    }
  }
  return values;
};
const setComponentProps = (containerState, elCtx, expectProps) => {
  let props = elCtx.$props$;
  if (props || (elCtx.$props$ = props = createProxy(createPropsState(), containerState)), expectProps === EMPTY_OBJ) {
    return;
  }
  const manager = getProxyManager(props);
  const target = getProxyTarget(props);
  const immutableMeta = target[_IMMUTABLE] = expectProps[_IMMUTABLE] ?? EMPTY_OBJ;
  for (const prop in expectProps) {
    if ("children" !== prop && prop !== QSlot && !immutableMeta[prop]) {
      const value = expectProps[prop];
      target[prop] !== value && (target[prop] = value, manager.$notifySubs$(prop));
    }
  }
};
const cleanupTree = (elm, staticCtx, subsManager, stopSlots) => {
  if (subsManager.$clearSub$(elm), isQwikElement(elm)) {
    if (stopSlots && elm.hasAttribute("q:s")) {
      return void staticCtx.$rmSlots$.push(elm);
    }
    const ctx = tryGetContext(elm);
    ctx && cleanupContext(ctx, subsManager);
    const end = isVirtualElement(elm) ? elm.close : null;
    let node = elm.firstChild;
    for (; (node = processVirtualNodes(node)) && (cleanupTree(node, staticCtx, subsManager, true), node = node.nextSibling, node !== end); ) {
    }
  }
};
const executeContextWithTransition = async (ctx) => {
  executeDOMRender(ctx);
};
const directAppendChild = (parent, child) => {
  isVirtualElement(child) ? child.appendTo(parent) : parent.appendChild(child);
};
const directRemoveChild = (parent, child) => {
  isVirtualElement(child) ? child.remove() : parent.removeChild(child);
};
const directInsertAfter = (parent, child, ref) => {
  isVirtualElement(child) ? child.insertBeforeTo(parent, ref?.nextSibling ?? null) : parent.insertBefore(child, ref?.nextSibling ?? null);
};
const directInsertBefore = (parent, child, ref) => {
  isVirtualElement(child) ? child.insertBeforeTo(parent, getRootNode(ref)) : parent.insertBefore(child, getRootNode(ref));
};
const createKeyToOldIdx = (children, beginIdx, endIdx) => {
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i].$key$;
    null != key && (map[key] = i);
  }
  return map;
};
const addQwikEvent = (staticCtx, elm, prop) => {
  prop.startsWith("on:") || setAttribute(staticCtx, elm, prop, ""), registerQwikEvent(prop);
};
const registerQwikEvent = (prop) => {
  var _a2;
  {
    const eventName = getEventName(prop);
    try {
      ((_a2 = globalThis).qwikevents || (_a2.qwikevents = [])).push(eventName);
    } catch (err) {
    }
  }
};
const executeSignalOperation = (staticCtx, operation) => {
  try {
    const type = operation[0];
    switch (type) {
      case 1:
      case 2: {
        let elm;
        let hostElm;
        1 === type ? (elm = operation[1], hostElm = operation[3]) : (elm = operation[3], hostElm = operation[1]);
        const elCtx = tryGetContext(elm);
        if (null == elCtx) {
          return;
        }
        const prop = operation[4];
        const isSVG = elm.namespaceURI === SVG_NS;
        staticCtx.$containerState$.$subsManager$.$clearSignal$(operation);
        let value = trackSignal(operation[2], operation.slice(0, -1));
        "class" === prop ? value = serializeClassWithHost(value, tryGetContext(hostElm)) : "style" === prop && (value = stringifyStyle(value));
        const vdom = getVdom(elCtx);
        if (vdom.$props$[prop] === value) {
          return;
        }
        return vdom.$props$[prop] = value, smartSetProperty(staticCtx, elm, prop, value, isSVG);
      }
      case 3:
      case 4: {
        const elm = operation[3];
        if (!staticCtx.$visited$.includes(elm)) {
          staticCtx.$containerState$.$subsManager$.$clearSignal$(operation);
          const value = trackSignal(operation[2], operation.slice(0, -1));
          return setProperty(staticCtx, elm, "data", jsxToString(value));
        }
      }
    }
  } catch (e) {
  }
};
const notifyChange = (subAction, containerState) => {
  if (0 === subAction[0]) {
    const host = subAction[1];
    isSubscriberDescriptor(host) ? notifyWatch(host, containerState) : notifyRender(host, containerState);
  } else {
    notifySignalOperation(subAction, containerState);
  }
};
const notifyRender = (hostElement, containerState) => {
  const server = isServerPlatform();
  server || resumeIfNeeded(containerState.$containerEl$);
  const elCtx = getContext(hostElement, containerState);
  if (assertDefined(elCtx.$componentQrl$), 1 & elCtx.$flags$) {
    return;
  }
  elCtx.$flags$ |= 1;
  if (void 0 !== containerState.$hostsRendering$) {
    containerState.$hostsStaging$.add(elCtx);
  } else {
    if (server) {
      return void logWarn();
    }
    containerState.$hostsNext$.add(elCtx), scheduleFrame(containerState);
  }
};
const notifySignalOperation = (op, containerState) => {
  const activeRendering = void 0 !== containerState.$hostsRendering$;
  containerState.$opsNext$.add(op), activeRendering || scheduleFrame(containerState);
};
const notifyWatch = (watch, containerState) => {
  if (watch.$flags$ & WatchFlagsIsDirty) {
    return;
  }
  watch.$flags$ |= WatchFlagsIsDirty;
  void 0 !== containerState.$hostsRendering$ ? containerState.$watchStaging$.add(watch) : (containerState.$watchNext$.add(watch), scheduleFrame(containerState));
};
const scheduleFrame = (containerState) => (void 0 === containerState.$renderPromise$ && (containerState.$renderPromise$ = getPlatform().nextTick(() => renderMarked(containerState))), containerState.$renderPromise$);
const renderMarked = async (containerState) => {
  const containerEl = containerState.$containerEl$;
  const doc = getDocument(containerEl);
  try {
    const rCtx = createRenderContext(doc, containerState);
    const staticCtx = rCtx.$static$;
    const hostsRendering = containerState.$hostsRendering$ = new Set(containerState.$hostsNext$);
    containerState.$hostsNext$.clear(), await executeWatchesBefore(containerState, rCtx), containerState.$hostsStaging$.forEach((host) => {
      hostsRendering.add(host);
    }), containerState.$hostsStaging$.clear();
    const signalOperations = Array.from(containerState.$opsNext$);
    containerState.$opsNext$.clear();
    const renderingQueue = Array.from(hostsRendering);
    if (sortNodes(renderingQueue), !containerState.$styleMoved$ && renderingQueue.length > 0) {
      containerState.$styleMoved$ = true;
      (containerEl === doc.documentElement ? doc.body : containerEl).querySelectorAll("style[q\\:style]").forEach((el) => {
        containerState.$styleIds$.add(directGetAttribute(el, QStyle)), appendChild(staticCtx, doc.head, el);
      });
    }
    for (const elCtx of renderingQueue) {
      const el = elCtx.$element$;
      if (!staticCtx.$hostElements$.has(el) && elCtx.$componentQrl$) {
        assertTrue(el.isConnected, "element must be connected to the dom"), staticCtx.$roots$.push(elCtx);
        try {
          await renderComponent(rCtx, elCtx, getFlags(el.parentElement));
        } catch (err) {
          logError(err);
        }
      }
    }
    return signalOperations.forEach((op) => {
      executeSignalOperation(staticCtx, op);
    }), staticCtx.$operations$.push(...staticCtx.$postOperations$), 0 === staticCtx.$operations$.length ? (printRenderStats(), void await postRendering(containerState, rCtx)) : (await executeContextWithTransition(staticCtx), printRenderStats(), postRendering(containerState, rCtx));
  } catch (err) {
    logError(err);
  }
};
const getFlags = (el) => {
  let flags = 0;
  return el && (el.namespaceURI === SVG_NS && (flags |= 1), "HEAD" === el.tagName && (flags |= 2)), flags;
};
const postRendering = async (containerState, rCtx) => {
  const hostElements = rCtx.$static$.$hostElements$;
  await executeWatchesAfter(containerState, rCtx, (watch, stage) => 0 != (watch.$flags$ & WatchFlagsIsVisibleTask) && (!stage || hostElements.has(watch.$el$))), containerState.$hostsStaging$.forEach((el) => {
    containerState.$hostsNext$.add(el);
  }), containerState.$hostsStaging$.clear(), containerState.$hostsRendering$ = void 0, containerState.$renderPromise$ = void 0;
  containerState.$hostsNext$.size + containerState.$watchNext$.size + containerState.$opsNext$.size > 0 && (containerState.$renderPromise$ = renderMarked(containerState));
};
const executeWatchesBefore = async (containerState, rCtx) => {
  const containerEl = containerState.$containerEl$;
  const resourcesPromises = [];
  const watchPromises = [];
  const isWatch = (watch) => 0 != (watch.$flags$ & WatchFlagsIsTask);
  const isResourceWatch = (watch) => 0 != (watch.$flags$ & WatchFlagsIsResource);
  containerState.$watchNext$.forEach((watch) => {
    isWatch(watch) && (watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch)), isResourceWatch(watch) && (resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch));
  });
  do {
    if (containerState.$watchStaging$.forEach((watch) => {
      isWatch(watch) ? watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : isResourceWatch(watch) ? resourcesPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : containerState.$watchNext$.add(watch);
    }), containerState.$watchStaging$.clear(), watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches), await Promise.all(watches.map((watch) => runSubscriber(watch, containerState, rCtx))), watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
  if (resourcesPromises.length > 0) {
    const resources = await Promise.all(resourcesPromises);
    sortWatches(resources), resources.forEach((watch) => runSubscriber(watch, containerState, rCtx));
  }
};
const executeWatchesAfter = async (containerState, rCtx, watchPred) => {
  const watchPromises = [];
  const containerEl = containerState.$containerEl$;
  containerState.$watchNext$.forEach((watch) => {
    watchPred(watch, false) && (watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)), containerState.$watchNext$.delete(watch));
  });
  do {
    if (containerState.$watchStaging$.forEach((watch) => {
      watchPred(watch, true) ? watchPromises.push(then(watch.$qrl$.$resolveLazy$(containerEl), () => watch)) : containerState.$watchNext$.add(watch);
    }), containerState.$watchStaging$.clear(), watchPromises.length > 0) {
      const watches = await Promise.all(watchPromises);
      sortWatches(watches);
      for (const watch of watches) {
        await runSubscriber(watch, containerState, rCtx);
      }
      watchPromises.length = 0;
    }
  } while (containerState.$watchStaging$.size > 0);
};
const sortNodes = (elements) => {
  elements.sort((a, b) => 2 & a.$element$.compareDocumentPosition(getRootNode(b.$element$)) ? 1 : -1);
};
const sortWatches = (watches) => {
  watches.sort((a, b) => a.$el$ === b.$el$ ? a.$index$ < b.$index$ ? -1 : 1 : 0 != (2 & a.$el$.compareDocumentPosition(getRootNode(b.$el$))) ? 1 : -1);
};
const WatchFlagsIsVisibleTask = 1;
const WatchFlagsIsTask = 2;
const WatchFlagsIsResource = 4;
const WatchFlagsIsDirty = 16;
const isResourceTask = (watch) => 0 != (watch.$flags$ & WatchFlagsIsResource);
const isComputedTask = (watch) => 0 != (8 & watch.$flags$);
const runSubscriber = async (watch, containerState, rCtx) => (assertEqual(!!(watch.$flags$ & WatchFlagsIsDirty)), isResourceTask(watch) ? runResource(watch, containerState, rCtx) : isComputedTask(watch) ? runComputed(watch, containerState, rCtx) : runWatch(watch, containerState, rCtx));
const runResource = (watch, containerState, rCtx, waitOn) => {
  watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
  const iCtx = newInvokeContext(rCtx.$static$.$locale$, watch.$el$, void 0, "WatchEvent");
  const { $subsManager$: subsManager } = containerState;
  iCtx.$renderCtx$ = rCtx;
  const watchFn = watch.$qrl$.getFn(iCtx, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  const resource = watch.$state$;
  const resourceTarget = unwrapProxy(resource);
  const opts = {
    track: (obj, prop) => {
      if (isFunction(obj)) {
        const ctx = newInvokeContext();
        return ctx.$renderCtx$ = rCtx, ctx.$subscriber$ = [0, watch], invoke(ctx, obj);
      }
      const manager = getProxyManager(obj);
      return manager ? manager.$addSub$([0, watch], prop) : logErrorAndStop(codeToText(26), obj), prop ? obj[prop] : isSignal(obj) ? obj.value : obj;
    },
    cleanup(callback) {
      cleanups.push(callback);
    },
    cache(policy) {
      let milliseconds = 0;
      milliseconds = "immutable" === policy ? 1 / 0 : policy, resource._cache = milliseconds;
    },
    previous: resourceTarget._resolved
  };
  let resolve;
  let reject;
  let done = false;
  const setState = (resolved, value) => !done && (done = true, resolved ? (done = true, resource.loading = false, resource._state = "resolved", resource._resolved = value, resource._error = void 0, resolve(value)) : (done = true, resource.loading = false, resource._state = "rejected", resource._error = value, reject(value)), true);
  invoke(iCtx, () => {
    resource._state = "pending", resource.loading = !isServerPlatform(), resource.value = new Promise((r, re) => {
      resolve = r, reject = re;
    });
  }), watch.$destroy$ = noSerialize(() => {
    done = true, cleanups.forEach((fn) => fn());
  });
  const promise = safeCall(() => then(waitOn, () => watchFn(opts)), (value) => {
    setState(true, value);
  }, (reason) => {
    setState(false, reason);
  });
  const timeout = resourceTarget._timeout;
  return timeout > 0 ? Promise.race([promise, delay(timeout).then(() => {
    setState(false, new Error("timeout")) && cleanupWatch(watch);
  })]) : promise;
};
const runWatch = (watch, containerState, rCtx) => {
  watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
  const hostElement = watch.$el$;
  const iCtx = newInvokeContext(rCtx.$static$.$locale$, hostElement, void 0, "WatchEvent");
  iCtx.$renderCtx$ = rCtx;
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(iCtx, () => {
    subsManager.$clearSub$(watch);
  });
  const cleanups = [];
  watch.$destroy$ = noSerialize(() => {
    cleanups.forEach((fn) => fn());
  });
  const opts = {
    track: (obj, prop) => {
      if (isFunction(obj)) {
        const ctx = newInvokeContext();
        return ctx.$subscriber$ = [0, watch], invoke(ctx, obj);
      }
      const manager = getProxyManager(obj);
      return manager ? manager.$addSub$([0, watch], prop) : logErrorAndStop(codeToText(26), obj), prop ? obj[prop] : obj;
    },
    cleanup(callback) {
      cleanups.push(callback);
    }
  };
  return safeCall(() => watchFn(opts), (returnValue) => {
    isFunction(returnValue) && cleanups.push(returnValue);
  }, (reason) => {
    handleError(reason, hostElement, rCtx);
  });
};
const runComputed = (watch, containerState, rCtx) => {
  assertSignal(watch.$state$), watch.$flags$ &= ~WatchFlagsIsDirty, cleanupWatch(watch);
  const hostElement = watch.$el$;
  const iCtx = newInvokeContext(rCtx.$static$.$locale$, hostElement, void 0, "ComputedEvent");
  iCtx.$subscriber$ = [0, watch], iCtx.$renderCtx$ = rCtx;
  const { $subsManager$: subsManager } = containerState;
  const watchFn = watch.$qrl$.getFn(iCtx, () => {
    subsManager.$clearSub$(watch);
  });
  return safeCall(watchFn, (returnValue) => untrack(() => {
    const signal = watch.$state$;
    signal[QObjectSignalFlags] &= -3, signal.untrackedValue = returnValue, signal[QObjectManagerSymbol].$notifySubs$();
  }), (reason) => {
    handleError(reason, hostElement, rCtx);
  });
};
const cleanupWatch = (watch) => {
  const destroy = watch.$destroy$;
  if (destroy) {
    watch.$destroy$ = void 0;
    try {
      destroy();
    } catch (err) {
      logError(err);
    }
  }
};
const destroyWatch = (watch) => {
  if (32 & watch.$flags$) {
    watch.$flags$ &= -33;
    (0, watch.$qrl$)();
  } else {
    cleanupWatch(watch);
  }
};
const isSubscriberDescriptor = (obj) => isObject(obj) && obj instanceof Task;
const serializeWatch = (watch, getObjId) => {
  let value = `${intToStr(watch.$flags$)} ${intToStr(watch.$index$)} ${getObjId(watch.$qrl$)} ${getObjId(watch.$el$)}`;
  return watch.$state$ && (value += ` ${getObjId(watch.$state$)}`), value;
};
const parseTask = (data) => {
  const [flags, index, qrl, el, resource] = data.split(" ");
  return new Task(strToInt(flags), strToInt(index), el, qrl, resource);
};
class Task {
  constructor($flags$, $index$, $el$, $qrl$, $state$) {
    this.$flags$ = $flags$, this.$index$ = $index$, this.$el$ = $el$, this.$qrl$ = $qrl$, this.$state$ = $state$;
  }
}
const pauseContainer = async (elmOrDoc, defaultParentJSON) => {
  const doc = getDocument(elmOrDoc);
  const documentElement = doc.documentElement;
  const containerEl = isDocument(elmOrDoc) ? documentElement : elmOrDoc;
  if ("paused" === directGetAttribute(containerEl, "q:container")) {
    throw qError(21);
  }
  const parentJSON = defaultParentJSON ?? (containerEl === doc.documentElement ? doc.body : containerEl);
  const containerState = _getContainerState(containerEl);
  const contexts = getNodesInScope(containerEl, hasContext);
  directSetAttribute(containerEl, "q:container", "paused");
  for (const elCtx of contexts) {
    const elm = elCtx.$element$;
    const listeners = elCtx.li;
    if (elCtx.$scopeIds$) {
      const value = serializeSStyle(elCtx.$scopeIds$);
      value && elm.setAttribute("q:sstyle", value);
    }
    if (elCtx.$id$ && elm.setAttribute("q:id", elCtx.$id$), isElement$1(elm) && listeners.length > 0) {
      const groups = groupListeners(listeners);
      for (const listener of groups) {
        elm.setAttribute(listener[0], serializeQRLs(listener[1], elCtx));
      }
    }
  }
  const data = await _pauseFromContexts(contexts, containerState, (el) => isNode$1(el) && isText(el) ? getTextID(el, containerState) : null);
  const qwikJson = doc.createElement("script");
  directSetAttribute(qwikJson, "type", "qwik/json"), qwikJson.textContent = escapeText$1(JSON.stringify(data.state, void 0, void 0)), parentJSON.appendChild(qwikJson);
  const extraListeners = Array.from(containerState.$events$, (s) => JSON.stringify(s));
  const eventsScript = doc.createElement("script");
  return eventsScript.textContent = `window.qwikevents||=[];window.qwikevents.push(${extraListeners.join(", ")})`, parentJSON.appendChild(eventsScript), data;
};
const _pauseFromContexts = async (allContexts, containerState, fallbackGetObjId, textNodes) => {
  const collector = createCollector(containerState);
  textNodes?.forEach((_, key) => {
    collector.$seen$.add(key);
  });
  let hasListeners = false;
  for (const ctx of allContexts) {
    if (ctx.$watches$) {
      for (const watch of ctx.$watches$) {
        isResourceTask(watch) && collector.$resources$.push(watch.$state$), destroyWatch(watch);
      }
    }
  }
  for (const ctx of allContexts) {
    const el = ctx.$element$;
    const ctxListeners = ctx.li;
    for (const listener of ctxListeners) {
      if (isElement$1(el)) {
        const qrl = listener[1];
        const captured = qrl.$captureRef$;
        if (captured) {
          for (const obj of captured) {
            collectValue(obj, collector, true);
          }
        }
        collector.$qrls$.push(qrl), hasListeners = true;
      }
    }
  }
  if (!hasListeners) {
    return {
      state: {
        refs: {},
        ctx: {},
        objs: [],
        subs: []
      },
      objs: [],
      funcs: [],
      qrls: [],
      resources: collector.$resources$,
      mode: "static"
    };
  }
  let promises;
  for (; (promises = collector.$promises$).length > 0; ) {
    collector.$promises$ = [], await Promise.all(promises);
  }
  const canRender = collector.$elements$.length > 0;
  if (canRender) {
    for (const elCtx of collector.$deferElements$) {
      collectElementData(elCtx, collector, elCtx.$element$);
    }
    for (const ctx of allContexts) {
      collectProps(ctx, collector);
    }
  }
  for (; (promises = collector.$promises$).length > 0; ) {
    collector.$promises$ = [], await Promise.all(promises);
  }
  const elementToIndex = /* @__PURE__ */ new Map();
  const objs = Array.from(collector.$objSet$.keys());
  const objToId = /* @__PURE__ */ new Map();
  const getObjId = (obj) => {
    let suffix = "";
    if (isPromise(obj)) {
      const promiseValue = getPromiseValue(obj);
      if (!promiseValue) {
        return null;
      }
      obj = promiseValue.value, suffix += promiseValue.resolved ? "~" : "_";
    }
    if (isObject(obj)) {
      const target = getProxyTarget(obj);
      if (target) {
        suffix += "!", obj = target;
      } else if (isQwikElement(obj)) {
        const elID = ((el) => {
          let id2 = elementToIndex.get(el);
          return void 0 === id2 && (id2 = getQId(el), id2 || console.warn("Missing ID", el), elementToIndex.set(el, id2)), id2;
        })(obj);
        return elID ? "#" + elID + suffix : null;
      }
    }
    const id = objToId.get(obj);
    if (id) {
      return id + suffix;
    }
    const textId = textNodes?.get(obj);
    return textId ? "*" + textId : fallbackGetObjId ? fallbackGetObjId(obj) : null;
  };
  const mustGetObjId = (obj) => {
    const key = getObjId(obj);
    if (null === key) {
      throw qError(27, obj);
    }
    return key;
  };
  const subsMap = /* @__PURE__ */ new Map();
  for (const obj of objs) {
    const subs2 = getManager(obj, containerState)?.$subs$;
    if (!subs2) {
      continue;
    }
    const flags = getProxyFlags(obj) ?? 0;
    const converted = [];
    1 & flags && converted.push(flags);
    for (const sub of subs2) {
      const host = sub[1];
      0 === sub[0] && isNode$1(host) && isVirtualElement(host) && !collector.$elements$.includes(tryGetContext(host)) || converted.push(sub);
    }
    converted.length > 0 && subsMap.set(obj, converted);
  }
  objs.sort((a, b) => (subsMap.has(a) ? 0 : 1) - (subsMap.has(b) ? 0 : 1));
  let count = 0;
  for (const obj of objs) {
    objToId.set(obj, intToStr(count)), count++;
  }
  if (collector.$noSerialize$.length > 0) {
    const undefinedID = objToId.get(void 0);
    for (const obj of collector.$noSerialize$) {
      objToId.set(obj, undefinedID);
    }
  }
  const subs = [];
  for (const obj of objs) {
    const value = subsMap.get(obj);
    if (null == value) {
      break;
    }
    subs.push(value.map((s) => "number" == typeof s ? `_${s}` : serializeSubscription(s, getObjId)).filter(isNotNullable));
  }
  assertEqual(subs.length, subsMap.size);
  const convertedObjs = objs.map((obj) => {
    if (null === obj) {
      return null;
    }
    const typeObj = typeof obj;
    switch (typeObj) {
      case "undefined":
        return UNDEFINED_PREFIX;
      case "number":
        if (!Number.isFinite(obj)) {
          break;
        }
        return obj;
      case "string":
      case "boolean":
        return obj;
    }
    const value = serializeValue(obj, mustGetObjId, collector, containerState);
    if (void 0 !== value) {
      return value;
    }
    if ("object" === typeObj) {
      if (isArray(obj)) {
        return obj.map(mustGetObjId);
      }
      if (isSerializableObject(obj)) {
        const output = {};
        for (const key in obj) {
          const id = getObjId(obj[key]);
          null !== id && (output[key] = id);
        }
        return output;
      }
    }
    throw qError(3, obj);
  });
  const meta = {};
  const refs = {};
  for (const ctx of allContexts) {
    const node = ctx.$element$;
    const elementID = ctx.$id$;
    const ref = ctx.$refMap$;
    const props = ctx.$props$;
    const contexts = ctx.$contexts$;
    const watches = ctx.$watches$;
    const renderQrl = ctx.$componentQrl$;
    const seq = ctx.$seq$;
    const metaValue = {};
    const elementCaptured = isVirtualElement(node) && collector.$elements$.includes(ctx);
    if (ref.length > 0) {
      const value = mapJoin(ref, mustGetObjId, " ");
      value && (refs[elementID] = value);
    } else if (canRender) {
      let add = false;
      if (elementCaptured) {
        const propsId = getObjId(props);
        metaValue.h = mustGetObjId(renderQrl) + (propsId ? " " + propsId : ""), add = true;
      } else {
        const propsId = getObjId(props);
        propsId && (metaValue.h = " " + propsId, add = true);
      }
      if (watches && watches.length > 0) {
        const value = mapJoin(watches, getObjId, " ");
        value && (metaValue.w = value, add = true);
      }
      if (elementCaptured && seq && seq.length > 0) {
        const value = mapJoin(seq, mustGetObjId, " ");
        metaValue.s = value, add = true;
      }
      if (contexts) {
        const serializedContexts = [];
        contexts.forEach((value2, key) => {
          const id = getObjId(value2);
          id && serializedContexts.push(`${key}=${id}`);
        });
        const value = serializedContexts.join(" ");
        value && (metaValue.c = value, add = true);
      }
      add && (meta[elementID] = metaValue);
    }
  }
  return {
    state: {
      refs,
      ctx: meta,
      objs: convertedObjs,
      subs
    },
    objs,
    funcs: collector.$inlinedFunctions$,
    resources: collector.$resources$,
    qrls: collector.$qrls$,
    mode: canRender ? "render" : "listeners"
  };
};
const mapJoin = (objects, getObjectId, sep) => {
  let output = "";
  for (const obj of objects) {
    const id = getObjectId(obj);
    null !== id && ("" !== output && (output += sep), output += id);
  }
  return output;
};
const getNodesInScope = (parent, predicate) => {
  const results = [];
  const v = predicate(parent);
  void 0 !== v && results.push(v);
  const walker = parent.ownerDocument.createTreeWalker(parent, 129, {
    acceptNode(node) {
      if (isContainer(node)) {
        return 2;
      }
      const v2 = predicate(node);
      return void 0 !== v2 && results.push(v2), 3;
    }
  });
  for (; walker.nextNode(); ) {
  }
  return results;
};
const collectProps = (elCtx, collector) => {
  const parentCtx = elCtx.$parent$;
  const props = elCtx.$props$;
  if (parentCtx && props && !isEmptyObj(props) && collector.$elements$.includes(parentCtx)) {
    const subs = getProxyManager(props)?.$subs$;
    const el = elCtx.$element$;
    if (subs) {
      for (const sub of subs) {
        0 === sub[0] ? (sub[1] !== el && collectSubscriptions(getProxyManager(props), collector, false), collectElement(sub[1], collector)) : (collectValue(props, collector, false), collectSubscriptions(getProxyManager(props), collector, false));
      }
    }
  }
};
const createCollector = (containerState) => ({
  $containerState$: containerState,
  $seen$: /* @__PURE__ */ new Set(),
  $objSet$: /* @__PURE__ */ new Set(),
  $prefetch$: 0,
  $noSerialize$: [],
  $inlinedFunctions$: [],
  $resources$: [],
  $elements$: [],
  $qrls$: [],
  $deferElements$: [],
  $promises$: []
});
const collectDeferElement = (el, collector) => {
  const ctx = tryGetContext(el);
  collector.$elements$.includes(ctx) || (collector.$elements$.push(ctx), collector.$prefetch$++, 8 & ctx.$flags$ ? collectElementData(ctx, collector, true) : collector.$deferElements$.push(ctx), collector.$prefetch$--);
};
const collectElement = (el, collector) => {
  const ctx = tryGetContext(el);
  if (ctx) {
    if (collector.$elements$.includes(ctx)) {
      return;
    }
    collector.$elements$.push(ctx), collectElementData(ctx, collector, el);
  }
};
const collectElementData = (elCtx, collector, dynamicCtx) => {
  if (elCtx.$props$ && !isEmptyObj(elCtx.$props$) && (collectValue(elCtx.$props$, collector, dynamicCtx), collectSubscriptions(getProxyManager(elCtx.$props$), collector, dynamicCtx)), elCtx.$componentQrl$ && collectValue(elCtx.$componentQrl$, collector, dynamicCtx), elCtx.$seq$) {
    for (const obj of elCtx.$seq$) {
      collectValue(obj, collector, dynamicCtx);
    }
  }
  if (elCtx.$watches$) {
    const map = collector.$containerState$.$subsManager$.$groupToManagers$;
    for (const obj of elCtx.$watches$) {
      map.has(obj) && collectValue(obj, collector, dynamicCtx);
    }
  }
  if (true === dynamicCtx && (collectContext(elCtx, collector), elCtx.$dynamicSlots$)) {
    for (const slotCtx of elCtx.$dynamicSlots$) {
      collectContext(slotCtx, collector);
    }
  }
};
const collectContext = (elCtx, collector) => {
  for (; elCtx; ) {
    if (elCtx.$contexts$) {
      for (const obj of elCtx.$contexts$.values()) {
        collectValue(obj, collector, true);
      }
      if (true === elCtx.$contexts$.get("_")) {
        break;
      }
    }
    elCtx = elCtx.$slotParent$ ?? elCtx.$parent$;
  }
};
const escapeText$1 = (str) => str.replace(/<(\/?script)/g, "\\x3C$1");
const collectSubscriptions = (manager, collector, leaks) => {
  if (collector.$seen$.has(manager)) {
    return;
  }
  collector.$seen$.add(manager);
  const subs = manager.$subs$;
  for (const key of subs) {
    const type = key[0];
    if (type > 0 && collectValue(key[2], collector, leaks), true === leaks) {
      const host = key[1];
      isNode$1(host) && isVirtualElement(host) ? 0 === type && collectDeferElement(host, collector) : collectValue(host, collector, true);
    }
  }
};
const PROMISE_VALUE = Symbol();
const getPromiseValue = (promise) => promise[PROMISE_VALUE];
const collectValue = (obj, collector, leaks) => {
  if (null !== obj) {
    const objType = typeof obj;
    switch (objType) {
      case "function":
      case "object": {
        const seen = collector.$seen$;
        if (seen.has(obj)) {
          return;
        }
        if (seen.add(obj), fastSkipSerialize(obj)) {
          return collector.$objSet$.add(void 0), void collector.$noSerialize$.push(obj);
        }
        const input = obj;
        const target = getProxyTarget(obj);
        if (target) {
          if (seen.has(obj = target)) {
            return;
          }
          seen.add(obj);
          const mutable = 0 == (2 & getProxyFlags(obj));
          if (leaks && mutable && collectSubscriptions(getProxyManager(input), collector, leaks), fastWeakSerialize(input)) {
            return void collector.$objSet$.add(obj);
          }
        }
        if (collectDeps(obj, collector, leaks)) {
          return void collector.$objSet$.add(obj);
        }
        if (isPromise(obj)) {
          return void collector.$promises$.push((promise = obj, promise.then((value) => (promise[PROMISE_VALUE] = {
            resolved: true,
            value
          }, value), (value) => (promise[PROMISE_VALUE] = {
            resolved: false,
            value
          }, value))).then((value) => {
            collectValue(value, collector, leaks);
          }));
        }
        if ("object" === objType) {
          if (isNode$1(obj)) {
            return;
          }
          if (isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              collectValue(input[i], collector, leaks);
            }
          } else if (isSerializableObject(obj)) {
            for (const key in obj) {
              collectValue(input[key], collector, leaks);
            }
          }
        }
        break;
      }
      case "string":
        if (collector.$seen$.has(obj)) {
          return;
        }
    }
  }
  var promise;
  collector.$objSet$.add(obj);
};
const isContainer = (el) => isElement$1(el) && el.hasAttribute("q:container");
const hasContext = (el) => {
  const node = processVirtualNodes(el);
  if (isQwikElement(node)) {
    const ctx = tryGetContext(node);
    if (ctx && ctx.$id$) {
      return ctx;
    }
  }
};
const getManager = (obj, containerState) => {
  if (!isObject(obj)) {
    return;
  }
  if (obj instanceof SignalImpl) {
    return getProxyManager(obj);
  }
  const proxy = containerState.$proxyMap$.get(obj);
  return proxy ? getProxyManager(proxy) : void 0;
};
const getQId = (el) => {
  const ctx = tryGetContext(el);
  return ctx ? ctx.$id$ : null;
};
const getTextID = (node, containerState) => {
  const prev = node.previousSibling;
  if (prev && isComment(prev) && prev.data.startsWith("t=")) {
    return "#" + prev.data.slice(2);
  }
  const doc = node.ownerDocument;
  const id = intToStr(containerState.$elementIndex$++);
  const open = doc.createComment(`t=${id}`);
  const close = doc.createComment("");
  const parent = node.parentElement;
  return parent.insertBefore(open, node), parent.insertBefore(close, node.nextSibling), "#" + id;
};
const isEmptyObj = (obj) => 0 === Object.keys(obj).length;
const serializeQRL = (qrl, opts = {}) => {
  let symbol = qrl.$symbol$;
  let chunk = qrl.$chunk$;
  const refSymbol = qrl.$refSymbol$ ?? symbol;
  const platform = getPlatform();
  if (platform) {
    const result = platform.chunkForSymbol(refSymbol, chunk);
    result && (chunk = result[1], qrl.$refSymbol$ || (symbol = result[0]));
  }
  if (!chunk) {
    throw qError(31, qrl.$symbol$);
  }
  chunk.startsWith("./") && (chunk = chunk.slice(2));
  let output = `${chunk}#${symbol}`;
  const capture = qrl.$capture$;
  const captureRef = qrl.$captureRef$;
  return captureRef && captureRef.length ? opts.$getObjId$ ? output += `[${mapJoin(captureRef, opts.$getObjId$, " ")}]` : opts.$addRefMap$ && (output += `[${mapJoin(captureRef, opts.$addRefMap$, " ")}]`) : capture && capture.length > 0 && (output += `[${capture.join(" ")}]`), output;
};
const serializeQRLs = (existingQRLs, elCtx) => {
  assertElement(elCtx.$element$);
  const opts = {
    $addRefMap$: (obj) => addToArray(elCtx.$refMap$, obj)
  };
  return mapJoin(existingQRLs, (qrl) => serializeQRL(qrl, opts), "\n");
};
const parseQRL = (qrl, containerEl) => {
  const endIdx = qrl.length;
  const hashIdx = indexOf(qrl, 0, "#");
  const captureIdx = indexOf(qrl, hashIdx, "[");
  const chunkEndIdx = Math.min(hashIdx, captureIdx);
  const chunk = qrl.substring(0, chunkEndIdx);
  const symbolStartIdx = hashIdx == endIdx ? hashIdx : hashIdx + 1;
  const symbol = symbolStartIdx == captureIdx ? "default" : qrl.substring(symbolStartIdx, captureIdx);
  const capture = captureIdx === endIdx ? EMPTY_ARRAY : qrl.substring(captureIdx + 1, endIdx - 1).split(" ");
  const iQrl = createQRL(chunk, symbol, null, null, capture, null, null);
  return containerEl && iQrl.$setContainer$(containerEl), iQrl;
};
const indexOf = (text, startIdx, char) => {
  const endIdx = text.length;
  const charIdx = text.indexOf(char, startIdx == endIdx ? 0 : startIdx);
  return -1 == charIdx ? endIdx : charIdx;
};
const addToArray = (array, obj) => {
  const index = array.indexOf(obj);
  return -1 === index ? (array.push(obj), String(array.length - 1)) : String(index);
};
const inflateQrl = (qrl, elCtx) => (assertDefined(qrl.$capture$), qrl.$captureRef$ = qrl.$capture$.map((idx) => {
  const int = parseInt(idx, 10);
  const obj = elCtx.$refMap$[int];
  return assertTrue(elCtx.$refMap$.length > int), obj;
}));
const _createResourceReturn = (opts) => ({
  __brand: "resource",
  value: void 0,
  loading: !isServerPlatform(),
  _resolved: void 0,
  _error: void 0,
  _state: "pending",
  _timeout: opts?.timeout ?? -1,
  _cache: 0
});
const isResourceReturn = (obj) => isObject(obj) && "resource" === obj.__brand;
const serializeResource = (resource, getObjId) => {
  const state = resource._state;
  return "resolved" === state ? `0 ${getObjId(resource._resolved)}` : "pending" === state ? "1" : `2 ${getObjId(resource._error)}`;
};
const parseResourceReturn = (data) => {
  const [first, id] = data.split(" ");
  const result = _createResourceReturn(void 0);
  return result.value = Promise.resolve(), "0" === first ? (result._state = "resolved", result._resolved = id, result.loading = false) : "1" === first ? (result._state = "pending", result.value = new Promise(() => {
  }), result.loading = true) : "2" === first && (result._state = "rejected", result._error = id, result.loading = false), result;
};
const Slot = (props) => _jsxC(Virtual, {
  "q:s": ""
}, 0, props.name ?? "");
const UNDEFINED_PREFIX = "";
const QRLSerializer = {
  $prefix$: "",
  $test$: (v) => isQrl(v),
  $collect$: (v, collector, leaks) => {
    if (v.$captureRef$) {
      for (const item of v.$captureRef$) {
        collectValue(item, collector, leaks);
      }
    }
    0 === collector.$prefetch$ && collector.$qrls$.push(v);
  },
  $serialize$: (obj, getObjId) => serializeQRL(obj, {
    $getObjId$: getObjId
  }),
  $prepare$: (data, containerState) => parseQRL(data, containerState.$containerEl$),
  $fill$: (qrl, getObject) => {
    qrl.$capture$ && qrl.$capture$.length > 0 && (qrl.$captureRef$ = qrl.$capture$.map(getObject), qrl.$capture$ = null);
  }
};
const TaskSerializer = {
  $prefix$: "",
  $test$: (v) => isSubscriberDescriptor(v),
  $collect$: (v, collector, leaks) => {
    collectValue(v.$qrl$, collector, leaks), v.$state$ && (collectValue(v.$state$, collector, leaks), true === leaks && v.$state$ instanceof SignalImpl && collectSubscriptions(v.$state$[QObjectManagerSymbol], collector, true));
  },
  $serialize$: (obj, getObjId) => serializeWatch(obj, getObjId),
  $prepare$: (data) => parseTask(data),
  $fill$: (watch, getObject) => {
    watch.$el$ = getObject(watch.$el$), watch.$qrl$ = getObject(watch.$qrl$), watch.$state$ && (watch.$state$ = getObject(watch.$state$));
  }
};
const ResourceSerializer = {
  $prefix$: "",
  $test$: (v) => isResourceReturn(v),
  $collect$: (obj, collector, leaks) => {
    collectValue(obj.value, collector, leaks), collectValue(obj._resolved, collector, leaks);
  },
  $serialize$: (obj, getObjId) => serializeResource(obj, getObjId),
  $prepare$: (data) => parseResourceReturn(data),
  $fill$: (resource, getObject) => {
    if ("resolved" === resource._state) {
      resource._resolved = getObject(resource._resolved), resource.value = Promise.resolve(resource._resolved);
    } else if ("rejected" === resource._state) {
      const p = Promise.reject(resource._error);
      p.catch(() => null), resource._error = getObject(resource._error), resource.value = p;
    }
  }
};
const URLSerializer = {
  $prefix$: "",
  $test$: (v) => v instanceof URL,
  $serialize$: (obj) => obj.href,
  $prepare$: (data) => new URL(data),
  $fill$: void 0
};
const DateSerializer = {
  $prefix$: "",
  $test$: (v) => v instanceof Date,
  $serialize$: (obj) => obj.toISOString(),
  $prepare$: (data) => new Date(data),
  $fill$: void 0
};
const RegexSerializer = {
  $prefix$: "\x07",
  $test$: (v) => v instanceof RegExp,
  $serialize$: (obj) => `${obj.flags} ${obj.source}`,
  $prepare$: (data) => {
    const space = data.indexOf(" ");
    const source = data.slice(space + 1);
    const flags = data.slice(0, space);
    return new RegExp(source, flags);
  },
  $fill$: void 0
};
const ErrorSerializer = {
  $prefix$: "",
  $test$: (v) => v instanceof Error,
  $serialize$: (obj) => obj.message,
  $prepare$: (text) => {
    const err = new Error(text);
    return err.stack = void 0, err;
  },
  $fill$: void 0
};
const DocumentSerializer = {
  $prefix$: "",
  $test$: (v) => isDocument(v),
  $serialize$: void 0,
  $prepare$: (_, _c, doc) => doc,
  $fill$: void 0
};
const SERIALIZABLE_STATE = Symbol("serializable-data");
const ComponentSerializer = {
  $prefix$: "",
  $test$: (obj) => isQwikComponent(obj),
  $serialize$: (obj, getObjId) => {
    const [qrl] = obj[SERIALIZABLE_STATE];
    return serializeQRL(qrl, {
      $getObjId$: getObjId
    });
  },
  $prepare$: (data, containerState) => {
    const qrl = parseQRL(data, containerState.$containerEl$);
    return componentQrl(qrl);
  },
  $fill$: (component, getObject) => {
    const [qrl] = component[SERIALIZABLE_STATE];
    qrl.$capture$ && qrl.$capture$.length > 0 && (qrl.$captureRef$ = qrl.$capture$.map(getObject), qrl.$capture$ = null);
  }
};
const DerivedSignalSerializer = {
  $prefix$: "",
  $test$: (obj) => obj instanceof SignalDerived,
  $collect$: (obj, collector, leaks) => {
    if (obj.$args$) {
      for (const arg of obj.$args$) {
        collectValue(arg, collector, leaks);
      }
    }
  },
  $serialize$: (signal, getObjID, collector) => {
    const serialized = serializeDerivedSignalFunc(signal);
    let index = collector.$inlinedFunctions$.indexOf(serialized);
    return index < 0 && (collector.$inlinedFunctions$.push(serialized), index = collector.$inlinedFunctions$.length - 1), mapJoin(signal.$args$, getObjID, " ") + " @" + intToStr(index);
  },
  $prepare$: (data) => {
    const ids = data.split(" ");
    const args = ids.slice(0, -1);
    const fn = ids[ids.length - 1];
    return new SignalDerived(fn, args, fn);
  },
  $fill$: (fn, getObject) => {
    assertString(fn.$func$), fn.$func$ = getObject(fn.$func$), fn.$args$ = fn.$args$.map(getObject);
  }
};
const SignalSerializer = {
  $prefix$: "",
  $test$: (v) => v instanceof SignalImpl,
  $collect$: (obj, collector, leaks) => {
    collectValue(obj.untrackedValue, collector, leaks);
    return true === leaks && 0 == (1 & obj[QObjectSignalFlags]) && collectSubscriptions(obj[QObjectManagerSymbol], collector, true), obj;
  },
  $serialize$: (obj, getObjId) => getObjId(obj.untrackedValue),
  $prepare$: (data, containerState) => new SignalImpl(data, containerState?.$subsManager$?.$createManager$(), 0),
  $subs$: (signal, subs) => {
    signal[QObjectManagerSymbol].$addSubs$(subs);
  },
  $fill$: (signal, getObject) => {
    signal.untrackedValue = getObject(signal.untrackedValue);
  }
};
const SignalWrapperSerializer = {
  $prefix$: "",
  $test$: (v) => v instanceof SignalWrapper,
  $collect$(obj, collector, leaks) {
    if (collectValue(obj.ref, collector, leaks), fastWeakSerialize(obj.ref)) {
      const localManager = getProxyManager(obj.ref);
      isTreeShakeable(collector.$containerState$.$subsManager$, localManager, leaks) && collectValue(obj.ref[obj.prop], collector, leaks);
    }
    return obj;
  },
  $serialize$: (obj, getObjId) => `${getObjId(obj.ref)} ${obj.prop}`,
  $prepare$: (data) => {
    const [id, prop] = data.split(" ");
    return new SignalWrapper(id, prop);
  },
  $fill$: (signal, getObject) => {
    signal.ref = getObject(signal.ref);
  }
};
const NoFiniteNumberSerializer = {
  $prefix$: "",
  $test$: (v) => "number" == typeof v,
  $serialize$: (v) => String(v),
  $prepare$: (data) => Number(data),
  $fill$: void 0
};
const URLSearchParamsSerializer = {
  $prefix$: "",
  $test$: (v) => v instanceof URLSearchParams,
  $serialize$: (obj) => obj.toString(),
  $prepare$: (data) => new URLSearchParams(data),
  $fill$: void 0
};
const FormDataSerializer = {
  $prefix$: "",
  $test$: (v) => "undefined" != typeof FormData && v instanceof globalThis.FormData,
  $serialize$: (formData) => {
    const array = [];
    return formData.forEach((value, key) => {
      array.push("string" == typeof value ? [key, value] : [key, value.name]);
    }), JSON.stringify(array);
  },
  $prepare$: (data) => {
    const array = JSON.parse(data);
    const formData = new FormData();
    for (const [key, value] of array) {
      formData.append(key, value);
    }
    return formData;
  },
  $fill$: void 0
};
const JSXNodeSerializer = {
  $prefix$: "",
  $test$: (v) => isJSXNode(v),
  $collect$: (node, collector, leaks) => {
    collectValue(node.children, collector, leaks), collectValue(node.props, collector, leaks), collectValue(node.immutableProps, collector, leaks);
    let type = node.type;
    type === Slot ? type = ":slot" : type === Fragment && (type = ":fragment"), collectValue(type, collector, leaks);
  },
  $serialize$: (node, getObjID) => {
    let type = node.type;
    return type === Slot ? type = ":slot" : type === Fragment && (type = ":fragment"), `${getObjID(type)} ${getObjID(node.props)} ${getObjID(node.immutableProps)} ${getObjID(node.children)} ${node.flags}`;
  },
  $prepare$: (data) => {
    const [type, props, immutableProps, children, flags] = data.split(" ");
    return new JSXNodeImpl(type, props, immutableProps, children, parseInt(flags, 10));
  },
  $fill$: (node, getObject) => {
    node.type = getResolveJSXType(getObject(node.type)), node.props = getObject(node.props), node.immutableProps = getObject(node.immutableProps), node.children = getObject(node.children);
  }
};
const BigIntSerializer = {
  $prefix$: "",
  $test$: (v) => "bigint" == typeof v,
  $serialize$: (v) => v.toString(),
  $prepare$: (data) => BigInt(data),
  $fill$: void 0
};
const serializers = [QRLSerializer, SignalSerializer, SignalWrapperSerializer, TaskSerializer, ResourceSerializer, URLSerializer, DateSerializer, RegexSerializer, ErrorSerializer, DerivedSignalSerializer, FormDataSerializer, URLSearchParamsSerializer, ComponentSerializer, NoFiniteNumberSerializer, JSXNodeSerializer, BigIntSerializer, DocumentSerializer];
const collectorSerializers = /* @__PURE__ */ serializers.filter((a) => a.$collect$);
const collectDeps = (obj, collector, leaks) => {
  for (const s of collectorSerializers) {
    if (s.$test$(obj)) {
      return s.$collect$(obj, collector, leaks), true;
    }
  }
  return false;
};
const serializeValue = (obj, getObjID, collector, containerState) => {
  for (const s of serializers) {
    if (s.$test$(obj)) {
      let value = s.$prefix$;
      return s.$serialize$ && (value += s.$serialize$(obj, getObjID, collector, containerState)), value;
    }
  }
};
const createParser = (containerState, doc) => {
  const fillMap = /* @__PURE__ */ new Map();
  const subsMap = /* @__PURE__ */ new Map();
  return {
    prepare(data) {
      for (const s of serializers) {
        const prefix = s.$prefix$;
        if (data.startsWith(prefix)) {
          const value = s.$prepare$(data.slice(prefix.length), containerState, doc);
          return s.$fill$ && fillMap.set(value, s), s.$subs$ && subsMap.set(value, s), value;
        }
      }
      return data;
    },
    subs(obj, subs) {
      const serializer = subsMap.get(obj);
      return !!serializer && (serializer.$subs$(obj, subs, containerState), true);
    },
    fill(obj, getObject) {
      const serializer = fillMap.get(obj);
      return !!serializer && (serializer.$fill$(obj, getObject, containerState), true);
    }
  };
};
const OBJECT_TRANSFORMS = {
  "!": (obj, containerState) => containerState.$proxyMap$.get(obj) ?? getOrCreateProxy(obj, containerState),
  "~": (obj) => Promise.resolve(obj),
  _: (obj) => Promise.reject(obj)
};
const isTreeShakeable = (manager, target, leaks) => {
  if ("boolean" == typeof leaks) {
    return leaks;
  }
  const localManager = manager.$groupToManagers$.get(leaks);
  return !!(localManager && localManager.length > 0) && (1 !== localManager.length || localManager[0] !== target);
};
const getResolveJSXType = (type) => ":slot" === type ? Slot : ":fragment" === type ? Fragment : type;
const noSerializeSet = /* @__PURE__ */ new WeakSet();
const weakSerializeSet = /* @__PURE__ */ new WeakSet();
const fastSkipSerialize = (obj) => noSerializeSet.has(obj);
const fastWeakSerialize = (obj) => weakSerializeSet.has(obj);
const noSerialize = (input) => (null != input && noSerializeSet.add(input), input);
const unwrapProxy = (proxy) => isObject(proxy) ? getProxyTarget(proxy) ?? proxy : proxy;
const getProxyTarget = (obj) => obj[QOjectTargetSymbol];
const getProxyManager = (obj) => obj[QObjectManagerSymbol];
const getProxyFlags = (obj) => obj[QObjectFlagsSymbol];
const serializeSubscription = (sub, getObjId) => {
  const type = sub[0];
  const host = "string" == typeof sub[1] ? sub[1] : getObjId(sub[1]);
  if (!host) {
    return;
  }
  let base = type + " " + host;
  let key;
  if (0 === type) {
    key = sub[2];
  } else {
    const signalID = getObjId(sub[2]);
    if (!signalID) {
      return;
    }
    if (type <= 2) {
      key = sub[5], base += ` ${signalID} ${must(getObjId(sub[3]))} ${sub[4]}`;
    } else if (type <= 4) {
      key = sub[4];
      base += ` ${signalID} ${"string" == typeof sub[3] ? sub[3] : must(getObjId(sub[3]))}`;
    } else
      ;
  }
  return key && (base += ` ${encodeURI(key)}`), base;
};
const parseSubscription = (sub, getObject) => {
  const parts = sub.split(" ");
  const type = parseInt(parts[0], 10);
  assertTrue(parts.length >= 2);
  const host = getObject(parts[1]);
  if (!host) {
    return;
  }
  if (isSubscriberDescriptor(host) && !host.$el$) {
    return;
  }
  const subscription = [type, host];
  return 0 === type ? (assertTrue(parts.length <= 3), subscription.push(safeDecode(parts[2]))) : type <= 2 ? (assertTrue(5 === parts.length || 6 === parts.length), subscription.push(getObject(parts[2]), getObject(parts[3]), parts[4], safeDecode(parts[5]))) : type <= 4 && (assertTrue(4 === parts.length || 5 === parts.length), subscription.push(getObject(parts[2]), getObject(parts[3]), safeDecode(parts[4]))), subscription;
};
const safeDecode = (str) => {
  if (void 0 !== str) {
    return decodeURI(str);
  }
};
const createSubscriptionManager = (containerState) => {
  const groupToManagers = /* @__PURE__ */ new Map();
  const manager = {
    $groupToManagers$: groupToManagers,
    $createManager$: (initialMap) => new LocalSubscriptionManager(groupToManagers, containerState, initialMap),
    $clearSub$: (group) => {
      const managers = groupToManagers.get(group);
      if (managers) {
        for (const manager2 of managers) {
          manager2.$unsubGroup$(group);
        }
        groupToManagers.delete(group), managers.length = 0;
      }
    },
    $clearSignal$: (signal) => {
      const managers = groupToManagers.get(signal[1]);
      if (managers) {
        for (const manager2 of managers) {
          manager2.$unsubEntry$(signal);
        }
      }
    }
  };
  return manager;
};
class LocalSubscriptionManager {
  constructor($groupToManagers$, $containerState$, initialMap) {
    this.$groupToManagers$ = $groupToManagers$, this.$containerState$ = $containerState$, this.$subs$ = [], initialMap && this.$addSubs$(initialMap);
  }
  $addSubs$(subs) {
    this.$subs$.push(...subs);
    for (const sub of this.$subs$) {
      this.$addToGroup$(sub[1], this);
    }
  }
  $addToGroup$(group, manager) {
    let managers = this.$groupToManagers$.get(group);
    managers || this.$groupToManagers$.set(group, managers = []), managers.includes(manager) || managers.push(manager);
  }
  $unsubGroup$(group) {
    const subs = this.$subs$;
    for (let i = 0; i < subs.length; i++) {
      subs[i][1] === group && (subs.splice(i, 1), i--);
    }
  }
  $unsubEntry$(entry) {
    const [type, group, signal, elm] = entry;
    const subs = this.$subs$;
    if (1 === type || 2 === type) {
      const prop = entry[4];
      for (let i = 0; i < subs.length; i++) {
        const sub = subs[i];
        sub[0] === type && sub[1] === group && sub[2] === signal && sub[3] === elm && sub[4] === prop && (subs.splice(i, 1), i--);
      }
    } else if (3 === type || 4 === type) {
      for (let i = 0; i < subs.length; i++) {
        const sub = subs[i];
        sub[0] === type && sub[1] === group && sub[2] === signal && sub[3] === elm && (subs.splice(i, 1), i--);
      }
    }
  }
  $addSub$(sub, key) {
    const subs = this.$subs$;
    const group = sub[1];
    0 === sub[0] && subs.some(([_type, _group, _key]) => 0 === _type && _group === group && _key === key) || (subs.push([...sub, key]), this.$addToGroup$(group, this));
  }
  $notifySubs$(key) {
    const subs = this.$subs$;
    for (const sub of subs) {
      const compare = sub[sub.length - 1];
      key && compare && compare !== key || notifyChange(sub, this.$containerState$);
    }
  }
}
const must = (a) => {
  if (null == a) {
    throw logError("must be non null", a);
  }
  return a;
};
const isQrl = (value) => "function" == typeof value && "function" == typeof value.getSymbol;
const createQRL = (chunk, symbol, symbolRef, symbolFn, capture, captureRef, refSymbol) => {
  let _containerEl;
  const setContainer = (el) => (_containerEl || (_containerEl = el), _containerEl);
  const resolve = async (containerEl) => {
    if (containerEl && setContainer(containerEl), null !== symbolRef) {
      return symbolRef;
    }
    if (null !== symbolFn) {
      return symbolRef = symbolFn().then((module2) => symbolRef = module2[symbol]);
    }
    {
      const symbol2 = getPlatform().importSymbol(_containerEl, chunk, symbol);
      return symbolRef = then(symbol2, (ref) => symbolRef = ref);
    }
  };
  const resolveLazy = (containerEl) => null !== symbolRef ? symbolRef : resolve(containerEl);
  function invokeFn(currentCtx, beforeFn) {
    return (...args) => {
      const start = now();
      const fn = resolveLazy();
      return then(fn, (fn2) => {
        if (isFunction(fn2)) {
          if (beforeFn && false === beforeFn()) {
            return;
          }
          const context = {
            ...createInvocationContext(currentCtx),
            $qrl$: QRL
          };
          return void 0 === context.$event$ && (context.$event$ = this), emitUsedSymbol(symbol, context.$element$, start), invoke.call(this, context, fn2, ...args);
        }
        throw qError(10);
      });
    };
  }
  const createInvocationContext = (invoke2) => null == invoke2 ? newInvokeContext() : isArray(invoke2) ? newInvokeContextFromTuple(invoke2) : invoke2;
  const invokeQRL = async function(...args) {
    const fn = invokeFn.call(this, tryGetInvokeContext());
    return await fn(...args);
  };
  const resolvedSymbol = refSymbol ?? symbol;
  const hash = getSymbolHash$1(resolvedSymbol);
  const QRL = invokeQRL;
  const qrl = Object.assign(invokeQRL, {
    getSymbol: () => resolvedSymbol,
    getHash: () => hash,
    getCaptured: () => captureRef,
    resolve,
    $resolveLazy$: resolveLazy,
    $setContainer$: setContainer,
    $chunk$: chunk,
    $symbol$: symbol,
    $refSymbol$: refSymbol,
    $hash$: hash,
    getFn: invokeFn,
    $capture$: capture,
    $captureRef$: captureRef,
    dev: null
  });
  return qrl;
};
const getSymbolHash$1 = (symbolName) => {
  const index = symbolName.lastIndexOf("_");
  return index > -1 ? symbolName.slice(index + 1) : symbolName;
};
function assertQrl() {
}
function assertSignal() {
}
const EMITTED = /* @__PURE__ */ new Set();
const emitUsedSymbol = (symbol, element, reqTime) => {
  EMITTED.has(symbol) || (EMITTED.add(symbol), emitEvent("qsymbol", {
    symbol,
    element,
    reqTime
  }));
};
const emitEvent = (eventName, detail) => {
  isServerPlatform() || "object" != typeof document || document.dispatchEvent(new CustomEvent(eventName, {
    bubbles: false,
    detail
  }));
};
const now = () => isServerPlatform() ? 0 : "object" == typeof performance ? performance.now() : 0;
const componentQrl = (componentQrl2) => {
  function QwikComponent(props, key, flags) {
    const hash = componentQrl2.$hash$.slice(0, 4);
    return _jsxC(Virtual, {
      "q:renderFn": componentQrl2,
      [QSlot]: props[QSlot],
      [_IMMUTABLE]: props[_IMMUTABLE],
      children: props.children,
      props
    }, flags, hash + ":" + (key || ""));
  }
  return QwikComponent[SERIALIZABLE_STATE] = [componentQrl2], QwikComponent;
};
const isQwikComponent = (component) => "function" == typeof component && void 0 !== component[SERIALIZABLE_STATE];
/**
 * @license
 * @builder.io/qwik/server 1.1.5
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/BuilderIO/qwik/blob/main/LICENSE
 */
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
function createPlatform(opts, resolvedManifest) {
  const mapper = resolvedManifest?.mapper;
  const mapperFn = opts.symbolMapper ? opts.symbolMapper : (symbolName) => {
    if (mapper) {
      const hash = getSymbolHash(symbolName);
      const result = mapper[hash];
      if (!result) {
        const isRegistered = globalThis.__qwik_reg_symbols?.has(hash);
        if (isRegistered) {
          return [symbolName, "_"];
        }
        console.error("Cannot resolve symbol", symbolName, "in", mapper);
      }
      return result;
    }
  };
  const serverPlatform = {
    isServer: true,
    async importSymbol(_containerEl, url, symbolName) {
      const hash = getSymbolHash(symbolName);
      const regSym = globalThis.__qwik_reg_symbols?.get(hash);
      if (regSym) {
        return regSym;
      }
      let modulePath = String(url);
      if (!modulePath.endsWith(".js")) {
        modulePath += ".js";
      }
      const module2 = __require(modulePath);
      if (!(symbolName in module2)) {
        throw new Error(`Q-ERROR: missing symbol '${symbolName}' in module '${modulePath}'.`);
      }
      return module2[symbolName];
    },
    raf: () => {
      console.error("server can not rerender");
      return Promise.resolve();
    },
    nextTick: (fn) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn());
        });
      });
    },
    chunkForSymbol(symbolName) {
      return mapperFn(symbolName, mapper);
    }
  };
  return serverPlatform;
}
async function setServerPlatform(opts, manifest2) {
  const platform = createPlatform(opts, manifest2);
  setPlatform(platform);
}
var getSymbolHash = (symbolName) => {
  const index = symbolName.lastIndexOf("_");
  if (index > -1) {
    return symbolName.slice(index + 1);
  }
  return symbolName;
};
function createTimer() {
  if (typeof performance === "undefined") {
    return () => 0;
  }
  const start = performance.now();
  return () => {
    const end = performance.now();
    const delta = end - start;
    return delta / 1e6;
  };
}
function getBuildBase(opts) {
  let base = opts.base;
  if (typeof opts.base === "function") {
    base = opts.base(opts);
  }
  if (typeof base === "string") {
    if (!base.endsWith("/")) {
      base += "/";
    }
    return base;
  }
  return "/build/";
}
var QWIK_LOADER_DEFAULT_MINIFIED = '((e,t)=>{const n="__q_context__",o=window,s=new Set,i=t=>e.querySelectorAll(t),a=(e,t,n=t.type)=>{i("[on"+e+"\\\\:"+n+"]").forEach((o=>f(o,e,t,n)))},r=(e,t)=>e.getAttribute(t),l=t=>{if(void 0===t._qwikjson_){let n=(t===e.documentElement?e.body:t).lastElementChild;for(;n;){if("SCRIPT"===n.tagName&&"qwik/json"===r(n,"type")){t._qwikjson_=JSON.parse(n.textContent.replace(/\\\\x3C(\\/?script)/g,"<$1"));break}n=n.previousElementSibling}}},c=(e,t)=>new CustomEvent(e,{detail:t}),f=async(t,o,s,i=s.type)=>{const a="on"+o+":"+i;t.hasAttribute("preventdefault:"+i)&&s.preventDefault();const c=t._qc_,f=null==c?void 0:c.li.filter((e=>e[0]===a));if(f&&f.length>0){for(const e of f)await e[1].getFn([t,s],(()=>t.isConnected))(s,t);return}const b=r(t,a);if(b){const o=t.closest("[q\\\\:container]"),i=new URL(r(o,"q:base"),e.baseURI);for(const a of b.split("\\n")){const r=new URL(a,i),c=r.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",f=performance.now(),b=import(r.href.split("#")[0]);l(o);const p=(await b)[c],u=e[n];if(t.isConnected)try{e[n]=[t,s,r],d("qsymbol",{symbol:c,element:t,reqTime:f}),await p(s,t)}finally{e[n]=u}}}},d=(t,n)=>{e.dispatchEvent(c(t,n))},b=e=>e.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),p=async e=>{let t=b(e.type),n=e.target;for(a("-document",e,t);n&&n.getAttribute;)await f(n,"",e,t),n=e.bubbles&&!0!==e.cancelBubble?n.parentElement:null},u=e=>{a("-window",e,b(e.type))},w=()=>{var n;const a=e.readyState;if(!t&&("interactive"==a||"complete"==a)&&(t=1,d("qinit"),(null!=(n=o.requestIdleCallback)?n:o.setTimeout).bind(o)((()=>d("qidle"))),s.has("qvisible"))){const e=i("[on\\\\:qvisible]"),t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),f(n.target,"",c("qvisible",n)))}));e.forEach((e=>t.observe(e)))}},q=(e,t,n,o=!1)=>e.addEventListener(t,n,{capture:o,passive:!1}),v=t=>{for(const n of t)s.has(n)||(q(e,n,p,!0),q(o,n,u),s.add(n))};if(!e.qR){const t=o.qwikevents;Array.isArray(t)&&v(t),o.qwikevents={push:(...e)=>v(e)},q(e,"readystatechange",w),w()}})(document);';
var QWIK_LOADER_DEFAULT_DEBUG = '(() => {\n    ((doc, hasInitialized) => {\n        const win = window;\n        const events =  new Set;\n        const querySelectorAll = query => doc.querySelectorAll(query);\n        const broadcast = (infix, ev, type = ev.type) => {\n            querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, ev, type)));\n        };\n        const getAttribute = (el, name) => el.getAttribute(name);\n        const resolveContainer = containerEl => {\n            if (void 0 === containerEl._qwikjson_) {\n                let script = (containerEl === doc.documentElement ? doc.body : containerEl).lastElementChild;\n                while (script) {\n                    if ("SCRIPT" === script.tagName && "qwik/json" === getAttribute(script, "type")) {\n                        containerEl._qwikjson_ = JSON.parse(script.textContent.replace(/\\\\x3C(\\/?script)/g, "<$1"));\n                        break;\n                    }\n                    script = script.previousElementSibling;\n                }\n            }\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {\n            const attrName = "on" + onPrefix + ":" + eventName;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const ctx = element._qc_;\n            const qrls = null == ctx ? void 0 : ctx.li.filter((li => li[0] === attrName));\n            if (qrls && qrls.length > 0) {\n                for (const q of qrls) {\n                    await q[1].getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = getAttribute(element, attrName);\n            if (attrValue) {\n                const container = element.closest("[q\\\\:container]");\n                const base = new URL(getAttribute(container, "q:base"), doc.baseURI);\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = new URL(qrl, base);\n                    const symbolName = url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n                    const reqTime = performance.now();\n                    const module = import(url.href.split("#")[0]);\n                    resolveContainer(container);\n                    const handler = (await module)[symbolName];\n                    const previousCtx = doc.__q_context__;\n                    if (element.isConnected) {\n                        try {\n                            doc.__q_context__ = [ element, ev, url ];\n                            emitEvent("qsymbol", {\n                                symbol: symbolName,\n                                element: element,\n                                reqTime: reqTime\n                            });\n                            await handler(ev, element);\n                        } finally {\n                            doc.__q_context__ = previousCtx;\n                        }\n                    }\n                }\n            }\n        };\n        const emitEvent = (eventName, detail) => {\n            doc.dispatchEvent(createEvent(eventName, detail));\n        };\n        const camelToKebab = str => str.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n        const processDocumentEvent = async ev => {\n            let type = camelToKebab(ev.type);\n            let element = ev.target;\n            broadcast("-document", ev, type);\n            while (element && element.getAttribute) {\n                await dispatch(element, "", ev, type);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev, camelToKebab(ev.type));\n        };\n        const processReadyStateChange = () => {\n            var _a;\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                emitEvent("qinit");\n                (null != (_a = win.requestIdleCallback) ? _a : win.setTimeout).bind(win)((() => emitEvent("qidle")));\n                if (events.has("qvisible")) {\n                    const results = querySelectorAll("[on\\\\:qvisible]");\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addEventListener = (el, eventName, handler, capture = !1) => el.addEventListener(eventName, handler, {\n            capture: capture,\n            passive: !1\n        });\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    addEventListener(doc, eventName, processDocumentEvent, !0);\n                    addEventListener(win, eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            addEventListener(doc, "readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
var QWIK_LOADER_OPTIMIZE_MINIFIED = '((e,t)=>{const n="__q_context__",o=window,s=new Set,i=t=>e.querySelectorAll(t),a=(e,t,n=t.type)=>{i("[on"+e+"\\\\:"+n+"]").forEach((o=>f(o,e,t,n)))},r=(e,t)=>e.getAttribute(t),l=t=>{if(void 0===t._qwikjson_){let n=(t===e.documentElement?e.body:t).lastElementChild;for(;n;){if("SCRIPT"===n.tagName&&"qwik/json"===r(n,"type")){t._qwikjson_=JSON.parse(n.textContent.replace(/\\\\x3C(\\/?script)/g,"<$1"));break}n=n.previousElementSibling}}},c=(e,t)=>new CustomEvent(e,{detail:t}),f=async(t,o,s,i=s.type)=>{const a="on"+o+":"+i;t.hasAttribute("preventdefault:"+i)&&s.preventDefault();const c=t._qc_,f=null==c?void 0:c.li.filter((e=>e[0]===a));if(f&&f.length>0){for(const e of f)await e[1].getFn([t,s],(()=>t.isConnected))(s,t);return}const b=r(t,a);if(b){const o=t.closest("[q\\\\:container]"),i=new URL(r(o,"q:base"),e.baseURI);for(const a of b.split("\\n")){const r=new URL(a,i),c=r.hash.replace(/^#?([^?[|]*).*$/,"$1")||"default",f=performance.now(),b=import(r.href.split("#")[0]);l(o);const p=(await b)[c],u=e[n];if(t.isConnected)try{e[n]=[t,s,r],d("qsymbol",{symbol:c,element:t,reqTime:f}),await p(s,t)}finally{e[n]=u}}}},d=(t,n)=>{e.dispatchEvent(c(t,n))},b=e=>e.replace(/([A-Z])/g,(e=>"-"+e.toLowerCase())),p=async e=>{let t=b(e.type),n=e.target;for(a("-document",e,t);n&&n.getAttribute;)await f(n,"",e,t),n=e.bubbles&&!0!==e.cancelBubble?n.parentElement:null},u=e=>{a("-window",e,b(e.type))},w=()=>{var n;const a=e.readyState;if(!t&&("interactive"==a||"complete"==a)&&(t=1,d("qinit"),(null!=(n=o.requestIdleCallback)?n:o.setTimeout).bind(o)((()=>d("qidle"))),s.has("qvisible"))){const e=i("[on\\\\:qvisible]"),t=new IntersectionObserver((e=>{for(const n of e)n.isIntersecting&&(t.unobserve(n.target),f(n.target,"",c("qvisible",n)))}));e.forEach((e=>t.observe(e)))}},q=(e,t,n,o=!1)=>e.addEventListener(t,n,{capture:o,passive:!1}),v=t=>{for(const n of t)s.has(n)||(q(e,n,p,!0),q(o,n,u),s.add(n))};if(!e.qR){const t=o.qwikevents;Array.isArray(t)&&v(t),o.qwikevents={push:(...e)=>v(e)},q(e,"readystatechange",w),w()}})(document);';
var QWIK_LOADER_OPTIMIZE_DEBUG = '(() => {\n    ((doc, hasInitialized) => {\n        const win = window;\n        const events = new Set;\n        const querySelectorAll = query => doc.querySelectorAll(query);\n        const broadcast = (infix, ev, type = ev.type) => {\n            querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((target => dispatch(target, infix, ev, type)));\n        };\n        const getAttribute = (el, name) => el.getAttribute(name);\n        const resolveContainer = containerEl => {\n            if (void 0 === containerEl._qwikjson_) {\n                let script = (containerEl === doc.documentElement ? doc.body : containerEl).lastElementChild;\n                while (script) {\n                    if ("SCRIPT" === script.tagName && "qwik/json" === getAttribute(script, "type")) {\n                        containerEl._qwikjson_ = JSON.parse(script.textContent.replace(/\\\\x3C(\\/?script)/g, "<$1"));\n                        break;\n                    }\n                    script = script.previousElementSibling;\n                }\n            }\n        };\n        const createEvent = (eventName, detail) => new CustomEvent(eventName, {\n            detail: detail\n        });\n        const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {\n            const attrName = "on" + onPrefix + ":" + eventName;\n            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();\n            const ctx = element._qc_;\n            const qrls = null == ctx ? void 0 : ctx.li.filter((li => li[0] === attrName));\n            if (qrls && qrls.length > 0) {\n                for (const q of qrls) {\n                    await q[1].getFn([ element, ev ], (() => element.isConnected))(ev, element);\n                }\n                return;\n            }\n            const attrValue = getAttribute(element, attrName);\n            if (attrValue) {\n                const container = element.closest("[q\\\\:container]");\n                const base = new URL(getAttribute(container, "q:base"), doc.baseURI);\n                for (const qrl of attrValue.split("\\n")) {\n                    const url = new URL(qrl, base);\n                    const symbolName = url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";\n                    const reqTime = performance.now();\n                    const module = import(url.href.split("#")[0]);\n                    resolveContainer(container);\n                    const handler = (await module)[symbolName];\n                    const previousCtx = doc.__q_context__;\n                    if (element.isConnected) {\n                        try {\n                            doc.__q_context__ = [ element, ev, url ];\n                            emitEvent("qsymbol", {\n                                symbol: symbolName,\n                                element: element,\n                                reqTime: reqTime\n                            });\n                            await handler(ev, element);\n                        } finally {\n                            doc.__q_context__ = previousCtx;\n                        }\n                    }\n                }\n            }\n        };\n        const emitEvent = (eventName, detail) => {\n            doc.dispatchEvent(createEvent(eventName, detail));\n        };\n        const camelToKebab = str => str.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));\n        const processDocumentEvent = async ev => {\n            let type = camelToKebab(ev.type);\n            let element = ev.target;\n            broadcast("-document", ev, type);\n            while (element && element.getAttribute) {\n                await dispatch(element, "", ev, type);\n                element = ev.bubbles && !0 !== ev.cancelBubble ? element.parentElement : null;\n            }\n        };\n        const processWindowEvent = ev => {\n            broadcast("-window", ev, camelToKebab(ev.type));\n        };\n        const processReadyStateChange = () => {\n            var _a;\n            const readyState = doc.readyState;\n            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {\n                hasInitialized = 1;\n                emitEvent("qinit");\n                (null != (_a = win.requestIdleCallback) ? _a : win.setTimeout).bind(win)((() => emitEvent("qidle")));\n                if (events.has("qvisible")) {\n                    const results = querySelectorAll("[on\\\\:qvisible]");\n                    const observer = new IntersectionObserver((entries => {\n                        for (const entry of entries) {\n                            if (entry.isIntersecting) {\n                                observer.unobserve(entry.target);\n                                dispatch(entry.target, "", createEvent("qvisible", entry));\n                            }\n                        }\n                    }));\n                    results.forEach((el => observer.observe(el)));\n                }\n            }\n        };\n        const addEventListener = (el, eventName, handler, capture = !1) => el.addEventListener(eventName, handler, {\n            capture: capture,\n            passive: !1\n        });\n        const push = eventNames => {\n            for (const eventName of eventNames) {\n                if (!events.has(eventName)) {\n                    addEventListener(doc, eventName, processDocumentEvent, !0);\n                    addEventListener(win, eventName, processWindowEvent);\n                    events.add(eventName);\n                }\n            }\n        };\n        if (!doc.qR) {\n            const qwikevents = win.qwikevents;\n            Array.isArray(qwikevents) && push(qwikevents);\n            win.qwikevents = {\n                push: (...e) => push(e)\n            };\n            addEventListener(doc, "readystatechange", processReadyStateChange);\n            processReadyStateChange();\n        }\n    })(document);\n})();';
function getQwikLoaderScript(opts = {}) {
  if (Array.isArray(opts.events) && opts.events.length > 0) {
    const loader = opts.debug ? QWIK_LOADER_OPTIMIZE_DEBUG : QWIK_LOADER_OPTIMIZE_MINIFIED;
    return loader.replace("window.qEvents", JSON.stringify(opts.events));
  }
  return opts.debug ? QWIK_LOADER_DEFAULT_DEBUG : QWIK_LOADER_DEFAULT_MINIFIED;
}
function getPrefetchResources(snapshotResult, opts, resolvedManifest) {
  if (!resolvedManifest) {
    return [];
  }
  const prefetchStrategy = opts.prefetchStrategy;
  const buildBase = getBuildBase(opts);
  if (prefetchStrategy !== null) {
    if (!prefetchStrategy || !prefetchStrategy.symbolsToPrefetch || prefetchStrategy.symbolsToPrefetch === "auto") {
      return getAutoPrefetch(snapshotResult, resolvedManifest, buildBase);
    }
    if (typeof prefetchStrategy.symbolsToPrefetch === "function") {
      try {
        return prefetchStrategy.symbolsToPrefetch({ manifest: resolvedManifest.manifest });
      } catch (e) {
        console.error("getPrefetchUrls, symbolsToPrefetch()", e);
      }
    }
  }
  return [];
}
function getAutoPrefetch(snapshotResult, resolvedManifest, buildBase) {
  const prefetchResources = [];
  const qrls = snapshotResult?.qrls;
  const { mapper, manifest: manifest2 } = resolvedManifest;
  const urls = /* @__PURE__ */ new Set();
  if (Array.isArray(qrls)) {
    for (const obj of qrls) {
      const qrlSymbolName = obj.getHash();
      const resolvedSymbol = mapper[qrlSymbolName];
      if (resolvedSymbol) {
        addBundle(manifest2, urls, prefetchResources, buildBase, resolvedSymbol[1]);
      }
    }
  }
  return prefetchResources;
}
function addBundle(manifest2, urls, prefetchResources, buildBase, bundleFileName) {
  const url = buildBase + bundleFileName;
  if (!urls.has(url)) {
    urls.add(url);
    const bundle = manifest2.bundles[bundleFileName];
    if (bundle) {
      const prefetchResource = {
        url,
        imports: []
      };
      prefetchResources.push(prefetchResource);
      if (Array.isArray(bundle.imports)) {
        for (const importedFilename of bundle.imports) {
          addBundle(manifest2, urls, prefetchResource.imports, buildBase, importedFilename);
        }
      }
    }
  }
}
function getValidManifest(manifest2) {
  if (manifest2 != null && manifest2.mapping != null && typeof manifest2.mapping === "object" && manifest2.symbols != null && typeof manifest2.symbols === "object" && manifest2.bundles != null && typeof manifest2.bundles === "object") {
    return manifest2;
  }
  return void 0;
}
function workerFetchScript() {
  const fetch = `Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})`;
  const workerBody = `onmessage=(e)=>{${fetch}}`;
  const blob = `new Blob(['${workerBody}'],{type:"text/javascript"})`;
  const url = `URL.createObjectURL(${blob})`;
  let s = `const w=new Worker(${url});`;
  s += `w.postMessage(u.map(u=>new URL(u,origin)+''));`;
  s += `w.onmessage=()=>{w.terminate()};`;
  return s;
}
function prefetchUrlsEventScript(prefetchResources) {
  const data = {
    bundles: flattenPrefetchResources(prefetchResources).map((u) => u.split("/").pop())
  };
  return `document.dispatchEvent(new CustomEvent("qprefetch",{detail:${JSON.stringify(data)}}))`;
}
function flattenPrefetchResources(prefetchResources) {
  const urls = [];
  const addPrefetchResource = (prefetchResources2) => {
    if (Array.isArray(prefetchResources2)) {
      for (const prefetchResource of prefetchResources2) {
        if (!urls.includes(prefetchResource.url)) {
          urls.push(prefetchResource.url);
          addPrefetchResource(prefetchResource.imports);
        }
      }
    }
  };
  addPrefetchResource(prefetchResources);
  return urls;
}
function applyPrefetchImplementation(prefetchStrategy, prefetchResources, nonce) {
  const prefetchImpl = normalizePrefetchImplementation(prefetchStrategy?.implementation);
  const prefetchNodes = [];
  if (prefetchImpl.prefetchEvent === "always") {
    prefetchUrlsEvent(prefetchNodes, prefetchResources, nonce);
  }
  if (prefetchImpl.linkInsert === "html-append") {
    linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl);
  }
  if (prefetchImpl.linkInsert === "js-append") {
    linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl, nonce);
  } else if (prefetchImpl.workerFetchInsert === "always") {
    workerFetchImplementation(prefetchNodes, prefetchResources, nonce);
  }
  if (prefetchNodes.length > 0) {
    return jsx(Fragment, { children: prefetchNodes });
  }
  return null;
}
function prefetchUrlsEvent(prefetchNodes, prefetchResources, nonce) {
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: prefetchUrlsEventScript(prefetchResources),
      nonce
    })
  );
}
function linkHtmlImplementation(prefetchNodes, prefetchResources, prefetchImpl) {
  const urls = flattenPrefetchResources(prefetchResources);
  const rel = prefetchImpl.linkRel || "prefetch";
  for (const url of urls) {
    const attributes = {};
    attributes["href"] = url;
    attributes["rel"] = rel;
    if (rel === "prefetch" || rel === "preload") {
      if (url.endsWith(".js")) {
        attributes["as"] = "script";
      }
    }
    prefetchNodes.push(jsx("link", attributes, void 0));
  }
}
function linkJsImplementation(prefetchNodes, prefetchResources, prefetchImpl, nonce) {
  const rel = prefetchImpl.linkRel || "prefetch";
  let s = ``;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `let supportsLinkRel = true;`;
  }
  s += `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += `u.map((u,i)=>{`;
  s += `const l=document.createElement('link');`;
  s += `l.setAttribute("href",u);`;
  s += `l.setAttribute("rel","${rel}");`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(i===0){`;
    s += `try{`;
    s += `supportsLinkRel=l.relList.supports("${rel}");`;
    s += `}catch(e){}`;
    s += `}`;
  }
  s += `document.body.appendChild(l);`;
  s += `});`;
  if (prefetchImpl.workerFetchInsert === "no-link-support") {
    s += `if(!supportsLinkRel){`;
    s += workerFetchScript();
    s += `}`;
  }
  if (prefetchImpl.workerFetchInsert === "always") {
    s += workerFetchScript();
  }
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: s,
      nonce
    })
  );
}
function workerFetchImplementation(prefetchNodes, prefetchResources, nonce) {
  let s = `const u=${JSON.stringify(flattenPrefetchResources(prefetchResources))};`;
  s += workerFetchScript();
  prefetchNodes.push(
    jsx("script", {
      type: "module",
      dangerouslySetInnerHTML: s,
      nonce
    })
  );
}
function normalizePrefetchImplementation(input) {
  if (input && typeof input === "object") {
    return input;
  }
  return PrefetchImplementationDefault;
}
var PrefetchImplementationDefault = {
  linkInsert: null,
  linkRel: null,
  workerFetchInsert: null,
  prefetchEvent: "always"
};
var DOCTYPE = "<!DOCTYPE html>";
async function renderToStream(rootNode, opts) {
  let stream = opts.stream;
  let bufferSize = 0;
  let totalSize = 0;
  let networkFlushes = 0;
  let firstFlushTime = 0;
  let buffer = "";
  let snapshotResult;
  const inOrderStreaming = opts.streaming?.inOrder ?? {
    strategy: "auto",
    maximunInitialChunk: 5e4,
    maximunChunk: 3e4
  };
  const containerTagName = opts.containerTagName ?? "html";
  const containerAttributes = opts.containerAttributes ?? {};
  const nativeStream = stream;
  const firstFlushTimer = createTimer();
  const buildBase = getBuildBase(opts);
  const resolvedManifest = resolveManifest(opts.manifest);
  function flush() {
    if (buffer) {
      nativeStream.write(buffer);
      buffer = "";
      bufferSize = 0;
      networkFlushes++;
      if (networkFlushes === 1) {
        firstFlushTime = firstFlushTimer();
      }
    }
  }
  function enqueue(chunk) {
    const len = chunk.length;
    bufferSize += len;
    totalSize += len;
    buffer += chunk;
  }
  switch (inOrderStreaming.strategy) {
    case "disabled":
      stream = {
        write: enqueue
      };
      break;
    case "direct":
      stream = nativeStream;
      break;
    case "auto":
      let count = 0;
      let forceFlush = false;
      const minimunChunkSize = inOrderStreaming.maximunChunk ?? 0;
      const initialChunkSize = inOrderStreaming.maximunInitialChunk ?? 0;
      stream = {
        write(chunk) {
          if (chunk === "<!--qkssr-f-->") {
            forceFlush || (forceFlush = true);
          } else if (chunk === "<!--qkssr-pu-->") {
            count++;
          } else if (chunk === "<!--qkssr-po-->") {
            count--;
          } else {
            enqueue(chunk);
          }
          const chunkSize = networkFlushes === 0 ? initialChunkSize : minimunChunkSize;
          if (count === 0 && (forceFlush || bufferSize >= chunkSize)) {
            forceFlush = false;
            flush();
          }
        }
      };
      break;
  }
  if (containerTagName === "html") {
    stream.write(DOCTYPE);
  } else {
    stream.write("<!--cq-->");
    if (opts.qwikLoader) {
      if (opts.qwikLoader.include === void 0) {
        opts.qwikLoader.include = "never";
      }
      if (opts.qwikLoader.position === void 0) {
        opts.qwikLoader.position = "bottom";
      }
    } else {
      opts.qwikLoader = {
        include: "never"
      };
    }
  }
  if (!opts.manifest) {
    console.warn(
      `Missing client manifest, loading symbols in the client might 404. Please ensure the client build has run and generated the manifest for the server build.`
    );
  }
  await setServerPlatform(opts, resolvedManifest);
  const injections = resolvedManifest?.manifest.injections;
  const beforeContent = injections ? injections.map((injection) => jsx(injection.tag, injection.attributes ?? {})) : void 0;
  const renderTimer = createTimer();
  const renderSymbols = [];
  let renderTime = 0;
  let snapshotTime = 0;
  await _renderSSR(rootNode, {
    stream,
    containerTagName,
    containerAttributes,
    serverData: opts.serverData,
    base: buildBase,
    beforeContent,
    beforeClose: async (contexts, containerState, _dynamic, textNodes) => {
      renderTime = renderTimer();
      const snapshotTimer = createTimer();
      snapshotResult = await _pauseFromContexts(contexts, containerState, void 0, textNodes);
      const jsonData = JSON.stringify(snapshotResult.state, void 0, "  ");
      const children = [
        jsx("script", {
          type: "qwik/json",
          dangerouslySetInnerHTML: escapeText(jsonData),
          nonce: opts.serverData?.nonce
        })
      ];
      if (snapshotResult.funcs.length > 0) {
        children.push(
          jsx("script", {
            "q:func": "qwik/json",
            dangerouslySetInnerHTML: serializeFunctions(snapshotResult.funcs),
            nonce: opts.serverData?.nonce
          })
        );
      }
      if (opts.prefetchStrategy !== null) {
        const prefetchResources = getPrefetchResources(snapshotResult, opts, resolvedManifest);
        if (prefetchResources.length > 0) {
          const prefetchImpl = applyPrefetchImplementation(
            opts.prefetchStrategy,
            prefetchResources,
            opts.serverData?.nonce
          );
          if (prefetchImpl) {
            children.push(prefetchImpl);
          }
        }
      }
      const needLoader = !snapshotResult || snapshotResult.mode !== "static";
      const includeMode = opts.qwikLoader?.include ?? "auto";
      const includeLoader = includeMode === "always" || includeMode === "auto" && needLoader;
      if (includeLoader) {
        const qwikLoaderScript = getQwikLoaderScript({
          events: opts.qwikLoader?.events,
          debug: opts.debug
        });
        children.push(
          jsx("script", {
            id: "qwikloader",
            dangerouslySetInnerHTML: qwikLoaderScript,
            nonce: opts.serverData?.nonce
          })
        );
      }
      const extraListeners = Array.from(containerState.$events$, (s) => JSON.stringify(s));
      if (extraListeners.length > 0) {
        let content = `window.qwikevents.push(${extraListeners.join(", ")})`;
        if (!includeLoader) {
          content = `window.qwikevents||=[];${content}`;
        }
        children.push(
          jsx("script", {
            dangerouslySetInnerHTML: content,
            nonce: opts.serverData?.nonce
          })
        );
      }
      collectRenderSymbols(renderSymbols, contexts);
      snapshotTime = snapshotTimer();
      return jsx(Fragment, { children });
    }
  });
  if (containerTagName !== "html") {
    stream.write("<!--/cq-->");
  }
  flush();
  const isDynamic = snapshotResult.resources.some((r) => r._cache !== Infinity);
  const result = {
    prefetchResources: void 0,
    snapshotResult,
    flushes: networkFlushes,
    manifest: resolvedManifest?.manifest,
    size: totalSize,
    isStatic: !isDynamic,
    timing: {
      render: renderTime,
      snapshot: snapshotTime,
      firstFlush: firstFlushTime
    },
    _symbols: renderSymbols
  };
  return result;
}
function resolveManifest(manifest2) {
  if (!manifest2) {
    return void 0;
  }
  if ("mapper" in manifest2) {
    return manifest2;
  }
  manifest2 = getValidManifest(manifest2);
  if (manifest2) {
    const mapper = {};
    Object.entries(manifest2.mapping).forEach(([key, value]) => {
      mapper[getSymbolHash(key)] = [key, value];
    });
    return {
      mapper,
      manifest: manifest2
    };
  }
  return void 0;
}
var escapeText = (str) => {
  return str.replace(/<(\/?script)/g, "\\x3C$1");
};
function collectRenderSymbols(renderSymbols, elements) {
  for (const ctx of elements) {
    const symbol = ctx.$componentQrl$?.getSymbol();
    if (symbol && !renderSymbols.includes(symbol)) {
      renderSymbols.push(symbol);
    }
  }
}
function serializeFunctions(funcs) {
  return `document.currentScript.qFuncs=[${funcs.join(",\n")}]`;
}
const manifest = null;
const Root = () => {
  return /* @__PURE__ */ _jsxC(Fragment, {
    children: [
      /* @__PURE__ */ _jsxQ("head", null, null, [
        /* @__PURE__ */ _jsxQ("meta", null, {
          charSet: "utf-8"
        }, null, 3, null, {
          fileName: "root.tsx",
          lineNumber: 5,
          columnNumber: 9
        }),
        /* @__PURE__ */ _jsxQ("title", null, null, "Qwik Blank App", 3, null, {
          fileName: "root.tsx",
          lineNumber: 6,
          columnNumber: 9
        })
      ], 3, null),
      /* @__PURE__ */ _jsxQ("body", null, null, null, 3, null)
    ]
  }, 3, "Uc_0");
};
function entry_ssr(opts) {
  return renderToStream(/* @__PURE__ */ _jsxC(Root, null, 3, "oy_0"), {
    manifest,
    ...opts
  });
}
module.exports = entry_ssr;
