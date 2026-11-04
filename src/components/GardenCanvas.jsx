import { useRef, useState } from "react";
import { pointsToString } from "../utils/pointsToString";
import { findBedAtPoint } from "../utils/findBedAtPoint";
import {
  distance,
  formatFeetInches,
  roundTo,
  snapToGrid,
  snapToNearbyCorner,
} from "../utils/measure";

const GRID_STEP = 0.25;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function GardenCanvas({
  garden,
  setGarden,
  plants,
  setPlants,
  mode,
  snap,
}) {
  const [draggingId, setDraggingId] = useState(null);
  const [draggingCorner, setDraggingCorner] = useState(null);
  const svgRef = useRef(null);
  const isEditing = mode === "edit";

  // Convert a screen position (pixels) into garden coordinates (feet)
  function toGardenPoint(event) {
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }

  function handlePointerDown(event, id) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingId(id);
  }

  function handlePointerMove(event, id) {
    if (draggingId !== id) return;
    const { x, y } = toGardenPoint(event);

    setPlants((current) =>
      current.map((plant) =>
        plant.id === id
          ? {
              ...plant,
              x: clamp(x, 0, garden.width),
              y: clamp(y, 0, garden.height),
            }
          : plant,
      ),
    );
  }

  function handlePointerUp() {
    setDraggingId(null);
  }

  function isDraggingCorner(bedId, index) {
    return draggingCorner?.bedId === bedId && draggingCorner.index === index;
  }

  function snapCorner(point, bedId) {
    if (!snap) return point.map((value) => roundTo(value, 2));

    return (
      snapToNearbyCorner(point, garden.beds, { bedId }) ??
      point.map((value) => snapToGrid(value, GRID_STEP))
    );
  }

  function handleCornerPointerDown(event, bedId, index) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingCorner({ bedId, index });
  }

  function handleCornerPointerMove(event, bedId, index) {
    if (!isDraggingCorner(bedId, index)) return;
    const { x, y } = toGardenPoint(event);
    const [snappedX, snappedY] = snapCorner([x, y], bedId);
    const corner = [
      clamp(snappedX, 0, garden.width),
      clamp(snappedY, 0, garden.height),
    ];

    setGarden((current) => ({
      ...current,
      beds: current.beds.map((bed) =>
        bed.id === bedId
          ? {
              ...bed,
              points: bed.points.map((point, pointIndex) =>
                pointIndex === index ? corner : point,
              ),
            }
          : bed,
      ),
    }));
  }

  function handleCornerPointerUp() {
    setDraggingCorner(null);
  }

  return (
    <svg
      ref={svgRef}
      // The 1 ft margin keeps boundary labels and handles from being clipped
      viewBox={`-1 -1 ${garden.width + 2} ${garden.height + 2}`}
      style={{
        width: "100%",
        border: "1px solid #444",
        boxSizing: "border-box",
      }}
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
              pointerEvents={isEditing ? "none" : "all"}
              style={{
                touchAction: "none",
                cursor: draggingId === plant.id ? "grabbing" : "grab",
              }}
              onPointerDown={(event) => handlePointerDown(event, plant.id)}
              onPointerMove={(event) => handlePointerMove(event, plant.id)}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
            <title>
              {plant.type} ({isPlanted ? bed.name : "staged"})
            </title>
          </g>
        );
      })}

      {isEditing &&
        garden.beds.map((bed) =>
          bed.points.map((point, index) => {
            const next = bed.points[(index + 1) % bed.points.length];

            return (
              <text
                key={`${bed.id}-edge-${index}`}
                x={(point[0] + next[0]) / 2}
                y={(point[1] + next[1]) / 2}
                fontSize={0.55}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#222"
                stroke="white"
                strokeWidth={0.15}
                paintOrder="stroke"
                pointerEvents="none"
                // The global letter-spacing would otherwise apply in feet here
                style={{ letterSpacing: 0 }}
              >
                {formatFeetInches(distance(point, next))}
              </text>
            );
          }),
        )}

      {isEditing &&
        garden.beds.map((bed) =>
          bed.points.map(([x, y], index) => (
            <g key={`${bed.id}-corner-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={0.4}
                fill="white"
                stroke="#3d5a2a"
                strokeWidth={0.08}
                pointerEvents="none"
              />
              <circle
                cx={x}
                cy={y}
                r={0.7}
                fill="transparent"
                style={{
                  touchAction: "none",
                  cursor: isDraggingCorner(bed.id, index) ? "grabbing" : "grab",
                }}
                onPointerDown={(event) =>
                  handleCornerPointerDown(event, bed.id, index)
                }
                onPointerMove={(event) =>
                  handleCornerPointerMove(event, bed.id, index)
                }
                onPointerUp={handleCornerPointerUp}
                onPointerCancel={handleCornerPointerUp}
              />
            </g>
          )),
        )}
    </svg>
  );
}
