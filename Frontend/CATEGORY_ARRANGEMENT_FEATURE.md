# Category Company Ordering Feature

## Overview
The Category Company Ordering feature allows administrators to reorder subcategory cards (companies) within each category. This provides control over the display order of companies on the frontend category grid.

## 🎯 **Key Features**

### **Company Reordering**
- **Drag and drop** companies to reorder them
- **Up/down arrows** for precise positioning
- **Real-time preview** of the new order
- **Persistent ordering** saved to database

### **Visual Interface**
- **Interactive list** of companies with position numbers
- **Drag handles** for easy reordering
- **Live preview** showing frontend layout
- **Position indicators** showing current order

### **Easy Management**
- **One-click access** from category headers
- **Immediate visual feedback** during reordering
- **Non-destructive** - doesn't delete or modify company data
- **Database persistence** - order is saved permanently

## 🚀 **How to Use**

### **Accessing the Feature**
1. Go to **Company Manager** in the admin panel
2. Find the category you want to reorder in the "Existing Companies" section
3. Click the **"Arrange Order"** button (blue button with settings icon)
4. The arrangement modal will open

### **Reordering Companies**
1. **Drag and Drop**: Click and drag companies to new positions
2. **Arrow Buttons**: Use up/down arrows for precise movement
3. **Preview**: See exactly how the order will look on frontend
4. **Save**: Click "Save Company Order" to apply changes

### **Understanding the Interface**
- **Position Numbers**: Shows current order (1, 2, 3, etc.)
- **Company Cards**: Displays company name and phone number
- **Drag Handles**: Hover to see drag cursor
- **Arrow Controls**: Up/down buttons for fine-tuning

## 📊 **Technical Implementation**

### **Frontend Components**
```javascript
// State management
const [showArrangementModal, setShowArrangementModal] = useState(false);
const [selectedCategoryForArrangement, setSelectedCategoryForArrangement] = useState(null);
const [companyOrder, setCompanyOrder] = useState({});

// Functions
const handleOpenArrangementModal = (category) => {
  setSelectedCategoryForArrangement(category);
  setShowArrangementModal(true);
};

const handleCompanyOrderChange = (categoryId, companyId, newIndex) => {
  // Update the order array
  setCompanyOrder(prev => {
    const currentOrder = prev[categoryId] || [];
    const newOrder = [...currentOrder];
    // Remove and reinsert at new position
    const currentIndex = newOrder.indexOf(companyId);
    if (currentIndex > -1) {
      newOrder.splice(currentIndex, 1);
    }
    newOrder.splice(newIndex, 0, companyId);
    return { ...prev, [categoryId]: newOrder };
  });
};

const handleSaveCategoryArrangement = async () => {
  // Update company order in database
  const orderedCompanyIds = companyOrder[categoryId] || [];
  const updatePromises = orderedCompanyIds.map((companyId, index) => 
    fetch(`/api/subcategories/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify({ order: index + 1 })
    })
  );
  await Promise.all(updatePromises);
};
```

### **Backend API**
```javascript
// Route: PUT /api/subcategories/:id
export const updateSubcategory = async (req, res) => {
  const { order } = req.body;
  
  // Update the company's order
  const subcategory = await Subcategory.findByIdAndUpdate(
    req.params.id,
    { order },
    { new: true }
  );
  
  res.json({
    success: true,
    message: 'Company order updated successfully'
  });
};
```

### **Database Schema**
```javascript
// Subcategory Model (Company)
order: {
  type: Number,
  default: 0,
}
```

## 🎨 **Frontend Integration**

### **CategoryGrid Component Usage**
The frontend CategoryGrid component should sort companies by order:

```javascript
// In CategoryGrid component
const getOrderedCompanies = (companies) => {
  return companies.sort((a, b) => (a.order || 0) - (b.order || 0));
};

// Usage
const orderedCompanies = getOrderedCompanies(category.companies);
```

### **Responsive Layout**
- **Mobile**: 2 columns
- **Tablet**: 3 columns  
- **Desktop**: 4 columns
- **Large Desktop**: 5+ columns

## 📱 **User Experience Benefits**

### **For Administrators**
- **Order Control**: Customize the sequence of companies
- **Priority Management**: Put important companies first
- **Visual Organization**: Create logical groupings
- **Easy Reordering**: Intuitive drag-and-drop interface

### **For End Users**
- **Predictable Order**: Companies appear in consistent sequence
- **Better Discovery**: Important companies appear first
- **Logical Flow**: Related companies grouped together
- **Professional Layout**: Organized, curated appearance

## 🔧 **Configuration Options**

### **Ordering Methods**
- **Drag and Drop**: Click and drag to reorder
- **Arrow Controls**: Use up/down buttons for precision
- **Position Numbers**: Visual indicators of current order
- **Live Preview**: See changes immediately

### **Order Persistence**
- **Database Storage**: Order saved permanently
- **Session Persistence**: Order maintained across sessions
- **Category Specific**: Each category has its own order
- **Real-time Updates**: Changes reflect immediately

## 📈 **Use Cases**

### **Featured Companies**
- **Order**: 1-3 positions
- **Purpose**: Highlight important companies
- **Example**: "Popular Banks", "Top Services"

### **Logical Grouping**
- **Order**: Group related companies together
- **Purpose**: Create logical flow
- **Example**: Government services, Banking categories

### **Priority Management**
- **Order**: Most important first
- **Purpose**: Guide user attention
- **Example**: Emergency services, Popular brands

### **Alphabetical Order**
- **Order**: A-Z sequence
- **Purpose**: Easy scanning
- **Example**: Complete company listings

## 🛠 **Best Practices**

### **Setting Order**
1. **Start with Priority**: Put most important companies first
2. **Group Related**: Keep similar companies together
3. **Consider User Flow**: Order based on user journey
4. **Maintain Consistency**: Use similar patterns across categories
5. **Regular Updates**: Review and update order periodically

### **Category Strategy**
1. **Featured Categories**: Put best companies first
2. **Comprehensive Categories**: Use logical grouping
3. **New Categories**: Start with priority order
4. **Popular Categories**: Keep most popular at top

### **Monitoring & Optimization**
1. **Track User Behavior**: Monitor which companies get clicked
2. **A/B Testing**: Test different orders for engagement
3. **Performance Metrics**: Monitor user engagement by position
4. **User Feedback**: Gather feedback on company order

## 🔄 **Future Enhancements**

### **Planned Features**
- **Bulk Reordering**: Reorder multiple categories at once
- **Order Templates**: Save and reuse order configurations
- **Auto-Ordering**: Smart ordering based on popularity
- **Analytics Dashboard**: Track performance by position

### **Advanced Controls**
- **Time-based Ordering**: Different orders for different times
- **User-based Ordering**: Personalized order for users
- **Device-based Ordering**: Different orders for mobile/desktop
- **Content-based Ordering**: Auto-order based on content quality

---

This feature provides administrators with powerful control over the company display order, ensuring the most important and relevant companies appear first on the frontend.
