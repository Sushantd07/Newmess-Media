# Canva-Style Contact Numbers Editor

A powerful, drag-and-drop visual editor for managing contact numbers on company pages, providing a Canva-like editing experience with full flexibility for admins.

## 🎯 Features

### Core Functionality
- **Drag & Drop Reordering**: Reorder components by dragging them up or down
- **Visual Component Selection**: Click any component to select and edit it
- **Real-time Preview**: Toggle between edit and preview modes
- **Component Management**: Add, edit, duplicate, and delete components
- **Live Editing**: Edit content directly on the page with visual feedback

### Component Types Supported
- **Top Contact Cards**: Colorful cards with icons and contact numbers
- **Helpline Numbers**: Structured tables with service categories
- **All India Numbers**: Comprehensive contact number listings
- **SMS Services**: SMS command listings with descriptions
- **Generic Tables**: Flexible table components for any data

### Admin Controls
- **Component Toolbar**: Quick actions for each component (move, edit, delete)
- **Add Component Panel**: Add new components from the toolbar
- **Context Menus**: Right-click context menus for additional actions
- **Save/Cancel**: Save changes or cancel editing session

## 🚀 Getting Started

### Prerequisites
- React 19+
- Framer Motion (for animations)
- Lucide React (for icons)
- Tailwind CSS (for styling)

### Installation
The editor is already integrated into the project. No additional installation required.

### Usage

#### 1. Access the Editor
```javascript
// From admin mode in CompanyPage
<AdminToggle 
  onOpenCanvaEditor={() => setShowCanvaEditor(true)}
  // ... other props
/>
```

#### 2. Open the Editor
- Enable admin mode on any company page
- Click the "Canva Editor" button in the admin toolbar
- The editor will open in full-screen mode

#### 3. Edit Components
- **Reorder**: Drag components up or down to change their position
- **Select**: Click any component to select it
- **Edit**: Use the toolbar buttons or context menu to edit
- **Add**: Use the "Add Component" toolbar to add new sections

#### 4. Save Changes
- Click "Save Changes" to persist your edits
- Click "Cancel" to discard changes

## 📁 File Structure

```
src/
├── components/
│   └── admin/
│       ├── CanvaStyleEditor.jsx          # Main editor component
│       ├── AdminToggle.jsx               # Admin mode toggle (updated)
│       └── InlineEditor.jsx              # Inline editing component
├── pages/
│   ├── CompanyPage.jsx                   # Company page (updated)
│   └── CanvaEditorTest.jsx              # Test page for editor
└── services/
    └── contactNumbersService.js         # API service functions
```

## 🔧 Component Architecture

### CanvaStyleEditor
The main editor component that provides:
- Full-screen editing interface
- Drag-and-drop functionality using Framer Motion
- Component rendering and management
- State management for editing data

### Key Props
```javascript
<CanvaStyleEditor
  contactData={contactNumbersData}        // Current contact data
  onSave={handleCanvaSave}               // Save handler
  onCancel={() => setShowCanvaEditor(false)} // Cancel handler
  isVisible={showCanvaEditor}            // Visibility state
/>
```

### State Management
```javascript
const [editingData, setEditingData] = useState(contactData || {});
const [selectedComponent, setSelectedComponent] = useState(null);
const [componentOrder, setComponentOrder] = useState([]);
const [previewMode, setPreviewMode] = useState(false);
```

## 🎨 Styling & Theming

### Design System
- **Colors**: Blue, green, purple, orange, red color schemes for cards
- **Icons**: Lucide React icons for visual elements
- **Typography**: Tailwind CSS classes for consistent text styling
- **Spacing**: Consistent padding and margins using Tailwind utilities

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly drag and drop
- Adaptive component sizing

## 🔌 API Integration

### Save Handler
```javascript
const handleCanvaSave = async (updatedContactData) => {
  try {
    const response = await fetch(`/api/subcategories/company-page/${companyId}/contact-numbers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContactData)
    });
    
    if (response.ok) {
      // Update local state and show success message
    }
  } catch (error) {
    // Handle error
  }
};
```

### Data Structure
The editor expects contact data in this format:
```javascript
{
  topContactCards: {
    heading: { text: 'Title', subText: 'Subtitle' },
    cards: [
      { title: 'Card Title', number: '123-456-7890', subtitle: 'Description' }
    ]
  },
  helplineNumbersSection: {
    heading: { text: 'Title', subText: 'Subtitle' },
    table: {
      headers: ['Column 1', 'Column 2'],
      rows: [['Data 1', 'Data 2']]
    }
  }
  // ... other sections
}
```

## 🧪 Testing

### Test Page
Access the test page at `/canva-editor-test` to:
- See the editor in action with sample data
- Test all features without affecting real data
- Understand the component structure

### Manual Testing Checklist
- [ ] Drag and drop reordering works
- [ ] Component selection highlights correctly
- [ ] Preview mode shows final result
- [ ] Save functionality persists changes
- [ ] Cancel functionality discards changes
- [ ] Responsive design works on mobile
- [ ] Copy functionality works for phone numbers

## 🚀 Performance Optimizations

### Framer Motion
- Uses `layout` prop for smooth animations
- `Reorder.Group` and `Reorder.Item` for drag-and-drop
- Optimized re-renders with proper key props

### React Optimizations
- Memoized component rendering
- Efficient state updates
- Proper cleanup on unmount

## 🔒 Security Considerations

### Input Validation
- Validate phone number formats
- Sanitize user input
- Prevent XSS attacks

### Admin Access
- Only accessible in admin mode
- Proper authentication checks
- API endpoint protection

## 🐛 Troubleshooting

### Common Issues

#### Drag and Drop Not Working
- Ensure Framer Motion is installed
- Check that components have proper `key` props
- Verify `Reorder.Group` and `Reorder.Item` usage

#### Components Not Rendering
- Check data structure matches expected format
- Verify component IDs are unique
- Ensure proper state initialization

#### Save Not Working
- Check API endpoint is correct
- Verify authentication headers
- Check network connectivity

### Debug Mode
Enable debug logging by setting:
```javascript
const DEBUG_MODE = true;
```

## 📈 Future Enhancements

### Planned Features
- [ ] Undo/Redo functionality
- [ ] Component templates
- [ ] Bulk editing operations
- [ ] Export/Import functionality
- [ ] Advanced styling options
- [ ] Component library
- [ ] Version history
- [ ] Collaborative editing

### Performance Improvements
- [ ] Virtual scrolling for large datasets
- [ ] Lazy loading of components
- [ ] Optimized re-rendering
- [ ] Caching strategies

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Navigate to `/canva-editor-test` to test

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety (future)
- Write comprehensive tests

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit pull request

## 📄 License

This project is part of the main application and follows the same license terms.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the test page at `/canva-editor-test`
3. Check console for error messages
4. Contact the development team

---

**Note**: This editor is designed to provide a Canva-like experience for managing contact numbers, with full flexibility for admins to customize the layout and content as needed. 