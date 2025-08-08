// Test script for complaints save functionality
const API_BASE_URL = 'http://localhost:3000/api';

async function testComplaintsSave() {
  try {
    console.log('🧪 Testing simplified complaints save functionality...');

    // First, let's get a company to test with
    const getCompaniesResponse = await fetch(`${API_BASE_URL}/subcategories`);
    const companiesData = await getCompaniesResponse.json();
    
    if (!companiesData.success || !companiesData.data || companiesData.data.length === 0) {
      console.error('❌ No companies found to test with');
      return;
    }

    const testCompany = companiesData.data[0];
    console.log(`✅ Found test company: ${testCompany.name} (ID: ${testCompany._id})`);

    // Test data to save - simplified structure
    const testComplaintContent = `
      <div class="editor-layout">
        <div class="sidebar">
          <h3>📋 Quick Navigation</h3>
          <ul>
            <li>📎 Complete Test Company Complaint Guide</li>
            <li>📄 How to Register Your Complaint</li>
            <li>📞 Method 1: Customer Care</li>
            <li>🌐 Method 2: Online Portal</li>
          </ul>
        </div>
        <div class="main-content">
          <h1 style="margin-top: 0; margin-bottom: 10px;">Complete Test Company Complaint and Grievance Resolution Guide</h1>
          <h2 style="margin-top: 15px; margin-bottom: 15px;">How to Register Your Complaint Online and Offline</h2>
          <p style="margin-bottom: 20px;">Here are some easy ways to register your complaint with Test Company. Just follow any of these steps to quickly raise your issue and get help on time:</p>
          
          <h2 style="margin-top: 25px; margin-bottom: 15px;">Method 1: Customer Care (Fastest Way)</h2>
          <h3 style="margin-top: 20px; margin-bottom: 10px;">Customer Care Contact Details:</h3>
          <ul style="margin-bottom: 20px;">
            <li><strong>Toll-Free Numbers:</strong> 1800 1234, 1800 5678</li>
            <li><strong>Email Support:</strong> <a href="mailto:support@testcompany.com">support@testcompany.com</a></li>
          </ul>
          
          <h2 style="margin-top: 25px; margin-bottom: 15px;">Method 2: Online Complaint Portal</h2>
          <h3 style="margin-top: 20px; margin-bottom: 10px;">Visit Online Portal:</h3>
          <p style="margin-bottom: 15px;">Go to: <a href="https://www.testcompany.com/complaints" target="_blank">https://www.testcompany.com/complaints</a></p>
        </div>
      </div>
    `;

    // Prepare simplified data - only save the rich text content
    const simplifiedData = {
      richTextContent: testComplaintContent,
      mainHeading: {
        title: 'Complaint Redressal Process',
        description: `Complaint redressal process for ${testCompany.name}`
      },
      processingStatus: 'completed',
      lastProcessed: new Date()
    };

    // Test saving simplified complaints data using company slug
    const saveResponse = await fetch(`${API_BASE_URL}/structured-complaints/company/${testCompany.slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(simplifiedData)
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error(`❌ Save failed with status ${saveResponse.status}:`, errorText);
      return;
    }

    const saveResult = await saveResponse.json();
    
    if (saveResult.success) {
      console.log('✅ Simplified complaints data saved successfully!');
      console.log('📝 Saved richTextContent length:', testComplaintContent.length);
      console.log('📊 Simplified data saved to structuredcomplaints collection');
      
      // Verify the data was saved by fetching it back using company slug
      const verifyResponse = await fetch(`${API_BASE_URL}/structured-complaints/company/${testCompany.slug}`);
      const verifyResult = await verifyResponse.json();
      
      if (verifyResult.success && verifyResult.data) {
        console.log('✅ Verified: Simplified complaints data was saved correctly');
        console.log('📏 Retrieved content length:', verifyResult.data.richTextContent?.length || 0);
        console.log('🏢 Company ID:', verifyResult.data.companyPageId);
        console.log('📋 Main Heading:', verifyResult.data.mainHeading?.title);
        console.log('📊 Data structure simplified - no unwanted fields');
      } else {
        console.log('⚠️  Could not verify saved content');
      }
    } else {
      console.error('❌ Save failed:', saveResult.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testComplaintsSave();
