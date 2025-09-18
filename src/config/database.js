const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For tier 3 cities, provide fallback to local SQLite-like setup
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/collage_db';
    
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', mongoUri);
    
    const conn = await mongoose.connect(mongoUri, {
      // Remove deprecated options
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // For tier 3 cities - provide instructions for alternative setups
    console.log(`
🔧 Database Setup Instructions for Tier 3 Cities:

1. Install MongoDB locally:
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas free tier: https://www.mongodb.com/cloud/atlas/register

2. Alternative lightweight options:
   - Use MongoDB Atlas (cloud) for reliability
   - Consider SQLite for very small deployments

3. For development without MongoDB:
   - The API structure is ready
   - Replace MongoDB with your preferred database
   - Models are well-structured for easy migration

Current connection string: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/collage_db'}
`);
    
    // In production, you might want to exit, but for development/demo, continue
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Continuing without database for demonstration...');
      return null;
    }
  }
};

module.exports = connectDB;