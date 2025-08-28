const API_BASE_URL = '/api/seo';

const isSeoDebugEnabled = (() => {
  try {
    if (import.meta?.env?.VITE_SEO_DEBUG === '1') return true;
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

const SeoService = {
  async get({ type, identifier, path, tab }) {
    const params = new URLSearchParams({ type, identifier });
    if (type === 'route' && path) params.set('path', path);
    if (tab) params.set('tab', tab);
    
    const url = `${API_BASE_URL}?${params.toString()}`;
    dbg('[SeoService] GET request:', url);

    const res = await fetch(url);

    const contentType = res.headers.get('content-type') || '';
    let json = null;
    try {
      if (contentType.includes('application/json')) {
        json = await res.json();
      }
    } catch (_) {}

    if (!res.ok) {
      dbg('[SeoService] GET non-OK response:', res.status, json);
      return null;
    }

    dbg('[SeoService] GET response:', json);
    if (!json || json.success === false) return null;
    return json.data ?? null;
  },
  async upsert(payload) {
    dbg('[SeoService] POST request:', payload);
    
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    let json = null;
    try { json = await res.json(); } catch (_) {}
    dbg('[SeoService] POST response:', json);

    if (!res.ok || !json || json.success === false) throw new Error(json?.message || 'Failed to save SEO');
    return json.data;
  },
};

export default SeoService;


