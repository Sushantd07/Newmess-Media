import React, { useEffect, useState, useMemo } from 'react';
import SeoService from '../../services/seoService.js';

const defaultState = {
  title: '',
  description: '',
  keywords: '',
  canonical: '',
  robots: 'index,follow',
  lang: 'en',
  publisher: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCard: 'summary_large_image',
  structuredData: '',
};

const SeoSettingsPanel = ({ type, identifier, onClose, defaults, tab }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultState);

  // Derive tab from URL if not provided
  const deriveTabFromPath = () => {
    try {
      const allowed = new Set(['contactnumber', 'complain', 'quickhelp', 'videoguide', 'overview']);
      const seg = (window.location.pathname || '').split('/').filter(Boolean).pop();
      return allowed.has(seg) ? seg : undefined;
    } catch { return undefined; }
  };
  const tabSlug = useMemo(() => tab || deriveTabFromPath(), [tab]);

  useEffect(() => {
    let mounted = true;
    
    // Skip fetching if identifier is 'pending' or empty
    if (!identifier || identifier === 'pending') {
      console.log('[SeoSettingsPanel] Skipping fetch - invalid identifier:', identifier);
      setLoading(false);
      return;
    }
    
    (async () => {
      try {
        setLoading(true);
        console.log('[SeoSettingsPanel] Fetching SEO data for:', { type, identifier, tab: tabSlug });
        const data = await SeoService.get({ type, identifier, path: type === 'route' ? window.location.pathname : undefined, tab: tabSlug });
        console.log('[SeoSettingsPanel] SEO data received:', data);
        
        if (mounted) {
          if (data) {
            // Use fetched data as primary, only fall back to defaults for missing fields
            const updatedForm = {
              ...defaultState,
              ...data,
              keywords: (data.keywords || []).join(', '),
              structuredData: data.structuredData ? JSON.stringify(data.structuredData, null, 2) : '',
            };
            console.log('[SeoSettingsPanel] Setting form with fetched data:', updatedForm);
            setForm(updatedForm);
          } else {
            // Reset to empty state if no data fetched
            console.log('[SeoSettingsPanel] Setting form to default state - no data fetched');
            setForm(defaultState);
          }
        }
      } catch (e) {
        console.error('[SeoSettingsPanel] Fetch error:', e);
        if (mounted) {
          // Reset to empty state on error
          setForm(defaultState);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [type, identifier, tabSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Prevent saving under 'pending' identifier
      if (!identifier || identifier === 'pending') {
        console.error('[SeoSettingsPanel] Cannot save - invalid identifier:', identifier);
        return;
      }
      
      setSaving(true);
      console.log('[SeoSettingsPanel] ===== SAVE PROCESS STARTED =====');
      console.log('[SeoSettingsPanel] Saving SEO data for:', { type, identifier, tab: tabSlug });
      console.log('[SeoSettingsPanel] Current form state:', form);
      console.log('[SeoSettingsPanel] Tab slug determined:', tabSlug);
      console.log('[SeoSettingsPanel] Window location pathname:', window.location.pathname);
      
      const payload = {
        type,
        identifier,
        ...form,
        keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      };
      if (tabSlug) payload.tab = tabSlug;
      
      console.log('[SeoSettingsPanel] Final payload being sent to backend:', payload);
      console.log('[SeoSettingsPanel] Payload JSON stringified:', JSON.stringify(payload, null, 2));
      
      if (form.structuredData) {
        try { 
          payload.structuredData = JSON.parse(form.structuredData); 
          console.log('[SeoSettingsPanel] Structured data parsed successfully');
        } catch (e) { 
          console.warn('[SeoSettingsPanel] Failed to parse structured data:', e);
        }
      }
      
      console.log('[SeoSettingsPanel] Calling SeoService.upsert...');
      const saved = await SeoService.upsert(payload);
      console.log('[SeoSettingsPanel] Save response received:', saved);
      console.log('[SeoSettingsPanel] Save response type:', typeof saved);
      console.log('[SeoSettingsPanel] Save response keys:', saved ? Object.keys(saved) : 'null');
      
      // Update form with saved normalized values
      if (saved) {
        console.log('[SeoSettingsPanel] Processing saved response...');
        // If backend returned container document with tabs, flatten the current tab to detail for consumers
        const flattened = (() => {
          if (saved?.tabs && tabSlug && saved.tabs[tabSlug]) {
            console.log('[SeoSettingsPanel] Flattening response with tab data');
            return { ...saved, ...saved.tabs[tabSlug], tab: tabSlug };
          }
          console.log('[SeoSettingsPanel] No tab data found, returning saved response as is');
          return { ...saved, tab: tabSlug };
        })();
        
        console.log('[SeoSettingsPanel] Flattened response:', flattened);
        
        setForm((prev) => ({
          ...prev,
          ...flattened,
          keywords: (flattened.keywords || []).join(', '),
          structuredData: flattened.structuredData ? JSON.stringify(flattened.structuredData, null, 2) : prev.structuredData,
        }));
        
        // Notify DynamicSEO to refresh immediately (Helmet will manage DOM updates)
        console.log('[SeoSettingsPanel] Dispatching seo-updated event:', flattened);
        window.dispatchEvent(new CustomEvent('seo-updated', { detail: flattened }));
        // Let DynamicSEO handle all DOM updates - don't manually set document.title or meta tags
      } else {
        console.warn('[SeoSettingsPanel] No saved response received');
      }
      
      console.log('[SeoSettingsPanel] ===== SAVE PROCESS COMPLETED =====');
      onClose?.();
    } catch (error) {
      console.error('[SeoSettingsPanel] Save failed:', error);
      console.error('[SeoSettingsPanel] Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Failed to save SEO settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-4 left-4 z-[1000] w-[360px] max-w-[92vw] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <div className="font-semibold">SEO Settings</div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin h-5 w-5 rounded-full border-2 border-gray-300 border-t-orange-500" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-[1000] w-[360px] max-w-[92vw] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
        <div className="font-semibold">SEO Settings</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
        {[
          ['title', 'Title'],
          ['description', 'Description'],
          ['keywords', 'Keywords (comma separated)'],
          ['canonical', 'Canonical URL'],
          ['robots', 'Robots'],
          ['lang', 'Language'],
          ['publisher', 'Publisher'],
          ['ogTitle', 'OG Title'],
          ['ogDescription', 'OG Description'],
          ['ogImage', 'OG Image URL'],
          ['twitterCard', 'Twitter Card'],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {name === 'description' || name === 'ogDescription' ? (
              <textarea name={name} value={form[name]} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows={3} />
            ) : name === 'twitterCard' ? (
              <select name={name} value={form[name]} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            ) : (
              <input name={name} value={form[name]} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Structured Data (JSON-LD)</label>
          <textarea name="structuredData" value={form.structuredData} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 font-mono" rows={6} />
        </div>
      </div>
      <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-orange-600 text-white">{saving ? 'Saving...' : 'Save'}</button>
        <button onClick={async () => { const data = await SeoService.get({ type, identifier, path: type === 'route' ? window.location.pathname : undefined, tab: tabSlug }); if (data) { setForm({ ...defaultState, ...data, keywords: (data.keywords || []).join(', '), structuredData: data.structuredData ? JSON.stringify(data.structuredData, null, 2) : '' }); } }} className="px-4 py-2 rounded-lg border">Reload</button>
      </div>
    </div>
  );
};

export default SeoSettingsPanel;


