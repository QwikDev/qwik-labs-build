import { component$ } from '@builder.io/qwik';
import { z } from 'zod';

export interface InsightsPayload {
  /** Qwik version */
  qVersion: string;

  /** Manifest Hash of the container. */
  manifestHash: string;

  /**
   * API key of the application which we are trying to profile.
   *
   * This key can be used for sharding the data.
   */
  publicApiKey: string;

  /**
   * Previous symbol received on the client.
   *
   * Client periodically sends symbol log to the server. Being able to connect the order of symbols
   * is useful for server clustering. Sending previous symbol name allows the server to stitch the
   * symbol list together.
   */
  previousSymbol: string | null;

  /** List of symbols which have been received since last update. */
  symbols: InsightSymbol[];
}

export interface InsightSymbol {
  /** Symbol name */
  symbol: string;

  /** Current route so we can have a better understanding of which symbols are needed for each route. */
  route: string;

  /** Time delta since last symbol. Can be used to stich symbol requests together */
  delay: number;

  /** Number of ms between the time the symbol was requested and it was loaded. */
  latency: number;

  /** Number of ms between the q:route attribute change and the qsymbol event */
  timeline: number;

  /**
   * Was this symbol as a result of user interaction. User interactions represent roots for
   * clouters.
   */
  interaction: boolean;
}

export interface InsightsError {
  /** Manifest Hash of the container. */
  manifestHash: string;
  timestamp: number;
  url: string;
  source: string;
  line: number;
  column: number;
  error: string;
  message: string;
  stack: string;
}

export const InsightsError = z.object({
  manifestHash: z.string(),
  url: z.string(),
  timestamp: z.number(),
  source: z.string(),
  line: z.number(),
  column: z.number(),
  message: z.string(),
  error: z.string(),
  stack: z.string(),
});

export const InsightSymbol = z.object({
  symbol: z.string(),
  route: z.string(),
  delay: z.number(),
  latency: z.number(),
  timeline: z.number(),
  interaction: z.boolean(),
});

export const InsightsPayload = z.object({
  qVersion: z.string(),
  manifestHash: z.string(),
  publicApiKey: z.string(),
  previousSymbol: z.string().nullable(),
  symbols: z.array(InsightSymbol),
});

InsightSymbol._type satisfies InsightSymbol;
InsightsPayload._type satisfies InsightsPayload;
InsightsError._type satisfies InsightsError;

export const Insights = component$<{ publicApiKey: string; postUrl?: string }>(
  ({ publicApiKey, postUrl }) => {
    return (
      <script
        data-insights={publicApiKey}
        dangerouslySetInnerHTML={`(${symbolTracker.toString()})(window, document, location, navigator, ${JSON.stringify(
          publicApiKey
        )},
          ${JSON.stringify(
            postUrl || 'https://qwik-insights.builder.io/api/v1/${publicApiKey}/post/'
          )}
        )`}
      />
    );
  }
);

interface QwikSymbolTrackerWindow extends Window {
  qSymbolTracker: {
    symbols: InsightSymbol[];
    publicApiKey: string;
  };
}

interface QSymbolDetail {
  element: HTMLElement | null;
  reqTime: number;
  symbol: string;
}

function symbolTracker(
  window: QwikSymbolTrackerWindow,
  document: Document,
  location: Location,
  navigator: Navigator,
  publicApiKey: string,
  postUrl: string
) {
  const qVersion = document.querySelector('[q\\:version]')?.getAttribute('q:version') || 'unknown';
  const manifestHash =
    document.querySelector('[q\\:manifest-hash]')?.getAttribute('q:manifest-hash') || 'dev';
  const qSymbols: InsightSymbol[] = [];
  const existingSymbols: Set<string> = new Set();
  let flushSymbolIndex: number = 0;
  let lastReqTime: number = 0;
  window.qSymbolTracker = {
    symbols: qSymbols,
    publicApiKey,
  };
  let timeoutID: ReturnType<typeof setTimeout> | null;
  let qRouteChangeTime = performance.now();
  const qRouteEl = document.querySelector('[q\\:route]');
  if (qRouteEl) {
    const observer = new MutationObserver((mutations) => {
      const mutation = mutations.find((m) => m.attributeName === 'q:route');
      if (mutation) {
        qRouteChangeTime = performance.now();
      }
    });
    observer.observe(qRouteEl, { attributes: true });
  }
  function flush() {
    timeoutID = null;
    if (qSymbols.length > flushSymbolIndex) {
      const payload = {
        qVersion,
        publicApiKey,
        manifestHash,
        previousSymbol: flushSymbolIndex == 0 ? null : qSymbols[flushSymbolIndex - 1].symbol,
        symbols: qSymbols.slice(flushSymbolIndex),
      } satisfies InsightsPayload;
      navigator.sendBeacon(
        postUrl.replace('${publicApiKey}', publicApiKey),
        JSON.stringify(payload)
      );
      flushSymbolIndex = qSymbols.length;
    }
  }
  function debounceFlush() {
    timeoutID != null && clearTimeout(timeoutID);
    timeoutID = setTimeout(flush, 1000);
  }
  document.addEventListener(
    'visibilitychange',
    () => document.visibilityState === 'hidden' && flush()
  );
  document.addEventListener('qsymbol', (_event) => {
    const event = _event as CustomEvent<QSymbolDetail>;
    const detail = event.detail;
    const symbolRequestTime = detail.reqTime;
    const symbolDeliveredTime = event.timeStamp;
    const symbol = detail.symbol;
    if (!existingSymbols.has(symbol)) {
      existingSymbols.add(symbol);
      const route = qRouteEl?.getAttribute('q:route') || '/';
      qSymbols.push({
        symbol: symbol,
        route,
        delay: Math.round(0 - lastReqTime + symbolRequestTime),
        latency: Math.round(symbolDeliveredTime - symbolRequestTime),
        timeline: Math.round(0 - qRouteChangeTime + symbolRequestTime),
        interaction: !!detail.element,
      });
      lastReqTime = symbolDeliveredTime;
      debounceFlush();
    }
  });
  window.addEventListener('error', (event: ErrorEvent) => {
    const error = event.error;
    if (!(error && typeof error === 'object')) return;
    const payload = {
      url: location.toString(),
      manifestHash,
      timestamp: new Date().getTime(),
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      message: event.message,
      error: 'message' in error ? (error as Error).message : String(error),
      stack: 'stack' in error ? (error as Error).stack || '' : '',
    } satisfies InsightsError;
    navigator.sendBeacon(
      postUrl.replace('${publicApiKey}', publicApiKey) + 'error/',
      JSON.stringify(payload)
    );
  });
}
