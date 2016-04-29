require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Callable API
 * afterEach(function([done]))
 */
"use strict";
var AfterEach_1 = require("../queue/AfterEach");
var callstack_1 = require("./callstack");
var StackTrace_1 = require("../stacktrace/StackTrace");
exports.afterEach = function (callback, timeoutInterval) {
    if (timeoutInterval === void 0) { timeoutInterval = 0; }
    var _afterEach;
    if (arguments.length !== 1 && arguments.length !== 2) {
        throw new TypeError("afterEach called with invalid parameters");
    }
    if (typeof (arguments[0]) !== "function") {
        throw new TypeError("afterEach called with invalid parameters");
    }
    if (arguments.length === 2 && typeof (arguments[1]) !== "number") {
        throw new TypeError("afterEach called with invalid parameters");
    }
    // an AfterEach object
    _afterEach = new AfterEach_1.AfterEach(callstack_1.callStack.getTopOfStack(), callstack_1.callStack.uniqueId.toString(), callback, timeoutInterval, StackTrace_1.stackTrace.stackTrace);
    // add it to its parent describe
    callstack_1.callStack.getTopOfStack().afterEach = _afterEach;
};

},{"../queue/AfterEach":15,"../stacktrace/StackTrace":24,"./callstack":3}],2:[function(require,module,exports){
/**
 * Callable API
 * beforeEach(function([done]))
 */
"use strict";
var BeforeEach_1 = require("../queue/BeforeEach");
var callstack_1 = require("./callstack");
var StackTrace_1 = require("../stacktrace/StackTrace");
exports.beforeEach = function (callback, timeoutInterval) {
    if (timeoutInterval === void 0) { timeoutInterval = 0; }
    var _beforeEach;
    if (arguments.length !== 1 && arguments.length !== 2) {
        throw new TypeError("beforeEach called with invalid parameters");
    }
    if (typeof (arguments[0]) !== "function") {
        throw new TypeError("beforeEach called with invalid parameters");
    }
    if (arguments.length === 2 && typeof (arguments[1]) !== "number") {
        throw new TypeError("beforeEach called with invalid parameters");
    }
    // a BeforeEach object
    _beforeEach = new BeforeEach_1.BeforeEach(callstack_1.callStack.getTopOfStack(), callstack_1.callStack.uniqueId.toString(), callback, timeoutInterval, StackTrace_1.stackTrace.stackTrace);
    // add it to its parent describe
    callstack_1.callStack.getTopOfStack().beforeEach = _beforeEach;
};

},{"../queue/BeforeEach":16,"../stacktrace/StackTrace":24,"./callstack":3}],3:[function(require,module,exports){
"use strict";
var CallStack_1 = require("../callstack/CallStack");
var UniqueNumber_1 = require("../uniquenumber/UniqueNumber");
exports.callStack = new CallStack_1.CallStack(new UniqueNumber_1.UniqueNumber());

},{"../callstack/CallStack":12,"../uniquenumber/UniqueNumber":25}],4:[function(require,module,exports){
/**
 * Callable API
 * describe("description", callback)
 */
"use strict";
var callstack_1 = require("./callstack");
var Describe_1 = require("../queue/Describe");
var QueueManager_1 = require("../queue/QueueManager");
exports.describe = function (label, callback) {
    var _describe;
    var excluded;
    if (arguments.length !== 2 || typeof (arguments[0])
        !== "string" || typeof (arguments[1]) !== "function") {
        throw new TypeError("describe called with invalid parameters");
    }
    // mark the Describe excluded if any of its parents are excluded
    // TODO(js):
    excluded = callstack_1.callStack.stack.some(function (item) {
        return item.excluded;
    });
    // a Description object
    _describe = new Describe_1.Describe(callstack_1.callStack.uniqueId.toString(), label, callback, callstack_1.callStack.length && callstack_1.callStack.getTopOfStack() || null, excluded);
    // push Describe onto the queue
    QueueManager_1.QueueManager.queue.push(_describe);
    // increment totDescribes count
    QueueManager_1.QueueManager.bumpTotDescribesCount();
    // increment total excluded Describes if excluded
    if (excluded) {
        QueueManager_1.QueueManager.bumpTotExcDescribesCount();
    }
    // push Describe onto the callstack
    callstack_1.callStack.pushDescribe(_describe);
    // call callback to register the beforeEach, afterEach, it and describe calls
    try {
        _describe.callback();
    }
    catch (error) {
        // TODO(js): this should be reported 
        throw new Error(error.message);
    }
    // pop Describe object off of the callstack
    callstack_1.callStack.popDescribe();
};

},{"../queue/Describe":17,"../queue/QueueManager":19,"./callstack":3}],5:[function(require,module,exports){
"use strict";
exports.deepRecursiveCompare = function (a, b) {
    if (typeof (a) === "object" && typeof (b) === "object") {
        if (a === b) {
            // return true if a and b are the same object
            return true;
        }
        return compareObjects(a, b) && compareObjects(b, a);
    }
    return a === b;
};
var compareObjects = function (a, b) {
    var prop;
    if (compareArrays(a, b)) {
        return true;
    }
    for (prop in a) {
        if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
            if (typeof a[prop] === "object" && typeof b[prop] === "object") {
                if (!compareObjects(a[prop], b[prop])) {
                    return false;
                }
                continue;
            }
            if (typeof a[prop] === "object" || typeof b[prop] === "object") {
                return false;
            }
            if (a[prop] !== b[prop]) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    return true;
};
var compareArrays = function (a, b) {
    var i;
    var len;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (i = 0, len = a.length; i < len; i++) {
            if (typeof a[i] === "object" && typeof b[i] === "object") {
                if (!exports.deepRecursiveCompare(a[i], b[i])) {
                    return false;
                }
                continue;
            }
            if (typeof a[i] === "object" || typeof b[i] === "object") {
                return false;
            }
            if (Array.isArray(a[i]) && Array.isArray(b[i])) {
                if (!compareArrays(a[i], b[i])) {
                    return false;
                }
                continue;
            }
            if (Array.isArray(a[i]) || Array.isArray(b[i])) {
                return false;
            }
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
};

},{}],6:[function(require,module,exports){
"use strict";
var expectationAPI = {};
var expectationAPICount = 0;
var negatedExpectationAPI = {};
var isShortCircuit = false;
var getCurrentIt;
var note;
var spyOn;
var stackTrace;
// add not api to expect api
expectationAPI["not"] = negatedExpectationAPI;
/**
 * argChecker - checks that the matcher has the
 * correct number of args passed to it.
 *
 * Allows for a fixed and a variable number of arguments.
 *
 * Returns true if # of args is correct & false otherwise.
 *
 * Example: To declare that a matcher can take
 * a variable number of args but must be passed
 * at least 1 arg then minArgs: 1 && maxArgs: -1.
 *
 * Example: To declare that a matcher can take
 * zero or more args then minArgs: 0 && maxArgs: -1.
 *
 * Example: To declare that a matcher can take
 * a fixed number of args then minArgs: n && maxArgs: n.
 *
 * Example: To declare that a matcher can take
 * from 3 to n args then minArgs: 3 && maxArgs: n.
 */
var argsChecker = function (matcher, argsLength) {
    // fails if minArgs > maxArgs
    if (matcher.minArgs !== -1 && matcher.maxArgs !== -1 &&
        matcher.minArgs > matcher.maxArgs) {
        return false;
    }
    // allows for a variable number of args.
    if (matcher.minArgs !== -1 && argsLength < matcher.minArgs ||
        matcher.maxArgs !== -1 && argsLength > matcher.maxArgs) {
        note.exception = new Error(matcher.apiName + "(): invalid arguments");
        return false;
    }
    return true;
};
var addNoteToIt = function (note) { return getCurrentIt().expectations.push(note); };
var showAs = function (value) {
    if (Array.isArray(value)) {
        return "array";
    }
    if (typeof (value) === "function") {
        return "function";
    }
    if (typeof (value) === "object") {
        return "object";
    }
    if (typeof (value) === "string") {
        return "\"" + value + "\"";
    }
    if (typeof (value) === "number") {
        return value;
    }
    if (typeof (value) === "boolean") {
        return value;
    }
    if (typeof (value) === "undefined") {
        return "undefined";
    }
};
var assignReason = function (note) {
    var reason;
    if (!note.result) {
        if (note.matcherValue != null) {
            reason = "expect(" + showAs(note.expectedValue) + ")." + note.apiName + "(" + showAs(note.matcherValue) + ") failed";
        }
        else {
            reason = "expect(" + showAs(note.expectedValue) + ")." + note.apiName + "() failed";
        }
        reason = isShortCircuit ? reason + " and testing has been short circuited" : reason;
        reason += "!";
        getCurrentIt().reasons.push({ reason: reason, stackTrace: note.stackTrace });
    }
};
// expect(value)
var expect = function (ev) {
    // if a callback was returned then call it and use what it returns for the expected value
    var expectedValue = ev;
    // capture the stack trace here when expect is called.
    var st = stackTrace.stackTrace;
    if (typeof (ev) === "function" && !ev.hasOwnProperty("_spyMarker")) {
        var spy = spyOn(ev).and.callActual();
        expectedValue = spy();
    }
    note = { it: getCurrentIt(), apiName: null, expectedValue: expectedValue, matcherValue: null, result: null, exception: null, stackTrace: st };
    return expectationAPI;
};
var registerMatcher = function (matcher) {
    var proxy = function (not) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            note.apiName = not ? "not." + matcher.apiName : matcher.apiName;
            if (argsChecker(matcher, args.length)) {
                // don't call matcher.api if it doesn't return a value (e.g. toBeTrue)
                note.matcherValue = matcher.minArgs > 0 ? matcher.api.apply(null, args) : note.matcherValue;
                // if a callback was returned then call it and use what it returns for the matcher value
                note.matcherValue = note.matcherValue && typeof (note.matcherValue) === "function" && note.matcherValue() || note.matcherValue;
                if (not) {
                    if (matcher.minArgs) {
                        note.result = !matcher.evaluator(note.expectedValue, note.matcherValue);
                    }
                    else {
                        note.result = !matcher.evaluator(note.expectedValue);
                    }
                }
                else {
                    if (matcher.minArgs) {
                        note.result = matcher.evaluator(note.expectedValue, note.matcherValue);
                    }
                    else {
                        note.result = matcher.evaluator(note.expectedValue);
                    }
                }
                addNoteToIt(note);
                assignReason(note);
                // set It's and its parent Describe's passed property to false when expectation fails
                getCurrentIt().passed = !note.result ? note.result : getCurrentIt().passed;
                getCurrentIt().parent.passed = !note.result ? note.result : getCurrentIt().parent.passed;
            }
            else {
            }
        };
    };
    // console.log("Registering matcher", matcher.apiName);
    expectationAPI[matcher.apiName] = proxy(false);
    if (matcher.negator) {
        negatedExpectationAPI[matcher.apiName] = proxy(true);
    }
    expectationAPICount++;
};
var getMatchersCount = function () { return expectationAPICount; };
var configure = function (_shortCircuit, _getCurrentIt, _spyOn, _stackTrace) {
    isShortCircuit = _shortCircuit;
    getCurrentIt = _getCurrentIt;
    spyOn = _spyOn;
    stackTrace = _stackTrace;
};
exports.expectApi = {
    expect: expect,
    registerMatcher: registerMatcher,
    getMatchersCount: getMatchersCount,
    configure: configure
};

},{}],7:[function(require,module,exports){
/**
 * Mock API
 * WARNING: mock is an experimental api and may not be included in the official release.
 */
"use strict";
var spy_1 = require("./spy/spy");
var QueueRunner_1 = require("../../queue/QueueRunner");
var StackTrace_1 = require("../../stacktrace/StackTrace");
var mockAPI = { not: {} };
var mockAPICount = 0;
var negatedMockAPI = {};
var registerMatcher = function (matcher) {
    if (matcher.negator) {
        mockAPI.not["not." + matcher.apiName] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return !matcher.evaluator.apply(null, args);
        };
    }
    mockAPI[matcher.apiName] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return matcher.evaluator.apply(null, args);
    };
};
registerMatcher({
    apiName: "toBeCalled",
    api: function () { },
    evaluator: function (expectedValue) { return expectedValue.calls.count() > 0; },
    negator: true,
    minArgs: 0,
    maxArgs: 0
});
registerMatcher({
    apiName: "toBeCalledWith",
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
    apiName: "toBeCalledWithContext",
    api: function (matcherValue) { return matcherValue; },
    evaluator: function (expectedValue, matcherValue) {
        return expectedValue.calls.wasCalledWithContext(matcherValue);
    },
    negator: true,
    minArgs: 1,
    maxArgs: 1
});
registerMatcher({
    apiName: "toReturnValue",
    api: function (matcherValue) { return matcherValue; },
    evaluator: function (expectedValue, matcherValue) {
        return expectedValue.calls.returned(matcherValue);
    },
    negator: true,
    minArgs: 1,
    maxArgs: 1
});
registerMatcher({
    apiName: "toThrow",
    api: function () { },
    evaluator: function (expectedValue) {
        return expectedValue.calls.threw();
    },
    negator: true,
    minArgs: 0,
    maxArgs: 0
});
registerMatcher({
    apiName: "toThrowWithMessage",
    api: function (matcherValue) { return matcherValue; },
    evaluator: function (expectedValue, matcherValue) {
        return expectedValue.calls.threwWithMessage(matcherValue);
    },
    negator: true,
    minArgs: 1,
    maxArgs: 1
});
registerMatcher({
    apiName: "toThrowWithName",
    api: function (matcherValue) { return matcherValue; },
    evaluator: function (expectedValue, matcherValue) {
        return expectedValue.calls.threwWithName(matcherValue);
    },
    negator: true,
    minArgs: 1,
    maxArgs: 1
});
exports.mock = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var st = StackTrace_1.stackTrace.stackTrace;
    var aSpy = spy_1.spyOn.apply(null, args);
    var _mockProxyStatic = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        // when called _mockProxyStatic delegates its calls to the spy
        aSpy.apply(this, args);
    };
    // mock api
    var _mock = _mockProxyStatic;
    var apisToCall = [];
    _mock.and = {};
    _mock.and.expect = { it: { not: {} } };
    _mock.and.expect.it.toBeCalled = function () {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "toBeCalled", expectedValue: aSpy, matcherValue: null, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.not.toBeCalled = function () {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "not.toBeCalled", expectedValue: aSpy, matcherValue: null, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.toBeCalledWith = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "toBeCalledWith", expectedValue: aSpy, matcherValue: args, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.not.toBeCalledWith = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "not.toBeCalledWith", expectedValue: aSpy, matcherValue: args, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.toBeCalledWithContext = function (context) {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "toBeCalledWithContext", expectedValue: aSpy, matcherValue: context, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.not.toBeCalledWithContext = function (context) {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "not.toBeCalledWithContext", expectedValue: aSpy, matcherValue: context, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.toReturnValue = function (value) {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "toReturnValue", expectedValue: aSpy, matcherValue: value, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.not.toReturnValue = function (value) {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "not.toReturnValue", expectedValue: aSpy, matcherValue: value, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.toThrow = function () {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "toThrow", expectedValue: aSpy, matcherValue: null, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.not.toThrow = function () {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "not.toThrow", expectedValue: aSpy, matcherValue: null, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.toThrowWithName = function (name) {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "toThrowWithName", expectedValue: aSpy, matcherValue: name, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.not.toThrowWithName = function (name) {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "not.toThrowWithName", expectedValue: aSpy, matcherValue: name, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.toThrowWithMessage = function (message) {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "toThrowWithMessage", expectedValue: aSpy, matcherValue: message, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    _mock.and.expect.it.not.toThrowWithMessage = function (message) {
        apisToCall.push({
            note: { it: QueueRunner_1.getCurrentIt(), apiName: "not.toThrowWithMessage", expectedValue: aSpy, matcherValue: message, result: null, exception: null, stackTrace: st }
        });
        return _mock;
    };
    // methods that delegate to the spy property
    _mock.and.reset = function () {
        aSpy.and.reset();
        return _mock;
    };
    _mock.and.callWithContext = function (context) {
        aSpy.and.callWithContext(context);
        return _mock;
    };
    _mock.and.throw = function () {
        aSpy.and.throw();
        return _mock;
    };
    _mock.and.throwWithMessage = function (message) {
        aSpy.and.throwWithMessage(message);
        return _mock;
    };
    _mock.and.throwWithName = function (name) {
        aSpy.and.throwWithName(name);
        return _mock;
    };
    _mock.and.return = function (ret) {
        aSpy.and.return(ret);
        return _mock;
    };
    _mock.and.callFake = function (fn) {
        aSpy.and.callFake(fn);
        return _mock;
    };
    _mock.and.callActual = function () {
        aSpy.and.callActual();
        return _mock;
    };
    _mock.and.callStub = function () {
        aSpy.and.callStub();
        return _mock;
    };
    // mock validtation
    _mock.validate = function () {
        apisToCall.forEach(function (apiToCall) {
            var negated = /not\./.test(apiToCall.note.apiName);
            var reason;
            if (apiToCall.note.matcherValue) {
                apiToCall.note.result = negated ?
                    mockAPI.not[apiToCall.note.apiName](apiToCall.note.expectedValue, apiToCall.note.matcherValue) :
                    mockAPI[apiToCall.note.apiName](apiToCall.note.expectedValue, apiToCall.note.matcherValue);
            }
            else {
                apiToCall.note.result = negated ?
                    mockAPI.not[apiToCall.note.apiName](apiToCall.note.expectedValue) :
                    mockAPI[apiToCall.note.apiName](apiToCall.note.expectedValue);
            }
            QueueRunner_1.getCurrentIt().passed = apiToCall.note.result && QueueRunner_1.getCurrentIt().passed || false;
            QueueRunner_1.getCurrentIt().parent.passed = apiToCall.note.result && QueueRunner_1.getCurrentIt().passed || false;
            QueueRunner_1.getCurrentIt().expectations.push(apiToCall.note);
            if (!apiToCall.note.result) {
                if (apiToCall.note.matcherValue) {
                    reason = "mock().and.expect.it." + apiToCall.note.apiName + "(" + apiToCall.note.matcherValue + ") failed!";
                }
                else {
                    reason = "mock().and.expect.it." + apiToCall.note.apiName + "() failed!";
                }
                QueueRunner_1.getCurrentIt().reasons.push({ reason: reason, stackTrace: apiToCall.note.stackTrace });
            }
        });
    };
    return _mock;
};
// test api here
// let aMock = mock().and.expect.it.toBeCalled();

},{"../../queue/QueueRunner":20,"../../stacktrace/StackTrace":24,"./spy/spy":8}],8:[function(require,module,exports){
"use strict";
var deeprecursiveequal_1 = require("../comparators/deeprecursiveequal");
// args API
var Args = (function () {
    function Args(args) {
        var _this = this;
        this.getLength = function () { return _this.args.length ? _this.args.length : 0; };
        this.hasArg = function (i) { return i >= 0 && _this.getLength() > i ? true : false; };
        this.getArg = function (i) { return _this.hasArg(i) ? _this.args[i] : null; };
        this.hasArgProperty = function (i, propertyName) {
            return _this.hasArg(i) && propertyName in _this.args[i] ? true : false;
        };
        this.getArgProperty = function (i, propertyName) {
            return _this.hasArgProperty(i, propertyName) ? _this.args[i][propertyName] : null;
        };
        this.args = args;
    }
    return Args;
}());
exports.Args = Args;
var ACall = (function () {
    function ACall(context, args, error, returned) {
        var _this = this;
        this.context = context;
        this.args = args;
        this.error = error;
        this.returned = returned;
        this.getContext = function () { return _this.context; };
        this.getArgs = function () { return _this.args; };
        this.getArg = function (i) { return _this.args.getArg(i); };
        this.getArgsLength = function () { return _this.args.getLength(); };
        this.getArgProperty = function (i, propertyName) { return _this.args.getArgProperty(i, propertyName); };
        this.hasArgProperty = function (i, propertyName) { return _this.args.hasArgProperty(i, propertyName); };
        this.hasArg = function (i) { return _this.args.hasArg(i); };
        this.getError = function () { return _this.error; };
        this.getReturned = function () { return _this.returned; };
    }
    return ACall;
}());
exports.ACall = ACall;
exports.spyOn = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var targetFn;
    var calls = [];
    if (args.length) {
        if (typeof (args[0]) !== "function" && typeof (args[0]) !== "object") {
            throw new Error("1st parameter must be a function or an object");
        }
        if (typeof (args[0]) === "object" && args.length < 2) {
            throw new Error("expecting 2 parameters - found " + args.length);
        }
        if (typeof (args[0]) === "object" && typeof (args[1]) !== "string") {
            throw new Error("2nd parameter must be a string");
        }
        if (typeof (args[0]) === "object" && typeof (args[0][args[1]]) !== "function") {
            throw new Error("expected " + args[1] + " to be a method");
        }
    }
    // spy api
    targetFn = args.length === 0 ? function () { } :
        typeof (args[0]) === "function" ? args[0] : args[0][args[1]];
    // spy api - tracking
    var spy = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var aArgs = args.length && args || [];
        var fn;
        var error;
        var returned;
        function ThrowsException(message, name) {
            this.message = message;
            this.name = name;
        }
        if (spy._callActual || spy._callFake) {
            fn = spy._callFake || targetFn;
            try {
                returned = fn.apply(spy._callWithContext || this, aArgs);
            }
            catch (er) {
                error = er;
            }
        }
        else if (spy._throws) {
            try {
                throw new ThrowsException(spy._throwsMessage, spy._throwsName);
            }
            catch (er) {
                error = er;
            }
        }
        if (!spy._callActual) {
            returned = spy._returns || returned;
        }
        calls.push(new ACall(spy._callWithContext || this, new Args(aArgs), error, returned));
        return returned;
    };
    spy._spyMarker = "preamble.spy";
    // stub api
    spy._throws = false;
    spy._throwsMessage = "";
    spy._throwsName = "";
    spy.and = {};
    // spy api - sets the spy back to its default state
    spy.and.reset = function () {
        calls = [];
        spy._resetCalls();
        spy._throws = false;
        spy._throwsMessage = "";
        spy._throwsName = "";
        spy._callWithContext = null;
        spy._hasExpectations = false;
        return spy;
    };
    spy._callWithContext = null;
    spy.and.callWithContext = function (context) {
        if (!context || typeof (context) !== "object") {
            throw new Error("callWithContext expects to be called with an object");
        }
        spy._callWithContext = context;
        return spy;
    };
    spy.and.throw = function () {
        spy._throws = true;
        // for chaining
        return spy;
    };
    spy.and.throwWithMessage = function (message) {
        if (typeof (message) !== "string") {
            throw new Error("message expects a string");
        }
        spy._throws = true;
        spy._throwsMessage = message;
        // for chaining - spy.throws.with.message().and.with.name();
        return spy;
    };
    spy.and.throwWithName = function (name) {
        if (typeof (name) !== "string") {
            throw new Error("name expects a string");
        }
        spy._throws = true;
        spy._throwsName = name;
        // for chaining - spy.throws.with.message().and.with.name();
        return spy;
    };
    spy.and.return = function (ret) {
        spy._returns = ret;
        // for chaining
        return spy;
    };
    // spy api
    spy._resetCalls = function () {
        spy._callFake = null;
        spy._callActual = this._callStub = false;
    };
    // spy api
    spy._callFake = null;
    spy.and.callFake = function (fn) {
        if (fn && typeof (fn) !== "function") {
            throw new Error("callFake expects to be called with a function");
        }
        spy._resetCalls();
        spy._callFake = fn;
        return spy;
    };
    // spy api
    spy._callActual = false;
    spy.and.callActual = function () {
        spy._resetCalls();
        spy._callActual = true;
        // for chaining
        return spy;
    };
    // spy api
    spy.and.callStub = function () {
        spy._resetCalls();
        spy._callActual = false;
        // for chaining
        return spy;
    };
    spy.calls = {
        count: function () {
            return calls.length;
        },
        forCall: function (i) {
            return i >= 0 && i < calls.length && calls[i] || undefined;
        },
        all: function () {
            return calls;
        },
        wasCalledWith: function () {
            var args1 = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args1[_i - 0] = arguments[_i];
            }
            return calls.some(function (call) {
                var args2 = call.getArgs().args;
                return (deeprecursiveequal_1.deepRecursiveCompare(args1, args2));
            });
        },
        wasCalledWithContext: function (obj) {
            return calls.some(function (call) {
                var context = call.context;
                return (deeprecursiveequal_1.deepRecursiveCompare(obj, context));
            });
        },
        returned: function (value) {
            return calls.some(function (call) {
                var returned = call.getReturned();
                return (deeprecursiveequal_1.deepRecursiveCompare(value, returned));
            });
        },
        threw: function () {
            return calls.some(function (call) {
                return !!call.error;
            });
        },
        threwWithName: function (name) {
            return calls.some(function (call) {
                return call.error && call.error.name === name;
            });
        },
        threwWithMessage: function (message) {
            return calls.some(function (call) {
                return call.error && call.error.message === message;
            });
        }
    };
    if (args.length && typeof (args[0]) !== "function" &&
        typeof (args[0]) === "object") {
        args[0][args[1]] = spy;
    }
    return spy;
};
/**
 * @param {object} argObject An object whose properties identified by
 * the elements in argPropertyNames are to be spies.
 * @param {array} argPropertyNames An array of strings whose elements
 * identify the methods in argObject to be spies.
 * @param {[object]} context An object to use as the context when calling
 * the spied property methods.
 */
exports.spyOnN = function (argObject, argPropertyNames) {
    var i, len;
    if (!argObject || typeof (argObject) !== "object") {
        throw new Error("expected an object for 1st parameter - found " +
            typeof (argObject));
    }
    if (!argPropertyNames || !Array.isArray(argPropertyNames)) {
        throw new Error("expected an array for 2nd parameter - found " +
            typeof (argObject));
    }
    if (!argPropertyNames.length) {
        throw new Error("expected an array for 2nd parameter with at " +
            "least one element for 2nd parameter");
    }
    for (i = 0, len = argPropertyNames.length; i < len; i++) {
        if (typeof (argPropertyNames[i]) !== "string") {
            throw new Error("expected element " + i +
                " of 2nd parameter to be a string");
        }
        if (!argObject[argPropertyNames[i]]) {
            throw new Error("expected 1st paramter to have property " +
                argPropertyNames[i]);
        }
        if (typeof (argObject[argPropertyNames[i]]) !== "function") {
            throw new Error("expected " + argPropertyNames[i] +
                " to be a method");
        }
    }
    argPropertyNames.forEach(function (property) {
        exports.spyOn(argObject, property);
    });
};

},{"../comparators/deeprecursiveequal":5}],9:[function(require,module,exports){
/**
 * Callable api
 * it("description", callback)
 */
"use strict";
var It_1 = require("../queue/It");
var callstack_1 = require("./callstack");
var QueueManager_1 = require("../queue/QueueManager");
var StackTrace_1 = require("../stacktrace/StackTrace");
exports.it = function (label, callback, timeoutInterval) {
    if (timeoutInterval === void 0) { timeoutInterval = 0; }
    var _it;
    var excluded;
    if (arguments.length !== 2 && arguments.length !== 3) {
        throw new TypeError("it called with invalid parameters");
    }
    if (typeof (arguments[0]) !== "string" || typeof (arguments[1]) !== "function") {
        throw new TypeError("it called with invalid parameters");
    }
    if (arguments.length === 3 && typeof (arguments[2]) !== "number") {
        throw new TypeError("it called with invalid parameters");
    }
    // mark the It excluded if any of its parents are excluded
    excluded = callstack_1.callStack.stack.some(function (item) {
        return item.excluded;
    });
    // an It object
    _it = new It_1.It(callstack_1.callStack.getTopOfStack(), callstack_1.callStack.uniqueId.toString(), label, callback, excluded, timeoutInterval, StackTrace_1.stackTrace.stackTrace);
    // push It onto the queue
    QueueManager_1.QueueManager.queue.push(_it);
    // increment totIts count
    QueueManager_1.QueueManager.bumpTotItsCount();
    // increment total excluded Its if excluded
    if (excluded) {
        QueueManager_1.QueueManager.bumpTotExcItsCount();
    }
};

},{"../queue/It":18,"../queue/QueueManager":19,"../stacktrace/StackTrace":24,"./callstack":3}],10:[function(require,module,exports){
/**
 * Callable API
 * xdescribe("description", callback)
 * excluded suite
 */
"use strict";
var callstack_1 = require("./callstack");
var Describe_1 = require("../queue/Describe");
var QueueManager_1 = require("../queue/QueueManager");
exports.xdescribe = function (label, callback) {
    var _describe;
    if (arguments.length !== 2 || typeof (arguments[0])
        !== "string" || typeof (arguments[1]) !== "function") {
        throw new TypeError("describe called with invalid parameters");
    }
    // a Description object
    _describe = new Describe_1.Describe(callstack_1.callStack.uniqueId.toString(), label, callback, callstack_1.callStack.length && callstack_1.callStack.getTopOfStack() || null, true);
    // push Describe onto the queue
    QueueManager_1.QueueManager.queue.push(_describe);
    // increment totDescribes count
    QueueManager_1.QueueManager.bumpTotDescribesCount();
    // increment totExcDescribes count
    QueueManager_1.QueueManager.bumpTotExcDescribesCount();
    // push Describe object onto the callstack
    callstack_1.callStack.pushDescribe(_describe);
    // call callback to register the beforeEach, afterEach, it and describe calls
    try {
        _describe.callback();
    }
    catch (error) {
        // TODO(js): this should be reported 
        throw new Error(error.message);
    }
    // pop Describe object off of the callstack
    callstack_1.callStack.popDescribe();
};

},{"../queue/Describe":17,"../queue/QueueManager":19,"./callstack":3}],11:[function(require,module,exports){
/**
 * Callable api
 * xit("description", callback)
 * exlude test
 */
"use strict";
var It_1 = require("../queue/It");
var callstack_1 = require("./callstack");
var QueueManager_1 = require("../queue/QueueManager");
var StackTrace_1 = require("../stacktrace/StackTrace");
exports.xit = function (label, callback, timeoutInterval) {
    if (timeoutInterval === void 0) { timeoutInterval = 0; }
    var _it;
    if (arguments.length !== 2 && arguments.length !== 3) {
        throw new TypeError("it called with invalid parameters");
    }
    if (typeof (arguments[0]) !== "string" || typeof (arguments[1]) !== "function") {
        throw new TypeError("it called with invalid parameters");
    }
    if (arguments.length === 3 && typeof (arguments[2]) !== "number") {
        throw new TypeError("it called with invalid parameters");
    }
    // an It object
    _it = new It_1.It(callstack_1.callStack.getTopOfStack(), callstack_1.callStack.uniqueId.toString(), label, callback, true, timeoutInterval, StackTrace_1.stackTrace.stackTrace);
    // push Describe onto the queue
    QueueManager_1.QueueManager.queue.push(_it);
    // Increment totIts count
    QueueManager_1.QueueManager.bumpTotItsCount();
    // Increment totExclIts count
    QueueManager_1.QueueManager.bumpTotExcItsCount();
};

},{"../queue/It":18,"../queue/QueueManager":19,"../stacktrace/StackTrace":24,"./callstack":3}],12:[function(require,module,exports){
/**
 * CallStack
 */
"use strict";
var Describe_1 = require("../queue/Describe");
var CallStack = (function () {
    function CallStack(_uniqueNumber) {
        this._uniqueNumber = _uniqueNumber;
        this._callStack = [];
    }
    CallStack.prototype.pushDescribe = function (describe) {
        if (!(describe instanceof Describe_1.Describe)) {
            throw new TypeError("callstack.push called with invalid parameter");
        }
        return this._callStack.push(describe);
    };
    CallStack.prototype.popDescribe = function () {
        if (this._callStack.length) {
            return this._callStack.pop();
        }
        else {
            return null;
        }
    };
    CallStack.prototype.clear = function () {
        this._callStack = [];
    };
    Object.defineProperty(CallStack.prototype, "stack", {
        get: function () {
            return this._callStack;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallStack.prototype, "length", {
        get: function () {
            return this._callStack.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CallStack.prototype, "uniqueId", {
        get: function () {
            return this._uniqueNumber.next;
        },
        enumerable: true,
        configurable: true
    });
    CallStack.prototype.getTopOfStack = function () {
        return this._callStack.length && this._callStack[this._callStack.length - 1] || null;
    };
    return CallStack;
}());
exports.CallStack = CallStack;

},{"../queue/Describe":17}],13:[function(require,module,exports){
/**
 * Environment Dependent Configuration
 */
"use strict";
// import {environment} from "../environment/environment";
var environment_1 = require("../environment/environment");
require("../../polyfills/Object.assign"); // prevent eliding import
// TODO(js): clean up configuration - remove shortCircuit, windowGlobals and make uiTestContainerId conditional
var defaultConfiguration = {
    // windowGlobals: true,
    timeoutInterval: 5000,
    name: "Suite",
    uiTestContainerId: "preamble-ui-container",
    hidePassedTests: typeof window !== "undefined" ? false : true,
    shortCircuit: false
};
if (environment_1.pGlobal.preamble && environment_1.pGlobal.preamble.preambleConfig) {
    exports.configuration = Object.assign({}, defaultConfiguration, environment_1.pGlobal.preamble.preambleConfig);
}
else {
    exports.configuration = defaultConfiguration;
}

},{"../../polyfills/Object.assign":26,"../environment/environment":14}],14:[function(require,module,exports){
"use strict";
var preambleGlobal = require("@jeffreyschwartz/environment");
exports.pGlobal = preambleGlobal;

},{"@jeffreyschwartz/environment":27}],15:[function(require,module,exports){
"use strict";
var AfterEach = (function () {
    function AfterEach(parent, id, callback, timeoutInterval, callStack) {
        this.parent = parent;
        this.id = id;
        this.callback = callback;
        this.timeoutInterval = timeoutInterval;
        this.callStack = callStack;
    }
    return AfterEach;
}());
exports.AfterEach = AfterEach;

},{}],16:[function(require,module,exports){
"use strict";
var BeforeEach = (function () {
    function BeforeEach(parent, id, callback, timeoutInterval, callStack) {
        this.parent = parent;
        this.id = id;
        this.callback = callback;
        this.timeoutInterval = timeoutInterval;
        this.callStack = callStack;
    }
    return BeforeEach;
}());
exports.BeforeEach = BeforeEach;

},{}],17:[function(require,module,exports){
"use strict";
var Describe = (function () {
    function Describe(id, label, callback, parent, excluded) {
        if (excluded === void 0) { excluded = false; }
        this.id = id;
        this.label = label;
        this.callback = callback;
        this.parent = parent;
        this.excluded = excluded;
        this.context = {};
        this.beforeEach = null;
        this.afterEach = null;
        this.isA = "Describe";
        this.passed = true;
    }
    return Describe;
}());
exports.Describe = Describe;

},{}],18:[function(require,module,exports){
"use strict";
var hierarchy_1 = require("./hierarchy");
/**
* returns an It ancestor hierarchy
*/
var It = (function () {
    function It(parent, id, label, callback, excluded, timeoutInterval, callStack) {
        if (excluded === void 0) { excluded = false; }
        this.parent = parent;
        this.id = id;
        this.label = label;
        this.callback = callback;
        this.excluded = excluded;
        this.timeoutInterval = timeoutInterval;
        this.callStack = callStack;
        this.expectations = [];
        this.scope = {};
        this.isA = "It";
        this.passed = true;
        this.hierarchy = hierarchy_1.ancestorHierarchy(parent);
        this.reasons = [];
    }
    return It;
}());
exports.It = It;

},{"./hierarchy":21}],19:[function(require,module,exports){
/**
 * QueueManager
 * Periodically checks the length of the queue.
 * If it remains stable over a period of time it
 * signals that the queue is ready to be processed.
 */
"use strict";
;
;
var QueueManager = (function () {
    function QueueManager(timerInterval, stableRetryCount, Q /** see Note above */) {
        this.timerInterval = timerInterval;
        this.stableRetryCount = stableRetryCount;
        this.Q = Q;
    }
    QueueManager.prototype.run = function () {
        var _this = this;
        var deferred = this.Q.defer();
        var retryCount = 0;
        var prevCount = 0;
        var intervalId = setInterval(function () {
            // console.log("QueueManager checking queue length stability");
            if (QueueManager.queue.length === prevCount) {
                retryCount++;
                if (retryCount > _this.stableRetryCount) {
                    clearInterval(intervalId);
                    if (QueueManager.queue.length === 0) {
                        deferred.reject(new Error("Nothing to test!"));
                    }
                    else {
                        // console.log("QueueManager queue stable.");
                        deferred.resolve("QueueManager.queue loaded. Count = " + QueueManager.queue.length + ".");
                    }
                }
            }
            else if (QueueManager.queue.length > prevCount) {
                prevCount = QueueManager.queue.length;
            }
        }, this.timerInterval);
        return deferred.promise;
    };
    QueueManager.startTimer = function () {
        QueueManager.queueManagerStats.timeKeeper.startTime = Date.now();
    };
    QueueManager.stopTimer = function () {
        QueueManager.queueManagerStats.timeKeeper.endTime = Date.now();
        QueueManager.queueManagerStats.timeKeeper.totTime =
            QueueManager.queueManagerStats.timeKeeper.endTime -
                QueueManager.queueManagerStats.timeKeeper.startTime;
    };
    QueueManager.bumpTotDescribesCount = function () {
        QueueManager.queueManagerStats.totDescribes++;
    };
    QueueManager.bumpTotExcDescribesCount = function () {
        QueueManager.queueManagerStats.totExcDescribes++;
    };
    QueueManager.bumpTotItsCount = function () {
        QueueManager.queueManagerStats.totIts++;
    };
    QueueManager.bumpTotExcItsCount = function () {
        QueueManager.queueManagerStats.totExcIts++;
    };
    QueueManager.bumpTotFailedItsCount = function () {
        QueueManager.queueManagerStats.totFailedIts++;
    };
    QueueManager.queue = [];
    QueueManager.queueManagerStats = {
        totDescribes: 0,
        totExcDescribes: 0,
        totIts: 0,
        totExcIts: 0,
        totFailedIts: 0,
        timeKeeper: {
            startTime: 0,
            endTime: 0,
            totTime: 0
        }
    };
    return QueueManager;
}());
exports.QueueManager = QueueManager;

},{}],20:[function(require,module,exports){
// TODO(js): Feature - implement shourt circuit. Done 4/28/16.
// TODO(js): Bug - timeouts shouldn't reject their promise. Done 4/28/16.
"use strict";
var QueueManager_1 = require("./QueueManager");
require("../../polyfills/Object.assign"); // prevent eliding import
var currentIt;
exports.getCurrentIt = function () { return currentIt; };
// TODO(JS): Show .fails (i.e. timeouts) in the done???
var QueueRunner = (function () {
    function QueueRunner(queue, configTimeoutInterval, configShortCircuit, queueManager, reportDispatch, Q) {
        this.queue = queue;
        this.configTimeoutInterval = configTimeoutInterval;
        this.configShortCircuit = configShortCircuit;
        this.queueManager = queueManager;
        this.reportDispatch = reportDispatch;
        this.Q = Q;
        this.isShortCircuited = false;
    }
    /**
     * Returns a function (closure) which must complete within a set amount of time
     * asynchronously. If the function fails to complete within its given time limit
     * then its promise is rejected. If the function completes within its given time
     * limit then its promise is resolved.
     *
     * Example:
     * beforeEach(function(done) {...}, 1);
     */
    QueueRunner.prototype.runBeforeItAfter = function (fn, context, timeoutInterval) {
        var _this = this;
        var deferred = this.Q.defer();
        setTimeout(function () {
            var resolve = function () {
                if (deferred.promise.isPending()) {
                    deferred.resolve();
                }
            };
            if (fn.length) {
                // Asynchronously calls fn passing callback for done parameter
                setTimeout(function () {
                    fn.call(context, function () { return resolve(); });
                }, 1);
            }
            else {
                // Synchronously calls fn
                setTimeout(function () {
                    fn.call(context);
                    resolve();
                }, 1);
            }
            // a timer that expires after timeoutInterval miliseconds
            setTimeout(function () {
                var errorMsg = "timed out after " + timeoutInterval + "ms";
                if (_this.isShortCircuited) {
                    errorMsg += " and testing has been short circuited";
                }
                if (deferred.promise.isPending()) {
                    // timedOut = true;
                    deferred.reject(new Error(errorMsg));
                }
            }, timeoutInterval);
        }, 1);
        // Immediately return a promise to the caller.
        return deferred.promise;
    };
    /**
     * runs ancestor hierarchy of BeforeEach with inherited contexts
     */
    // TODO(js): combine runBefores and runAfters into one routine using a callback to determine whether to run the before or after
    QueueRunner.prototype.runBefores = function (hierarchy) {
        var _this = this;
        var deferred = this.Q.defer();
        var runner = function (ndx) {
            setTimeout(function () {
                if (ndx < hierarchy.length && deferred.promise.isPending()) {
                    // setup the context for calling BeforeEach.callback
                    // if it is not the 1st ([0]) item in the array
                    if (ndx) {
                        // the current context is a result of applying its parent's context values to a blank object
                        hierarchy[ndx].context = Object.assign({}, hierarchy[ndx - 1].context);
                    }
                    else {
                        hierarchy[ndx].context = {};
                    }
                    if (hierarchy[ndx].beforeEach) {
                        var ms = hierarchy[ndx].beforeEach.timeoutInterval > 0
                            && hierarchy[ndx].beforeEach.timeoutInterval || _this.configTimeoutInterval;
                        _this.runBeforeItAfter(hierarchy[ndx].beforeEach.callback, hierarchy[ndx].context, ms)
                            .then(function () { return runner(++ndx); }, function (error) {
                            deferred.reject(new Error("beforeEach " + error.message));
                        });
                    }
                    else {
                        runner(++ndx);
                    }
                }
                else {
                    if (deferred.promise.isPending()) {
                        deferred.resolve();
                    }
                }
            }, 1);
        };
        runner(0);
        return deferred.promise;
    };
    /**
     * runs ancestor hierarchy of AfterEach with inherited contexts
     */
    // TODO(js): combine runBefores and runAfters into one routine using a callback to determine whether to run the before or after
    QueueRunner.prototype.runAfters = function (hierarchy) {
        var _this = this;
        var deferred = this.Q.defer();
        var runner = function (ndx) {
            setTimeout(function () {
                if (ndx < hierarchy.length && deferred.promise.isPending()) {
                    // setup the context for calling BeforeEach.callback
                    // if it is not the 1st ([0]) item in the array
                    if (ndx) {
                        // the current context is a result of applying its parent's context values to a blank object
                        hierarchy[ndx].context = Object.assign({}, hierarchy[ndx - 1].context);
                    }
                    else {
                        hierarchy[ndx].context = {};
                    }
                    if (hierarchy[ndx].afterEach) {
                        var ms = hierarchy[ndx].afterEach.timeoutInterval > 0
                            && hierarchy[ndx].afterEach.timeoutInterval || _this.configTimeoutInterval;
                        _this.runBeforeItAfter(hierarchy[ndx].afterEach.callback, hierarchy[ndx].context, ms)
                            .then(function () { return runner(++ndx); }, function (error) {
                            deferred.reject(new Error("afterEach " + error.message));
                        });
                    }
                    else {
                        runner(++ndx);
                    }
                }
                else {
                    if (deferred.promise.isPending()) {
                        deferred.resolve();
                    }
                }
            }, 1);
        };
        runner(0);
        return deferred.promise;
    };
    /**
     * runs an It
     */
    QueueRunner.prototype.runIt = function (it) {
        var _this = this;
        var deferred = this.Q.defer();
        var ms = it.timeoutInterval > 0 && it.timeoutInterval || this.configTimeoutInterval;
        setTimeout(function () {
            _this.runBeforeItAfter(it.callback, it.parent.context, ms).
                then(function () {
                deferred.resolve();
            }, function (error) {
                deferred.reject(new Error("it " + error.message));
            });
        }, 1);
        return deferred.promise;
    };
    /**
     * run before/it/after block
     */
    QueueRunner.prototype.runBIA = function (it) {
        var _this = this;
        var deferred = this.Q.defer();
        var shortCircuitMessage = function (message) {
            return _this.configShortCircuit && message + " and testing has been short circuited!" || message;
        };
        setTimeout(function () {
            currentIt = it;
            _this.runBefores(it.hierarchy).then(function () {
                _this.runIt(it).then(function () {
                    _this.runAfters(it.hierarchy).then(function () {
                        deferred.resolve();
                    }, function (error) {
                        it.reasons.push({
                            reason: shortCircuitMessage(error.message),
                            stackTrace: it.parent.afterEach.callStack
                        });
                        it.passed = false;
                        deferred.reject(error);
                    });
                }, function (error) {
                    it.reasons.push({
                        reason: shortCircuitMessage(error.message),
                        stackTrace: it.callStack
                    });
                    it.passed = false;
                    deferred.reject(error);
                });
            }, function (error) {
                it.reasons.push({
                    reason: shortCircuitMessage(error.message),
                    stackTrace: it.parent.beforeEach.callStack
                });
                it.passed = false;
                deferred.reject(error);
            });
        }, 1);
        return deferred.promise;
    };
    /**
     * recursively iterates through all the queue's Its
     * asynchronously and returns a promise
     */
    QueueRunner.prototype.run = function () {
        var _this = this;
        var deferred = this.Q.defer();
        var its = this.queue.filter(function (element) { return element.isA === "It"; });
        var it;
        // console.log("its", its);
        // recursive iterator
        var runner = function (i) {
            setTimeout(function () {
                if (!_this.isShortCircuited && i < its.length) {
                    it = its[i];
                    // TODO(js): is parent.excluded check really needed????
                    if (it.excluded || it.parent.excluded) {
                        _this.reportDispatch.reportSpec(it);
                        runner(++i);
                    }
                    else {
                        _this.runBIA(it).then(function () {
                            if (!it.passed) {
                                QueueManager_1.QueueManager.bumpTotFailedItsCount();
                                if (_this.configShortCircuit) {
                                    _this.isShortCircuited = true;
                                }
                            }
                            _this.reportDispatch.reportSummary();
                            _this.reportDispatch.reportSpec(it);
                            runner(++i);
                        }).fail(function () {
                            // an it timed out or one or more expectations failed
                            QueueManager_1.QueueManager.bumpTotFailedItsCount();
                            _this.reportDispatch.reportSummary();
                            _this.reportDispatch.reportSpec(it);
                            if (_this.configShortCircuit) {
                                _this.isShortCircuited = true;
                            }
                            runner(++i);
                        });
                    }
                }
                else {
                    deferred.resolve();
                }
            }, 1);
        };
        // call recursive runner to begin iterating through the queue
        runner(0);
        // return a promise to caller
        return deferred.promise;
    };
    return QueueRunner;
}());
exports.QueueRunner = QueueRunner;

},{"../../polyfills/Object.assign":26,"./QueueManager":19}],21:[function(require,module,exports){
"use strict";
function ancestorHierarchy(item) {
    var parent = item;
    var hierarchy = [];
    // build ancestor hierarchy adding parent to the top of the hierarcy
    while (parent) {
        hierarchy.unshift(parent);
        parent = parent.parent;
    }
    // return ancestor hierarchy
    return hierarchy;
}
exports.ancestorHierarchy = ancestorHierarchy;
;
function descendantHierarchy(queue, item) {
    var child;
    var hierarchy = [];
    // returns an array of all queue items whose parent is aChild
    var searchQueueForChidren = function (aChild) {
        var t = [];
        queue.forEach(function (item) {
            if (item.parent && item.parent.id === aChild.id) {
                t.push(item);
            }
        });
        return t;
    };
    // buid descendant hierarchy adding children to the bottom of the hierarch
    var buildHierarchy = function (item) {
        hierarchy.push(item);
        searchQueueForChidren(item).forEach(function (child) { return buildHierarchy(child); });
    };
    buildHierarchy(item);
    return hierarchy;
}
exports.descendantHierarchy = descendantHierarchy;

},{}],22:[function(require,module,exports){
"use strict";
var hierarchy_1 = require("./hierarchy");
/**
 * Returns a subset of quueue that matches filter.
 */
function queueFilter(queue, queueManagerStats, filter) {
    var target;
    var result;
    var originalTotItCount = queueManagerStats.totIts;
    var count = 0;
    if (!filter || !filter.length) {
        return queue;
    }
    // find the item whose id matches the filter and push it onto the hierarchy
    queue.some(function (item) {
        if (item.id === filter) {
            target = item;
            return true;
        }
    });
    // find descendants
    result = hierarchy_1.descendantHierarchy(queue, target);
    // set the queue's total its count
    queueManagerStats.totIts = result.reduce(function (prev, curr) {
        return curr.isA === "It" && prev + 1 || prev;
    }, 0);
    // set the queue's excluded count
    queueManagerStats.totExcIts = result.reduce(function (prev, curr) {
        return curr.isA === "It" && curr.excluded && prev + 1 || prev;
    }, 0);
    // set the queue's filtered count
    queueManagerStats.totFiltered = originalTotItCount - queueManagerStats.totIts;
    return hierarchy_1.descendantHierarchy(queue, target);
}
exports.queueFilter = queueFilter;

},{"./hierarchy":21}],23:[function(require,module,exports){
"use strict";
var ReportDispatch = (function () {
    function ReportDispatch() {
    }
    ReportDispatch.prototype.reportBegin = function (configOptions) {
        this._configOptions = configOptions;
        this._reporters.forEach(function (report) { return report.reportBegin(configOptions); });
    };
    ReportDispatch.prototype.reportSummary = function () {
        var _this = this;
        this._reporters.forEach(function (report) { return report.reportSummary(_this._queueManagerStats); });
    };
    ReportDispatch.prototype.reportSpec = function (it) {
        this._reporters.forEach(function (report) { return report.reportSpec(it); });
    };
    ReportDispatch.prototype.reportEnd = function () {
        var _this = this;
        this._reporters.forEach(function (report) { return report.reportEnd(_this._queueManagerStats); });
    };
    Object.defineProperty(ReportDispatch.prototype, "reporters", {
        set: function (reporters) {
            this._reporters = reporters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReportDispatch.prototype, "queueManagerStats", {
        set: function (stats) {
            this._queueManagerStats = stats;
        },
        enumerable: true,
        configurable: true
    });
    return ReportDispatch;
}());
exports.ReportDispatch = ReportDispatch;
exports.reportDispatch = new ReportDispatch();

},{}],24:[function(require,module,exports){
"use strict";
var StackTrace = (function () {
    function StackTrace() {
        // determine the Error object's stack trace property
        try {
            throw new Error("testing for stack or stacktrace");
        }
        catch (error) {
            this.stackTraceProperty = error.stack ? "stack" : error.stacktrace ?
                "stacktrace" : undefined;
        }
    }
    // TODO(JS): might not want to do this and instead might want to include references to preamble.js or even make it configurable
    StackTrace.prototype.filterstackTrace = function (st) {
        var reFileFromStackTrace = /file:\/\/\/\S+\.js:[0-9]+[:0-9]*/g;
        var reFileFromStackTraceNode = /\(\S+\.js:[0-9]+[:0-9]*\)/g;
        // Get all file references ...
        var matches = st.match(reFileFromStackTrace);
        if (!matches) {
            matches = st.match(reFileFromStackTraceNode);
        }
        // ... and return an array of file references except those to preamble.js
        return matches.filter(function (el) {
            return el.search(/preamble-ts.js/) === -1;
        });
    };
    StackTrace.prototype.stackTraceFromError = function () {
        var stackTrace = null;
        if (this.stackTraceProperty) {
            try {
                throw new Error();
            }
            catch (error) {
                stackTrace = error[this.stackTraceProperty];
            }
        }
        return stackTrace;
    };
    Object.defineProperty(StackTrace.prototype, "stackTrace", {
        get: function () {
            var st;
            var flt = null;
            st = this.stackTraceFromError();
            if (st) {
                flt = this.filterstackTrace(st);
            }
            return flt;
        },
        enumerable: true,
        configurable: true
    });
    return StackTrace;
}());
exports.StackTrace = StackTrace;
exports.stackTrace = new StackTrace();

},{}],25:[function(require,module,exports){
/**
 * UniqueNumber
 *
 * Unique sequential number generator.
 * Useful for IDs.
 */
"use strict";
var UniqueNumber = (function () {
    function UniqueNumber() {
        this.unique = 0;
    }
    Object.defineProperty(UniqueNumber.prototype, "next", {
        get: function () {
            return this.unique++;
        },
        enumerable: true,
        configurable: true
    });
    return UniqueNumber;
}());
exports.UniqueNumber = UniqueNumber;

},{}],26:[function(require,module,exports){
if (typeof Object.assign !== "function") {
    (function () {
        Object.assign = function (target) {
            "use strict";
            if (target === undefined || target === null) {
                throw new TypeError("Cannot convert undefined or null to object");
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}

},{}],27:[function(require,module,exports){
(function (global){
"use strict";
var throwError = function () {
    throw new Error("Unsuported Environment");
};
module.exports = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : throwError();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],29:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();

        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };

    } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.nextTick()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected() {
            pendingCount--;
            if (pendingCount === 0) {
                deferred.reject(new Error(
                    "Can't get fulfillment value from any promise, all " +
                    "promises were rejected."
                ));
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require('_process'))
},{"_process":28}],30:[function(require,module,exports){
module.exports={
  "name": "@preamble/preamble-ts-core",
  "version": "0.2.3",
  "description": "An environment neutral JavaScript BDD testing framework written in TypeScript which supports writing test suites in TypeScript.",
  "main": "dist/main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Jeffrey Schwartz <preamble.ts@gmail.com> (https://github.com/Preamble-BDD/standalone)",
  "license": "MIT",
  "repository": "https://github.com/Preamble-BDD/preamble.ts.core.git",
  "dependencies": {
    "@jeffreyschwartz/environment": "0.0.3",
    "q": "^1.4.1"
  },
  "devDependencies": {
    "browserify": "^13.0.0",
    "gulp": "^3.9.1",
    "vinyl-source-stream": "^1.1.0"
  }
}

},{}],"main":[function(require,module,exports){
/**
 * Main entry point module
 */
"use strict";
var Q = require("q");
var QueueManager_1 = require("./core/queue/QueueManager");
var QueueRunner_1 = require("./core/queue/QueueRunner");
var QueueRunner_2 = require("./core/queue/QueueRunner");
var describe_1 = require("./core/api/describe");
var xdescribe_1 = require("./core/api/xdescribe");
var it_1 = require("./core/api/it");
var xit_1 = require("./core/api/xit");
var beforeEach_1 = require("./core/api/beforeEach");
var afterEach_1 = require("./core/api/afterEach");
var environment_1 = require("./core/environment/environment");
var configuration_1 = require("./core/configuration/configuration");
var StackTrace_1 = require("./core/stacktrace/StackTrace");
var expect_1 = require("./core/api/expectations/expect");
var spy_1 = require("./core/api/expectations/spy/spy");
var spy_2 = require("./core/api/expectations/spy/spy");
var mock_1 = require("./core/api/expectations/mock");
var deeprecursiveequal_1 = require("./core/api/expectations/comparators/deeprecursiveequal");
var reportdispatch_1 = require("./core/reporters/reportdispatch");
var queueFilter_1 = require("./core/queue/queueFilter");
var pkgJSON = require("../package.json");
module.exports = function () {
    var reporters;
    // turn on long stact support in Q
    Q.longStackSupport = true;
    // give reportDispatch access to the queuManager
    reportdispatch_1.reportDispatch.queueManagerStats = QueueManager_1.QueueManager.queueManagerStats;
    // configure expectations
    expect_1.expectApi.configure(configuration_1.configuration.shortCircuit, QueueRunner_2.getCurrentIt, spy_1.spyOn, StackTrace_1.stackTrace);
    // add APIs used by suites to the global object
    environment_1.pGlobal.describe = describe_1.describe;
    environment_1.pGlobal.xdescribe = xdescribe_1.xdescribe;
    environment_1.pGlobal.it = it_1.it;
    environment_1.pGlobal.xit = xit_1.xit;
    environment_1.pGlobal.beforeEach = beforeEach_1.beforeEach;
    environment_1.pGlobal.afterEach = afterEach_1.afterEach;
    environment_1.pGlobal.expect = expect_1.expectApi.expect;
    environment_1.pGlobal.spyOn = spy_1.spyOn;
    environment_1.pGlobal.spyOnN = spy_2.spyOnN;
    environment_1.pGlobal.mock = mock_1.mock;
    if (environment_1.pGlobal.hasOwnProperty("preamble")) {
        // add reporter plugin
        if (environment_1.pGlobal.preamble.hasOwnProperty("reporters")) {
            reporters = environment_1.pGlobal.preamble.reporters;
            // hand off reporters to the ReportDispatch
            reportdispatch_1.reportDispatch.reporters = reporters;
        }
        if (!reporters || !reporters.length) {
            // console.log("No reporters found");
            throw new Error("No reporters found");
        }
        // dispatch reportBegin to reporters
        reportdispatch_1.reportDispatch.reportBegin({
            version: pkgJSON.version,
            uiTestContainerId: configuration_1.configuration.uiTestContainerId,
            name: configuration_1.configuration.name,
            hidePassedTests: configuration_1.configuration.hidePassedTests
        });
        // expose registerMatcher for one-off in-line matcher registration
        environment_1.pGlobal.preamble.registerMatcher = expect_1.expectApi.registerMatcher;
        // call each matcher plugin to register their matchers
        if (environment_1.pGlobal.preamble.hasOwnProperty("registerMatchers")) {
            var registerMatchers = environment_1.pGlobal.preamble.registerMatchers;
            registerMatchers.forEach(function (rm) { return rm(expect_1.expectApi.registerMatcher, { deepRecursiveCompare: deeprecursiveequal_1.deepRecursiveCompare }); });
            if (!expect_1.expectApi.getMatchersCount()) {
                // console.log("No matchers registered");
                throw new Error("No matchers found");
            }
        }
        else {
            // no matcher plugins found but matchers can be
            // registered inline so just log it but don't
            // throw an exception
            console.log("No matcher plugins found");
        }
        // expose Q on wondow.preamble
        environment_1.pGlobal.preamble.Q = Q;
    }
    else {
        // console.log("No plugins found");
        throw new Error("No plugins found");
    }
    // the raw filter looks like "?filter=spec_n" or "?filter=suite_n" where n is some number
    var filter = typeof window === "object" &&
        window.location.search.substring(window.location.search.indexOf("_") + 1) || null;
    // console.log("filter =", filter);
    // dspatch reportSummary to all reporters
    reportdispatch_1.reportDispatch.reportSummary();
    // get a queue manager and call its run method to run the test suite
    var queueManager = new QueueManager_1.QueueManager(100, 2, Q);
    QueueManager_1.QueueManager.startTimer();
    queueManager.run()
        .then(function (msg) {
        // fulfilled/success
        // console.log(msg);
        // console.log("QueueManager.queue =", QueueManager.queue);
        // dispatch reportSummary to all reporters
        reportdispatch_1.reportDispatch.reportSummary();
        // run the queue
        // TODO(js): should filter for failed specs if hidePassedTests is true
        new QueueRunner_1.QueueRunner(filter && queueFilter_1.queueFilter(QueueManager_1.QueueManager.queue, QueueManager_1.QueueManager.queueManagerStats, filter) || QueueManager_1.QueueManager.queue, configuration_1.configuration.timeoutInterval, configuration_1.configuration.shortCircuit, queueManager, reportdispatch_1.reportDispatch, Q).run()
            .then(function () {
            var totFailedIts = QueueManager_1.QueueManager.queue.reduce(function (prev, curr) {
                return curr.isA === "It" && !curr.passed ? prev + 1 : prev;
            }, 0);
            QueueManager_1.QueueManager.stopTimer();
            // console.log(`queue ran successfully in ${QueueManager.queueManagerStats.timeKeeper.totTime} miliseconds`);
            reportdispatch_1.reportDispatch.reportSummary();
            reportdispatch_1.reportDispatch.reportEnd();
        }, function () {
            // console.log("queue failed to run");
            console.log("queue failed to run");
        });
    }, function (msg) {
        // rejected/failure
        // console.log(msg);
    });
};

},{"../package.json":30,"./core/api/afterEach":1,"./core/api/beforeEach":2,"./core/api/describe":4,"./core/api/expectations/comparators/deeprecursiveequal":5,"./core/api/expectations/expect":6,"./core/api/expectations/mock":7,"./core/api/expectations/spy/spy":8,"./core/api/it":9,"./core/api/xdescribe":10,"./core/api/xit":11,"./core/configuration/configuration":13,"./core/environment/environment":14,"./core/queue/QueueManager":19,"./core/queue/QueueRunner":20,"./core/queue/queueFilter":22,"./core/reporters/reportdispatch":23,"./core/stacktrace/StackTrace":24,"q":29}]},{},["main"]);
