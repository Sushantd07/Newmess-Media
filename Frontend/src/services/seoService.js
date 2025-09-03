const API_BASE_URL_ROOT =
  ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `http://localhost:3000/api`)) ||
  'http://localhost:3000/api');
const API_BASE_URL = `${API_BASE_URL_ROOT}/seo`;

// Add timeout configuration
const API_TIMEOUT = 10000; // 10 seconds

const isSeoDebugEnabled = (() => {
  try {
    if (import.meta?.env?.VITE_SEO_DEBUG === '1') return true;
    if (import.meta?.env?.DEV === true) return true; // Enable debug in development
    if (typeof window !== 'undefined') {
      const flag = window.localStorage.getItem('seo:debug');
      if (flag === '1' || flag === 'true') return true;
    }
  } catch (_) {}
  return false;
})();
const dbg = (...args) => {
  if (isSeoDebugEnabled) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

// Helper function to create fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = API_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
};

const SeoService = {
  async get({ type, identifier, path, tab }) {
    const params = new URLSearchParams({ type, identifier });
    if (type === 'route' && path) params.set('path', path);
    if (tab) params.set('tab', tab);
    
    const url = `${API_BASE_URL}?${params.toString()}`;
    dbg('[SeoService] GET request:', url);
    
    // Optional production debugging (enabled only when VITE_SEO_DEBUG==='1')
    if (isSeoDebugEnabled) {
      console.log('[SeoService] Production Debug - API_BASE_URL_ROOT:', API_BASE_URL_ROOT);
      console.log('[SeoService] Production Debug - API_BASE_URL:', API_BASE_URL);
      console.log('[SeoService] Production Debug - Full URL:', url);
      console.log('[SeoService] Production Debug - Environment:', {
        VITE_API_BASE_URL: import.meta?.env?.VITE_API_BASE_URL,
        NODE_ENV: import.meta?.env?.MODE,
        PROD: import.meta?.env?.PROD
      });
    }

    try {
      const res = await fetchWithTimeout(url);

      const contentType = res.headers.get('content-type') || '';
      let json = null;
      try {
        if (contentType.includes('application/json')) {
          json = await res.json();
        }
      } catch (_) {}

      if (isSeoDebugEnabled) {
        console.log('[SeoService] Production Debug - Response status:', res.status);
        console.log('[SeoService] Production Debug - Response headers:', Object.fromEntries(res.headers.entries()));
        console.log('[SeoService] Production Debug - Response body:', json);
      }

      if (!res.ok) {
        dbg('[SeoService] GET non-OK response:', res.status, json);
        console.error('[SeoService] Production Error - Non-OK response:', res.status, json);
        return null;
      }

      dbg('[SeoService] GET response:', json);
      if (!json || json.success === false) {
        console.error('[SeoService] Production Error - API returned false success:', json);
        return null;
      }
      
      if (isSeoDebugEnabled) {
        console.log('[SeoService] Production Success - SEO data retrieved:', json.data);
        console.log('[SeoService] SEO data structure:', {
          hasTitle: !!json.data?.title,
          hasDescription: !!json.data?.description,
          title: json.data?.title,
          description: json.data?.description,
          keys: json.data ? Object.keys(json.data) : []
        });
      }
      return json.data ?? null;
    } catch (error) {
      console.error('[SeoService] GET request failed:', error.message);
      console.error('[SeoService] Production Error - Full error:', error);
      return null;
    }
  },
  async upsert(payload) {
    dbg('[SeoService] POST request:', payload);
    if (isSeoDebugEnabled) {
      console.log('[SeoService] Making POST request to:', API_BASE_URL);
      console.log('[SeoService] API_BASE_URL_ROOT:', API_BASE_URL_ROOT);
      console.log('[SeoService] Payload being sent:', JSON.stringify(payload, null, 2));
    }
    
    try {
      const res = await fetchWithTimeout(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      let json = null;
      try { json = await res.json(); } catch (_) {}
      dbg('[SeoService] POST response:', json);
      if (isSeoDebugEnabled) {
        console.log('[SeoService] Response status:', res.status);
        console.log('[SeoService] Response headers:', Object.fromEntries(res.headers.entries()));
        console.log('[SeoService] Response body:', json);
      }

      if (!res.ok || !json || json.success === false) {
        console.error('[SeoService] Request failed:', { status: res.status, json });
        throw new Error(json?.message || 'Failed to save SEO');
      }
      return json.data;
    } catch (error) {
      console.error('[SeoService] POST request failed:', error.message);
      throw error;
    }
  },
};

export default SeoService;


