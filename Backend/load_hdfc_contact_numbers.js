import mongoose from 'mongoose';
import ContactNumbersTab from './src/models/tabs/ContactNumbers.tabs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Load HDFC contact numbers data
const loadHDFCContactNumbers = async () => {
  try {
    // Read the HDFC contact numbers data
    const dataPath = path.join(__dirname, 'hdfc_contact_numbers_data.json');
    const hdfcData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log('Loading HDFC contact numbers data...');
    
    // Check if HDFC contact numbers already exist
    const existingContactNumbers = await ContactNumbersTab.findOne({
      tabTitle: { $regex: /HDFC/i }
    });
    
    if (existingContactNumbers) {
      console.log('HDFC contact numbers already exist. Updating...');
      const updated = await ContactNumbersTab.findByIdAndUpdate(
        existingContactNumbers._id,
        hdfcData,
        { new: true }
      );
      console.log('HDFC contact numbers updated successfully with ID:', updated._id);
    } else {
      console.log('Creating new HDFC contact numbers...');
      const newContactNumbers = await ContactNumbersTab.create(hdfcData);
      console.log('HDFC contact numbers created successfully with ID:', newContactNumbers._id);
    }
    
    console.log('HDFC contact numbers data loaded successfully!');
    
    // Test the API endpoint
    console.log('\nTesting API endpoint...');
    console.log('You can now test the API at: http://localhost:3000/api/tabs/contact-numbers');
    
  } catch (error) {
    console.error('Error loading HDFC contact numbers:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await loadHDFCContactNumbers();
  await mongoose.disconnect();
  console.log('Script completed successfully');
};

main().catch(console.error); 