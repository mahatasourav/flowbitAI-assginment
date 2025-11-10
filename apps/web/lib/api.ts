export const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export async function apiGet(path: string) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return res.json();
}
