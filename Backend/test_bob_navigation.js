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

// Test BOB Bank navigation
const testBOBNavigation = async () => {
  try {
    console.log('Testing BOB Bank navigation...');
    
    // Step 1: Find BOB Bank in database
    const bobBank = await Subcategory.findOne({
      $or: [{ id: 'bob-bank' }, { slug: 'bob-bank' }]
    });
    
    if (!bobBank) {
      console.log('❌ BOB Bank not found in database');
      return;
    }
    
    console.log('✅ BOB Bank found in database:');
    console.log('ObjectId:', bobBank._id);
    console.log('Name:', bobBank.name);
    console.log('Slug:', bobBank.slug);
    console.log('ID:', bobBank.id);
    console.log('IsActive:', bobBank.isActive);
    console.log('ParentCategory:', bobBank.parentCategory);
    
    // Step 2: Test category grid API
    console.log('\n🧪 Testing category grid API...');
    const gridResponse = await fetch('http://localhost:3000/api/categories/grid-data');
    if (gridResponse.ok) {
      const gridData = await gridResponse.json();
      const bankingCategory = gridData.data.find(cat => cat.slug === 'banking-services');
      
      if (bankingCategory) {
        console.log('✅ Banking Services category found in grid data');
        console.log('Subcategory count:', bankingCategory.subcategoryCount);
        
        const bobInGrid = bankingCategory.subcategories.find(sub => sub.slug === 'bob-bank');
        if (bobInGrid) {
          console.log('✅ BOB Bank found in grid data');
          console.log('Grid data BOB Bank:', {
            _id: bobInGrid._id,
            name: bobInGrid.name,
            slug: bobInGrid.slug,
            id: bobInGrid.id
          });
        } else {
          console.log('❌ BOB Bank NOT found in grid data');
          console.log('Available subcategories:', bankingCategory.subcategories.map(s => s.slug));
        }
      } else {
        console.log('❌ Banking Services category not found in grid data');
      }
    } else {
      console.log('❌ Category grid API failed');
    }
    
    // Step 3: Test individual company API
    console.log('\n🧪 Testing individual company API...');
    const companyResponse = await fetch('http://localhost:3000/api/subcategories/company/bob-bank');
    if (companyResponse.ok) {
      const companyData = await companyResponse.json();
      console.log('✅ Individual company API works');
      console.log('Company name:', companyData.data.name);
      console.log('Company slug:', companyData.data.slug);
      console.log('Company ID:', companyData.data.id);
    } else {
      console.log('❌ Individual company API failed');
    }
    
    // Step 4: Show expected navigation routes
    console.log('\n🌐 Expected Navigation Routes:');
    console.log('SEO-friendly route: http://localhost:5173/category/banking-services/bob-bank/contactnumber');
    console.log('ObjectId route: http://localhost:5173/company/' + bobBank._id + '/contactnumber');
    
    // Step 5: Check frontend navigation logic
    console.log('\n🔍 Frontend Navigation Logic Check:');
    console.log('Frontend should use slug route: /category/banking-services/bob-bank/contactnumber');
    console.log('Frontend should have _id field for fallback: ' + bobBank._id);
    
  } catch (error) {
    console.error('Error testing BOB Bank navigation:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testBOBNavigation();
  await mongoose.disconnect();
  console.log('\nTest completed successfully');
};

main().catch(console.error); 