import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log("Attempting to connect to MongoDB...");
  if (!process.env.MONGODB_URI) {
      console.error("CRITICAL: MONGODB_URI is not loaded from .env.local. Please ensure the file exists and is named correctly.");
  }

  if (cached.conn) {
    console.log("Using cached MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection promise.");
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30-second timeout
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB connection successful!");
      return mongoose;
    }).catch(err => {
        console.error("MongoDB connection error in promise:", err);
        // Reset promise on failure to allow retry
        cached.promise = null; 
        throw err;
    });
  } else {
    console.log("Waiting for existing connection promise to resolve.");
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Make sure promise is null so we can retry
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;
