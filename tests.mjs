import { diffGenerator, merge } from "./index.mjs";
import CASES from "./testCases.mjs";
const run = (cb) => {
  let count = 0;
  const assert = (condition, text) => {
    count++;
    if (condition !== true) {
      console.error("ERR", count, "...", text);
      process.exit(1);
    }
    console.log("PASS", count);
  };
  cb(assert);
  console.log("Successfully ran", count, "tests! exiting.");
};
const toPrint = (arg) => JSON.stringify(arg, undefined, 2);
run((assert) => {
  for (const testCase of CASES) {
    const diff = testCase.opts
      ? diffGenerator(testCase.left, testCase.right, testCase.opts)
      : diffGenerator(testCase.left, testCase.right);
    if (testCase.diff)
      assert(
        JSON.stringify(diff) === JSON.stringify(testCase.diff),
        `Diff failed:\ngot:\n${toPrint(diff)}\nExpected:\n${toPrint(
          testCase.diff
        )}`
      );
    const merged = testCase.opts
      ? merge(testCase.left, diff, testCase.opts)
      : merge(testCase.left , diff);

    assert(
      JSON.stringify(merged) === JSON.stringify(testCase.result),
      `Following Failed: left: \n${toPrint(testCase.left)}\nright:\n${toPrint(
        testCase.right
      )}\ndiff:\n${toPrint(diff)}\nmerged:\n${toPrint(
        merged
      )}\nExpected:\n${toPrint(testCase.result)}`
    );
  }
});
