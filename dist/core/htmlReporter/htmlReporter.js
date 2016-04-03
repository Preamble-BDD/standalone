"use strict";
var testContainerId = "preamble-test-container";
var summaryContainerId = "preamble-summary";
var summaryStatsId = "preamble-summary-stats";
var summaryDurationId = "preamble-summary-duration";
var configOptions;
var createElement = function (tagName) {
    return document.createElement(tagName);
};
var createTextNode = function (text) {
    return document.createTextNode(text);
};
var getBody = function () {
    return document.body;
};
var getElementByTagName = function (tagName) {
    return document.getElementsByTagName(tagName);
};
var getElementById = function (id) {
    return document.getElementById(id);
};
var getTestContainer = function () {
    return getElementById(testContainerId);
};
var getSummaryContainer = function () {
    return getElementById(summaryContainerId);
};
var getUiTestContainerEl = function () {
    return getElementById(configOptions.uiTestContainerId);
};
var id = function (id) {
    return "spec_" + id;
};
var color = function (item) {
    if (item.excluded) {
        return "brown";
    }
    if (item.passed) {
        return "auto";
    }
    return "red";
};
var HtmlReporter = (function () {
    function HtmlReporter() {
        this.onErrorFnPrev = window.onerror;
        window.onerror = this.onError;
    }
    HtmlReporter.prototype.onError = function (errorMessage, url, lineno) {
        var ret = false;
        console.log("Uncaught exception caught...");
        if (this.onErrorFnPrev) {
            ret = this.onErrorFnPrev(errorMessage, url, lineno);
        }
        if (ret !== true) {
        }
        return false;
    };
    HtmlReporter.prototype.reportBegin = function (confOpts) {
        configOptions = confOpts;
        getBody().style.margin = "52px 0 0 0";
        getTestContainer().style.fontFamily = "sans-serif";
    };
    HtmlReporter.prototype.reportSummary = function (summaryInfo) {
        var duration = parseInt((summaryInfo.totTime / 1000).toString()) + "." + summaryInfo.totTime % 1000;
        var summaryElId = summaryContainerId;
        var summaryEl = getElementById(summaryElId);
        var summaryStatsEl;
        var summaryDurationEl;
        var summaryHtml;
        if (!summaryEl) {
            summaryHtml = "<div id=\"" + summaryContainerId + "\" style=\"box-sizing: border-box; position: fixed; top: 0; width: 100%; overflow: hidden; padding: .25em .5em; color: white; background-color: blue;\"><span id=\"preamble-summary-stats\"></span><span id=\"preamble-summary-duration\" style=\"float: right; display: none;\"></span></div>";
            getTestContainer().insertAdjacentHTML("afterbegin", summaryHtml);
            summaryEl = getElementById(summaryElId);
        }
        summaryEl.style.backgroundColor = summaryInfo.totIts && summaryInfo.totFailedIts && "red" || summaryInfo.totIts && "green" || "blue";
        summaryStatsEl = getElementById(summaryStatsId);
        summaryStatsEl.innerHTML = "<span>" + summaryInfo.name + ": </span> <span style=\"color: white;\">" + summaryInfo.totIts + "</span><b> specs</b>, <span style=\"color: white;\">" + summaryInfo.totFailedIts + "</span><b> failures</b>, <span style=\"color: white;\">" + summaryInfo.totExcIts + "</span><b> excluded</b>";
        summaryDurationEl = getElementById(summaryDurationId);
        summaryDurationEl.innerHTML = "<span style=\"font-size: .75em;\">completed in " + duration + "s </span>";
        summaryDurationEl.style.display = summaryInfo.totTime && "block" || "none";
    };
    HtmlReporter.prototype.reportSpec = function (it) {
        var parents = [];
        var parent = it.parent;
        var html;
        var htmlStackTrace;
        var reasonNumber;
        while (parent) {
            parents.unshift(parent);
            parent = parent.parent;
        }
        if (parents.length) {
            parents.forEach(function (p) {
                var pEl = getElementById(id(p.id));
                var pParent;
                if (!pEl) {
                    if (it.passed && configOptions.hidePassedTests) {
                        html = "<ul style=\"display: none;\"><li id=\"" + id(p.id) + "\"><span style=\"color: " + color(p) + "\">" + p.label + "</span></li></ul>";
                    }
                    else {
                        html = "<ul><li id=\"" + id(p.id) + "\"><span style=\"color: " + color(p) + "\">" + p.label + "</span></li></ul>";
                    }
                    if (p.parent) {
                        getElementById(id(p.parent.id)).insertAdjacentHTML("beforeend", html);
                    }
                    else {
                        getTestContainer().insertAdjacentHTML("beforeend", html);
                    }
                }
            });
            if (it.passed && configOptions.hidePassedTests) {
                html = "<ul style=\"display: none;\"><li id=\"" + id(it.id) + "\"><span style=\"color: " + color(it) + "\">" + it.label + "</span></li></ul>";
            }
            else {
                html = "<ul><li id=\"" + id(it.id) + "\"><span style=\"color: " + color(it) + "\">" + it.label + "</span></li></ul>";
            }
            getElementById(id(it.parent.id)).insertAdjacentHTML("beforeend", html);
            if (!it.passed) {
                reasonNumber = 0;
                it.reasons.forEach(function (reason) {
                    reasonNumber++;
                    html = "<ul><li id=\"" + id(it.id) + "-reason-" + reasonNumber + "\"><span style=\"color: " + color(it) + "\">" + reason.reason + "</span></li></ul>";
                    getElementById(id(it.id)).insertAdjacentHTML("beforeend", html);
                    html = "<ul id=\"" + id(it.id) + "-reason-stack-trace-" + reasonNumber + "\"></ul>";
                    getElementById(id(it.id) + "-reason-" + reasonNumber).insertAdjacentHTML("beforeend", html);
                    reason.stackTrace.forEach(function (stackTrace) {
                        html = "<li id=\"" + id(it.id) + "-reason-stack-trace-item\"><span style=\"color: " + color(it) + "\">" + stackTrace + "</span></li>";
                        getElementById(id(it.id) + "-reason-stack-trace-" + reasonNumber).insertAdjacentHTML("beforeend", html);
                    });
                });
            }
        }
    };
    return HtmlReporter;
}());
window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
