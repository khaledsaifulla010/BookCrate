export function getApiBase() {

  const env = import.meta.env.VITE_API_URL as string | undefined;
  return env ?? "/";
}
