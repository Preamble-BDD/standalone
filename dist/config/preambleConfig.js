/**
 *Use this file to override any of Preamble"s default configuration settings.
 *Don"t forget to uncomment this file"s script tag in SpecRunner.html.
 */

"use strict";

var preambleGlobal;
if (typeof(window) !== "undefined") {
    preambleGlobal = window;
} else if (typeof(global) !== "undefined") {
    preambleGlobal = global;
}

preambleGlobal.preambleConfig = {
    windowGlobals: true,
    timeoutInterval: 5000,
    name: "Sanity Check",
    uiTestContainerId: "ui-test-container",
    hidePassedTests: false,
    shortCircuit: false
};
