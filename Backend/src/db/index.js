import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        // Check if MONGODB_URL already contains a database name
        const mongoUrl = process.env.MONGODB_URL;
        
        if (!mongoUrl) {
            console.error("❌ MONGODB_URL environment variable is not set!");
            console.log("📝 Please create a .env file with MONGODB_URL=mongodb://localhost:27017");
            process.exit(1);
        }
        
        let connectionString;
        
        if (mongoUrl.includes('/' + DB_NAME) || mongoUrl.includes('/' + DB_NAME + '?')) {
            // URL already contains the database name
            connectionString = mongoUrl;
        } else {
            // Append database name to URL
            connectionString = `${mongoUrl}/${DB_NAME}`;
        }

        // Add connection options to prevent hanging
        const connectionOptions = {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds
            connectTimeoutMS: 10000, // 10 seconds
            maxPoolSize: 10,
            minPoolSize: 1,
            maxIdleTimeMS: 30000,
        };

        console.log("🔄 Connecting to MongoDB...");
        const connectionInstance = await mongoose.connect(connectionString, connectionOptions);
        console.log("✅ MongoDB Connected Successfully!");
        console.log(`📍 Host: ${connectionInstance.connection.host}`);
        console.log(`🗄️  Database: ${connectionInstance.connection.name}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB disconnected');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });
        
    } catch (error) {
        console.error("❌ MongoDB Connection failed:", error.message);
        console.log("💡 Make sure MongoDB is running and accessible");
        console.log("💡 Check your MONGODB_URL in .env file");
        process.exit(1);
    }
}

export default connectDB