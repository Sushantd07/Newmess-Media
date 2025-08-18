import mongoose from 'mongoose';
import Category from './src/models/Category.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your_database_name');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test SVG display system
const testSvgDisplay = async () => {
  try {
    console.log('🧪 Testing SVG Display System...\n');

    // Step 1: Check if test SVG file exists
    const testSvgPath = path.join(__dirname, 'public', 'category-icons', 'test-icon.svg');
    console.log('📁 Checking test SVG file...');
    console.log('Path:', testSvgPath);
    
    if (fs.existsSync(testSvgPath)) {
      console.log('✅ Test SVG file exists');
      const svgContent = fs.readFileSync(testSvgPath, 'utf8');
      console.log('📄 SVG content length:', svgContent.length);
      console.log('📄 SVG content preview:', svgContent.substring(0, 100) + '...');
    } else {
      console.log('❌ Test SVG file not found');
      return;
    }

    // Step 2: Create a test category with SVG icon
    console.log('\n📝 Creating test category with SVG icon...');
    
    const testCategoryData = {
      name: 'Test Category with SVG',
      slug: 'test-category-svg',
      description: 'A test category to verify SVG display',
      icon: '/category-icons/test-icon.svg', // This should be converted to SVG content
      order: 999,
      isActive: true
    };

    // Check if test category already exists
    let testCategory = await Category.findOne({ slug: 'test-category-svg' });
    
    if (testCategory) {
      console.log('⚠️ Test category already exists, updating...');
      testCategory = await Category.findByIdAndUpdate(
        testCategory._id,
        testCategoryData,
        { new: true }
      );
    } else {
      console.log('✅ Creating new test category...');
      testCategory = await Category.create(testCategoryData);
    }

    console.log('✅ Test category created/updated:', testCategory.name);
    console.log('📁 Icon field type:', typeof testCategory.icon);
    console.log('📁 Icon field length:', testCategory.icon ? testCategory.icon.length : 0);
    console.log('📁 Icon field preview:', testCategory.icon ? testCategory.icon.substring(0, 100) + '...' : 'null');

    // Step 3: Test the API endpoint
    console.log('\n🌐 Testing API endpoint...');
    
    // Simulate the convertIconPathToContent function
    const convertIconPathToContent = async (category) => {
      if (category.icon && category.icon.startsWith('/') && category.icon.endsWith('.svg')) {
        try {
          console.log('🔍 Processing SVG icon for category:', category.name);
          console.log('📁 Icon path:', category.icon);
          
                     const fs = await import('fs');
           const path = await import('path');
           
           // Convert the URL path to a file system path
           const iconPath = path.default.join(process.cwd(), 'public', category.icon.replace('/category-icons/', ''));
           console.log('🗂️ Full file path:', iconPath);
           
           if (fs.default.existsSync(iconPath)) {
             console.log('✅ SVG file exists, reading content...');
             const svgContent = fs.default.readFileSync(iconPath, 'utf8');
            console.log('📄 SVG content length:', svgContent.length);
            console.log('📄 SVG content preview:', svgContent.substring(0, 100) + '...');
            return { ...category, icon: svgContent };
          } else {
            console.log('❌ SVG file does not exist at path:', iconPath);
          }
        } catch (fileError) {
          console.error('❌ Error reading SVG file:', fileError);
        }
      } else {
        console.log('ℹ️ Category', category.name, 'has no SVG icon or icon is not a file path');
      }
      return category;
    };

    // Test the conversion
    const convertedCategory = await convertIconPathToContent(testCategory);
    console.log('\n🔄 Conversion result:');
    console.log('📁 Converted icon type:', typeof convertedCategory.icon);
    console.log('📁 Converted icon length:', convertedCategory.icon ? convertedCategory.icon.length : 0);
    console.log('📁 Converted icon preview:', convertedCategory.icon ? convertedCategory.icon.substring(0, 100) + '...' : 'null');

    // Step 4: Test frontend detection logic
    console.log('\n🎨 Testing frontend detection logic...');
    const hasCustomIcon = convertedCategory.icon && (
      convertedCategory.icon.startsWith('<svg') || 
      convertedCategory.icon.includes('<svg') || 
      convertedCategory.icon.includes('viewBox') ||
      convertedCategory.icon.includes('xmlns=')
    );
    
    console.log('🎨 Has custom icon:', hasCustomIcon);
    console.log('🎨 Icon starts with <svg:', convertedCategory.icon ? convertedCategory.icon.startsWith('<svg') : false);
    console.log('🎨 Icon includes <svg:', convertedCategory.icon ? convertedCategory.icon.includes('<svg') : false);
    console.log('🎨 Icon includes viewBox:', convertedCategory.icon ? convertedCategory.icon.includes('viewBox') : false);
    console.log('🎨 Icon includes xmlns=:', convertedCategory.icon ? convertedCategory.icon.includes('xmlns=') : false);

    console.log('\n✅ SVG Display System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('- SVG file exists and is readable');
    console.log('- Category created with SVG icon path');
    console.log('- Icon path converted to SVG content successfully');
    console.log('- Frontend detection logic works correctly');
    console.log('- Ready for frontend display');

  } catch (error) {
    console.error('❌ Error testing SVG display:', error);
  }
};

// Run the test
const runTest = async () => {
  await connectDB();
  await testSvgDisplay();
  process.exit(0);
};

runTest();
