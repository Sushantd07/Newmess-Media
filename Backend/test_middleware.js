import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test the middleware setup
const testMiddleware = async () => {
  try {
    console.log('🧪 Testing Logo Upload Middleware...');
    
    // Check if uploads/logos directory exists
    const uploadDir = path.join(__dirname, 'uploads', 'logos');
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating uploads/logos directory...');
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log('✅ Upload directory exists:', uploadDir);
    
    // Test if we can import the middleware
    try {
      const logoUpload = await import('./src/middleware/logoUpload.js');
      console.log('✅ Logo upload middleware imported successfully');
    } catch (error) {
      console.log('❌ Error importing logo upload middleware:', error.message);
    }
    
    // Test if we can import the compression middleware
    try {
      const compressLogo = await import('./src/middleware/logoCompression.js');
      console.log('✅ Logo compression middleware imported successfully');
    } catch (error) {
      console.log('❌ Error importing logo compression middleware:', error.message);
    }
    
    // Test if we can import the Cloudinary utility
    try {
      const logoCloudinary = await import('./src/utils/logoCloudinary.js');
      console.log('✅ Logo Cloudinary utility imported successfully');
    } catch (error) {
      console.log('❌ Error importing logo Cloudinary utility:', error.message);
    }
    
    // Check if Sharp is working
    try {
      const sharp = await import('sharp');
      console.log('✅ Sharp library imported successfully');
    } catch (error) {
      console.log('❌ Error importing Sharp:', error.message);
    }
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Make sure your backend server is running on port 3000');
    console.log('2. Try creating a company with logo upload');
    console.log('3. Check the backend console for detailed error messages');
    console.log('4. If you see any import errors above, install missing dependencies');
    
  } catch (error) {
    console.error('❌ Error during middleware test:', error);
  }
};

testMiddleware();
