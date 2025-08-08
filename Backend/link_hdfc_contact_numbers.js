import mongoose from 'mongoose';
import Subcategory from './src/models/Subcategory.js';
import ContactNumbersTab from './src/models/tabs/ContactNumbers.tabs.js';
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

// Link HDFC contact numbers to company page
const linkHDFCContactNumbers = async () => {
  try {
    console.log('Linking HDFC contact numbers to company page...');
    
    // Step 1: Find the HDFC contact numbers data
    const contactNumbersData = await ContactNumbersTab.findOne({
      tabTitle: { $regex: /HDFC/i }
    });
    
    if (!contactNumbersData) {
      console.log('❌ No HDFC contact numbers data found. Creating new one...');
      // You can create default contact numbers data here if needed
      return;
    }
    
    console.log('✅ Found HDFC contact numbers data with ID:', contactNumbersData._id);
    
    // Step 2: Find the HDFC company page
    const hdfcCompany = await Subcategory.findOne({
      $or: [{ id: 'hdfc-bank' }, { slug: 'hdfc-bank' }]
    });
    
    if (!hdfcCompany) {
      console.log('❌ No HDFC company page found');
      return;
    }
    
    console.log('✅ Found HDFC company page with ID:', hdfcCompany._id);
    
    // Step 3: Link the contact numbers to the company page
    const updatedCompany = await Subcategory.findByIdAndUpdate(
      hdfcCompany._id,
      {
        tabs: {
          numbers: contactNumbersData._id,
          complaints: null,
          quickhelp: null,
          video: null,
          overview: null
        }
      },
      { new: true }
    );
    
    console.log('✅ Successfully linked HDFC contact numbers to company page!');
    console.log('Updated company data:', {
      id: updatedCompany.id,
      name: updatedCompany.name,
      tabs: updatedCompany.tabs
    });
    
    // Step 4: Test the API
    console.log('\n🧪 Testing the API...');
    const testResponse = await fetch('http://localhost:3000/api/subcategories/company/hdfc-bank');
    if (testResponse.ok) {
      const testData = await testResponse.json();
      if (testData.success && testData.data.tabs.numbers) {
        console.log('✅ API now returns linked contact numbers data!');
      } else {
        console.log('⚠️ API response:', testData);
      }
    }
    
  } catch (error) {
    console.error('Error linking HDFC contact numbers:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await linkHDFCContactNumbers();
  await mongoose.disconnect();
  console.log('\nScript completed successfully');
};

main().catch(console.error); 