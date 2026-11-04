import { pointInPolygon } from "./pointInPolygon";

export function findBedAtPoint(point, beds) {
  return beds.find((bed) => pointInPolygon(point, bed.points)) ?? null;
}
