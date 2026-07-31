// Central place for frontend configuration.
// Vite reads .env files and exposes VITE_* variables via import.meta.env.
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
