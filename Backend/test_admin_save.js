// Test script to verify admin save functionality
const API_BASE_URL = 'http://localhost:3000/api';

async function testAdminSave() {
  try {
    console.log('🧪 Testing admin save functionality...');

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

    // Test data that matches the admin panel format
    const adminPanelData = {
      richTextContent: '<p>Test content from admin panel - ' + new Date().toISOString() + '</p>',
      mainHeading: {
        title: 'Complaint Redressal Process',
        description: `Complaint redressal process for ${iciciCompany.name}`
      },
      processingStatus: 'completed',
      lastProcessed: new Date()
    };

    console.log(`📤 Testing admin panel save with slug: ${iciciCompany.slug}`);
    console.log('📤 Data being sent:', adminPanelData);

    // Test saving using the admin panel format
    const saveResponse = await fetch(`${API_BASE_URL}/structured-complaints/company/${iciciCompany.slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminPanelData)
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error(`❌ Save failed with status ${saveResponse.status}:`, errorText);
      return;
    }

    const saveResult = await saveResponse.json();
    
    if (saveResult.success) {
      console.log('✅ Admin panel save successful!');
      console.log('📝 Saved data:', saveResult.data);
      
      // Verify the data was saved by fetching it back
      const verifyResponse = await fetch(`${API_BASE_URL}/structured-complaints/company/${iciciCompany.slug}`);
      const verifyResult = await verifyResponse.json();
      
      if (verifyResult.success && verifyResult.data) {
        console.log('✅ Verified: Admin panel data was saved correctly');
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
testAdminSave();

