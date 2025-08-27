export function getApiBase() {
  if (import.meta.env.DEV) return "";

  const env = import.meta.env.VITE_API_URL as string | undefined;
  return env ?? "/";
}
