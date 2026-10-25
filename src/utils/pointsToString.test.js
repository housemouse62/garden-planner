import { describe, it, expect } from "vitest";
import { pointsToString } from "./pointsToString";

describe("pointsToString", () => {
  it("converts points into an SVG points string", () => {
    expect(
      pointsToString([
        [0, 0],
        [8, 0],
        [0, 7],
      ]),
    ).toBe("0,0 8,0 0,7");
  });
});
