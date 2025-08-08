import fetch from 'node-fetch';

// Test the HDFC company page API
const testHDFCCompanyAPI = async () => {
  try {
    console.log('Testing HDFC Company Page API...');
    
    const response = await fetch('http://localhost:3000/api/subcategories/company/hdfc-bank');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Success:', data.success);
    
    if (data.success && data.data) {
      console.log('✅ HDFC Company Data Found:');
      console.log('   - Name:', data.data.name);
      console.log('   - Company Name:', data.data.companyName);
      console.log('   - Phone:', data.data.phone);
      console.log('   - Website:', data.data.website);
      console.log('   - Rating:', data.data.rating);
      console.log('   - Total Reviews:', data.data.totalReviews);
      console.log('   - Parent Category:', data.data.parentCategory);
      
      if (data.data.tabs && data.data.tabs.numbers) {
        console.log('   - Contact Numbers Tab: Available');
      } else {
        console.log('   - Contact Numbers Tab: Not linked');
      }
      
      console.log('\n🎉 HDFC Company Page API is working correctly!');
      console.log('You can now access this data from your frontend.');
      
    } else {
      console.log('❌ No data found in API response');
      console.log('Response:', data);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\nMake sure:');
    console.log('1. Backend server is running on http://localhost:3000');
    console.log('2. HDFC Bank data exists in the database');
    console.log('3. MongoDB is running and accessible');
  }
};

// Run the test
testHDFCCompanyAPI(); 