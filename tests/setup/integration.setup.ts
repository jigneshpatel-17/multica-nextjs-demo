import { afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { clearCollections } from "./mongo";
import { clearCookies } from "./cookies";

beforeEach(async () => {
  await clearCollections();
  clearCookies();
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  (globalThis as { mongooseCache?: unknown }).mongooseCache = {
    conn: null,
    promise: null,
  };
});
