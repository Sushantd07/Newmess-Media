import mongoose from 'mongoose';
import Subcategory from './src/models/Subcategory.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const dbName = 'NumbersDB';
    
    await mongoose.connect(`${mongoUrl}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully to:', `${mongoUrl}/${dbName}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Get SBI ObjectId
const getSBIObjectId = async () => {
  try {
    console.log('Finding SBI Bank...');
    
    // Find SBI by slug
    const sbiCompany = await Subcategory.findOne({
      $or: [{ id: 'sbi-bank' }, { slug: 'sbi-bank' }]
    });
    
    if (!sbiCompany) {
      console.log('❌ No SBI company found');
      return;
    }
    
    console.log('✅ Found SBI Bank:');
    console.log('ObjectId:', sbiCompany._id);
    console.log('Name:', sbiCompany.name);
    console.log('Slug:', sbiCompany.slug);
    console.log('ID:', sbiCompany.id);
    
    // Test the API with ObjectId
    console.log('\n🧪 Testing API with ObjectId...');
    const testResponse = await fetch(`http://localhost:3000/api/subcategories/company/${sbiCompany._id}`);
    if (testResponse.ok) {
      console.log('✅ API works with ObjectId!');
    } else {
      console.log('❌ API failed with ObjectId');
    }
    
  } catch (error) {
    console.error('Error getting SBI ObjectId:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await getSBIObjectId();
  await mongoose.disconnect();
  console.log('\nScript completed successfully');
};

main().catch(console.error); 