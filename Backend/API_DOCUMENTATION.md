# API Documentation

## Base URL
```
http://localhost:4000/api
```

## 📋 Table of Contents
1. [Company Pages](#company-pages)
2. [Tab Management](#tab-management)
3. [Categories](#categories)
4. [Subcategories](#subcategories)

---

## 🏢 Company Pages

### Base Path: `/api/company-pages`

#### Create Company Page
```http
POST /api/company-pages/create
```
**Body:**
```json
{
  "categoryId": "banking",
  "subCategoryId": "private-banks",
  "slug": "hdfc-bank",
  "name": "HDFC Bank",
  "logo": "/company-logos/Bank/hdfc_bank.svg",
  "description": "Leading private sector bank in India",
  "rating": 4.5,
  "totalReviews": 1250,
  "monthlySearches": "50K+",
  "founded": "1994",
  "headquarters": "Mumbai, Maharashtra",
  "website": "https://www.hdfcbank.com",
  "parentCompany": "HDFC Group"
}
```

#### Get All Company Pages
```http
GET /api/company-pages?page=1&limit=10&categoryId=banking&subCategoryId=private-banks
```

#### Get Company Page by Slug
```http
GET /api/company-pages/hdfc-bank
```

#### Update Company Page
```http
PUT /api/company-pages/hdfc-bank
```

#### Delete Company Page
```http
DELETE /api/company-pages/hdfc-bank
```

#### Search Company Pages
```http
GET /api/company-pages/search?q=hdfc&categoryId=banking
```

#### Get Company Pages by Category
```http
GET /api/company-pages/category/banking
GET /api/company-pages/category/banking/private-banks
```

#### Get Specific Tab Data
```http
GET /api/company-pages/hdfc-bank/tab/numbers
GET /api/company-pages/hdfc-bank/tab/complaints
GET /api/company-pages/hdfc-bank/tab/quickhelp
GET /api/company-pages/hdfc-bank/tab/video
GET /api/company-pages/hdfc-bank/tab/overview
```

---

## 📑 Tab Management

### Base Path: `/api/tabs`

#### Contact Numbers Tab

**Create Contact Numbers Tab**
```http
POST /api/tabs/contact-numbers
```

**Get Contact Numbers Tab**
```http
GET /api/tabs/contact-numbers/:id
```

**Update Contact Numbers Tab**
```http
PUT /api/tabs/contact-numbers/:id
```

#### Complaints Tab

**Create Complaints Tab**
```http
POST /api/tabs/complaints
```

**Get Complaints Tab**
```http
GET /api/tabs/complaints/:id
```

**Update Complaints Tab**
```http
PUT /api/tabs/complaints/:id
```

#### Quick Help Tab

**Create Quick Help Tab**
```http
POST /api/tabs/quick-help
```

**Get Quick Help Tab**
```http
GET /api/tabs/quick-help/:id
```

**Update Quick Help Tab**
```http
PUT /api/tabs/quick-help/:id
```

#### Overview Tab

**Create Overview Tab**
```http
POST /api/tabs/overview
```

**Get Overview Tab**
```http
GET /api/tabs/overview/:id
```

**Update Overview Tab**
```http
PUT /api/tabs/overview/:id
```

#### Video Guide Tab

**Create Video Guide Tab**
```http
POST /api/tabs/video-guide
```

**Get Video Guide Tab**
```http
GET /api/tabs/video-guide/:id
```

**Update Video Guide Tab**
```http
PUT /api/tabs/video-guide/:id
```

#### Delete Any Tab
```http
DELETE /api/tabs/:tabType/:id
```
**tabType options:** `contact-numbers`, `complaints`, `quick-help`, `overview`, `video-guide`

---

## 📂 Categories

### Base Path: `/api/categories`

#### Create Category
```http
POST /api/categories/create
```

#### Get All Categories
```http
GET /api/categories
```

#### Get Categories with Subcategories
```http
GET /api/categories/with-subcategories
```

---

## 📁 Subcategories

### Base Path: `/api/subcategories`

#### Create Subcategory
```http
POST /api/subcategories/create
```

#### Get Subcategories by Category
```http
GET /api/subcategories/category/:categoryId
```

---

## 🔧 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

---

## 📝 Example Usage

### Creating a Complete Company Page

1. **Create Tab Data First:**
```http
POST /api/tabs/contact-numbers
POST /api/tabs/complaints
POST /api/tabs/quick-help
POST /api/tabs/overview
POST /api/tabs/video-guide
```

2. **Create Company Page with Tab References:**
```http
POST /api/company-pages/create
```
```json
{
  "categoryId": "banking",
  "subCategoryId": "private-banks",
  "slug": "hdfc-bank",
  "name": "HDFC Bank",
  "tabs": {
    "numbers": "contactNumbersTabId",
    "complaints": "complaintsTabId",
    "quickhelp": "quickHelpTabId",
    "video": "videoGuideTabId",
    "overview": "overviewTabId"
  }
}
```

3. **Fetch Complete Company Page:**
```http
GET /api/company-pages/hdfc-bank
```

---

## 🚀 Quick Start Examples

### Get HDFC Bank Contact Numbers
```http
GET /api/company-pages/hdfc-bank/tab/numbers
```

### Search for Banking Companies
```http
GET /api/company-pages/search?q=bank&categoryId=banking
```

### Get All Private Banks
```http
GET /api/company-pages/category/banking/private-banks
```

### Update Company Rating
```http
PUT /api/company-pages/hdfc-bank
```
```json
{
  "rating": 4.8,
  "totalReviews": 1500
}
``` 