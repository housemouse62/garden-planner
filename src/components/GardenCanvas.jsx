import { garden } from "../data/garden";
import { plants } from "../data/plants";
import { pointsToString } from "../utils/pointsToString";
import { findBedAtPoint } from "../utils/findBedAtPoint";

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

      {plants.map((plant) => {
        const bed = findBedAtPoint([plant.x, plant.y], garden.beds);
        const isPlanted = bed !== null;

        return (
          <g key={plant.id}>
            <circle
              cx={plant.x}
              cy={plant.y}
              r={0.6}
              fill={isPlanted ? "#c0392b" : "none"}
              stroke="#7b241c"
              strokeWidth={0.12}
              strokeDasharray={isPlanted ? undefined : "0.25 0.2"}
              opacity={isPlanted ? 1 : 0.6}
              pointerEvents="all"
            />
            <title>
              {plant.type} ({isPlanted ? bed.name : "staged"})
            </title>
          </g>
        );
      })}
    </svg>
  );
}
