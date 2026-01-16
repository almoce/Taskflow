import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Umami handles tracking automatically in many cases, but for HashRouter
    // or specific SPA behaviors, sometimes manual intervention is needed.
    // Leaving this component here as a placeholder for any manual route tracking logic
    // if the default script behavior is insufficient.
  }, [location]);

  return null;
};
