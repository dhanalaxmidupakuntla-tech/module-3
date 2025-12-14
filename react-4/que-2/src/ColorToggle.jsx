import { useState } from "react";

function ColorToggle() {
  const [isRed, setIsRed] = useState(true);

  return (
    <div>
      <div
        style={{
          backgroundColor: isRed ? "red" : "blue",
          color: "white",
          padding: "20px",
          marginBottom: "10px",
        }}
      >
        This div changes color
      </div>

      <button onClick={() => setIsRed(!isRed)}>
        Toggle Color
      </button>
    </div>
  );
}

export default ColorToggle;
