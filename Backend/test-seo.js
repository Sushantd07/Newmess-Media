import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// Test MongoDB connection and SEO operations
async function testSeo() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Import the SeoSetting model
    const { default: SeoSetting } = await import('./src/models/SeoSetting.js');
    
    // Test creating a new SEO record
    const testData = {
      type: 'company',
      identifier: 'test-company',
      title: 'Test Company SEO',
      description: 'Test description for SEO',
      keywords: ['test', 'company', 'seo'],
      robots: 'index,follow',
      lang: 'en',
      tabs: {
        overview: {
          title: 'Test Company Overview',
          description: 'Test overview description',
          keywords: ['overview', 'test'],
          robots: 'index,follow',
          lang: 'en'
        }
      }
    };
    
    console.log('🔍 Testing SEO creation with:', testData);
    
    // Try to create
    const newSeo = await SeoSetting.create(testData);
    console.log('✅ Created new SEO record:', newSeo._id);
    
    // Try to find it
    const found = await SeoSetting.findOne({ type: 'company', identifier: 'test-company' });
    console.log('✅ Found SEO record:', found ? 'Yes' : 'No');
    
    // Try to update it
    const updateResult = await SeoSetting.findOneAndUpdate(
      { type: 'company', identifier: 'test-company' },
      { 
        $set: { 
          'tabs.overview.title': 'Updated Title',
          'tabs.overview.description': 'Updated description'
        }
      },
      { new: true }
    );
    console.log('✅ Updated SEO record:', updateResult ? 'Yes' : 'No');
    
    // Clean up - delete test record
    await SeoSetting.deleteOne({ type: 'company', identifier: 'test-company' });
    console.log('✅ Cleaned up test record');
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testSeo();

