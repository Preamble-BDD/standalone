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
var id = function (item) {
    return (item.hasOwnProperty("expectations") && "spec" || "suite") + "_" + item.id;
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
var wrapWithAnchor = function (item) {
    var notExcluded = "<a href=\"#" + id(item) + "\" onclick=\"window.location.hash = '#" + id(item) + "'; window.location.reload();\"><span>" + item.label + "</span></a>";
    var excluded = "<span>" + item.label + "</span>";
    return item.excluded && excluded || notExcluded;
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
        getTestContainer().insertAdjacentHTML("beforeend", "<footer>Preamble v" + confOpts.version + "</footer>");
    };
    HtmlReporter.prototype.reportSummary = function (summaryInfo) {
        var duration = parseInt((summaryInfo.timeKeeper.totTime / 1000).toString()) + "." + summaryInfo.timeKeeper.totTime % 1000;
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
        summaryStatsEl.innerHTML = "<span>" + configOptions.name + ": </span> <span>" + summaryInfo.totIts + "</span><b> specs</b>, <span>" + summaryInfo.totFailedIts + "</span><b> failures</b>, <span>" + summaryInfo.totExcIts + "</span><b> excluded</b>";
        summaryDurationEl = getElementById(summaryDurationId);
        summaryDurationEl.innerHTML = "<span>completed in " + duration + "s </span>";
        summaryDurationEl.className = summaryInfo.timeKeeper.totTime === 0 && "preamble-summary-duration preamble-summary-duration-hidden" || "preamble-summary-duration";
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
            var pEl = getElementById(id(p));
            var pParent;
            if (!pEl) {
                html = "<ul class=\"" + cssClass(p, "suite") + "\"><li id=\"" + id(p) + "\">" + wrapWithAnchor(p) + "</li></ul>";
                if (p.parent) {
                    getElementById(id(p.parent)).insertAdjacentHTML("beforeend", html);
                }
                else {
                    getTestContainer().insertAdjacentHTML("beforeend", html);
                }
            }
        });
        html = "<ul class=\"" + cssClass(it, "spec") + "\"><li id=\"" + id(it) + "\">" + wrapWithAnchor(it) + "</li></ul>";
        getElementById(id(it.parent)).insertAdjacentHTML("beforeend", html);
        if (!it.passed) {
            reasonNumber = 0;
            it.reasons.forEach(function (reason) {
                reasonNumber++;
                html = "<ul class=\"reason\"><li id=\"" + id(it) + "-reason-" + reasonNumber + "\"><span>" + reason.reason + "</span></li></ul>";
                getElementById(id(it)).insertAdjacentHTML("beforeend", html);
                html = "<ul class=\"reason-stacktrace\" id=\"" + id(it) + "-reason-stacktrace-" + reasonNumber + "\"></ul>";
                getElementById(id(it) + "-reason-" + reasonNumber).insertAdjacentHTML("beforeend", html);
                reason.stackTrace.forEach(function (stackTrace) {
                    html = "<li class=\"reason-stacktrace-item\" id=\"" + id(it) + "-reason-stacktrace-item\"><span>" + stackTrace + "</span></li>";
                    getElementById(id(it) + "-reason-stacktrace-" + reasonNumber).insertAdjacentHTML("beforeend", html);
                });
            });
        }
    };
    return HtmlReporter;
}());
window["preamble"] = window["preamble"] || {};
window["preamble"]["reporters"] = window["preamble"]["reporters"] || [];
window["preamble"]["reporters"].push(new HtmlReporter());
