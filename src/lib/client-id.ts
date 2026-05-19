// Browser-local identifier used to scope Studio projects without auth.
export function getClientId(): string {
  if (typeof window === "undefined") return "ssr";
  const KEY = "m2_client_id";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id =
      (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() ??
      `c_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
