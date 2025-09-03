import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const debugSeo = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');
    
    // Import the SeoSetting model
    const { default: SeoSetting } = await import('./src/models/SeoSetting.js');
    
    // Find the jp-morgan SEO record
    const seoRecord = await SeoSetting.findOne({ 
      type: 'company', 
      identifier: 'jp-morgan' 
    });
    
    if (seoRecord) {
      console.log('🔍 Found SEO record:', {
        _id: seoRecord._id,
        type: seoRecord.type,
        identifier: seoRecord.identifier,
        title: seoRecord.title,
        description: seoRecord.description,
        keywords: seoRecord.keywords,
        tabs: seoRecord.tabs,
        updatedAt: seoRecord.updatedAt
      });
      
      // Check the tabs structure
      if (seoRecord.tabs) {
        console.log('\n📋 Tabs structure:');
        Object.keys(seoRecord.tabs).forEach(tabName => {
          const tabData = seoRecord.tabs[tabName];
          console.log(`  ${tabName}:`, {
            title: tabData.title,
            description: tabData.description,
            keywords: tabData.keywords
          });
        });
      }
    } else {
      console.log('❌ No SEO record found for jp-morgan');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

debugSeo();

