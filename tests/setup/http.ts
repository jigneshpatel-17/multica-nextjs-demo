export function jsonRequest(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): Request {
  const init: RequestInit = {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  return new Request(url, init);
}

export function params<T extends Record<string, string>>(value: T) {
  return { params: Promise.resolve(value) };
}
