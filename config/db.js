import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // We pull the URI from your .env file for security
  const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // This logs the specific database name you are using
    console.log(`Database Name: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure so you know exactly when it breaks
    process.exit(1);
  }
};

export default connectDB;