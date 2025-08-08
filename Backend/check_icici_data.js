// Check ICICI Bank data in database
import mongoose from 'mongoose';
import Subcategory from './src/models/Subcategory.js';
import StructuredComplaints from './src/models/StructuredComplaints.js';

async function checkICICIData() {
  try {
    console.log('🔍 Checking ICICI Bank data...');
    
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/NumbersDB');
    console.log('✅ Connected to database');
    
    // Find ICICI companies
    const iciciCompanies = await Subcategory.find({
      name: { $regex: /icici/i }
    });
    
    console.log('\n🏦 ICICI Companies found:');
    iciciCompanies.forEach(company => {
      console.log(`  - Name: ${company.name}`);
      console.log(`    Slug: ${company.slug}`);
      console.log(`    ID: ${company._id}`);
    });
    
    // Find all structured complaints
    const allComplaints = await StructuredComplaints.find()
      .populate('companyPageId', 'name slug');
    
    console.log('\n📋 All Structured Complaints:');
    allComplaints.forEach(complaint => {
      console.log(`  - Company: ${complaint.companyPageId?.name || 'Unknown'}`);
      console.log(`    Company ID: ${complaint.companyPageId?._id || 'Unknown'}`);
      console.log(`    Content Length: ${complaint.richTextContent?.length || 0} characters`);
      console.log(`    Last Updated: ${complaint.updatedAt}`);
      console.log('    ---');
    });
    
    // Check if ICICI has complaints data
    const iciciComplaints = allComplaints.filter(complaint => 
      complaint.companyPageId?.name?.toLowerCase().includes('icici')
    );
    
    console.log('\n🎯 ICICI Complaints Data:');
    if (iciciComplaints.length > 0) {
      iciciComplaints.forEach(complaint => {
        console.log(`  ✅ Found complaints data for: ${complaint.companyPageId.name}`);
        console.log(`    Content: ${complaint.richTextContent?.substring(0, 100)}...`);
      });
    } else {
      console.log('  ❌ No complaints data found for ICICI Bank');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

checkICICIData();
