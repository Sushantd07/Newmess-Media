# Routing Setup for Mobile States Navigation

This guide explains how to set up the routing for the mobile states grid navigation.

## Current Implementation

The mobile states grid component (`MobileStatesGrid.jsx`) is set up to navigate to `/state/{stateId}` routes when a state is clicked. Currently, it uses a demo route structure that you can customize later.

## Required Route Configuration

To make the mobile navigation work, you need to add the following route to your main routing configuration:

### 1. Add State Route to Your Router

In your main routing file (usually `App.jsx` or `main.jsx`), add:

```jsx
import StatePage from './pages/StatePage';

// In your router configuration
<Route path="/state/:stateId" element={<StatePage />} />
```

### 2. Complete Router Example

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StateWiseSection from './components/StateWiseSection';
import StatePage from './pages/StatePage';
// ... other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StateWiseSection />} />
        <Route path="/state/:stateId" element={<StatePage />} />
        {/* ... other routes */}
      </Routes>
    </Router>
  );
}

export default App;
```

## How It Works

1. **Mobile View**: When users are on mobile devices, they see a grid of states instead of the interactive map
2. **State Click**: Clicking on any state navigates to `/state/{stateId}` (e.g., `/state/maharashtra`)
3. **State Page**: The `StatePage` component receives the state ID and displays relevant information
4. **Navigation**: Users can go back to the states grid using the back button

## Customization Options

### 1. Replace Demo Data with Real API Calls

In `StatePage.jsx`, replace the demo data with actual API calls:

```jsx
// Instead of demo data, fetch from your API
useEffect(() => {
  const fetchStateData = async () => {
    try {
      const response = await fetch(`/api/states/${stateId}`);
      const data = await response.json();
      setStateData(data);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };
  
  fetchStateData();
}, [stateId]);
```

### 2. Add More State-Specific Information

You can enhance the `StatePage` component to include:
- State government websites
- Local emergency services
- State-specific helpline categories
- Regional contact information
- State news and updates

### 3. Implement Search and Filtering

Add search functionality to the mobile states grid:

```jsx
const [searchTerm, setSearchTerm] = useState('');
const filteredStates = statesData.filter(state => 
  state.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

## File Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── StateWiseSection.jsx    # Main component with mobile/desktop views
│   │   └── MobileStatesGrid.jsx    # Mobile states grid component
│   ├── pages/
│   │   └── StatePage.jsx           # Individual state page
│   └── App.jsx                     # Main app with routing
```

## Testing

1. **Mobile View**: Resize your browser to mobile width or use browser dev tools
2. **State Navigation**: Click on any state in the mobile grid
3. **Back Navigation**: Use the back button to return to the states grid
4. **Responsive Design**: Verify that desktop view still shows the interactive map

## Next Steps

1. ✅ Set up the routing configuration
2. ✅ Test mobile and desktop views
3. 🔄 Replace demo data with real API calls
4. 🔄 Add state-specific content and functionality
5. 🔄 Implement search and filtering
6. 🔄 Add analytics and tracking

## Notes

- The desktop view remains completely unchanged
- Mobile view provides a touch-friendly grid interface
- All existing functionality is preserved
- The component automatically switches between views based on screen size
- Vertical scrolling is implemented for both views to handle many states

