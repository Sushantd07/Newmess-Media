import mongoose from 'mongoose';
import Category from './src/models/Category.js';
import Subcategory from './src/models/Subcategory.js';
import categoriesData from './categories_data.json' assert { type: 'json' };
import subcategoriesData from './subcategories_data.json' assert { type: 'json' };

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Load Categories
const loadCategories = async () => {
  try {
    console.log('📁 Loading categories...');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');
    
    // Create categories
    const categories = await Category.insertMany(categoriesData.categories);
    console.log(`✅ Created ${categories.length} categories`);
    
    return categories;
  } catch (error) {
    console.error('❌ Error loading categories:', error);
    throw error;
  }
};

// Load Subcategories
const loadSubcategories = async () => {
  try {
    console.log('📁 Loading subcategories...');
    
    // Clear existing subcategories
    await Subcategory.deleteMany({});
    console.log('🗑️  Cleared existing subcategories');
    
    // Create subcategories using parentCategorySlug
    const subcategories = [];
    for (const subcategoryData of subcategoriesData.subcategories) {
      try {
        const subcategory = await Subcategory.create(subcategoryData);
        subcategories.push(subcategory);
      } catch (error) {
        console.error(`❌ Error creating subcategory ${subcategoryData.name}:`, error.message);
      }
    }
    
    console.log(`✅ Created ${subcategories.length} subcategories`);
    return subcategories;
  } catch (error) {
    console.error('❌ Error loading subcategories:', error);
    throw error;
  }
};

// Main function
const loadData = async () => {
  try {
    await connectDB();
    
    // Load categories first
    const categories = await loadCategories();
    
    // Load subcategories (they will automatically link to categories via slug)
    const subcategories = await loadSubcategories();
    
    console.log('\n🎉 Data loading completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Subcategories: ${subcategories.length}`);
    
    // Show some sample data
    console.log('\n📋 Sample Categories:');
    categories.slice(0, 3).forEach(cat => {
      console.log(`   - ${cat.name} (${cat.subcategoryCount} subcategories)`);
    });
    
    console.log('\n📋 Sample Subcategories:');
    subcategories.slice(0, 3).forEach(sub => {
      console.log(`   - ${sub.name} (${sub.phone})`);
    });
    
  } catch (error) {
    console.error('❌ Error in data loading:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the script
loadData(); 