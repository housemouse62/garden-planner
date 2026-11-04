export function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function snapToGrid(value, step) {
  // The extra round removes float noise like 0.7000000000000001
  return roundTo(Math.round(value / step) * step, 10);
}

export function distance([x1, y1], [x2, y2]) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function formatFeetInches(feet) {
  // Round total inches first so 7.99 becomes 8' rather than 7' 12"
  const totalInches = Math.round(feet * 12);
  const wholeFeet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return inches === 0 ? `${wholeFeet}'` : `${wholeFeet}' ${inches}"`;
}

export function snapToNearbyCorner(point, beds, ignore, threshold = 0.5) {
  let nearest = null;
  let nearestDistance = threshold;

  for (const bed of beds) {
    // Skips the whole bed, since snapping to a neighbor on the same bed would collapse an edge
    if (bed.id === ignore.bedId) continue;

    for (const corner of bed.points) {
      const gap = distance(point, corner);
      if (gap <= nearestDistance) {
        nearest = corner;
        nearestDistance = gap;
      }
    }
  }

  return nearest && [...nearest];
}
