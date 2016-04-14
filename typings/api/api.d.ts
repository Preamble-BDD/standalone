declare interface IMatcher {
    apiName: string;
    api(...args): any;
    evaluator(expectedValue: any, matcherValue?: any): boolean;
    negator?: boolean;
    minArgs: number;
    maxArgs: number;
}
declare interface Window {
    preamble: {
        registerMatcher(matcher: IMatcher): void;
        Q: typeof Q;
    };
}
declare function registerMatcher(matcher: IMatcher): void;
declare function describe(label: string, callback: () => void): void;
declare function xdescribe(label: string, callback: () => void): void;
declare function it(label: string, callback: (done?: () => void) => void, timeoutInterval?: number): void;
declare function xit(label: string, callback: (done?: () => void) => void, timeoutInterval?: number): void;
declare function beforeEach(callback: (done?: () => void) => void, timeoutInterval?: number);
declare function afterEach(callback: (done?: () => void) => void, timeoutInterval?: number);
declare function expect(ev: any): {
    toBe(matcherValue: any): any;
    toEqual(matcherValue: any): any;
    toBeTrue(): void;
    toBeTruthy(): void;
    toBeDefined(): void;
    toBeUndefined(): void;
    toBeNull(): void;
    toMatch(regExp: RegExp): void;
    toHaveBeenCalled(): void;
    toHaveBeenCalledWith(...matcherValue): any[];
    toHaveBeenCalledWithContext(matcherValue): {};
    toHaveReturnedValue(matcherValue: any): void;
    toHaveThrown(): void;
    toHaveThrownWithMessage(matcherValue): void;
    toHaveThrownWithName(matcherValue): void;
    // declare your custom matchers here
    toBeAString(): void;
    toBeANumber(): void;
    toBeInstanceOf(matcherValue: any): any;
    not: {
        toBe(matcherValue: any): any;
        toEqual(matcherValue: any): any;
        toBeTrue(): void;
        toBeTruthy(): void;
        toBeDefined(): void;
        toBeUndefined(): void;
        toBeNull(): void;
        toHaveBeenCalled(): void;
        toHaveBeenCalledWith(...matcherValue): any[];
        toHaveBeenCalledWithContext(matcherValue): {};
        toHaveReturnedValue(matcherValue: any): void;
        toHaveThrown(): void;
        toHaveThrownWithMessage(matcherValue): void;
        toHaveThrownWithName(matcherValue): void;
        // declare your custom negated matchers here
        toBeAString(): void;
        toBeANumber(): void;
        toMatch(regExp: RegExp): any;
        toBeInstanceOf(matcherValue: any): any;
    }
};
declare function spyOn(...args): Spy;
declare interface StaticSpy {
    (...args): any;
}
declare interface And {
    reset: () => Spy;
    callWithContext: (context: {}) => Spy;
    throw: () => Spy;
    throwWithMessage: (message: string) => Spy;
    throwWithName: (name: string) => Spy;
    return: (ret: any) => Spy;
    callFake: (fn: (...args) => any) => Spy;
    callActual: () => Spy;
    callStub: () => Spy;
}
declare interface Calls {
    count: () => number;
    forCall: (i: number) => ACall;
    all: () => ACall[];
    wasCalledWith: (...args) => boolean;
    wasCalledWithContext: (obj: {}) => boolean;
    returned: (value: any) => boolean;
    threw: () => boolean;
    threwWithName: (name: string) => boolean;
    threwWithMessage: (message: string) => boolean;
}
declare interface Spy extends StaticSpy {
    _spyMaker: string;
    _returns: any;
    _callActual: boolean;
    _callFake: (...args) => any;
    _callWithContext: {};
    _throws: boolean;
    _throwsMessage: string;
    _throwsName: string;
    _hasExpectations: boolean;
    and: And;
    calls: Calls;
    validate: () => void;
    _resetCalls: () => void;
}
declare interface SpyOnStatic {
    (...args): Spy;
}
declare interface SpyOn extends SpyOnStatic {
    x: (argObject: {}, argPropertyNames: string[]) => void;
}
// args API
declare class Args {
    args: any[];
    constructor(...args);
    getLength: () => number;
    hasArg: (i: number) => boolean;
    getArg: (i: number) => any;
    hasArgProperty: (i: number, propertyName: string) => boolean;
    getArgProperty: (i: number, propertyName: string) => string;
}
declare class ACall {
    constructor(context: {}, args: Args, error: Error, returned: any);
    getContext: () => {};
    getArgs: () => Args;
    getArg: (i: number) => any;
    getArgsLength: () => number;
    getArgProperty: (i: number, propertyName: string) => any;
    hasArgProperty: (i: number, propertyName: string) => boolean;
    hasArg: (i: number) => boolean;
    getError: () => Error;
    getReturned: () => any;
}
declare function mock(...args): MockProxy;
declare function validate(): void;
declare interface MockStatic {
    (...args: any[]): MockProxy;
}
declare interface MockProxyStatic {
    (...args): void;
}
declare interface MockProxy extends MockProxyStatic {
    and: And;
    validate: () => void;
}
declare interface And {
    expect: Expect;
}
declare interface Expect {
    it: It;
}
declare interface It {
    toBeCalled: () => MockProxy;
    toBeCalledWith: (...args) => MockProxy;
    toBeCalledWithContext: (context: {}) => Spy;
    toReturn: (value: any) => Spy;
    toThrow: () => Spy;
    toThrowWithName: (name: string) => Spy;
    toThrowWithMessage: (message: string) => Spy;
    not: Not;
}

declare interface Not {
    toBeCalled: () => MockProxy;
    toBeCalledWith: (...args) => MockProxy;
    toBeCalledWithContext: (context: {}) => Spy;
    toReturn: (value: any) => Spy;
    toThrow: () => Spy;
    toThrowWithName: (name: string) => Spy;
    toThrowWithMessage: (message: string) => Spy;
}
