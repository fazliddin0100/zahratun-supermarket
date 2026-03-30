// lib/mongodb.ts
import mongoose, { Mongoose } from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI as string;
console.log('mongo url', MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error('Iltimos .env.local faylida MONGODB_URI ni belgilang');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }

  return cached!.conn;
}

export default dbConnect;
