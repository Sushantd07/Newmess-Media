// Test script to debug production SEO API issues
const API_BASE_URL = 'https://newmess-media-backend.onrender.com/api/seo';

async function testSeoAPI() {
  console.log('🔍 Testing Production SEO API...');
  console.log('🌐 API Base URL:', API_BASE_URL);
  
  // Test 1: Basic GET request
  try {
    const params = new URLSearchParams({ 
      type: 'route', 
      identifier: '/', 
      path: '/' 
    });
    const url = `${API_BASE_URL}?${params.toString()}`;
    console.log('📡 Making request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const contentType = response.headers.get('content-type') || '';
    let json = null;
    
    try {
      if (contentType.includes('application/json')) {
        json = await response.json();
      }
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
    }
    
    console.log('📄 Response body:', json);
    
    if (!response.ok) {
      console.error('❌ Request failed with status:', response.status);
      return;
    }
    
    if (!json || json.success === false) {
      console.error('❌ API returned error:', json);
      return;
    }
    
    console.log('✅ SEO data retrieved successfully:', json.data);
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Test 2: Test with different parameters
async function testCompanySeo() {
  console.log('\n🔍 Testing Company SEO API...');
  
  try {
    const params = new URLSearchParams({ 
      type: 'company', 
      identifier: 'amazon',
      tab: 'overview'
    });
    const url = `${API_BASE_URL}?${params.toString()}`;
    console.log('📡 Making request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📊 Response status:', response.status);
    
    const contentType = response.headers.get('content-type') || '';
    let json = null;
    
    try {
      if (contentType.includes('application/json')) {
        json = await response.json();
      }
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
    }
    
    console.log('📄 Response body:', json);
    
    if (!response.ok) {
      console.error('❌ Request failed with status:', response.status);
      return;
    }
    
    if (!json || json.success === false) {
      console.error('❌ API returned error:', json);
      return;
    }
    
    console.log('✅ Company SEO data retrieved successfully:', json.data);
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testSeoAPI();
  await testCompanySeo();
}

runTests().catch(console.error);
