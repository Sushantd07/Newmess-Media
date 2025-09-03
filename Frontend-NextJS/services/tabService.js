// services/tabService.js

const API_BASE_URL_ROOT =
  ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
  '/api');
const API_BASE_URL = `${API_BASE_URL_ROOT}/tabs`;

// Get all tabs for a specific company
export const getCompanyTabs = async (companyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${companyId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch company tabs');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching company tabs:', error);
    throw error;
  }
};

// Create a new tab for a company
export const createTab = async (companyId, tabData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tabData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create tab');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating tab:', error);
    throw error;
  }
};

// Update a specific tab for a company
export const updateTab = async (companyId, tabId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${companyId}/${tabId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update tab');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating tab:', error);
    throw error;
  }
};

// Delete a tab for a specific company
export const deleteTab = async (companyId, tabId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${companyId}/${tabId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete tab');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting tab:', error);
    throw error;
  }
};

// Reorder tabs for a company
export const reorderTabs = async (companyId, tabOrders) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${companyId}/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tabOrders }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reorder tabs');
    }
    
    return data;
  } catch (error) {
    console.error('Error reordering tabs:', error);
    throw error;
  }
};

// Bulk update tabs for a company
export const bulkUpdateTabs = async (companyId, tabs) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${companyId}/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tabs }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to bulk update tabs');
    }
    
    return data;
  } catch (error) {
    console.error('Error bulk updating tabs:', error);
    throw error;
  }
};

// Get all available tabs (admin endpoint)
export const getAllTabs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch all tabs');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching all tabs:', error);
    throw error;
  }
};

// Transform tabs for context usage
export const transformTabsForContext = (tabs) => {
  return tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    name: tab.name,
    icon: tab.icon,
    type: tab.type,
    order: tab.order,
    content: tab.content || '',
    isActive: tab.isActive !== false,
    lastUpdated: tab.lastUpdated,
    createdBy: tab.createdBy,
    createdAt: tab.createdAt
  }));
};

// Create tab data for API
export const createTabData = (tab) => {
  return {
    label: tab.label,
    name: tab.name || tab.label.toLowerCase().replace(/\s+/g, '-'),
    icon: tab.icon || 'FileText',
    content: tab.content || '',
    order: tab.order || 0
  };
};

// Validate tab data
export const validateTabData = (tab) => {
  const errors = [];
  
  if (!tab.label || tab.label.trim() === '') {
    errors.push('Tab label is required');
  }
  
  if (!tab.name || tab.name.trim() === '') {
    errors.push('Tab name is required');
  }
  
  if (tab.order !== undefined && (isNaN(tab.order) || tab.order < 0)) {
    errors.push('Tab order must be a non-negative number');
  }
  
  return errors;
};

const tabService = {
  getCompanyTabs,
  createTab,
  updateTab,
  deleteTab,
  reorderTabs,
  bulkUpdateTabs,
  getAllTabs,
  transformTabsForContext,
  createTabData,
  validateTabData
};

export default tabService;
