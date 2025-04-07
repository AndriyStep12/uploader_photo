import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/photo_upload';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
      socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
      connectTimeoutMS: 30000, // 30 seconds timeout for initial connection
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      retryWrites: true, // Enable retryable writes
      retryReads: true, // Enable retryable reads
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('Failed to connect to MongoDB:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;