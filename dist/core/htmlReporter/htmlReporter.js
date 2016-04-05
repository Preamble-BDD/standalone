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
var cssClass = function (item, isA) {
    var clazz = isA;
    if (item.excluded) {
        clazz += " " + isA + "-excluded";
        if (configOptions.hidePassedTests) {
            clazz += " " + isA + "-hidden";
        }
    }
    else if (item.passed) {
        clazz += " " + isA + "-passed";
        if (configOptions.hidePassedTests) {
            clazz += " " + isA + "-hidden";
        }
    }
    else {
        clazz += " " + isA + "-failed";
    }
    return clazz;
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
    };
    HtmlReporter.prototype.reportSummary = function (summaryInfo) {
        var duration = parseInt((summaryInfo.totTime / 1000).toString()) + "." + summaryInfo.totTime % 1000;
        var summaryElId = summaryContainerId;
        var summaryEl = getElementById(summaryElId);
        var summaryStatsEl;
        var summaryDurationEl;
        var summaryHtml;
        if (!summaryEl) {
            summaryHtml = "<div class=\"preamble-summary preamble-summary-hidden\" id=\"" + summaryContainerId + "\"><span id=\"preamble-summary-stats\"></span><span class=\"preamble-summary-duration preamble-summary-duration-hidden\" id=\"preamble-summary-duration\"></span></div>";
            getTestContainer().insertAdjacentHTML("afterbegin", summaryHtml);
            summaryEl = getElementById(summaryElId);
        }
        summaryEl.className = summaryInfo.totIts && summaryInfo.totFailedIts && "preamble-summary preamble-summary-fail" || summaryInfo.totIts && "preamble-summary preamble-summary-pass" || "preamble-summary preamble-summary-pending";
        summaryStatsEl = getElementById(summaryStatsId);
        summaryStatsEl.innerHTML = "<span>" + summaryInfo.name + ": </span> <span>" + summaryInfo.totIts + "</span><b> specs</b>, <span>" + summaryInfo.totFailedIts + "</span><b> failures</b>, <span>" + summaryInfo.totExcIts + "</span><b> excluded</b>";
        summaryDurationEl = getElementById(summaryDurationId);
        summaryDurationEl.innerHTML = "<span>completed in " + duration + "s </span>";
        summaryDurationEl.className = summaryInfo.totTime === 0 && "preamble-summary-duration preamble-summary-duration-hidden" || "preamble-summary-duration";
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
        parents.forEach(function (p) {
            var pEl = getElementById(id(p.id));
            var pParent;
            if (!pEl) {
                html = "<ul class=\"" + cssClass(p, "suite") + "\"><li id=\"" + id(p.id) + "\"><span>" + p.label + "</span></li></ul>";
                if (p.parent) {
                    getElementById(id(p.parent.id)).insertAdjacentHTML("beforeend", html);
                }
                else {
                    getTestContainer().insertAdjacentHTML("beforeend", html);
                }
            }
        });
        html = "<ul class=\"" + cssClass(it, "spec") + "\"><li id=\"" + id(it.id) + "\"><span>" + it.label + "</span></li></ul>";
        getElementById(id(it.parent.id)).insertAdjacentHTML("beforeend", html);
        if (!it.passed) {
            reasonNumber = 0;
            it.reasons.forEach(function (reason) {
                reasonNumber++;
                html = "<ul class=\"reason\"><li id=\"" + id(it.id) + "-reason-" + reasonNumber + "\"><span>" + reason.reason + "</span></li></ul>";
                getElementById(id(it.id)).insertAdjacentHTML("beforeend", html);
                html = "<ul class=\"reason-stacktrace\" id=\"" + id(it.id) + "-reason-stacktrace-" + reasonNumber + "\"></ul>";
                getElementById(id(it.id) + "-reason-" + reasonNumber).insertAdjacentHTML("beforeend", html);
                reason.stackTrace.forEach(function (stackTrace) {
                    html = "<li class=\"reason-stacktrace-item\" id=\"" + id(it.id) + "-reason-stacktrace-item\"><span>" + stackTrace + "</span></li>";
                    getElementById(id(it.id) + "-reason-stacktrace-" + reasonNumber).insertAdjacentHTML("beforeend", html);
                });
            });
        }
    };
    return HtmlReporter;
}());
window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
