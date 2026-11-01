const productionApiUrl = "https://backend20250126033414.azurewebsites.net";
const defaultApiUrl = import.meta.env.DEV
  ? "http://127.0.0.1:5080"
  : productionApiUrl;

export const apiUrl = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/+$/, "");
