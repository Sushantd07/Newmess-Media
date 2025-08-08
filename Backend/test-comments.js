// Simple test script for comment system
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000/api';

async function testCommentSystem() {
  console.log('Testing Comment System...\n');

  try {
    // Test 1: Create a comment
    console.log('1. Testing comment creation...');
    const formData = new FormData();
    formData.append('userName', 'Test User');
    formData.append('content', 'This is a test comment from the backend!');
    formData.append('pageId', 'test-page-123');
    formData.append('pageType', 'company');

    const createResponse = await fetch(`${API_BASE_URL}/comments/create`, {
      method: 'POST',
      body: formData
    });

    const createData = await createResponse.json();
    console.log('Create response:', createData);

    if (createData.success) {
      console.log('✅ Comment created successfully!');
      
      // Test 2: Get comments
      console.log('\n2. Testing comment retrieval...');
      const getResponse = await fetch(`${API_BASE_URL}/comments/page/test-page-123?pageType=company&page=1&limit=10`);
      const getData = await getResponse.json();
      console.log('Get response:', getData);

      if (getData.success) {
        console.log('✅ Comments retrieved successfully!');
        console.log(`Found ${getData.data.length} comments`);
      }

      // Test 3: Get stats
      console.log('\n3. Testing stats retrieval...');
      const statsResponse = await fetch(`${API_BASE_URL}/comments/stats/test-page-123?pageType=company`);
      const statsData = await statsResponse.json();
      console.log('Stats response:', statsData);

      if (statsData.success) {
        console.log('✅ Stats retrieved successfully!');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCommentSystem(); 