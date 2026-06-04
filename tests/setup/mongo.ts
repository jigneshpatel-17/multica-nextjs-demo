import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: unknown; promise: unknown } | undefined;
}

let mongo: MongoMemoryServer | null = null;

export async function startMongo(): Promise<void> {
  if (mongo || process.env.MONGODB_URI) {
    global.mongooseCache ??= { conn: null, promise: null };
    return;
  }
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  global.mongooseCache = { conn: null, promise: null };
}

export async function stopMongo(): Promise<void> {
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
    mongo = null;
  }
  global.mongooseCache = { conn: null, promise: null };
}

export async function clearCollections(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(uri, { bufferCommands: false });
    global.mongooseCache = { conn: mongoose, promise: Promise.resolve(mongoose) };
  }
  const db = mongoose.connection.db;
  if (!db) return;
  const cols = await db.collections();
  await Promise.all(cols.map((c) => c.deleteMany({})));
}
