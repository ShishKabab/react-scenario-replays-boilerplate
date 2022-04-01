import { ComponentSelector } from "./types";
import { matchComponentSelector } from "./utils";

describe("matchComponentSelector()", () => {
  function runTest(actual: ComponentSelector, expected: ComponentSelector, result: boolean) {
    expect(matchComponentSelector(actual, expected)).toEqual(result);
  }
  it("should work", () => {
    runTest({ id: 1, type: "test" }, { id: 1 }, true);
    runTest({ id: 1, type: "test" }, { id: 2 }, false);
    runTest({ id: 1, type: "test" }, { id: 1, type: "test" }, true);
    runTest({ id: 1, type: "test" }, { id: 1, type: "foo" }, false);
    runTest({ id: 1 }, { id: 1, type: "test" }, false);
  });
});
