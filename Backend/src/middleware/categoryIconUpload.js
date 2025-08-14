import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure multer for category icon uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure public category-icons directory exists
    const uploadDir = './public/category-icons';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a clean filename for the category icon
    const categoryName = req.body.categoryName || 'category';
    const cleanName = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `icon-${cleanName}-${uniqueSuffix}.svg`);
  }
});

const categoryIconUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024, // 100KB limit for SVG files
    files: 1 // Only 1 file for icon
  },
  fileFilter: (req, file, cb) => {
    // Only allow SVG files for category icons
    if (file.mimetype === 'image/svg+xml' || file.originalname.toLowerCase().endsWith('.svg')) {
      cb(null, true);
    } else {
      cb(new Error('Only SVG files are allowed for category icons!'), false);
    }
  }
});

export default categoryIconUpload;
