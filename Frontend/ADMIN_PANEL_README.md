# Admin Panel Documentation

## Overview
The admin panel provides a user-friendly interface for managing categories and companies without needing to use Postman or write code. It's designed to be non-coder friendly with intuitive forms and real-time feedback.

## Access
Navigate to `/admin` in your browser to access the admin panel.

## Features

### 1. Dashboard
- Overview of system statistics
- Quick action buttons
- Recent activity feed

### 2. Category Manager (`/admin/categories`)
Create and manage categories with the following features:

#### Creating a Category
1. **Basic Information**
   - Category Name (required) - Auto-generates slug
   - Description - Optional detailed description
   - Icon - Choose from predefined emoji icons
   - Color - Select from color palette
   - Display Order - Numeric order for sorting

2. **SEO Information**
   - Meta Title - For search engine optimization
   - Meta Description - SEO description
   - Keywords - Add multiple keywords (press Enter to add each)

3. **Settings**
   - Active - Toggle category visibility
   - Featured - Mark as featured category

#### Features
- Auto-generated slug from category name
- Real-time form validation
- Success/error message display
- List of existing categories with status indicators

### 3. Company Manager (`/admin/companies`)
Create and manage company pages with comprehensive data:

#### Creating a Company
1. **Basic Information** (Required)
   - Company Name - Auto-generates ID and slug
   - Phone Number - Primary contact number
   - Category - Select from existing categories
   - Logo Path - Path to company logo
   - Address - Company address
   - Operating Hours - Business hours
   - Tags - Add multiple tags (press Enter to add each)
   - Display Order - Numeric order for sorting
   - Verified/Active toggles

2. **Company Details**
   - Company Name (Full) - Complete legal name
   - Main Phone - Alternative contact number
   - Website - Company website URL
   - Founded Year - Year of establishment
   - Headquarters - Main office location
   - Parent Company - Parent organization
   - Rating - Customer rating (0-5)
   - Total Reviews - Number of reviews
   - Monthly Searches - Search volume
   - Description - Detailed company description

#### Features
- Auto-generated ID and slug from company name
- Category dropdown populated from database
- Tag management with visual tags
- Form validation and error handling
- Success confirmation with form reset

### 4. Complaint Editor (`/admin/complaint-editor`)
- Coming soon feature for managing complaints

## User-Friendly Features

### For Non-Coders
1. **No Code Required**: All operations through simple forms
2. **Auto-Generation**: IDs and slugs generated automatically
3. **Visual Feedback**: Success/error messages for all actions
4. **Intuitive Layout**: Organized sections with clear labels
5. **Dropdown Menus**: Pre-populated options where possible
6. **Real-time Validation**: Immediate feedback on form errors

### Easy Data Entry
1. **Smart Defaults**: Pre-filled common values
2. **Tag System**: Easy tag addition with Enter key
3. **Visual Indicators**: Status badges and icons
4. **Responsive Design**: Works on all screen sizes
5. **Clear Navigation**: Sidebar with active page highlighting

## API Integration
The admin panel uses the same backend APIs you were using with Postman:

- **Categories**: `POST /api/categories/create`
- **Companies**: `POST /api/subcategories/create-company-page`

## Technical Details

### Frontend Technologies
- React 19 with hooks
- Tailwind CSS for styling
- React Router for navigation
- Fetch API for backend communication

### Backend Requirements
- Backend server running on `http://localhost:3000`
- CORS enabled for frontend communication
- MongoDB database connection

## Getting Started

1. **Start Backend Server**
   ```bash
   cd Backend
   npm start
   ```

2. **Start Frontend Development Server**
   ```bash
   cd Frontend/Main_Website
   npm run dev
   ```

3. **Access Admin Panel**
   - Open browser and go to `http://localhost:5173/admin`
   - Or whatever port your Vite dev server is running on

## Example Usage

### Creating a Banking Category
1. Go to `/admin/categories`
2. Fill in:
   - Name: "Banking"
   - Description: "Financial services and banking institutions"
   - Icon: 🏦
   - Color: Blue
   - Keywords: "bank, finance, money, loans"
3. Click "Create Category"

### Creating ICICI Bank Company
1. Go to `/admin/companies`
2. Fill in:
   - Company Name: "ICICI Bank"
   - Phone: "1800-1080"
   - Category: Select "Banking" from dropdown
   - Logo: "/company-logos/Bank/icici_bank.svg"
   - Description: "ICICI Bank is one of India's leading private sector banks..."
   - Website: "https://www.icicibank.com"
   - Founded: "1994"
   - Headquarters: "Mumbai, Maharashtra"
3. Click "Create Company"

## Troubleshooting

### Common Issues
1. **Backend Connection Error**: Ensure backend server is running on port 3000
2. **CORS Errors**: Check backend CORS configuration
3. **Form Validation Errors**: Check required fields and data formats
4. **Category Not Found**: Create category first before adding companies

### Error Messages
- **Network Error**: Backend server not running or connection issues
- **Validation Error**: Check required fields and data formats
- **Duplicate Error**: ID or slug already exists in database

## Future Enhancements
- Bulk import functionality
- Image upload for logos
- Advanced search and filtering
- User management and permissions
- Audit logs for changes
- Export functionality 