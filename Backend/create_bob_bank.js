import mongoose from 'mongoose';
import Subcategory from './src/models/Subcategory.js';
import Category from './src/models/Category.js';
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

// Create BOB Bank company page
const createBOBBank = async () => {
  try {
    console.log('Creating BOB Bank company page...');
    
    // Step 1: Find the banking category
    const bankingCategory = await Category.findOne({
      slug: 'banking-services'
    });
    
    if (!bankingCategory) {
      console.log('❌ Banking Services category not found');
      return;
    }
    
    console.log('✅ Found Banking Services category:', bankingCategory.name);
    
    // Step 2: Check if BOB Bank already exists
    const existingBOB = await Subcategory.findOne({
      $or: [{ id: 'bob-bank' }, { slug: 'bob-bank' }]
    });
    
    if (existingBOB) {
      console.log('⚠️ BOB Bank already exists, updating...');
    }
    
    // Step 3: Create/Update BOB Bank data
    const bobBankData = {
      id: "bob-bank",
      name: "BOB Bank",
      slug: "bob-bank",
      phone: "1800-258-6161",
      logo: "/company-logos/Bank/bob_bank.svg",
      verified: true,
      isActive: true,
      tags: ["Banking", "Public Sector", "Digital Banking"],
      address: "All India",
      timing: "24x7",
      parentCategory: bankingCategory._id,
      order: 3,
      description: "Bank of Baroda (BOB) is one of India's leading public sector banks offering comprehensive banking and financial services including savings accounts, loans, credit cards, and digital banking solutions.",
      companyName: "Bank of Baroda",
      mainPhone: "1800-258-6161",
      website: "https://www.bankofbaroda.in",
      founded: "1908",
      headquarters: "Vadodara, Gujarat",
      parentCompany: "Government of India",
      rating: 4.1,
      totalReviews: 2100,
      monthlySearches: "25K",
      // Empty tabs - will be populated later
      tabs: {
        numbers: null,
        complaints: null,
        quickhelp: null,
        video: null,
        overview: null
      }
    };
    
    // Step 4: Create or update BOB Bank
    let bobBank;
    if (existingBOB) {
      bobBank = await Subcategory.findByIdAndUpdate(
        existingBOB._id,
        bobBankData,
        { new: true }
      );
      console.log('✅ Updated BOB Bank');
    } else {
      bobBank = await Subcategory.create(bobBankData);
      console.log('✅ Created BOB Bank');
    }
    
    console.log('BOB Bank Details:');
    console.log('ObjectId:', bobBank._id);
    console.log('Name:', bobBank.name);
    console.log('Slug:', bobBank.slug);
    console.log('ID:', bobBank.id);
    console.log('Tabs:', bobBank.tabs);
    
    // Step 5: Test the API
    console.log('\n🧪 Testing the API...');
    const testResponse = await fetch(`http://localhost:3000/api/subcategories/company/bob-bank`);
    if (testResponse.ok) {
      const testData = await testResponse.json();
      if (testData.success) {
        console.log('✅ API works! Company page data fetched successfully');
        console.log('Company name:', testData.data.name);
        console.log('Tabs status:', testData.data.tabs);
      } else {
        console.log('❌ API returned error:', testData.message);
      }
    } else {
      console.log('❌ API failed with status:', testResponse.status);
    }
    
    // Step 6: Test ObjectId route
    console.log('\n🧪 Testing ObjectId route...');
    const objectIdResponse = await fetch(`http://localhost:3000/api/subcategories/company/${bobBank._id}`);
    if (objectIdResponse.ok) {
      console.log('✅ ObjectId route works!');
    } else {
      console.log('❌ ObjectId route failed');
    }
    
  } catch (error) {
    console.error('Error creating BOB Bank:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await createBOBBank();
  await mongoose.disconnect();
  console.log('\nScript completed successfully');
};

main().catch(console.error); 