import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { migrateStorage } from "./lib/storage";

// Initiate storage migration for legacy data
migrateStorage().catch(console.error);

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed
createRoot(document.getElementById("root")!).render(<App />);
