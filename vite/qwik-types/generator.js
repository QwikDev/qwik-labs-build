"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRouteTypes = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const prettify_1 = require("./prettify");
async function generateRouteTypes(srcDir, routesDir, routes) {
    // console.log(routes);
    await generateSrcRoutesConfig(srcDir);
    await generateSrcRoutesGen(srcDir, routes);
}
exports.generateRouteTypes = generateRouteTypes;
async function generateSrcRoutesConfig(srcDir) {
    const CONFIG_FILE = await (0, prettify_1.prettify) `
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
    const file = (0, node_path_1.join)(srcDir, 'routes.config.tsx');
    const fileExists = await exists(file);
    console.log('File exists', file, fileExists);
    if (!fileExists) {
        (0, promises_1.writeFile)(file, CONFIG_FILE);
    }
}
async function exists(file) {
    try {
        return (await (0, promises_1.stat)(file)).isFile();
    }
    catch (e) {
        return false;
    }
}
async function generateSrcRoutesGen(srcDir, routes) {
    await (0, promises_1.writeFile)((0, node_path_1.join)(srcDir, 'routes.gen.d.ts'), await (0, prettify_1.prettify) `
${GENERATED_HEADER}

export type AppRoutes = ${routes.map((r) => s(r)).join('|')};

export interface AppRouteMap {
  ${routes.map((r) => s(r) + ':' + toInterface('', r))}
};

export interface AppRouteParamsFunction {
  ${routes.map((r) => `(route: ${s(r)}, ${toInterface('params', r)}): string`).join(';')}
}

export type AppLinkProps = ${routes
        .map((route) => `{ route: ${s(route)}, ${toParams(route)
        .map((param) => s('param:' + param) + ': string')
        .join(';')}}`)
        .join('|')}
`);
}
function toParams(route) {
    const params = [];
    const parts = route.split('/');
    parts.forEach((part) => {
        if (part.startsWith('[') && part.endsWith(']')) {
            params.push(part.substring(part.startsWith('[...') ? 4 : 1, part.length - 1));
        }
    });
    return params;
}
function toInterface(paramName, route) {
    const params = toParams(route);
    return ((paramName ? paramName + (params.length ? ':' : '?:') : '') +
        '{' +
        params.map((param) => param + ': string').join(';') +
        '}');
}
const GENERATED_HEADER = `
///////////////////////////////////////////////////////////////////////////
/// GENERATED FILE --- DO NOT EDIT --- YOUR CHANGES WILL BE OVERWRITTEN ///
///////////////////////////////////////////////////////////////////////////
`;
function s(text) {
    return JSON.stringify(text);
}
