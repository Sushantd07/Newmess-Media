# Enhanced Tab Management System

## Overview

This document describes the complete enhanced tab management system that allows admins to manage tabs in full edit mode with automatic database synchronization. The system provides a seamless experience for viewing existing tabs from the database and adding new tabs that are automatically saved.

## 🚀 Key Features

### ✅ **Database Integration**
- Automatically fetches existing tabs from the current company page
- Supports both standard tabs (contact numbers, complaints, etc.) and custom tabs
- Real-time synchronization between frontend and backend
- Efficient API calls with optimized data fetching

### ✅ **Admin Full Edit Mode**
- Shows all existing tabs in an organized interface
- Displays tab type (standard vs custom), status, and order
- Real-time updates when tabs are modified
- Visual indicators for tab changes and sync status

### ✅ **Live Tab Management**
- Add new tabs instantly through the sidebar
- Edit existing tab names and properties
- Delete custom tabs (standard tabs are protected)
- Changes automatically sync to the database

### ✅ **Enhanced User Experience**
- Loading states and error handling
- Visual feedback for all operations
- Confirmation dialogs for destructive actions
- Responsive design for all screen sizes

## 🏗️ Architecture

### Backend Components

#### 1. **Tab Controller** (`Backend/src/controllers/tabController.js`)
- Handles all tab CRUD operations
- Supports both CompanyPage and Subcategory models
- Manages standard and custom tabs
- Provides bulk operations for efficiency

#### 2. **Tab Routes** (`Backend/src/routes/tabRoutes.js`)
- RESTful API endpoints for tab management
- Integrated with existing Express app
- Supports all standard HTTP methods

#### 3. **Dynamic Tab Model**
- Flexible schema for custom tabs
- Metadata support for icons, descriptions
- Company association and ordering

### Frontend Components

#### 1. **TabManagementContext** (`Frontend/src/contexts/TabManagementContext.jsx`)
- Global state management for tabs
- API integration with automatic sync
- Event-driven updates for loose coupling
- Error handling and loading states

#### 2. **Enhanced Tab Service** (`Frontend/src/services/tabService.js`)
- Comprehensive API client for tab operations
- Data validation and transformation
- Helper methods for common operations
- Error handling and retry logic

#### 3. **EnhancedCompanyPageEditor** (`Frontend/src/components/admin/EnhancedCompanyPageEditor.jsx`)
- Full-featured company page editor
- Integrated tab management
- Real-time tab synchronization
- Professional admin interface

#### 4. **Enhanced EditableSidebar** (`Frontend/src/components/admin/EditableSidebar.jsx`)
- Extended with tab management capabilities
- Toggle between content and tab modes
- Integration with global context
- Live preview of changes

## 🔌 API Endpoints

### Base URL: `/api/tabs`

#### Get Company Tabs
```http
GET /company/:companyId
```
**Response:**
```json
{
  "success": true,
  "message": "Company tabs fetched successfully",
  "data": {
    "companyInfo": {
      "id": "company_id",
      "slug": "company-slug",
      "name": "Company Name"
    },
    "tabs": [
      {
        "id": "tab_id",
        "type": "standard|custom",
        "label": "Tab Label",
        "icon": "IconName",
        "data": {},
        "isActive": true,
        "order": 1
      }
    ],
    "totalTabs": 5
  }
}
```

#### Create New Tab
```http
POST /company/:companyId
```
**Request Body:**
```json
{
  "tabId": "unique-tab-id",
  "tabTitle": "Tab Title",
  "tabType": "custom",
  "content": {},
  "order": 10,
  "metadata": {
    "icon": "FileText",
    "description": "Tab description",
    "isVisible": true
  }
}
```

#### Update Tab
```http
PUT /company/:companyId/:tabId
```

#### Delete Tab
```http
DELETE /company/:companyId/:tabId
```

#### Bulk Operations
```http
POST /company/:companyId/bulk
```

## 💻 Usage Examples

### Basic Integration in Admin Panel

```jsx
import { TabManagementProvider, useTabManagement } from '../contexts/TabManagementContext';
import EnhancedCompanyPageEditor from '../components/admin/EnhancedCompanyPageEditor';

const AdminPanel = () => {
  const [companyData, setCompanyData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <TabManagementProvider>
      {showEditor && (
        <EnhancedCompanyPageEditor
          companyData={companyData}
          isVisible={showEditor}
          onSave={async (data) => {
            await saveCompanyData(data);
            setShowEditor(false);
          }}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </TabManagementProvider>
  );
};
```

### Using Tab Management Context

```jsx
const MyComponent = () => {
  const { 
    tabs, 
    fetchTabs, 
    addTab, 
    updateTab, 
    deleteTab, 
    isLoading, 
    error 
  } = useTabManagement();

  useEffect(() => {
    fetchTabs('company-id');
  }, []);

  const handleAddTab = async () => {
    try {
      await addTab({
        label: 'New Tab',
        icon: 'FileText',
        content: {}
      });
    } catch (error) {
      console.error('Failed to add tab:', error);
    }
  };

  return (
    <div>
      {tabs.map(tab => (
        <div key={tab.id}>{tab.label}</div>
      ))}
      <button onClick={handleAddTab}>Add Tab</button>
    </div>
  );
};
```

### Direct API Usage

```jsx
import tabService from '../services/tabService';

const MyComponent = () => {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    try {
      const response = await tabService.getCompanyTabs('company-id');
      setTabs(response.data.tabs);
    } catch (error) {
      console.error('Error loading tabs:', error);
    }
  };

  const createNewTab = async () => {
    try {
      const tabData = tabService.createTabData(
        'new-tab-id',
        'New Tab Title',
        {
          icon: 'FileText',
          content: { sections: [] }
        }
      );

      await tabService.createTab('company-id', tabData);
      await loadTabs(); // Refresh tabs
    } catch (error) {
      console.error('Error creating tab:', error);
    }
  };
};
```

## 🎯 Integration with Existing Company Pages

### Step 1: Wrap Your App with Context Provider

```jsx
// App.jsx
import { TabManagementProvider } from './contexts/TabManagementContext';

function App() {
  return (
    <TabManagementProvider>
      <Routes>
        {/* Your existing routes */}
      </Routes>
    </TabManagementProvider>
  );
}
```

### Step 2: Update Company Page Components

```jsx
// pages/CompanyPage.jsx
import { useTabManagement } from '../contexts/TabManagementContext';

const CompanyPage = () => {
  const { fetchTabs, tabs } = useTabManagement();
  const { companySlug } = useParams();

  useEffect(() => {
    if (companySlug) {
      fetchTabs(companySlug);
    }
  }, [companySlug, fetchTabs]);

  return (
    <div>
      {/* Render tabs dynamically */}
      {tabs.map(tab => (
        <TabContent key={tab.id} tab={tab} />
      ))}
    </div>
  );
};
```

### Step 3: Enable Admin Features

```jsx
// admin/CompanyManager.jsx
import EnhancedCompanyPageEditor from './EnhancedCompanyPageEditor';

const CompanyManager = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      {/* Company list */}
      <CompanyList onEdit={(company) => {
        setSelectedCompany(company);
        setShowEditor(true);
      }} />

      {/* Enhanced editor */}
      {showEditor && (
        <EnhancedCompanyPageEditor
          companyData={selectedCompany}
          isVisible={showEditor}
          onSave={handleSave}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};
```

## 🔧 Configuration

### Environment Variables

Add to your `.env` file:

```env
# API Configuration
API_BASE_URL=http://localhost:3000/api
TABS_CACHE_DURATION=300000  # 5 minutes

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your-database
```

### API Configuration

Update your API base URL in the tab service:

```javascript
// services/tabService.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + '/tabs' || '/api/tabs';
```

## 🎨 Customization

### Custom Tab Types

Add custom tab types to the backend:

```javascript
// controllers/tabController.js
const CUSTOM_TAB_TYPES = {
  'gallery': 'Image Gallery',
  'documents': 'Document Library',
  'reviews': 'Customer Reviews',
  'news': 'News & Updates'
};
```

### Custom Icons

Add custom icons to the frontend:

```javascript
// services/tabService.js
const AVAILABLE_ICONS = {
  FileText,
  Phone,
  HelpCircle,
  PlayCircle,
  BarChart,
  Image,
  Download,
  Star,
  Newspaper
};
```

### Custom Styling

Override default styles:

```css
/* Custom tab management styles */
.tab-manager-container {
  --tab-primary-color: #your-brand-color;
  --tab-secondary-color: #your-secondary-color;
}

.tab-item-custom {
  background: var(--tab-primary-color);
  color: white;
}
```

## 🧪 Testing

### Demo Page

Visit the demo page to test all features:
```
http://localhost:5173/live-tab-editing-demo
```

### Test Scenarios

1. **Basic Tab Management**
   - Add new tabs
   - Edit tab names
   - Delete custom tabs
   - Reorder tabs

2. **Database Integration**
   - Fetch existing tabs
   - Sync changes to database
   - Handle API errors gracefully

3. **Admin Interface**
   - Open enhanced editor
   - View tab overview
   - Save changes with tab updates

4. **Error Handling**
   - Network failures
   - Invalid data
   - Permission errors

## 🐛 Troubleshooting

### Common Issues

#### Tabs Not Loading
```javascript
// Check console for API errors
console.log('API Base URL:', API_BASE_URL);
console.log('Company ID:', companyId);

// Verify API endpoint
fetch('/api/tabs/company/test-id')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Context Not Working
```javascript
// Ensure provider wraps your components
<TabManagementProvider>
  <YourComponent />
</TabManagementProvider>

// Check context availability
const context = useTabManagement();
console.log('Context available:', !!context);
```

#### Database Connection Issues
```javascript
// Backend - check MongoDB connection
import mongoose from 'mongoose';
console.log('MongoDB connection state:', mongoose.connection.readyState);
```

### Performance Optimization

#### Reduce API Calls
```javascript
// Use React Query for caching
import { useQuery } from 'react-query';

const { data: tabs, isLoading } = useQuery(
  ['company-tabs', companyId],
  () => tabService.getCompanyTabs(companyId),
  { 
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  }
);
```

#### Optimize Re-renders
```javascript
// Use React.memo for tab components
const TabItem = React.memo(({ tab }) => {
  return <div>{tab.label}</div>;
});
```

## 📚 Advanced Features

### Tab Templates
Create predefined tab templates:

```javascript
const TAB_TEMPLATES = {
  'contact-support': {
    label: 'Contact & Support',
    icon: 'Phone',
    content: {
      sections: ['phone-numbers', 'email-support', 'live-chat']
    }
  },
  'service-guide': {
    label: 'Service Guide',
    icon: 'HelpCircle',
    content: {
      sections: ['how-to-guides', 'faqs', 'video-tutorials']
    }
  }
};
```

### Tab Analytics
Track tab usage and performance:

```javascript
const trackTabView = (tabId, companyId) => {
  analytics.track('tab_viewed', {
    tab_id: tabId,
    company_id: companyId,
    timestamp: Date.now()
  });
};
```

### Bulk Tab Operations
Manage multiple tabs efficiently:

```javascript
const bulkUpdateTabs = async (operations) => {
  const response = await tabService.bulkUpdateTabs(companyId, operations);
  return response;
};

// Usage
await bulkUpdateTabs([
  { type: 'create', tabId: 'tab1', tabTitle: 'New Tab 1' },
  { type: 'update', tabId: 'tab2', tabTitle: 'Updated Tab 2' },
  { type: 'delete', tabId: 'tab3' }
]);
```

## 🚀 Deployment

### Production Checklist

- [ ] Update API URLs for production
- [ ] Set up MongoDB indexes for performance
- [ ] Configure CORS for your domain
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable API rate limiting
- [ ] Set up backup procedures for tab data
- [ ] Test all features in production environment

### Monitoring

Set up monitoring for the tab management system:

```javascript
// Monitor API performance
const apiMonitor = {
  trackRequest: (endpoint, duration, success) => {
    console.log(`API ${endpoint}: ${duration}ms ${success ? 'SUCCESS' : 'FAILED'}`);
  }
};
```

This enhanced tab management system provides a complete solution for managing company page tabs with full database integration, real-time updates, and a professional admin interface. The system is designed to be scalable, maintainable, and user-friendly.


