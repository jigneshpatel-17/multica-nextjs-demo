import { vi } from "vitest";

interface CookieSetOpts {
  name: string;
  value: string;
  maxAge?: number;
}

vi.mock("next/headers", async () => {
  const { cookieStore } = await import("./cookies");
  return {
    cookies: async () => ({
      get(name: string) {
        const v = cookieStore.get(name);
        return v === undefined ? undefined : { name, value: v };
      },
      set(opts: CookieSetOpts) {
        if (!opts.value || opts.maxAge === 0) {
          cookieStore.delete(opts.name);
        } else {
          cookieStore.set(opts.name, opts.value);
        }
      },
      delete(name: string) {
        cookieStore.delete(name);
      },
    }),
  };
});
