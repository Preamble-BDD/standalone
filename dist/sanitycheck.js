"use strict";
var preamble = window.preamble;
xdescribe("Calling and.expect.it.toBeCalled()", function () {
    it("sets the expectation that the mock must be called", function () {
        var m = mock().and.expect.it.toBeCalled();
        m();
        m.validate();
    });
});
describe("Calling and.expect.it.toBeCalledWith(\"abc\", 123, {zip: \"55555\"})", function () {
    it("sets the expectation that the mock must be called with \"abc\", 123, {zip: \"55555\"}", function () {
        var m = mock().and.expect.it.toBeCalledWith("abc", 123, { zip: "55555" });
        m("abc", 123, { zip: "55555" });
        m.validate();
    });
});
//# sourceMappingURL=sanitycheck.js.map