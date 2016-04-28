/**
 * Use this file to override Preamble"s default configuration settings.
 * Don"t forget to uncomment this file"s script tag in SpecRunner.html.
 */

"use strict";

var preambleGlobal = window;
preambleGlobal.preamble = preambleGlobal.preamble || {};
preambleGlobal.preamble.preambleConfig = {
    timeoutInterval: 5000,
    name: "Sanity Check",
    uiTestContainerId: "ui-test-container",
    hidePassedTests: false,
    shortCircuit: true
};
