// Test script to check SEO data in the database
const API_BASE_URL = 'https://newmess-media-backend.onrender.com/api/seo';

async function testSeoData() {
  console.log('🔍 Testing SEO data retrieval...');
  
  // Test different routes
  const tests = [
    { type: 'route', identifier: '/', path: '/' },
    { type: 'home', identifier: 'home' },
    { type: 'route', identifier: '/category', path: '/category' },
    { type: 'all-categories', identifier: 'all-categories' }
  ];
  
  for (const test of tests) {
    try {
      const params = new URLSearchParams(test);
      const url = `${API_BASE_URL}?${params.toString()}`;
      console.log(`\n📡 Testing: ${test.type} - ${test.identifier}`);
      console.log(`URL: ${url}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('✅ Found SEO data:');
        console.log('  Title:', data.data.title || 'NOT SET');
        console.log('  Description:', data.data.description || 'NOT SET');
        console.log('  Type:', data.data.type);
        console.log('  Identifier:', data.data.identifier);
        console.log('  All fields:', Object.keys(data.data));
      } else {
        console.log('❌ No SEO data found');
      }
    } catch (error) {
      console.error(`❌ Error testing ${test.type}:`, error.message);
    }
  }
}

testSeoData().catch(console.error);
