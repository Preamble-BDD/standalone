"use strict";
// matchers
describe("Preamble comes with numerous matchers out of the box", function() {
    describe("Calling toEqual", function() {
        it("sets the expectation that the actual and expected values are equal", function() {
            let obj1 = { iAm: "I am!" },
                obj2 = { iAm: "I am!" },
                obj3 = { iAm: "Obj3" };
            expect(obj1).toEqual(obj2);
            expect(obj2).not.toEqual(obj3);
        });
    });
    describe("Calling toBeTrue", function() {
        it("sets the expectation that the actual value is true", function() {
            expect(true).toBeTrue();
            expect(false).not.toBeTrue();
            expect(0).not.toBeTrue();
            expect(1).not.toBeTrue();
        });
    });
    describe("Calling toBeTruthy", function() {
        it("sets the expectation that the actual value is truthy", function() {
            expect(0).not.toBeTruthy();
            expect(1).toBeTruthy();
            expect("").not.toBeTruthy();
            expect("abc").toBeTruthy();
        });
    });
    describe("Calling toMatch", function() {
        it("does a regular expression match", function() {
            let str = "foo bar baz";
            expect(str).toMatch(/foo/);
            expect(str).toMatch(/bar/);
            expect(str).toMatch(/baz/);
            expect(str).not.toMatch(/foogazi/);
            expect(str).not.toMatch(/barry/);
            expect(str).not.toMatch(/bazzar/);
        });
    });
    describe("Calling toBeDefined", function() {
        it("sets the expectation that the value is not undefined", function() {
            let prop1 = "I'm here";
            let prop2;
            let obj = { prop1, prop2 };
            expect(obj).toBeDefined();
            expect(obj.prop1).toBeDefined();
            expect(obj.prop2).not.toBeDefined();
        });
    });
    describe("Calling toBeUndefined", function() {
        it("sets the expectation that the value is undefined", function() {
            let prop1 = "I'm here";
            let prop2;
            let obj = { prop1, prop2 };
            expect(obj).not.toBeUndefined();
            expect(obj.prop1).not.toBeUndefined();
            expect(obj.prop2).toBeUndefined();
        });
    });
});

// this
describe(`Sharing values between setups, specs and teardowns using "this"`, function() {
    beforeEach(function() {
        this.value = 10;
        this.nullValue = null;
    });
    it("this.value should equal 10 and this.nullValue should be null", function() {
        expect(this.value).toBe(10);
        expect(this.nullValue).toBeNull();
    });
    describe("works in nested suites also", function() {
        beforeEach(function() {
            this.otherValue = 100;
        });
        it("this.value should equal 10 and this.otherValue should equal 100", function() {
            expect(this.value).toBe(10);
            expect(this.nullValue).toBeNull();
            expect(this.otherValue).toBe(100);
        });
    });
    it("this.otherValue should not exist and this.value should equal 10", function() {
        expect(this.value).toBe(10);
        expect(this.nullValue).toBeNull();
        expect(this.otherValue).toBeUndefined();
    });
});
// describe("outer describe", function() {
//     beforeEach(function(done) {
//         setTimeout(() => {
//             this.abc = "";
//             console.log("beforeEach this", this);
//             done();
//         }, 1000);
//     });
//     afterEach(function() {
//         this.yada = "yada";
//         console.log("afterEach this", this);
//     });
//     it("outer describe it", function() {
//         let fn = () => this.abc;
//         this.abc = "abc";
//         console.log("it this", this);
//         expect(fn).toBe(fn);
//     }, 100);
//     describe("nested describe", function() {
//         beforeEach(function(done) {
//             setTimeout(() => {
//                 this.number = 123;
//                 console.log("nested describe beforeEach this", this);
//                 done();
//             }, 1000);
//         });
//         afterEach(function() {
//             console.log("nested describe afterEach this", this);
//         });
//         it("nested describe it", function() {
//             let fn = () => true;
//             console.log("nested it this", this);
//             expect(fn).toBeTrue();
//             expect(true).toBeTrue();
//             expect(false).not.toBeTrue();
//             expect(false).toBeTrue();
//         }, 100);
//     });
//     describe("nested describe", function() {
//         beforeEach(function() {
//             this.number = 456;
//             console.log("nested describe beforeEach this", this);
//         });
//         afterEach(function() {
//             console.log("nested describe afterEach this", this);
//         });
//         it("nested describe it", function() {
//             console.log("it this", this);
//         }, 100);
//     });
// });

// custom matchers
window.preamble.registerMatcher({
    apiName: "toBeAString",
    api: (matcherValue: any): void => { },
    evaluator: (expectedValue): boolean => typeof expectedValue === "string",
    negator: true,
    minArgs: 0,
    maxArgs: 0
});
window.preamble.registerMatcher({
    apiName: "toBeANumber",
    api: (matcherValue: any): void => { },
    evaluator: (expectedValue): boolean => typeof expectedValue === "number",
    negator: true,
    minArgs: 0,
    maxArgs: 0
});
window.preamble.registerMatcher({
    apiName: "toBeInstanceOf",
    api: (matcherValue: any): any => matcherValue,
    evaluator: (expectedValue, matcherValue): boolean => expectedValue instanceof matcherValue,
    negator: true,
    minArgs: 1,
    maxArgs: 1
});
describe("Custome matchers", function() {
    it("toBeAString can be loaded dynamically and used just like a built in matcher", function() {
        expect("I am a string").toBeAString();
        expect(999).not.toBeAString();
    });
    it("toBeANumber can be loaded dynamically and used just like a built in matcher", function() {
        expect(999).toBeANumber();
        expect("I am a string").not.toBeANumber();
    });
    it("toBeInstanceOf can be loaded dynamically and used just like a built in matcher", function() {
        class SomeThing {
            constructor() { }
        }
        class SomeOtherThing {
            constructor() { }
        }
        let someThing = new SomeThing();
        expect(someThing).toBeInstanceOf(SomeThing);
        expect(someThing).not.toBeInstanceOf(SomeOtherThing);
    });
});
describe("Spies", function() {
    beforeEach(function() {
        this.abc = "abc";
        this.spy1 = spyOn((a, b) => (a, b));
        this.return = this.spy1("a", "b");
        this.spy2 = spyOn((a, b) => (a, b));
    });
    it("note if they were called", function() {
        expect(this.spy1).toHaveBeenCalled();
        expect(this.spy2).not.toHaveBeenCalled();
    });
    it("note what arguments they were called with", function() {
        expect(this.spy1).toHaveBeenCalledWith("a", "b");
        expect(this.spy2).not.toHaveBeenCalledWith("b", "a");
    });
    it("note their context (i.e. their \"this\")", function() {
        let someObject = { abc: "abc" };
        let someOtherObject = {};
        let someFunc = () => this.abc;
        let spy = spyOn(someFunc);
        spy.call(someObject);
        expect(spy).toHaveBeenCalledWithContext(someObject);
        expect(spy).not.toHaveBeenCalledWithContext(someOtherObject);
    });
    it("note what they return", function() {
        let someFunc = () => this.abc;
        let spy = spyOn(someFunc).and.callActual();
        spy();
        expect(spy).toHaveReturnedValue("abc");
        expect(spy).not.toHaveReturnedValue("cba");
    });
    it("note when they throw", function() {
        let someFunc = () => { throw new Error("Whoops"); };
        let spy = spyOn(someFunc).and.callActual();
        spy();
        expect(spy).toHaveThrown();
    });
    it("note when they throw", function() {
        let someFunc = () => { throw new Error("Whoops"); };
        let spy = spyOn(someFunc).and.callActual();
        spy();
        expect(spy).toHaveThrown();
    });
    it("note the error message when they throw", function() {
        let someFunc = () => { throw new Error("Whoops"); };
        let spy = spyOn(someFunc).and.callActual();
        spy();
        expect(spy).toHaveThrownWithMessage("Whoops");
        expect(spy).not.toHaveThrownWithMessage("Whoopsie");
    });
});
