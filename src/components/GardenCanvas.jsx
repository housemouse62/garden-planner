import { garden } from "../data/garden";
import { pointsToString } from "../utils/pointsToString";

export default function GardenCanvas() {
  return (
    <svg
      viewBox={`0 0 ${garden.width} ${garden.height}`}
      style={{ width: "100%", border: "1px solid #444" }}
    >
      <rect width={garden.width} height={garden.height} fill="#d8c9a3" />

      {garden.beds.map((bed) => (
        <polygon
          key={bed.id}
          points={pointsToString(bed.points)}
          fill="#6b8e4e"
          stroke="#3d5a2a"
          strokeWidth={0.1}
        />
      ))}
    </svg>
  );
}
