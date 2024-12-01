import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Scrambler from "./Scrambler.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Scrambler />
  </StrictMode>
);
