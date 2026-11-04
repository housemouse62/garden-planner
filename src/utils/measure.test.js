import { describe, it, expect } from "vitest";
import { snapToGrid, formatFeetInches, distance } from "./measure";

describe("snapToGrid", () => {
  it("rounds to the nearest step", () => {
    expect(snapToGrid(7.1, 0.25)).toBe(7);
    expect(snapToGrid(7.2, 0.25)).toBe(7.25);
  });

  it("leaves values already on the grid alone", () => {
    expect(snapToGrid(3.75, 0.25)).toBe(3.75);
  });

  it("does not leave float noise on decimal steps", () => {
    expect(snapToGrid(0.68, 0.1)).toBe(0.7);
  });
});

describe("formatFeetInches", () => {
  it("shows feet and inches", () => {
    expect(formatFeetInches(7.3333)).toBe("7' 4\"");
  });

  it("drops the inches on whole feet", () => {
    expect(formatFeetInches(8)).toBe("8'");
  });

  it("rolls 12 inches over into the next foot", () => {
    expect(formatFeetInches(7.99)).toBe("8'");
  });

  it("shows zero feet for lengths under a foot", () => {
    expect(formatFeetInches(0.25)).toBe("0' 3\"");
  });
});

describe("distance", () => {
  it("measures a diagonal", () => {
    expect(distance([0, 0], [3, 4])).toBe(5);
  });

  it("does not depend on direction", () => {
    expect(distance([3, 4], [0, 0])).toBe(5);
  });

  it("is zero for the same point", () => {
    expect(distance([2, 2], [2, 2])).toBe(0);
  });
});
