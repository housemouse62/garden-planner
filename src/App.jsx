import { useState } from "react";
import GardenCanvas from "./components/GardenCanvas";
import { garden as starterGarden } from "./data/garden";
import { plants as starterPlants } from "./data/plants";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [garden, setGarden] = useLocalStorage(
    "garden-planner:garden",
    starterGarden,
  );
  const [plants, setPlants] = useLocalStorage(
    "garden-planner:plants",
    starterPlants,
  );
  const [mode, setMode] = useState("plan");
  const [snap, setSnap] = useState(true);

  function handleReset() {
    const confirmed = window.confirm(
      "Reset to the starter garden? This replaces your saved beds and plants.",
    );
    if (!confirmed) return;
    setGarden(starterGarden);
    setPlants(starterPlants);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
          padding: "0.5rem",
        }}
      >
        <button
          type="button"
          onClick={() => setMode(mode === "plan" ? "edit" : "plan")}
        >
          {mode === "plan" ? "Edit beds" : "Done editing"}
        </button>

        {mode === "edit" && (
          <label>
            <input
              type="checkbox"
              checked={snap}
              onChange={(event) => setSnap(event.target.checked)}
            />{" "}
            Snap to 3 inches
          </label>
        )}

        <button type="button" onClick={handleReset}>
          Reset to starter garden
        </button>
      </div>

      <GardenCanvas
        garden={garden}
        setGarden={setGarden}
        plants={plants}
        setPlants={setPlants}
        mode={mode}
        snap={snap}
      />
    </>
  );
}
