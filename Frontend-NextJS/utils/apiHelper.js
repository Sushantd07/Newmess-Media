// Utility function to get the proper API base URL
export const getApiBaseUrl = () => {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
    '/api'
  );
};

// Helper function to make API calls with proper base URL
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  console.log(`[apiHelper] Making API call to: ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  return response;
};
