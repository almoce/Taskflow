import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed
createRoot(document.getElementById("root")!).render(<App />);
