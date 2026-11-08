import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./styles/type.css";
import "./styles/hud.css";
import "./styles/hud-rail.css";
import "./styles/overlays.css";
import "./styles/overlays-scenes.css";
import "./styles/panels.css";
import "./styles/plans.css";
import "./styles/dive.css";
import "./styles/agent.css";
import "./styles/mobile.css";
import "./styles/mobile-panels.css";

createRoot(document.getElementById("root")!).render(<App />);
