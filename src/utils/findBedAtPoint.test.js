import { describe, it, expect } from "vitest";
import { findBedAtPoint } from "./findBedAtPoint";

const beds = [
  {
    id: "a",
    name: "A",
    points: [
      [0, 0],
      [4, 0],
      [4, 4],
      [0, 4],
    ],
  },
  {
    id: "b",
    name: "B",
    points: [
      [6, 0],
      [10, 0],
      [10, 4],
      [6, 4],
    ],
  },
];

describe("findBedAtPoint", () => {
  it("returns the bed containing the point", () => {
    expect(findBedAtPoint([7, 2], beds).id).toBe("b");
  });

  it("returns null when the point is on a path", () => {
    expect(findBedAtPoint([5, 2], beds)).toBeNull();
  });
});
