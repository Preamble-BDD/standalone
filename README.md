# Preamble-TS-Standalone
The default [Preamble-TS](https://github.com/Preamble-BDD/preamble.ts) "in the browser" test environment.

## Installation
Download or clone the [Preamble-Standalone](https://github.com/Preamble-BDD/standalone) repo, which includes everything you need to author and run your tests, all wrapped up in one tidy repo:

* SpecRunner.html - a spec runner html file
* dist/core/matchers/preamble-matchers.js - the default matchers via a matchers plugin
* dist/core/htmlReporter/htmlReport.js - the default html reporter via a reporter plugin

### In addition to the above, Standalone also includes two additional files:

* specs/suite.ts, which is provided for your convenience for authoring your own test suites.
* specs/sanitycheck.ts, which is the test suite that is used to test Preamble-ts itself. It also serves as a reference to the APIs that are available for authoring your own test suites.
