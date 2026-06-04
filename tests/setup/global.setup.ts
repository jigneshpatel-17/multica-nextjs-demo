import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer | null = null;

export async function setup(): Promise<void> {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  process.env.JWT_SECRET =
    process.env.JWT_SECRET ?? "test-jwt-secret-very-long-random-string-vitest";
}

export async function teardown(): Promise<void> {
  if (mongo) {
    await mongo.stop();
    mongo = null;
  }
}
