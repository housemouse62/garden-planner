export function pointsToString(points) {
  return points.map((point) => point.join(",")).join(" ");
}
