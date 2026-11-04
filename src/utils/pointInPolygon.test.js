import { describe, it, expect } from "vitest";
import { pointInPolygon } from "./pointInPolygon";

const triangle = [
  [0, 0],
  [8, 0],
  [0, 7],
];

describe("pointInPolygon", () => {
  it("returns true for a point inside", () => {
    expect(pointInPolygon([2, 2], triangle)).toBe(true);
  });

  it("returns false for a point outside", () => {
    expect(pointInPolygon([10, 10], triangle)).toBe(false);
  });

  it("returns false for a point inside the bounding box but past the slanted edge", () => {
    expect(pointInPolygon([7, 6], triangle)).toBe(false);
  });
});
