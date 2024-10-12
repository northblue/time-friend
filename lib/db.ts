import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: CachedMongoose = (globalThis as unknown as { mongoose: CachedMongoose }).mongoose;

if (!cached) {
  cached = (globalThis as unknown as { mongoose: CachedMongoose }).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (MONGODB_URI) {
      cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
        return mongoose;
      });
    } else {
      throw new Error('MONGODB_URI is undefined');
    }
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;