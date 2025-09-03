// Test script to simulate frontend production environment
// This simulates what happens in the browser

// Simulate production environment variables
const mockImportMeta = {
  env: {
    VITE_API_BASE_URL: 'https://newmess-media-backend.onrender.com/api',
    MODE: 'production',
    PROD: true
  }
};

// Mock the import.meta object
global.import = {
  meta: mockImportMeta
};

// Simulate the SEO service logic
const API_BASE_URL_ROOT = 
  ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `http://localhost:3000/api`)) ||
  'http://localhost:3000/api');

const API_BASE_URL = `${API_BASE_URL_ROOT}/seo`;

console.log('🔍 Testing Frontend Production Environment...');
console.log('🌐 API_BASE_URL_ROOT:', API_BASE_URL_ROOT);
console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('🌐 Environment:', {
  VITE_API_BASE_URL: import.meta?.env?.VITE_API_BASE_URL,
  NODE_ENV: import.meta?.env?.MODE,
  PROD: import.meta?.env?.PROD
});

async function testSeoAPI() {
  console.log('\n🔍 Testing SEO API from frontend perspective...');
  
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
        'Origin': 'https://indiacustomerhelp.com', // Simulate production frontend
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
    console.error('❌ Full error:', error);
  }
}

// Test with different origins to check CORS
async function testCorsWithDifferentOrigins() {
  console.log('\n🔍 Testing CORS with different origins...');
  
  const origins = [
    'https://indiacustomerhelp.com',
    'https://www.indiacustomerhelp.com',
    'http://localhost:5174',
    'https://localhost:5174'
  ];
  
  for (const origin of origins) {
    try {
      const params = new URLSearchParams({ 
        type: 'route', 
        identifier: '/', 
        path: '/' 
      });
      const url = `${API_BASE_URL}?${params.toString()}`;
      console.log(`📡 Testing with origin: ${origin}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': origin,
        },
      });
      
      console.log(`✅ ${origin}: Status ${response.status}`);
      
    } catch (error) {
      console.error(`❌ ${origin}: ${error.message}`);
    }
  }
}

// Run tests
async function runTests() {
  await testSeoAPI();
  await testCorsWithDifferentOrigins();
}

runTests().catch(console.error);
