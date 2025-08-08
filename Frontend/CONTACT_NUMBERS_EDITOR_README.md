# Contact Numbers Editor - Admin Panel

A comprehensive, dynamic admin panel for editing contact numbers tabs with full flexibility and real-time editing capabilities.

## Features

### 🎯 Core Features
- **Dynamic Section Management**: Edit all 14 sections of contact numbers
- **Real-time Editing**: Live preview and instant updates
- **Flexible Data Structure**: Support for complex nested data
- **Color Customization**: Visual customization for contact cards
- **Table Editors**: Dynamic table creation and management
- **Responsive Design**: Works on all screen sizes

### 📋 Supported Sections
1. **Top Contact Cards** - Featured contact numbers with custom styling
2. **National Numbers** - Country-wide contact information
3. **Helpline Numbers** - Emergency and support numbers
4. **All India Numbers** - Pan-India contact details
5. **Service-wise Numbers** - Service-specific contact information
6. **State-wise Numbers** - Regional contact details
7. **SMS Services** - SMS-based services
8. **IVR Menu** - Interactive voice response options
9. **Quick Links** - Important links and resources
10. **Email Support** - Email-based support channels
11. **NRI Phone Banking** - International customer support
12. **Missed Call Service** - Missed call services
13. **Customer Care List** - Customer care contacts
14. **Additional Tables** - Custom tables for specific needs

## Installation & Setup

### 1. Backend Setup
The backend API endpoints are already configured:

```javascript
// Routes available in Backend/src/routes/companyPageRoutes.js
PUT /api/company-pages/:slug/contact-numbers  // Update contact numbers
GET /api/company-pages/:slug/tab/numbers      // Get contact numbers
POST /api/company-pages/:slug/add-contact-numbers // Create new contact numbers
```

### 2. Frontend Integration
The Contact Numbers Editor is integrated into the existing admin panel:

```javascript
// Import the editor
import ContactNumbersEditor from './components/admin/ContactNumbersEditor';

// Use in your component
<ContactNumbersEditor
  contactData={contactData}
  onSave={handleSave}
  onCancel={handleCancel}
  isVisible={showEditor}
/>
```

## Usage Guide

### Basic Usage

1. **Open the Editor**:
   ```javascript
   const handleOpenEditor = () => {
     setShowContactNumbersEditor(true);
   };
   ```

2. **Handle Save**:
   ```javascript
   const handleSave = async (contactData) => {
     try {
       await updateContactNumbers(companySlug, contactData);
       setShowContactNumbersEditor(false);
     } catch (error) {
       console.error('Error saving:', error);
     }
   };
   ```

3. **Handle Cancel**:
   ```javascript
   const handleCancel = () => {
     setShowContactNumbersEditor(false);
   };
   ```

### Advanced Usage

#### Custom Section Editors
You can create custom editors for specific sections:

```javascript
// Example: Custom SMS Services Editor
const SmsServicesEditor = ({ items, onUpdate }) => {
  // Your custom editor logic
  return (
    <div>
      {/* Custom SMS services editing interface */}
    </div>
  );
};
```

#### Data Structure
The contact numbers data follows this structure:

```javascript
{
  tabTitle: "Contact Numbers",
  tabDescription: "Customer care, helpline, toll-free numbers",
  
  topContactCards: {
    heading: {
      key: "topContactCards",
      text: "Top Contact Cards",
      subText: "Most important contact numbers"
    },
    cards: [
      {
        title: "Customer Care",
        number: "1800-123-4567",
        subtitle: "24x7 Support",
        icon: "Phone",
        colors: {
          cardBg: "#ffffff",
          iconBg: "#3b82f6",
          textColor: "#1f2937"
        }
      }
    ]
  },
  
  helplineNumbersSection: {
    heading: { /* heading data */ },
    table: {
      headers: ["Service", "Number", "Timing"],
      rows: [
        ["General Support", "1800-123-4567", "24x7"],
        ["Technical Support", "1800-987-6543", "9 AM - 6 PM"]
      ]
    }
  }
  // ... other sections
}
```

## API Integration

### Service Functions
Use the provided service functions for API calls:

```javascript
import { 
  getContactNumbers, 
  updateContactNumbers, 
  createContactNumbersTab 
} from '../services/contactNumbersService';

// Get contact numbers
const contactData = await getContactNumbers(companySlug);

// Update contact numbers
await updateContactNumbers(companySlug, contactData);

// Create new contact numbers tab
await createContactNumbersTab(companySlug, contactData);
```

### Error Handling
The editor includes comprehensive error handling:

```javascript
const handleSave = async (contactData) => {
  try {
    await updateContactNumbers(companySlug, contactData);
    // Success handling
  } catch (error) {
    console.error('Error saving contact numbers:', error);
    // Error handling - show user-friendly message
  }
};
```

## Customization

### Styling
The editor uses Tailwind CSS classes and can be customized:

```css
/* Custom styles for the editor */
.contact-numbers-editor {
  @apply bg-white rounded-xl shadow-2xl;
}

.contact-numbers-sidebar {
  @apply bg-gray-50 border-r border-gray-200;
}
```

### Adding New Sections
To add a new section:

1. **Update the sidebar navigation**:
   ```javascript
   const sections = [
     // ... existing sections
     { id: 'newSection', label: 'New Section', icon: NewIcon }
   ];
   ```

2. **Add the section editor**:
   ```javascript
   {activeSection === 'newSection' && (
     <SectionWrapper id="newSection" title="New Section" icon={NewIcon}>
       <NewSectionEditor />
     </SectionWrapper>
   )}
   ```

3. **Create the editor component**:
   ```javascript
   const NewSectionEditor = ({ data, onUpdate }) => {
     // Your custom editor logic
   };
   ```

## Testing

### Demo Component
Use the provided test component to explore features:

```javascript
import ContactNumbersTest from './components/admin/ContactNumbersTest';

// Add to your routes
<Route path="/contact-numbers-test" element={<ContactNumbersTest />} />
```

### Sample Data
The test component includes sample data for all sections to demonstrate functionality.

## Best Practices

### 1. Data Validation
Always validate data before saving:

```javascript
const validateContactData = (data) => {
  // Add your validation logic
  if (!data.tabTitle) {
    throw new Error('Tab title is required');
  }
  return true;
};
```

### 2. Error Handling
Implement proper error handling:

```javascript
const handleSave = async (data) => {
  try {
    validateContactData(data);
    await updateContactNumbers(companySlug, data);
    showSuccessMessage('Contact numbers updated successfully');
  } catch (error) {
    showErrorMessage(error.message);
  }
};
```

### 3. Performance
For large datasets, consider implementing:

- Lazy loading for sections
- Debounced save operations
- Optimistic updates

### 4. Accessibility
The editor includes accessibility features:

- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels

## Troubleshooting

### Common Issues

1. **Editor not opening**:
   - Check if `isVisible` prop is set to `true`
   - Verify `contactData` is properly passed

2. **Save not working**:
   - Check API endpoint configuration
   - Verify data structure matches backend expectations
   - Check network connectivity

3. **Styling issues**:
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts

### Debug Mode
Enable debug mode for troubleshooting:

```javascript
const DEBUG_MODE = process.env.NODE_ENV === 'development';

if (DEBUG_MODE) {
  console.log('Contact Numbers Editor Debug:', {
    contactData,
    isVisible,
    activeSection
  });
}
```

## Contributing

### Adding New Features
1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit pull request

### Code Style
- Use functional components with hooks
- Follow existing naming conventions
- Add proper TypeScript types (if using TS)
- Include JSDoc comments for complex functions

## Support

For issues and questions:
1. Check this documentation
2. Review the test component
3. Check console for error messages
4. Verify API endpoints are working

## License

This component is part of the main project and follows the same license terms. 