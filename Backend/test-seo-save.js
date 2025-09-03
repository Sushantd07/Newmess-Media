import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const testSeoSave = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');
    
    // Import the SeoSetting model
    const { default: SeoSetting } = await import('./src/models/SeoSetting.js');
    
    // Find the existing jp-morgan SEO record
    let seoRecord = await SeoSetting.findOne({ 
      type: 'company', 
      identifier: 'jp-morgan' 
    });
    
    if (seoRecord) {
      console.log('🔍 Found existing SEO record:', {
        _id: seoRecord._id,
        tabs: seoRecord.tabs ? Object.keys(seoRecord.tabs) : 'No tabs'
      });
      
      // Try to update the contactnumber tab
      console.log('\n🔍 Updating contactnumber tab...');
      
      // Initialize tabs if it doesn't exist
      if (!seoRecord.tabs || typeof seoRecord.tabs !== 'object') {
        seoRecord.tabs = {};
      }
      
      // Update the specific tab
      seoRecord.tabs.contactnumber = {
        type: 'company',
        identifier: 'jp-morgan',
        title: 'JP Morgan Customer Care - Test Title',
        description: 'Test description for JP Morgan customer care page',
        keywords: ['jp morgan', 'customer care', 'contact'],
        robots: 'index,follow',
        lang: 'en'
      };
      
      // Mark tabs as modified for Mongoose
      seoRecord.markModified('tabs');
      
      // Save the document
      await seoRecord.save();
      console.log('✅ Saved updated SEO record');
      
      // Check what was actually saved
      const updatedRecord = await SeoSetting.findOne({ 
        type: 'company', 
        identifier: 'jp-morgan' 
      });
      
      console.log('\n🔍 Updated record tabs:', updatedRecord.tabs ? Object.keys(updatedRecord.tabs) : 'No tabs');
      
      if (updatedRecord.tabs && updatedRecord.tabs.contactnumber) {
        console.log('✅ contactnumber tab was saved successfully');
        console.log('📋 contactnumber tab data:', {
          title: updatedRecord.tabs.contactnumber.title,
          description: updatedRecord.tabs.contactnumber.description,
          keywords: updatedRecord.tabs.contactnumber.keywords
        });
      } else {
        console.log('❌ contactnumber tab was not saved');
      }
      
    } else {
      console.log('❌ No SEO record found for jp-morgan');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testSeoSave();

