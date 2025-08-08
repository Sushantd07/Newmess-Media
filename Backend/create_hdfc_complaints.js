import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
import Subcategory from './src/models/Subcategory.js';
import ComplaintsTab from './src/models/tabs/Complaint.tabs.js';

// Read the HDFC complaints data
const complaintsData = JSON.parse(fs.readFileSync('./hdfc_complaints_data.json', 'utf8'));

async function createHDFCComplaints() {
  try {
    console.log('🚀 Starting HDFC complaints creation...');

    // Find HDFC company by slug
    const hdfcCompany = await Subcategory.findOne({
      $or: [
        { slug: 'hdfc-bank' },
        { id: 'hdfc-bank' },
        { name: { $regex: /hdfc/i } }
      ]
    });

    if (!hdfcCompany) {
      console.error('❌ HDFC company not found!');
      console.log('Available companies:');
      const companies = await Subcategory.find({}, 'name slug id');
      companies.forEach(company => {
        console.log(`- ${company.name} (slug: ${company.slug}, id: ${company.id})`);
      });
      return;
    }

    console.log(`✅ Found HDFC company: ${hdfcCompany.name} (slug: ${hdfcCompany.slug})`);

    // Check if complaints tab already exists
    if (hdfcCompany.tabs.complaints) {
      console.log('⚠️  Complaints tab already exists, updating...');
      
      // Update existing complaints tab
      await ComplaintsTab.findByIdAndUpdate(
        hdfcCompany.tabs.complaints,
        complaintsData,
        { new: true }
      );
      
      console.log('✅ Complaints tab updated successfully!');
    } else {
      console.log('📝 Creating new complaints tab...');
      
      // Create new complaints tab
      const complaintsTab = await ComplaintsTab.create(complaintsData);
      
      // Link to company
      hdfcCompany.tabs.complaints = complaintsTab._id;
      await hdfcCompany.save();
      
      console.log('✅ Complaints tab created and linked successfully!');
    }

    // Verify the data
    await hdfcCompany.populate('tabs.complaints');
    console.log('📊 Complaints tab data:');
    console.log(`- Tab Title: ${hdfcCompany.tabs.complaints.tabTitle}`);
    console.log(`- Methods: ${hdfcCompany.tabs.complaints.complaintMethods?.methods?.length || 0} methods`);
    console.log(`- Escalation Levels: ${hdfcCompany.tabs.complaints.escalationLevels?.levels?.length || 0} levels`);
    console.log(`- Regional Offices: ${hdfcCompany.tabs.complaints.regionalNodalOfficers?.table?.rows?.length || 0} offices`);
    console.log(`- FAQs: ${hdfcCompany.tabs.complaints.faqs?.questions?.length || 0} questions`);

    console.log('🎉 HDFC complaints setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error creating HDFC complaints:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
createHDFCComplaints(); 