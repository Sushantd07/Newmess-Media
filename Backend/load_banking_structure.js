import mongoose from 'mongoose';
import Category from './src/models/Category.js';
import Subcategory from './src/models/Subcategory.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Load banking category structure
const loadBankingStructure = async () => {
  try {
    // Read the banking structure data
    const dataPath = path.join(__dirname, 'banking_category_structure.json');
    const bankingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log('Loading banking category structure...');
    
    // Step 1: Create or update the main banking category
    const bankingCategory = bankingData.bankingCategory;
    let existingCategory = await Category.findOne({ slug: bankingCategory.slug });
    
    if (existingCategory) {
      console.log('Banking category already exists. Updating...');
      await Category.findByIdAndUpdate(existingCategory._id, bankingCategory);
      console.log('Banking category updated successfully');
    } else {
      console.log('Creating new banking category...');
      const newCategory = await Category.create(bankingCategory);
      console.log('Banking category created successfully with ID:', newCategory._id);
    }
    
    // Step 2: Create bank companies (subcategories)
    console.log('\nLoading bank companies...');
    
    for (const bankCompany of bankingData.bankCompanies) {
      try {
        // Check if company already exists
        const existingCompany = await Subcategory.findOne({
          $or: [{ id: bankCompany.id }, { slug: bankCompany.slug }]
        });
        
        if (existingCompany) {
          console.log(`Company ${bankCompany.name} already exists. Updating...`);
          await Subcategory.findByIdAndUpdate(existingCompany._id, bankCompany);
          console.log(`✅ ${bankCompany.name} updated successfully`);
        } else {
          console.log(`Creating new company: ${bankCompany.name}...`);
          const newCompany = await Subcategory.create(bankCompany);
          console.log(`✅ ${bankCompany.name} created successfully with ID:`, newCompany._id);
        }
      } catch (error) {
        console.error(`❌ Error processing ${bankCompany.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Banking structure loaded successfully!');
    console.log('\nYou can now access:');
    console.log('- Banking category: /category/banking-services');
    console.log('- Public sector banks: /category/banking-services/public-sector-banks');
    console.log('- Private sector banks: /category/banking-services/private-sector-banks');
    console.log('- Individual banks: /category/banking-services/private-sector-banks/hdfc-bank');
    
  } catch (error) {
    console.error('Error loading banking structure:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await loadBankingStructure();
  await mongoose.disconnect();
  console.log('\nScript completed successfully');
};

main().catch(console.error); 