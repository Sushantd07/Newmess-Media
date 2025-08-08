# 🏢 Company Page Creation Guide

This guide explains how to create new company pages that will automatically work with the "View More" button on the home page.

## 🎯 What This System Does

1. **Creates company page** with basic information (hero section)
2. **Empty tabs** initially (contact numbers, complaints, etc.)
3. **"View More" button** automatically redirects to the company page
4. **SEO-friendly URLs** (no ObjectIds in the URL)
5. **Automatic tab linking** when you add tab data later

## 📋 Prerequisites

- Backend server running on `http://localhost:3000`
- Frontend server running on `http://localhost:5173`
- MongoDB connected

## 🚀 How to Create a New Company Page

### Method 1: Using JSON Template (Recommended)

1. **Copy the template:**
   ```bash
   cp company_template.json my_company.json
   ```

2. **Edit the JSON file** with your company details:
   ```json
   {
     "id": "my-company-id",
     "name": "My Company Name",
     "slug": "my-company-slug",
     "phone": "1800-XXX-XXXX",
     "logo": "/company-logos/my-logo.svg",
     "verified": true,
     "isActive": true,
     "tags": ["Category", "Subcategory", "Service Type"],
     "address": "All India",
     "timing": "24x7",
     "parentCategory": "banking-services",
     "order": 1,
     "description": "Your company description here...",
     "companyName": "Your Full Company Name",
     "mainPhone": "1800-XXX-XXXX",
     "website": "https://www.yourcompany.com",
     "founded": "YYYY",
     "headquarters": "City, State",
     "parentCompany": "Parent Company Name",
     "rating": 4.0,
     "totalReviews": 1000,
     "monthlySearches": "10K"
   }
   ```

3. **Run the creation script:**
   ```bash
   node create_company_from_json.js my_company.json
   ```

### Method 2: Using the Generic Script

1. **Edit the `create_company_page.js` file** and add your company data to the `companies` array
2. **Run the script:**
   ```bash
   node create_company_page.js
   ```

## ✅ What Happens After Creation

1. **Company page is created** in the database
2. **Empty tabs** are initialized (numbers, complaints, quickhelp, video, overview)
3. **API endpoints** are tested automatically
4. **Routes are displayed** for you to test

## 🌐 Available Routes

After creation, you'll get two routes:

1. **SEO-friendly route:**
   ```
   http://localhost:5173/category/banking-services/my-company-slug/contactnumber
   ```

2. **ObjectId route (fallback):**
   ```
   http://localhost:5173/company/[object-id]/contactnumber
   ```

## 🏠 Home Page Integration

The company will automatically appear on the home page in the category grid, and the "View More" button will redirect to the SEO-friendly route.

## 📊 Adding Tab Data Later

### Contact Numbers Tab
1. Create contact numbers data in the `ContactNumbersTab` collection
2. Link it to the company using the `link_hdfc_contact_numbers.js` script as a template

### Other Tabs
1. Create data in respective tab collections (Complaints, QuickHelp, etc.)
2. Update the company's `tabs` object to link the data

## 🔧 Example: Creating BOB Bank

```bash
# BOB Bank was already created as an example
# You can test it by visiting:
http://localhost:5173/category/banking-services/bob-bank/contactnumber
```

## 🎯 Key Features

- ✅ **SEO-friendly URLs** (no ObjectIds)
- ✅ **Automatic home page integration**
- ✅ **Empty tabs ready for data**
- ✅ **API endpoints tested**
- ✅ **Both route types supported**
- ✅ **Easy to create new companies**

## 🚨 Important Notes

1. **Category must exist** before creating a company
2. **Slug must be unique** across all companies
3. **Logo path** should point to an existing file
4. **Tabs start empty** - add data separately
5. **"View More" button** uses SEO-friendly route by default

## 🆘 Troubleshooting

### Company not appearing on home page
- Check if `isActive: true`
- Verify the category slug matches
- Ensure the company is in the correct category

### "View More" button not working
- Check browser console for errors
- Verify the company slug is correct
- Ensure the frontend is using the latest code

### API not working
- Check if backend server is running
- Verify MongoDB connection
- Check if company was created successfully 