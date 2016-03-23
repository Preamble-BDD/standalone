(function () {
    var registerMatchers = [];
    var register = function (registerMatcher, comparators) {
        registerMatcher({
            apiName: "toBeTrue",
            api: function () { },
            evalueator: function (expectedValue) { return expectedValue === true; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toBeTruthy",
            api: function () { },
            evalueator: function (expectedValue) { return !!expectedValue; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toBe",
            api: function (matcherValue) { return matcherValue; },
            evalueator: function (expectedValue, matcherValue) {
                return expectedValue === matcherValue;
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toEqual",
            api: function (matcherValue) { return matcherValue; },
            evalueator: function (expectedValue, matcherValue) {
                return comparators.deepRecursiveCompare(expectedValue, matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toBeDefined",
            api: function () { },
            evalueator: function (expectedValue) { return expectedValue !== undefined; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toBeUndefined",
            api: function () { },
            evalueator: function (expectedValue) { return expectedValue === undefined; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toBeNull",
            api: function () { },
            evalueator: function (expectedValue) { return expectedValue === null; },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toMatch",
            api: function (matcherValue) { return matcherValue; },
            evalueator: function (expectedValue, matcherValue) {
                return matcherValue.exec(expectedValue) !== null;
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveBeenCalled",
            api: function () { },
            evalueator: function (expectedValue) { return expectedValue.calls.count() > 0; },
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
            evalueator: function (expectedValue) {
                var matcherValue = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    matcherValue[_i - 1] = arguments[_i];
                }
                return expectedValue.calls.wasCalledWith(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: -1
        });
        registerMatcher({
            apiName: "toHaveBeenCalledWithContext",
            api: function (matcherValue) { return matcherValue; },
            evalueator: function (expectedValue, matcherValue) {
                return expectedValue.calls.wasCalledWithContext(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveReturnedValue",
            api: function (matcherValue) { return matcherValue; },
            evalueator: function (expectedValue, matcherValue) {
                return expectedValue.calls.returned(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveThrown",
            api: function () { },
            evalueator: function (expectedValue) {
                return expectedValue.calls.threw();
            },
            negator: true,
            minArgs: 0,
            maxArgs: 0
        });
        registerMatcher({
            apiName: "toHaveThrownWithMessage",
            api: function (matcherValue) { return matcherValue; },
            evalueator: function (expectedValue, matcherValue) {
                return expectedValue.calls.threwWithMessage(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveThrownWithName",
            api: function (matcherValue) { return matcherValue; },
            evalueator: function (expectedValue, matcherValue) {
                return expectedValue.calls.threwWithName(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
        registerMatcher({
            apiName: "toHaveThrownWithName",
            api: function (matcherValue) { return matcherValue; },
            evalueator: function (expectedValue, matcherValue) {
                return expectedValue.calls.threwWithName(matcherValue);
            },
            negator: true,
            minArgs: 1,
            maxArgs: 1
        });
    };
    window["preamble"] = window["preamble"] || {};
    window["preamble"]["registerMatchers"] = window["preamble"]["registerMatchers"] || registerMatchers;
    registerMatchers.push(register);
}());
//# sourceMappingURL=preamble-matchers.js.map