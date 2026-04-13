import mongoose from 'mongoose';

let isConnected = false;
let connectionAttempts = 0;
const MAX_ATTEMPTS = 3;

export async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
    };

    await mongoose.connect(process.env.MONGODB_URI, opts);
    
    isConnected = true;
    connectionAttempts = 0;
    console.log('✅ MongoDB Atlas connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    connectionAttempts++;
    
    if (connectionAttempts <= MAX_ATTEMPTS) {
      console.log(`Retrying connection... (${connectionAttempts}/${MAX_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await connectToDatabase();
    }
    
    throw new Error(`Failed to connect to MongoDB after ${MAX_ATTEMPTS} attempts: ${error.message}`);
  }
}

// Helper function to check connection status
export function isDatabaseConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
  }
  process.exit(0);
});