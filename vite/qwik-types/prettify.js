"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettify = void 0;
const standalone_1 = require("prettier/standalone");
async function prettify(template, ...substitutions) {
    let source = '';
    for (let i = 0; i < template.length; i++) {
        source += template[i] + (i < substitutions.length ? String(substitutions[i]) : '');
    }
    try {
        source = await (0, standalone_1.format)(source, {
            parser: 'typescript',
            plugins: [
                // To support running in browsers
                require('prettier/plugins/estree'),
                require('prettier/parser-typescript'),
                require('prettier/parser-postcss'),
                require('prettier/parser-html'),
                require('prettier/parser-babel'),
            ],
            htmlWhitespaceSensitivity: 'ignore',
        });
    }
    catch (e) {
        throw new Error(e +
            '\n' +
            '========================================================================\n' +
            source +
            '\n\n========================================================================');
    }
    return source;
}
exports.prettify = prettify;
