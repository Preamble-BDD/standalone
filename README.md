# Preamble-TS-Standalone
The default [Preamble-TS-Core](https://github.com/Preamble-BDD/preamble.ts.core) runner for the browser.

## Installation
Download or clone the [Preamble-Standalone](https://github.com/Preamble-BDD/standalone) repo, which includes everything you need to author and run your tests, all wrapped up in one tidy repo:

## What's Included In The Box
* SpecRunner.html - the spec runner html file
* dist/core/preamble-matchers.js - Preamble's default matchers plugin
* dist/core/htmlReport.js - Preamble's default html reporter plugin
* specs/suite.ts, which is provided for your convenience for authoring your own test suites in TypeScript. Remember, you have to compile this to JavaScript, so use your editor's TypeScript "Build" feature to generate the JavaScript. The generated JavaScript will appear in the dist folder as configured in tsconfig.json.
* specs/sanitycheck.ts, which is the test suite that is used to test Preamble-ts itself. It also serves as a reference to the APIs that are available for authoring your own test suites.

### Show Some <3 For `d.ts` Files
* Preamble-TS-Standalone includes a TypeScript definition files (.d.ts) for Preamble-TS-Core's BDD API as well as for Q, the very popular promise library, and for NodeJS. So if your editor or IDE supports TypeScript you will get fabulous code completion and api information while authoring your specs.
* Inportant - Always include `/// <reference path="../dist/preamble-bdd-api.d.ts" />` at the top of every test script file written in TypeScript. Without this, the TypeScript compiler will not be able to resolve the location of the preamble-bdd-api-d.ts file,  which will result in all sorts of bad things (i.e errors and warnings).
