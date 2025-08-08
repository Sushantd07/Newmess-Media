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

// Load Categories and return mapping
const loadCategories = async () => {
  try {
    console.log('📁 Loading categories...');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');
    
    // Create categories
    const categories = await Category.insertMany(categoriesData.categories);
    console.log(`✅ Created ${categories.length} categories`);
    
    // Create slug to ObjectId mapping
    const categoryMapping = {};
    categories.forEach(category => {
      categoryMapping[category.slug] = category._id;
    });
    
    return { categories, categoryMapping };
  } catch (error) {
    console.error('❌ Error loading categories:', error);
    throw error;
  }
};

// Load Subcategories with ObjectId linking
const loadSubcategories = async (categoryMapping) => {
  try {
    console.log('📁 Loading subcategories...');
    
    // Clear existing subcategories
    await Subcategory.deleteMany({});
    console.log('🗑️  Cleared existing subcategories');
    
    // Transform subcategories data to use ObjectId
    const subcategoriesWithObjectIds = subcategoriesData.subcategories.map(sub => ({
      ...sub,
      parentCategory: categoryMapping[sub.parentCategorySlug],
      // Remove the slug field as we're using ObjectId
      parentCategorySlug: undefined
    })).filter(sub => sub.parentCategory); // Filter out any with invalid category slugs
    
    // Create subcategories
    const subcategories = await Subcategory.insertMany(subcategoriesWithObjectIds);
    console.log(`✅ Created ${subcategories.length} subcategories`);
    
    return subcategories;
  } catch (error) {
    console.error('❌ Error loading subcategories:', error);
    throw error;
  }
};

// Update category counts
const updateCategoryCounts = async () => {
  try {
    console.log('📊 Updating category counts...');
    
    const categories = await Category.find({});
    
    for (const category of categories) {
      const count = await Subcategory.countDocuments({ 
        parentCategory: category._id,
        isActive: true 
      });
      
      await Category.findByIdAndUpdate(category._id, { 
        subcategoryCount: count 
      });
    }
    
    console.log('✅ Updated category counts');
  } catch (error) {
    console.error('❌ Error updating category counts:', error);
    throw error;
  }
};

// Main function
const loadData = async () => {
  try {
    await connectDB();
    
    // Load categories first and get mapping
    const { categories, categoryMapping } = await loadCategories();
    
    // Load subcategories with ObjectId linking
    const subcategories = await loadSubcategories(categoryMapping);
    
    // Update category counts
    await updateCategoryCounts();
    
    console.log('\n🎉 Data loading completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Subcategories: ${subcategories.length}`);
    
    // Show sample data
    console.log('\n📋 Sample Categories:');
    categories.slice(0, 3).forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat._id})`);
    });
    
    console.log('\n📋 Sample Subcategories:');
    subcategories.slice(0, 3).forEach(sub => {
      console.log(`   - ${sub.name} (Parent: ${sub.parentCategory})`);
    });
    
    // Test the API response format
    console.log('\n🔍 Testing API Response Format:');
    const testCategory = categories[0];
    const testSubcategories = await Subcategory.find({ 
      parentCategory: testCategory._id 
    }).lean();
    
    console.log('Sample API Response:');
    console.log(JSON.stringify({
      success: true,
      message: 'Categories with subcategories fetched successfully',
      data: [{
        _id: testCategory._id,
        name: testCategory.name,
        slug: testCategory.slug,
        icon: testCategory.icon,
        subcategoryCount: testSubcategories.length,
        subcategories: testSubcategories.slice(0, 2) // Show first 2 subcategories
      }]
    }, null, 2));
    
  } catch (error) {
    console.error('❌ Error in data loading:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the script
loadData(); 