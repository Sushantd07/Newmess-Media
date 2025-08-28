import React, { createContext, useContext, useState, useCallback } from 'react';
import tabService from '../services/tabService.js';

const TabManagementContext = createContext();

export const useTabManagement = () => {
  const context = useContext(TabManagementContext);
  if (!context) {
    throw new Error('useTabManagement must be used within a TabManagementProvider');
  }
  return context;
};

export const TabManagementProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [lastModified, setLastModified] = useState(Date.now());
  const [companyId, setCompanyId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTabs = useCallback((newTabs, source = 'unknown') => {
    console.log(`🔄 Updating tabs from ${source}:`, newTabs);
    setTabs(newTabs);
    setLastModified(Date.now());
  }, []);

  const addTab = useCallback(async (tab, source = 'live-editor') => {
    if (!companyId) {
      console.error('❌ No company ID set for tab management');
      throw new Error('Company ID not set');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const tabData = tabService.createTabData(tab);
      const validationErrors = tabService.validateTabData(tabData);
      
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      console.log(`➕ Adding tab from ${source}:`, tabData);
      
      const response = await tabService.createTab(companyId, tabData);
      
      if (response.success && response.data.tab) {
        const newTab = response.data.tab;
        setTabs(prevTabs => [...prevTabs, newTab]);
        setLastModified(Date.now());
        console.log(`✅ Tab added successfully:`, newTab);
        return newTab;
      } else {
        throw new Error('Failed to create tab');
      }
    } catch (error) {
      console.error('❌ Error adding tab:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const updateTab = useCallback(async (tabId, updates, source = 'live-editor') => {
    if (!companyId) {
      console.error('❌ No company ID set for tab management');
      throw new Error('Company ID not set');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`✏️ Updating tab from ${source}:`, { tabId, updates });
      
      const response = await tabService.updateTab(companyId, tabId, updates);
      
      if (response.success && response.data.tab) {
        const updatedTab = response.data.tab;
        setTabs(prevTabs => 
          prevTabs.map(tab => 
            tab.id === tabId ? updatedTab : tab
          )
        );
        setLastModified(Date.now());
        console.log(`✅ Tab updated successfully:`, updatedTab);
        return updatedTab;
      } else {
        throw new Error('Failed to update tab');
      }
    } catch (error) {
      console.error('❌ Error updating tab:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const deleteTab = useCallback(async (tabId, source = 'live-editor') => {
    if (!companyId) {
      console.error('❌ No company ID set for tab management');
      throw new Error('Company ID not set');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🗑️ Deleting tab from ${source}:`, tabId);
      
      const response = await tabService.deleteTab(companyId, tabId);
      
      if (response.success) {
        setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
        setLastModified(Date.now());
        console.log(`✅ Tab deleted successfully:`, tabId);
        return true;
      } else {
        throw new Error('Failed to delete tab');
      }
    } catch (error) {
      console.error('❌ Error deleting tab:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const reorderTabs = useCallback(async (fromIndex, toIndex, source = 'live-editor') => {
    if (!companyId) {
      console.error('❌ No company ID set for tab management');
      throw new Error('Company ID not set');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Create new array with reordered tabs
      const newTabs = [...tabs];
      const [movedTab] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, movedTab);
      
      // Update order property for each tab
      const updatedTabs = newTabs.map((tab, index) => ({
        ...tab,
        order: index
      }));
      
      console.log(`🔄 Reordering tabs from ${source}:`, { fromIndex, toIndex });
      
      // Prepare tab orders for API
      const tabOrders = updatedTabs.map((tab, index) => ({
        tabId: tab.id,
        order: index
      }));
      
      const response = await tabService.reorderTabs(companyId, tabOrders);
      
      if (response.success) {
        setTabs(updatedTabs);
        setLastModified(Date.now());
        console.log(`✅ Tabs reordered successfully`);
        return updatedTabs;
      } else {
        throw new Error('Failed to reorder tabs');
      }
    } catch (error) {
      console.error('❌ Error reordering tabs:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [companyId, tabs]);

  const initializeTabs = useCallback((initialTabs, source = 'initialization') => {
    console.log(`🚀 Initializing tabs from ${source}:`, initialTabs);
    const transformedTabs = tabService.transformTabsForContext(initialTabs);
    setTabs(transformedTabs);
    setLastModified(Date.now());
    setError(null);
  }, []);

  const fetchTabs = useCallback(async (newCompanyId, source = 'api-fetch') => {
    if (!newCompanyId) {
      console.error('❌ No company ID provided for fetching tabs');
      throw new Error('Company ID is required');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`📥 Fetching tabs from ${source} for company:`, newCompanyId);
      
      const response = await tabService.getCompanyTabs(newCompanyId);
      
      if (response.success && response.data.tabs) {
        const transformedTabs = tabService.transformTabsForContext(response.data.tabs);
        setTabs(transformedTabs);
        setLastModified(Date.now());
        console.log(`✅ Tabs fetched successfully:`, transformedTabs);
        return transformedTabs;
      } else {
        throw new Error('Failed to fetch tabs');
      }
    } catch (error) {
      console.error('❌ Error fetching tabs:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setCompanyContext = useCallback((newCompanyId) => {
    console.log(`🏢 Setting company context:`, newCompanyId);
    setCompanyId(newCompanyId);
    setError(null);
  }, []);

  const clearTabs = useCallback(() => {
    console.log('🧹 Clearing tabs');
    setTabs([]);
    setLastModified(Date.now());
    setError(null);
  }, []);

  const value = {
    // State
    tabs,
    lastModified,
    companyId,
    isLoading,
    error,
    
    // Actions
    updateTabs,
    addTab,
    updateTab,
    deleteTab,
    reorderTabs,
    initializeTabs,
    fetchTabs,
    setCompanyContext,
    clearTabs
  };

  return (
    <TabManagementContext.Provider value={value}>
      {children}
    </TabManagementContext.Provider>
  );
};
