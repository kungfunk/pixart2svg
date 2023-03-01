import test from "node:test";
import assert from "node:assert/strict";
import { getCSSColor, arrayToChunks } from "../src/utils";

test("[getCSSColor] transforms RGBA black to CSS hex value", () => {
  const black = [0, 0, 0, 255] as const;
  const result = "#000000";

  assert.strictEqual(getCSSColor(...black), result);
});

test("[getCSSColor] transforms RGBA transparent blue to CSS rgba value", () => {
  const blue = [25, 118, 210, 100] as const;
  const result = "rgba(25,118,210,0.39)";

  assert.strictEqual(getCSSColor(...blue), result);
});

test("[arrayToChunks] divides array in an array of arrays of 2 items", () => {
  const data = ["test", "test", "test", "test"].reduce(arrayToChunks(2), []);
  const result = [
    ["test", "test"],
    ["test", "test"],
  ];

  assert.deepStrictEqual(data, result);
});
