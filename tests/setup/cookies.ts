export const cookieStore = new Map<string, string>();

export function clearCookies(): void {
  cookieStore.clear();
}

export function getCookie(name: string): string | undefined {
  return cookieStore.get(name);
}

export function setCookie(name: string, value: string): void {
  cookieStore.set(name, value);
}
