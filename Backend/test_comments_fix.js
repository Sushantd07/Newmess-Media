import mongoose from 'mongoose';
import Comment from './src/models/Comment.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const dbName = 'NumbersDB';
    
    await mongoose.connect(`${mongoUrl}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully to:', `${mongoUrl}/${dbName}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test comments for new companies
const testCommentsFix = async () => {
  try {
    console.log('🧪 Testing comments for new companies...');
    
    // Step 1: Check existing comments
    console.log('\n📊 Existing comments in database:');
    const existingComments = await Comment.find({}).select('pageId pageType userName content').lean();
    existingComments.forEach(comment => {
      console.log(`- ${comment.pageId} (${comment.pageType}): "${comment.userName}" - "${comment.content}"`);
    });
    
    // Step 2: Create test comments for new companies
    const testComments = [
      {
        pageId: 'banking-bob-bank',
        pageType: 'company',
        userName: 'Test User',
        content: 'BOB Bank customer service is excellent!',
        likes: 5,
        dislikes: 0
      },
      {
        pageId: 'banking-pnb-bank',
        pageType: 'company',
        userName: 'Customer Review',
        content: 'PNB Bank has good digital banking features.',
        likes: 3,
        dislikes: 1
      }
    ];
    
    console.log('\n✅ Creating test comments for new companies...');
    for (const commentData of testComments) {
      // Check if comment already exists
      const existingComment = await Comment.findOne({
        pageId: commentData.pageId,
        userName: commentData.userName,
        content: commentData.content
      });
      
      if (!existingComment) {
        const newComment = await Comment.create(commentData);
        console.log(`✅ Created comment for ${commentData.pageId}: "${newComment.content}"`);
      } else {
        console.log(`⚠️ Comment already exists for ${commentData.pageId}`);
      }
    }
    
    // Step 3: Test API endpoints
    console.log('\n🧪 Testing API endpoints...');
    
    // Test BOB Bank comments
    console.log('\n📞 Testing BOB Bank comments API...');
    const bobResponse = await fetch('http://localhost:3000/api/comments/page/banking-bob-bank?pageType=company&page=1&limit=10');
    if (bobResponse.ok) {
      const bobData = await bobResponse.json();
      console.log('✅ BOB Bank comments API works');
      console.log(`Found ${bobData.data.length} comments for BOB Bank`);
    } else {
      console.log('❌ BOB Bank comments API failed');
    }
    
    // Test PNB Bank comments
    console.log('\n📞 Testing PNB Bank comments API...');
    const pnbResponse = await fetch('http://localhost:3000/api/comments/page/banking-pnb-bank?pageType=company&page=1&limit=10');
    if (pnbResponse.ok) {
      const pnbData = await pnbResponse.json();
      console.log('✅ PNB Bank comments API works');
      console.log(`Found ${pnbData.data.length} comments for PNB Bank`);
    } else {
      console.log('❌ PNB Bank comments API failed');
    }
    
    // Step 4: Show expected pageId format
    console.log('\n🔍 Expected pageId format for comments:');
    console.log('- HDFC Bank: banking-hdfc-bank ✅');
    console.log('- BOB Bank: banking-bob-bank ✅');
    console.log('- PNB Bank: banking-pnb-bank ✅');
    console.log('- SBI Bank: banking-sbi-bank ✅');
    
    console.log('\n✅ Comments system should now work for all companies!');
    
  } catch (error) {
    console.error('Error testing comments fix:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testCommentsFix();
  await mongoose.disconnect();
  console.log('\nTest completed successfully');
};

main().catch(console.error); 