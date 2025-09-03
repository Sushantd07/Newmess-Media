import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = 'NumbersDB'; // Your actual database name

async function checkCollections() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URL);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // List all collections
    console.log('\n📊 Available collections:');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('❌ No collections found in database');
    } else {
      collections.forEach((collection, index) => {
        console.log(`${index + 1}. ${collection.name}`);
      });
    }
    
    // Check specific collections we need
    console.log('\n🔍 Checking specific collections:');
    
    const collectionNames = ['categories', 'subcategories', 'companypages', 'Categories', 'Subcategories', 'CompanyPages'];
    
    for (const name of collectionNames) {
      try {
        const count = await db.collection(name).countDocuments();
        console.log(`📁 ${name}: ${count} documents`);
        
        if (count > 0) {
          // Show sample document structure
          const sample = await db.collection(name).findOne();
          console.log(`   Sample document keys: ${Object.keys(sample).join(', ')}`);
        }
      } catch (err) {
        console.log(`❌ ${name}: Collection not found`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking collections:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Run the check
checkCollections();
