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

// Generic function to create any company page
const createCompanyPage = async (companyData) => {
  try {
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
    
    return company;
    
  } catch (error) {
    console.error(`Error creating ${companyData.name}:`, error);
    return null;
  }
};

// Example usage - Create multiple companies
const createExampleCompanies = async () => {
  const companies = [
    {
      id: "icici-bank",
      name: "ICICI Bank",
      slug: "icici-bank",
      phone: "1800-266-6161",
      logo: "/company-logos/Bank/icici_bank.svg",
      verified: true,
      isActive: true,
      tags: ["Banking", "Private Sector", "Digital Banking"],
      address: "All India",
      timing: "24x7",
      parentCategory: "banking-services",
      order: 4,
      description: "ICICI Bank is one of India's leading private sector banks offering comprehensive banking and financial services.",
      companyName: "ICICI Bank",
      mainPhone: "1800-266-6161",
      website: "https://www.icicibank.com",
      founded: "1994",
      headquarters: "Mumbai, Maharashtra",
      parentCompany: "ICICI Group",
      rating: 4.3,
      totalReviews: 2800,
      monthlySearches: "35K"
    },
    {
      id: "axis-bank",
      name: "Axis Bank",
      slug: "axis-bank",
      phone: "1800-419-5959",
      logo: "/company-logos/Bank/axis_bank.svg",
      verified: true,
      isActive: true,
      tags: ["Banking", "Private Sector", "Digital Banking"],
      address: "All India",
      timing: "24x7",
      parentCategory: "banking-services",
      order: 5,
      description: "Axis Bank is one of India's leading private sector banks offering comprehensive banking and financial services.",
      companyName: "Axis Bank",
      mainPhone: "1800-419-5959",
      website: "https://www.axisbank.com",
      founded: "1993",
      headquarters: "Mumbai, Maharashtra",
      parentCompany: "Axis Bank Limited",
      rating: 4.0,
      totalReviews: 1900,
      monthlySearches: "22K"
    }
  ];
  
  for (const companyData of companies) {
    await createCompanyPage(companyData);
    console.log('\n' + '='.repeat(50) + '\n');
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  // Create example companies
  await createExampleCompanies();
  
  await mongoose.disconnect();
  console.log('\nScript completed successfully');
};

main().catch(console.error); 