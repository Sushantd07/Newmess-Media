import mongoose from 'mongoose';
import Subcategory from './src/models/Subcategory.js';
import StructuredComplaints from './src/models/StructuredComplaints.js';

const MONGODB_URI = 'mongodb://localhost:27017/ich_db';

async function testHDFCSave() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find HDFC company
    const hdfcCompany = await Subcategory.findOne({ name: { $regex: /hdfc/i } });
    if (!hdfcCompany) {
      console.log('❌ HDFC company not found');
      return;
    }
    console.log('✅ Found HDFC company:', hdfcCompany.name, 'ID:', hdfcCompany._id);

    // Test data to save
    const testData = {
      richTextContent: '<h1>HDFC Bank Complaint Process</h1><p>This is a test complaint content for HDFC Bank.</p>',
      mainHeading: {
        title: 'HDFC Bank Complaint Redressal Process',
        description: 'Complaint redressal process for HDFC Bank'
      },
      processingStatus: 'completed',
      lastProcessed: new Date()
    };

    // Check if structured complaints data already exists
    let existingData = await StructuredComplaints.findOne({ companyPageId: hdfcCompany._id });
    
    if (existingData) {
      console.log('📝 Updating existing structured complaints data...');
      existingData.richTextContent = testData.richTextContent;
      existingData.mainHeading = testData.mainHeading;
      existingData.processingStatus = testData.processingStatus;
      existingData.lastProcessed = testData.lastProcessed;
      await existingData.save();
      console.log('✅ Updated existing data');
    } else {
      console.log('📝 Creating new structured complaints data...');
      const newData = new StructuredComplaints({
        companyPageId: hdfcCompany._id,
        richTextContent: testData.richTextContent,
        mainHeading: testData.mainHeading,
        processingStatus: testData.processingStatus,
        lastProcessed: testData.lastProcessed
      });
      await newData.save();
      console.log('✅ Created new data');
    }

    // Verify the data was saved
    const savedData = await StructuredComplaints.findOne({ companyPageId: hdfcCompany._id });
    if (savedData) {
      console.log('✅ Data saved successfully!');
      console.log('📊 Saved data:', {
        id: savedData._id,
        companyPageId: savedData.companyPageId,
        mainHeading: savedData.mainHeading,
        richTextContent: savedData.richTextContent ? savedData.richTextContent.substring(0, 100) + '...' : 'No content',
        processingStatus: savedData.processingStatus,
        lastProcessed: savedData.lastProcessed
      });
    } else {
      console.log('❌ Data not found after saving');
    }

    // Test the API endpoint
    console.log('\n🔍 Testing API endpoint...');
    const API_BASE_URL = 'http://localhost:3000/api';
    
    const response = await fetch(`${API_BASE_URL}/structured-complaints/company/${hdfcCompany._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API call successful:', result.message);
    } else {
      console.log('❌ API call failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testHDFCSave();

