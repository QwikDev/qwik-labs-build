"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_fs = require("node:fs");
const promises = require("node:fs/promises");
const node_path = require("node:path");
const standalone = require("prettier/standalone");
const estree = require("prettier/plugins/estree");
const typeScriptParser = require("prettier/parser-typescript");
const postCssParser = require("prettier/parser-postcss");
const htmlParser = require("prettier/parser-html");
const babelParser = require("prettier/parser-babel");
const logWarn = (message, ...rest) => {
  console.warn("\x1B[33m%s\x1B[0m", `qwikInsight()[WARN]: ${message}`, ...rest);
};
const log = (message) => {
  console.log("\x1B[35m%s\x1B[0m", `qwikInsight(): ${message}`);
};
async function qwikInsights(qwikInsightsOpts) {
  const { publicApiKey, baseUrl = "https://insights.qwik.dev", outDir = "" } = qwikInsightsOpts;
  let isProd = false;
  let jsonDir;
  let jsonFile;
  let data = null;
  let qwikVitePlugin = null;
  async function loadQwikInsights() {
    if (data) {
      return data;
    }
    if (node_fs.existsSync(jsonFile)) {
      log("Reading Qwik Insight data from: " + jsonFile);
      return data = JSON.parse(await promises.readFile(jsonFile, "utf-8"));
    }
    return null;
  }
  const vitePlugin = {
    name: "vite-plugin-qwik-insights",
    enforce: "pre",
    apply: "build",
    async config(viteConfig) {
      jsonDir = node_path.resolve(viteConfig.root || ".", outDir);
      jsonFile = node_path.join(jsonDir, "q-insights.json");
      isProd = viteConfig.mode !== "ssr";
    },
    configResolved: {
      // we want to register the bundle graph adder last so we overwrite existing routes
      order: "post",
      async handler(config) {
        qwikVitePlugin = config.plugins.find(
          (p) => p.name === "vite-plugin-qwik"
        );
        if (!qwikVitePlugin) {
          throw new Error("Missing vite-plugin-qwik");
        }
        const opts = qwikVitePlugin.api.getOptions();
        if (isProd) {
          try {
            const qManifest = { manual: {}, prefetch: [] };
            const response = await fetch(`${baseUrl}/api/v1/${publicApiKey}/bundles/strategy/`);
            const strategy = await response.json();
            Object.assign(qManifest, strategy);
            data = qManifest;
            node_fs.mkdirSync(jsonDir, { recursive: true });
            log("Fetched latest Qwik Insight data into: " + jsonFile);
            await promises.writeFile(jsonFile, JSON.stringify(qManifest));
          } catch (e) {
            logWarn("Failed to fetch manifest from Insights DB", e);
            await loadQwikInsights();
          }
        } else {
          await loadQwikInsights();
        }
        if (data) {
          opts.entryStrategy.manual = {
            ...data.manual,
            ...opts.entryStrategy.manual
          };
          qwikVitePlugin.api.registerBundleGraphAdder((manifest) => {
            const result = {};
            for (const item of data?.prefetch || []) {
              if (item.symbols) {
                let route = item.route;
                if (route.startsWith("/")) {
                  route = route.slice(1);
                }
                if (!route.endsWith("/")) {
                  route += "/";
                }
                result[route] = { ...manifest.bundles[route], imports: item.symbols };
              }
            }
            return result;
          });
        }
      }
    },
    closeBundle: async () => {
      const path = node_path.resolve(outDir, "q-manifest.json");
      if (isProd && node_fs.existsSync(path)) {
        const qManifest = await promises.readFile(path, "utf-8");
        try {
          await fetch(`${baseUrl}/api/v1/${publicApiKey}/post/manifest`, {
            method: "post",
            body: qManifest
          });
        } catch (e) {
          logWarn("Failed to post manifest to Insights DB", e);
        }
      }
    }
  };
  return vitePlugin;
}
async function prettify(template, ...substitutions) {
  let source = "";
  for (let i = 0; i < template.length; i++) {
    source += template[i] + (i < substitutions.length ? String(substitutions[i]) : "");
  }
  try {
    source = await standalone.format(source, {
      parser: "typescript",
      plugins: [
        // To support running in browsers
        // require('prettier/plugins/estree'),
        estree,
        // require('prettier/parser-typescript'),
        typeScriptParser,
        // require('prettier/parser-postcss'),
        postCssParser,
        // require('prettier/parser-html'),
        htmlParser,
        // require('prettier/parser-babel'),
        babelParser
      ],
      htmlWhitespaceSensitivity: "ignore"
    });
  } catch (e) {
    throw new Error(
      e + "\n========================================================================\n" + source + "\n\n========================================================================"
    );
  }
  return source;
}
async function generateRouteTypes(srcDir, routesDir, routes) {
  await generateSrcRoutesConfig(srcDir);
  await generateSrcRoutesGen(srcDir, routes);
}
async function generateSrcRoutesConfig(srcDir) {
  const CONFIG_FILE = await prettify`
/**
 * This file is created as part of the typed routes, but it is intended to be modified by the developer.
 *
 * @fileoverview
 */
import { untypedAppUrl, omitProps } from '@builder.io/qwik-labs';
import { type AppLinkProps, type AppRouteParamsFunction } from './routes.gen';
import { type QwikIntrinsicElements } from '@builder.io/qwik';

/**
 * Configure \`appUrl\` with the typed information of routes.
 */
export const appUrl = untypedAppUrl as AppRouteParamsFunction;

/**
 * Configure \`<AppLink/>\` component with the typed information of routes.
 *
 * NOTE: you may consider changing \`<a>\` to \`<Link>\` to be globally applied across your application.
 */
export function AppLink(props: AppLinkProps & QwikIntrinsicElements['a']) {
  return (
    <a
      href={(appUrl as (route: string, props: any, prefix: string) => string)(
        props.route,
        props,
        'param:'
      )}
      {...omitProps(props, ['href'])}
    >
      {props.children}
    </a>
  );
}
`;
  const file = node_path.join(srcDir, "routes.config.tsx");
  const fileExists = await exists(file);
  console.log("File exists", file, fileExists);
  if (!fileExists) {
    promises.writeFile(file, CONFIG_FILE);
  }
}
async function exists(file) {
  try {
    return (await promises.stat(file)).isFile();
  } catch (e) {
    return false;
  }
}
async function generateSrcRoutesGen(srcDir, routes) {
  await promises.writeFile(
    node_path.join(srcDir, "routes.gen.d.ts"),
    await prettify`
${GENERATED_HEADER}

export type AppRoutes = ${routes.map((r) => s(r)).join("|")};

export interface AppRouteMap {
  ${routes.map((r) => s(r) + ":" + toInterface("", r))}
};

export interface AppRouteParamsFunction {
  ${routes.map((r) => `(route: ${s(r)}, ${toInterface("params", r)}): string`).join(";")}
}

export type AppLinkProps = ${routes.map(
      (route) => `{ route: ${s(route)}, ${toParams(route).map((param) => s("param:" + param) + ": string").join(";")}}`
    ).join("|")}
`
  );
}
function toParams(route) {
  const params = [];
  const parts = route.split("/");
  parts.forEach((part) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      params.push(part.substring(part.startsWith("[...") ? 4 : 1, part.length - 1));
    }
  });
  return params;
}
function toInterface(paramName, route) {
  const params = toParams(route);
  return (paramName ? paramName + (params.length ? ":" : "?:") : "") + "{" + params.map((param) => param + ": string").join(";") + "}";
}
const GENERATED_HEADER = `
///////////////////////////////////////////////////////////////////////////
/// GENERATED FILE --- DO NOT EDIT --- YOUR CHANGES WILL BE OVERWRITTEN ///
///////////////////////////////////////////////////////////////////////////
`;
function s(text) {
  return JSON.stringify(text);
}
function qwikTypes() {
  const srcFolder = node_path.join(process.cwd(), "src");
  const routesFolder = node_path.join(srcFolder, "routes");
  return {
    name: "Qwik Type Generator",
    async buildStart() {
      await regenerateRoutes(srcFolder, routesFolder);
    }
  };
}
async function regenerateRoutes(srcDir, routesDir) {
  assertDirectoryExists(srcDir);
  assertDirectoryExists(routesDir);
  const routes = [];
  await collectRoutes(routesDir, routesDir, routes);
  routes.sort();
  generateRouteTypes(srcDir, routesDir, routes);
  const seenRoutes = /* @__PURE__ */ new Set();
  routes.forEach((route) => seenRoutes.add(node_path.join(routesDir, route, `index.tsx`)));
  return seenRoutes;
}
async function assertDirectoryExists(directoryPath) {
  try {
    const stats = await promises.stat(directoryPath);
    if (!stats.isDirectory()) {
      throw new Error(`${directoryPath} is not a directory.`);
    }
  } catch (error) {
    throw new Error(`Directory ${directoryPath} does not exist.`);
  }
}
function getRouteDirectory(id) {
  const lastSlash = id.lastIndexOf(node_path.sep);
  const filename = id.substring(lastSlash + 1);
  if (filename.endsWith("index.md") || filename.endsWith("index.mdx") || filename.endsWith("index.js") || filename.endsWith("index.jsx") || filename.endsWith("index.ts") || filename.endsWith("index.tsx")) {
    return id.substring(0, lastSlash + 1);
  }
  return null;
}
async function collectRoutes(base, directoryPath, routes) {
  const files = await promises.readdir(directoryPath);
  for (let i = 0; i < files.length; i++) {
    const filePath = node_path.join(directoryPath, files[i]);
    const fileStat = await promises.stat(filePath);
    let route;
    if (fileStat.isDirectory()) {
      await collectRoutes(base, filePath, routes);
    } else if ((route = getRouteDirectory(filePath)) !== null) {
      routes.push(route.substring(base.length).replaceAll(node_path.sep, "/"));
    }
  }
}
exports.qwikInsights = qwikInsights;
exports.qwikTypes = qwikTypes;
