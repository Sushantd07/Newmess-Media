// Test script to check ICICI Bank complaints data
const API_BASE_URL = 'http://localhost:3000/api';

async function testICICIComplaints() {
  try {
    console.log('🧪 Testing ICICI Bank complaints data...');

    // First, let's get all companies to find ICICI
    const getCompaniesResponse = await fetch(`${API_BASE_URL}/subcategories`);
    const companiesData = await getCompaniesResponse.json();
    
    if (!companiesData.success || !companiesData.data || companiesData.data.length === 0) {
      console.error('❌ No companies found to test with');
      return;
    }

    // Find ICICI Bank
    const iciciCompany = companiesData.data.find(company => 
      company.name.toLowerCase().includes('icici')
    );

    if (!iciciCompany) {
      console.error('❌ ICICI Bank not found in companies list');
      console.log('Available companies:');
      companiesData.data.forEach(company => {
        console.log(`  - ${company.name} (slug: ${company.slug})`);
      });
      return;
    }

    console.log(`✅ Found ICICI Bank: ${iciciCompany.name} (slug: ${iciciCompany.slug})`);

    // Test data to save for ICICI Bank
    const testComplaintContent = `
      <div class="editor-layout">
        <div class="sidebar">
          <h3>📋 ICICI Bank Complaint Guide</h3>
          <ul>
            <li>📎 ICICI Bank Complaint Process</li>
            <li>📄 How to Register Your Complaint</li>
            <li>📞 Method 1: Customer Care</li>
            <li>🌐 Method 2: Online Portal</li>
          </ul>
        </div>
        <div class="main-content">
          <h1 style="margin-top: 0; margin-bottom: 10px;">ICICI Bank Complaint and Grievance Resolution Guide</h1>
          <h2 style="margin-top: 15px; margin-bottom: 15px;">How to Register Your Complaint Online and Offline</h2>
          <p style="margin-bottom: 20px;">Here are some easy ways to register your complaint with ICICI Bank. Just follow any of these steps to quickly raise your issue and get help on time:</p>
          
          <h2 style="margin-top: 25px; margin-bottom: 15px;">Method 1: Customer Care (Fastest Way)</h2>
          <h3 style="margin-top: 20px; margin-bottom: 10px;">Customer Care Contact Details:</h3>
          <ul style="margin-bottom: 20px;">
            <li><strong>Toll-Free Numbers:</strong> 1800 2100 1000, 1800 425 4252</li>
            <li><strong>Email Support:</strong> <a href="mailto:care@icicibank.com">care@icicibank.com</a></li>
          </ul>
          
          <h2 style="margin-top: 25px; margin-bottom: 15px;">Method 2: Online Complaint Portal</h2>
          <h3 style="margin-top: 20px; margin-bottom: 10px;">Visit Online Portal:</h3>
          <p style="margin-bottom: 15px;">Go to: <a href="https://www.icicibank.com/complaints" target="_blank">https://www.icicibank.com/complaints</a></p>
        </div>
      </div>
    `;

    // Prepare simplified data for ICICI Bank
    const simplifiedData = {
      richTextContent: testComplaintContent,
      mainHeading: {
        title: 'ICICI Bank Complaint Redressal Process',
        description: `Complaint redressal process for ${iciciCompany.name}`
      },
      processingStatus: 'completed',
      lastProcessed: new Date()
    };

    console.log(`📤 Saving ICICI Bank complaints data using slug: ${iciciCompany.slug}`);

    // Test saving ICICI Bank complaints data
    const saveResponse = await fetch(`${API_BASE_URL}/structured-complaints/company/${iciciCompany.slug}`, {
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
      console.log('✅ ICICI Bank complaints data saved successfully!');
      console.log('📝 Saved richTextContent length:', testComplaintContent.length);
      
      // Verify the data was saved by fetching it back
      const verifyResponse = await fetch(`${API_BASE_URL}/structured-complaints/company/${iciciCompany.slug}`);
      const verifyResult = await verifyResponse.json();
      
      if (verifyResult.success && verifyResult.data) {
        console.log('✅ Verified: ICICI Bank complaints data was saved correctly');
        console.log('📏 Retrieved content length:', verifyResult.data.richTextContent?.length || 0);
        console.log('🏢 Company ID:', verifyResult.data.companyPageId);
        console.log('📋 Main Heading:', verifyResult.data.mainHeading?.title);
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
testICICIComplaints();

