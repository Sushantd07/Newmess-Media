// Simple test script for SEO API
const testSeoAPI = async () => {
  try {
    // Test GET endpoint
    console.log('🔍 Testing GET endpoint...');
    const getResponse = await fetch('http://localhost:3000/api/seo?type=company&identifier=jp-morgan&tab=contactnumber');
    const getData = await getResponse.json();
    console.log('✅ GET Response:', getData);
    
    // Test POST endpoint
    console.log('\n🔍 Testing POST endpoint...');
    const postData = {
      type: 'company',
      identifier: 'jp-morgan',
      tab: 'contactnumber',
      title: 'JP Morgan Customer Care - Updated Title',
      description: 'Updated description for JP Morgan customer care page',
      keywords: ['jp morgan', 'customer care', 'contact'],
      robots: 'index,follow',
      lang: 'en'
    };
    
    console.log('📤 Sending data:', postData);
    
    const postResponse = await fetch('http://localhost:3000/api/seo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    
    const postResult = await postResponse.json();
    console.log('✅ POST Response:', postResult);
    
    // Test GET again to see if data was updated
    console.log('\n🔍 Testing GET endpoint again to verify update...');
    const getResponse2 = await fetch('http://localhost:3000/api/seo?type=company&identifier=jp-morgan&tab=contactnumber');
    const getData2 = await getResponse2.json();
    console.log('✅ GET Response after update:', getData2);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testSeoAPI();

