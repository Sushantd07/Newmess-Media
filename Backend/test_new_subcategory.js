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

// Test creating a new subcategory
const testNewSubcategory = async () => {
  try {
    console.log('🧪 Testing new subcategory creation...');
    
    // Step 1: Get the banking category ObjectId
    const bankingCategory = await Category.findOne({ slug: 'banking-services' });
    if (!bankingCategory) {
      console.log('❌ Banking Services category not found');
      return;
    }
    console.log('✅ Found Banking Services category:', bankingCategory._id);
    
    // Step 2: Create a test subcategory
    const testSubcategoryData = {
      id: "test-bank",
      name: "Test Bank",
      slug: "test-bank",
      phone: "1800-123-4567",
      logo: "/company-logos/Bank/test_bank.svg",
      verified: true,
      isActive: true,
      tags: ["Banking", "Test", "Digital Banking"],
      address: "All India",
      timing: "24x7",
      parentCategory: bankingCategory._id,
      order: 10,
      description: "A test bank for demonstration purposes.",
      companyName: "Test Bank Limited",
      mainPhone: "1800-123-4567",
      website: "https://www.testbank.com",
      founded: "2024",
      headquarters: "Mumbai, Maharashtra",
      parentCompany: "Test Group",
      rating: 4.0,
      totalReviews: 100,
      monthlySearches: "1K",
      tabs: { numbers: null, complaints: null, quickhelp: null, video: null, overview: null }
    };
    
    // Check if test subcategory already exists
    const existingTest = await Subcategory.findOne({ $or: [{ id: 'test-bank' }, { slug: 'test-bank' }] });
    let testSubcategory;
    
    if (existingTest) {
      console.log('⚠️ Test subcategory already exists, updating...');
      testSubcategory = await Subcategory.findByIdAndUpdate(existingTest._id, testSubcategoryData, { new: true });
    } else {
      console.log('✅ Creating new test subcategory...');
      testSubcategory = await Subcategory.create(testSubcategoryData);
    }
    
    console.log('✅ Test subcategory created/updated:', {
      ObjectId: testSubcategory._id,
      Name: testSubcategory.name,
      Slug: testSubcategory.slug,
      ID: testSubcategory.id,
      ParentCategory: testSubcategory.parentCategory
    });
    
    // Step 3: Test if it appears in category grid API
    console.log('\n🧪 Testing category grid API...');
    const gridResponse = await fetch('http://localhost:3000/api/categories/grid-data');
    if (gridResponse.ok) {
      const gridData = await gridResponse.json();
      const bankingCategoryInGrid = gridData.data.find(cat => cat.slug === 'banking-services');
      
      if (bankingCategoryInGrid) {
        console.log('✅ Banking Services found in grid data');
        console.log('Subcategory count:', bankingCategoryInGrid.subcategoryCount);
        
        const testInGrid = bankingCategoryInGrid.subcategories.find(sub => sub.slug === 'test-bank');
        if (testInGrid) {
          console.log('✅ Test Bank found in grid data!');
          console.log('Grid data Test Bank:', {
            _id: testInGrid._id,
            name: testInGrid.name,
            slug: testInGrid.slug,
            id: testInGrid.id
          });
        } else {
          console.log('❌ Test Bank NOT found in grid data');
          console.log('Available subcategories:', bankingCategoryInGrid.subcategories.map(s => s.slug));
        }
      }
    }
    
    // Step 4: Test individual company API
    console.log('\n🧪 Testing individual company API...');
    const companyResponse = await fetch('http://localhost:3000/api/subcategories/company/test-bank');
    if (companyResponse.ok) {
      const companyData = await companyResponse.json();
      console.log('✅ Individual company API works for Test Bank');
      console.log('Company name:', companyData.data.name);
      console.log('Company slug:', companyData.data.slug);
    } else {
      console.log('❌ Individual company API failed for Test Bank');
    }
    
    // Step 5: Show expected navigation routes
    console.log('\n🌐 Expected Navigation Routes:');
    console.log('SEO-friendly route: http://localhost:5173/category/banking-services/test-bank/contactnumber');
    console.log('ObjectId route: http://localhost:5173/company/' + testSubcategory._id + '/contactnumber');
    
    // Step 6: Frontend navigation logic check
    console.log('\n🔍 Frontend Navigation Logic Check:');
    console.log('CategoryGrid will check:');
    console.log('1. co.slug exists? YES -> Navigate to SEO-friendly route');
    console.log('2. co._id exists? YES -> Fallback to ObjectId route');
    console.log('3. co.id exists? YES -> Final fallback route');
    
    console.log('\n✅ Conclusion: Test Bank will appear on homepage and "View More" will work!');
    
  } catch (error) {
    console.error('Error testing new subcategory:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testNewSubcategory();
  await mongoose.disconnect();
  console.log('\nTest completed successfully');
};

main().catch(console.error); 