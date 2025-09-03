import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = 'NumbersDB';

async function checkSubcategories() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URL);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Check subcategories collection
    console.log('\n📂 Examining subcategories collection:');
    const subcategories = await db.collection('subcategories').find({}).limit(3).toArray();
    
    console.log(`Found ${subcategories.length} subcategories (showing first 3):`);
    
    subcategories.forEach((sub, index) => {
      console.log(`\n${index + 1}. ${sub.name || 'No name'}`);
      console.log(`   Slug: ${sub.slug || 'No slug'}`);
      console.log(`   Parent Category: ${sub.parentCategory || 'No parent'}`);
      console.log(`   Is Active: ${sub.isActive}`);
      console.log(`   Keys: ${Object.keys(sub).join(', ')}`);
    });
    
    // Check if there are any unique parent categories
    console.log('\n🔍 Checking unique parent categories:');
    const parentCategories = await db.collection('subcategories').distinct('parentCategory');
    console.log('Parent categories found:', parentCategories);
    
    // Check companypages collection
    console.log('\n🏢 Examining companypages collection:');
    const companies = await db.collection('companypages').find({}).limit(3).toArray();
    
    console.log(`Found ${companies.length} companies (showing first 3):`);
    
    companies.forEach((company, index) => {
      console.log(`\n${index + 1}. ${company.name || 'No name'}`);
      console.log(`   Slug: ${company.slug || 'No slug'}`);
      console.log(`   Category ID: ${company.categoryId || 'No category'}`);
      console.log(`   Subcategory ID: ${company.subCategoryId || 'No subcategory'}`);
      console.log(`   Keys: ${Object.keys(company).join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking subcategories:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Run the check
checkSubcategories();
