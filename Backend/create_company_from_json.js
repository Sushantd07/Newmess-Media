import mongoose from 'mongoose';
import Subcategory from './src/models/Subcategory.js';
import Category from './src/models/Category.js';
import fs from 'fs';
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

// Create company from JSON file
const createCompanyFromJSON = async (jsonFilePath) => {
  try {
    console.log(`Reading company data from: ${jsonFilePath}`);
    
    // Read JSON file
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const companyData = JSON.parse(jsonData);
    
    console.log(`Creating ${companyData.name} company page...`);
    
    // Step 1: Find the category
    const category = await Category.findOne({
      slug: companyData.parentCategory
    });
    
    if (!category) {
      console.log(`❌ Category '${companyData.parentCategory}' not found`);
      return null;
    }
    
    console.log(`✅ Found category: ${category.name}`);
    
    // Step 2: Check if company already exists
    const existingCompany = await Subcategory.findOne({
      $or: [{ id: companyData.id }, { slug: companyData.slug }]
    });
    
    if (existingCompany) {
      console.log(`⚠️ ${companyData.name} already exists, updating...`);
    }
    
    // Step 3: Prepare company data with empty tabs
    const fullCompanyData = {
      ...companyData,
      parentCategory: category._id,
      // Empty tabs - will be populated later
      tabs: {
        numbers: null,
        complaints: null,
        quickhelp: null,
        video: null,
        overview: null
      }
    };
    
    // Step 4: Create or update company
    let company;
    if (existingCompany) {
      company = await Subcategory.findByIdAndUpdate(
        existingCompany._id,
        fullCompanyData,
        { new: true }
      );
      console.log(`✅ Updated ${companyData.name}`);
    } else {
      company = await Subcategory.create(fullCompanyData);
      console.log(`✅ Created ${companyData.name}`);
    }
    
    console.log(`${companyData.name} Details:`);
    console.log('ObjectId:', company._id);
    console.log('Name:', company.name);
    console.log('Slug:', company.slug);
    console.log('ID:', company.id);
    console.log('Tabs:', company.tabs);
    
    // Step 5: Test the API
    console.log('\n🧪 Testing the API...');
    const testResponse = await fetch(`http://localhost:3000/api/subcategories/company/${company.slug}`);
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
    
    // Step 6: Show the routes
    console.log('\n🌐 Available Routes:');
    console.log(`SEO-friendly route: http://localhost:5173/category/${companyData.parentCategory}/${company.slug}/contactnumber`);
    console.log(`ObjectId route: http://localhost:5173/company/${company._id}/contactnumber`);
    
    return company;
    
  } catch (error) {
    console.error('Error creating company from JSON:', error);
    return null;
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  // Get JSON file path from command line argument
  const jsonFilePath = process.argv[2];
  
  if (!jsonFilePath) {
    console.log('❌ Please provide a JSON file path');
    console.log('Usage: node create_company_from_json.js <json-file-path>');
    console.log('Example: node create_company_from_json.js my_company.json');
    process.exit(1);
  }
  
  if (!fs.existsSync(jsonFilePath)) {
    console.log(`❌ File not found: ${jsonFilePath}`);
    process.exit(1);
  }
  
  await createCompanyFromJSON(jsonFilePath);
  
  await mongoose.disconnect();
  console.log('\nScript completed successfully');
};

main().catch(console.error); 