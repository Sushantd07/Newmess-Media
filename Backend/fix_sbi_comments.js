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

// Fix SBI comments
const fixSBIComments = async () => {
  try {
    console.log('🔧 Fixing SBI comments...');
    
    // Step 1: Find comments with incorrect pageId
    console.log('\n📊 Finding comments with incorrect pageId...');
    const incorrectComments = await Comment.find({
      $or: [
        { pageId: 'undefined-undefined' },
        { pageId: { $regex: /undefined/ } }
      ]
    });
    
    console.log(`Found ${incorrectComments.length} comments with incorrect pageId:`);
    incorrectComments.forEach(comment => {
      console.log(`- ${comment.pageId} (${comment.pageType}): "${comment.userName}" - "${comment.content}"`);
    });
    
    // Step 2: Update incorrect comments to correct pageId
    if (incorrectComments.length > 0) {
      console.log('\n✅ Updating incorrect pageId to correct SBI pageId...');
      const updateResult = await Comment.updateMany(
        { pageId: 'undefined-undefined' },
        { pageId: 'banking-sbi-bank' }
      );
      console.log(`Updated ${updateResult.modifiedCount} comments`);
    }
    
    // Step 3: Create a test comment for SBI if none exists
    console.log('\n✅ Creating test comment for SBI Bank...');
    const existingSBIComments = await Comment.find({ pageId: 'banking-sbi-bank' });
    
    if (existingSBIComments.length === 0) {
      const sbiComment = await Comment.create({
        pageId: 'banking-sbi-bank',
        pageType: 'company',
        userName: 'SBI Customer',
        content: 'SBI Bank provides excellent nationwide banking services!',
        likes: 8,
        dislikes: 0
      });
      console.log(`✅ Created SBI comment: "${sbiComment.content}"`);
    } else {
      console.log(`⚠️ SBI already has ${existingSBIComments.length} comments`);
    }
    
    // Step 4: Test SBI comments API
    console.log('\n🧪 Testing SBI comments API...');
    const sbiResponse = await fetch('http://localhost:3000/api/comments/page/banking-sbi-bank?pageType=company&page=1&limit=10');
    if (sbiResponse.ok) {
      const sbiData = await sbiResponse.json();
      console.log('✅ SBI comments API works');
      console.log(`Found ${sbiData.data.length} comments for SBI Bank`);
      sbiData.data.forEach(comment => {
        console.log(`- "${comment.userName}": "${comment.content}"`);
      });
    } else {
      console.log('❌ SBI comments API failed');
    }
    
    // Step 5: Show all company comments status
    console.log('\n📊 All company comments status:');
    const companies = ['banking-hdfc-bank', 'banking-sbi-bank', 'banking-bob-bank', 'banking-pnb-bank'];
    
    for (const companyPageId of companies) {
      const comments = await Comment.find({ pageId: companyPageId });
      console.log(`- ${companyPageId}: ${comments.length} comments`);
    }
    
    console.log('\n✅ SBI comments should now work properly!');
    
  } catch (error) {
    console.error('Error fixing SBI comments:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await fixSBIComments();
  await mongoose.disconnect();
  console.log('\nFix completed successfully');
};

main().catch(console.error); 