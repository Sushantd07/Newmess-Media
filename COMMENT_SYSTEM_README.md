# Comment System Implementation

## Overview
A complete, scalable comment system with image upload functionality, built with React frontend and Node.js/Express backend.

## Features

### ✅ Backend Features
- **RESTful API** with proper error handling
- **MongoDB** integration with Mongoose ODM
- **Image Upload** with Cloudinary integration
- **Image Compression** to 300KB using Sharp
- **Pagination** for scalable comment loading
- **Search functionality** across comments and replies
- **Like/Dislike system** with real-time updates
- **Reply system** with official reply support
- **Statistics** for comments, likes, replies, etc.
- **Proper indexing** for performance optimization

### ✅ Frontend Features
- **Real-time comment posting** with image upload
- **Drag & drop** image upload support
- **Image preview** with modal view
- **Infinite scroll** pagination
- **Search comments** functionality
- **Like/Dislike** buttons with real-time updates
- **Reply system** with nested comments
- **Responsive design** with modern UI
- **Loading states** and error handling
- **Comment statistics** display

## Backend Structure

### Models
```
Backend/src/models/Comment.js
```
- User name, content, images
- Page ID and page type (company/category/subcategory)
- Likes, dislikes, replies
- Timestamps and virtual fields for formatted dates
- Database indexes for performance

### Controllers
```
Backend/src/controllers/commentController.js
```
- `createComment` - Create new comment with image upload
- `getComments` - Get paginated comments for a page
- `addReply` - Add reply to existing comment
- `updateReaction` - Update like/dislike count
- `deleteComment` - Delete comment and associated images
- `getCommentStats` - Get comment statistics
- `searchComments` - Search across comments and replies

### Routes
```
Backend/src/routes/commentRoutes.js
```
- `POST /api/comments/create` - Create comment
- `GET /api/comments/page/:pageId` - Get comments
- `POST /api/comments/:commentId/reply` - Add reply
- `PATCH /api/comments/:commentId/reaction` - Update reaction
- `DELETE /api/comments/:commentId` - Delete comment
- `GET /api/comments/stats/:pageId` - Get statistics
- `GET /api/comments/search/:pageId` - Search comments

### Middleware
```
Backend/src/middleware/imageCompression.js
```
- Compresses images to 300KB using Sharp
- Resizes images to max 800x800px
- Converts to JPEG format for optimization

### Utilities
```
Backend/src/utils/cloudinary.js
```
- Cloudinary integration for image storage
- Automatic image optimization
- Secure URL generation

## Frontend Integration

### Component Usage
```jsx
import CommentSection from './components/CommentSection';

// In your page component
<CommentSection 
  pageId="hdfc-bank-123" 
  pageType="company" 
/>
```

### Props
- `pageId` (required): Unique identifier for the page
- `pageType` (optional): Type of page ('company', 'category', 'subcategory')

### API Integration
The component automatically:
- Fetches comments on mount
- Handles real-time updates
- Manages pagination
- Handles image uploads
- Provides search functionality

## Installation & Setup

### Backend Dependencies
```bash
cd Backend
npm install cloudinary multer sharp
```

### Environment Variables
Create `.env` file in Backend directory:
```
PORT=4000
MONGODB_URL=mongodb://localhost:27017
CORS_ORIGIN=http://localhost:5173
```

### Cloudinary Configuration
The system uses the provided Cloudinary credentials:
- Cloud Name: dzewb6t64
- API Key: 832381689355839
- API Secret: JZbls_2MQ4mpGnXVTVPwS1wGkrU

## API Endpoints

### Create Comment
```http
POST /api/comments/create
Content-Type: multipart/form-data

{
  "userName": "John Doe",
  "content": "Great service!",
  "pageId": "hdfc-bank-123",
  "pageType": "company",
  "images": [File1, File2] // Optional, max 2 files
}
```

### Get Comments
```http
GET /api/comments/page/hdfc-bank-123?pageType=company&page=1&limit=10
```

### Add Reply
```http
POST /api/comments/commentId/reply
Content-Type: application/json

{
  "userName": "Support Team",
  "content": "Thank you for your feedback!",
  "isOfficial": true
}
```

### Update Reaction
```http
PATCH /api/comments/commentId/reaction
Content-Type: application/json

{
  "type": "like" // or "dislike"
}
```

### Search Comments
```http
GET /api/comments/search/hdfc-bank-123?pageType=company&query=service&page=1&limit=10
```

### Get Statistics
```http
GET /api/comments/stats/hdfc-bank-123?pageType=company
```

## Performance Optimizations

### Database Indexes
- `{ pageId: 1, createdAt: -1 }` - Fast comment retrieval
- `{ createdAt: -1 }` - Global comment sorting
- `{ pageId: 1, pageType: 1 }` - Page-specific queries

### Image Optimization
- Automatic compression to 300KB
- Progressive JPEG encoding
- Cloudinary transformations
- Lazy loading in frontend

### Frontend Optimizations
- Pagination to limit initial load
- Debounced search
- Optimistic updates for reactions
- Image lazy loading

## Scalability Features

### Backend
- Pagination prevents memory issues
- Database indexes for fast queries
- Image compression reduces storage
- Cloudinary CDN for global image delivery

### Frontend
- Infinite scroll for large comment lists
- Search with debouncing
- Optimistic UI updates
- Error boundaries and retry logic

## Error Handling

### Backend
- Proper HTTP status codes
- Detailed error messages
- Input validation
- File upload validation

### Frontend
- Loading states
- Error messages
- Retry mechanisms
- Graceful degradation

## Security Features

### Backend
- File type validation
- File size limits
- Input sanitization
- CORS configuration

### Frontend
- XSS prevention
- File validation
- Secure image handling

## Testing

Run the test script to verify functionality:
```bash
cd Backend
node test-comments.js
```

## Usage Examples

### Basic Comment Section
```jsx
<CommentSection pageId="company-123" pageType="company" />
```

### With Custom Styling
```jsx
<div className="my-custom-container">
  <CommentSection 
    pageId="category-456" 
    pageType="category" 
  />
</div>
```

## Troubleshooting

### Common Issues
1. **Images not uploading**: Check Cloudinary credentials
2. **Comments not loading**: Verify MongoDB connection
3. **CORS errors**: Check CORS configuration
4. **File size errors**: Ensure images are under 5MB

### Debug Mode
Enable debug logging in the backend by setting:
```javascript
console.log('Debug:', data);
```

## Future Enhancements

- [ ] User authentication system
- [ ] Comment moderation tools
- [ ] Email notifications
- [ ] Rich text editor
- [ ] Comment threading
- [ ] Analytics dashboard
- [ ] Mobile app integration

## Support

For issues or questions, check the console logs and verify:
1. Backend server is running
2. MongoDB is connected
3. Cloudinary credentials are correct
4. Frontend API URL is correct 