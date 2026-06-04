#!/usr/bin/env node
import { MongoMemoryServer } from "mongodb-memory-server";
import { spawn } from "node:child_process";

const ms = await MongoMemoryServer.create();
process.env.MONGODB_URI = ms.getUri();
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "e2e-test-jwt-secret-very-long";

const args = process.argv.slice(2);
const proc = spawn("npx", ["playwright", "test", ...args], {
  stdio: "inherit",
  env: process.env,
});

let stopped = false;
async function stop(code) {
  if (stopped) return;
  stopped = true;
  try {
    await ms.stop();
  } catch {
    // ignore
  }
  process.exit(code ?? 0);
}

proc.on("exit", (code) => stop(code ?? 0));
process.on("SIGINT", () => stop(130));
process.on("SIGTERM", () => stop(143));
