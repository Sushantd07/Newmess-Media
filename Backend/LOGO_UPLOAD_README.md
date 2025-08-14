# Company Logo Upload Feature

This document describes the implementation of the company logo upload feature for the admin panel.

## Overview

The logo upload feature allows admins to upload company logos (SVG, PNG, JPG, JPEG) to Cloudinary with automatic compression for image files and direct upload for SVG files.

## Architecture

### Files Created/Modified

1. **`src/middleware/logoUpload.js`** - Multer middleware for logo file uploads
2. **`src/middleware/logoCompression.js`** - Image compression middleware (skips SVG)
3. **`src/utils/logoCloudinary.js`** - Cloudinary upload utility for logos
4. **`src/models/CompanyPage.js`** - Updated to include logo fields
5. **`src/controllers/companyPageController.js`** - Added logo upload/delete functions
6. **`src/routes/companyPageRoutes.js`** - Added logo upload routes

## Features

### ✅ File Validation
- Accepts only SVG, PNG, JPG, JPEG files
- 5MB file size limit
- Single file upload per request

### ✅ Smart Compression
- **PNG/JPG/JPEG**: Compressed to 400x400px max, 85% quality
- **SVG**: Uploaded directly without compression
- Automatic format conversion to JPEG for images

### ✅ Cloudinary Integration
- Uploads to `company-logos` folder
- Stores `secure_url` and `public_id` in MongoDB
- Automatic cleanup of old logos when replacing

### ✅ Database Schema
```javascript
logo: {
  url: String,      // Cloudinary secure_url
  publicId: String  // Cloudinary public_id for deletion
}
```

## API Endpoints

### Upload Logo
```
POST /api/company-pages/:slug/upload-logo
Content-Type: multipart/form-data

Body:
- logo: File (SVG, PNG, JPG, JPEG)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logo": {
      "url": "https://res.cloudinary.com/.../company-logos/...",
      "publicId": "company-logos/..."
    }
  },
  "message": "Logo uploaded successfully"
}
```

### Delete Logo
```
DELETE /api/company-pages/:slug/delete-logo
```

**Response:**
```json
{
  "success": true,
  "message": "Logo deleted successfully"
}
```

## Usage Examples

### Frontend Implementation (React)

```javascript
// Upload logo
const uploadLogo = async (slug, file) => {
  const formData = new FormData();
  formData.append('logo', file);
  
  const response = await fetch(`/api/company-pages/${slug}/upload-logo`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.data.logo.url; // Return logo URL for preview
};

// Delete logo
const deleteLogo = async (slug) => {
  const response = await fetch(`/api/company-pages/${slug}/delete-logo`, {
    method: 'DELETE'
  });
  
  return await response.json();
};
```

### File Input Component
```jsx
const LogoUpload = ({ slug, onLogoUpload }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const logoUrl = await uploadLogo(slug, file);
        onLogoUpload(logoUrl);
      } catch (error) {
        console.error('Logo upload failed:', error);
      }
    }
  };

  return (
    <input
      type="file"
      accept=".svg,.png,.jpg,.jpeg"
      onChange={handleFileChange}
    />
  );
};
```

## Error Handling

The system handles various error scenarios:

- **Invalid file type**: Returns 400 with error message
- **File too large**: Returns 400 with size limit error
- **Company not found**: Returns 404
- **Cloudinary upload failure**: Returns 500 with error details
- **Compression failure**: Falls back to original file

## Production Considerations

### ✅ Environment Compatibility
- Works on both local development and Hostinger production
- No configuration changes needed between environments
- Uses existing Cloudinary credentials

### ✅ Performance
- Automatic image compression reduces bandwidth
- SVG files remain vector-based for crisp scaling
- Efficient file cleanup after upload

### ✅ Security
- File type validation prevents malicious uploads
- File size limits prevent abuse
- Secure Cloudinary URLs for public access

## Testing

Run the test script to verify functionality:
```bash
node test_logo_upload.js
```

## Troubleshooting

### Common Issues

1. **Upload fails**: Check file size and format
2. **Compression errors**: Verify Sharp installation
3. **Cloudinary errors**: Check API credentials
4. **File not found**: Ensure uploads/logos directory exists

### Debug Logs
The system provides detailed console logs for:
- File upload progress
- Compression status
- Cloudinary upload results
- Error details

## Future Enhancements

Potential improvements:
- Multiple logo sizes (thumbnail, medium, large)
- Logo cropping/positioning tools
- Batch logo upload for multiple companies
- Logo versioning/history
- CDN optimization settings
