(function () {
    var registerMatchers = [];
    var register = function (registerMatcher, comparators) {
        registerMatcher({
            apiName: "toBeTrue",
            api: function () { },
            evaluator: function (expectedValue) { return expectedValue === true; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toBeTruthy",
            api: function () { },
            evaluator: function (expectedValue) { return !!expectedValue; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toBe",
            api: function (matcherValue) { return matcherValue; },
            evaluator: function (expectedValue, matcherValue) {
                return expectedValue === matcherValue;
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toEqual",
            api: function (matcherValue) { return matcherValue; },
            evaluator: function (expectedValue, matcherValue) {
                return comparators.deepRecursiveCompare(expectedValue, matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toBeDefined",
            api: function () { },
            evaluator: function (expectedValue) { return expectedValue !== undefined; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toBeUndefined",
            api: function () { },
            evaluator: function (expectedValue) { return expectedValue === undefined; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toBeNull",
            api: function () { },
            evaluator: function (expectedValue) { return expectedValue === null; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toMatch",
            api: function (matcherValue) { return matcherValue; },
            evaluator: function (expectedValue, matcherValue) {
                return matcherValue.exec(expectedValue) !== null;
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveBeenCalled",
            api: function () { },
            evaluator: function (expectedValue) {
                return expectedValue.calls.count() > 0;
            },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toHaveBeenCalledWith",
            api: function () {
                var matcherValue = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    matcherValue[_i - 0] = arguments[_i];
                }
                return matcherValue;
            },
            evaluator: function (expectedValue, matcherValue) {
                return expectedValue.calls.wasCalledWith.apply(null, matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: -1
        });
        registerMatcher({
            apiName: "toHaveBeenCalledWithContext",
            api: function (matcherValue) { return matcherValue; },
            evaluator: function (expectedValue, matcherValue) {
                return expectedValue.calls.wasCalledWithContext(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveReturnedValue",
            api: function (matcherValue) { return matcherValue; },
            evaluator: function (expectedValue, matcherValue) {
                return expectedValue.calls.returned(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveThrown",
            api: function () { },
            evaluator: function (expectedValue) {
                return expectedValue.calls.threw();
            },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toHaveThrownWithMessage",
            api: function (matcherValue) { return matcherValue; },
            evaluator: function (expectedValue, matcherValue) {
                return expectedValue.calls.threwWithMessage(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveThrownWithName",
            api: function (matcherValue) { return matcherValue; },
            evaluator: function (expectedValue, matcherValue) {
                return expectedValue.calls.threwWithName(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
    };
    var preambleGlobal;
    if (typeof (window) !== "undefined") {
        preambleGlobal = window;
    }
    else if (typeof (global) !== "undefined") {
        preambleGlobal = global;
    }
    else {
        throw new Error("Unsuported Environment");
    }
    var pGlobal = preambleGlobal;
    if (!pGlobal.hasOwnProperty("preamble")) {
        pGlobal.preamble = { registerMatchers: registerMatchers };
    }
    else {
        pGlobal.preamble.registerMatchers = registerMatchers;
    }
    registerMatchers.push(register);
}());
//# sourceMappingURL=preamble-matchers.js.map