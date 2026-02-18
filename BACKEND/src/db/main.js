import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/easystay';
    
    const connection = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export { connectDB };




