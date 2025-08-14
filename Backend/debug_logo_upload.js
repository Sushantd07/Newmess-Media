import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug the logo upload issue
const debugLogoUpload = async () => {
  try {
    console.log('🔍 Debugging Logo Upload Issue...');
    
    // Check if uploads/logos directory exists
    const uploadDir = path.join(__dirname, 'uploads', 'logos');
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating uploads/logos directory...');
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    console.log('✅ Upload directory ready');
    
    // Check if all middleware files exist
    const middlewareFiles = [
      'src/middleware/logoUpload.js',
      'src/middleware/logoCompression.js',
      'src/utils/logoCloudinary.js'
    ];
    
    console.log('\n📁 Checking middleware files:');
    for (const file of middlewareFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
      } else {
        console.log(`❌ ${file} - MISSING`);
      }
    }
    
    // Check if routes are properly configured
    console.log('\n🔧 Checking route configuration:');
    const subcategoryRoutesPath = path.join(__dirname, 'src', 'routes', 'subcategoryRoutes.js');
    if (fs.existsSync(subcategoryRoutesPath)) {
      const routesContent = fs.readFileSync(subcategoryRoutesPath, 'utf8');
      if (routesContent.includes('logoUpload.single')) {
        console.log('✅ Logo upload middleware configured in subcategory routes');
      } else {
        console.log('❌ Logo upload middleware NOT configured in subcategory routes');
      }
    }
    
    // Check if controller has proper error handling
    console.log('\n🎯 Checking controller error handling:');
    const controllerPath = path.join(__dirname, 'src', 'controllers', 'subcategoryController.js');
    if (fs.existsSync(controllerPath)) {
      const controllerContent = fs.readFileSync(controllerPath, 'utf8');
      if (controllerContent.includes('console.log(\'Received request body\'')) {
        console.log('✅ Debug logging added to controller');
      } else {
        console.log('❌ Debug logging NOT found in controller');
      }
    }
    
    console.log('\n🐛 Common Issues to Check:');
    console.log('1. Make sure the backend server is running on port 3000');
    console.log('2. Check if the frontend is sending the correct FormData');
    console.log('3. Verify that the logo file is being properly attached');
    console.log('4. Check browser console for any CORS or network errors');
    console.log('5. Verify that the logo file meets size and format requirements');
    
    console.log('\n📝 Debug Steps:');
    console.log('1. Open browser developer tools (F12)');
    console.log('2. Go to Network tab');
    console.log('3. Try to create a company with logo upload');
    console.log('4. Check the request to /api/subcategories/create-company-page');
    console.log('5. Verify the request contains FormData with logo file');
    console.log('6. Check the response for detailed error messages');
    
    console.log('\n🔧 Backend Debug Info:');
    console.log('• Backend should be running on: http://localhost:3000');
    console.log('• Logo upload endpoint: POST /api/subcategories/create-company-page');
    console.log('• File size limit: 5MB');
    console.log('• Allowed formats: SVG, PNG, JPG, JPEG');
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  }
};

debugLogoUpload();
