import React, { useState, useEffect } from 'react';

const SeoDebugPanel = ({ type, identifier, tab }) => {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSeoData = async () => {
    if (!identifier || identifier === 'pending') return;
    
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ type, identifier });
      if (tab) params.set('tab', tab);
      
      const response = await fetch(`/api/seo?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setSeoData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, [type, identifier, tab]);

  if (!identifier || identifier === 'pending') {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm">
        <strong>SEO Debug:</strong> Waiting for valid identifier (current: {identifier})
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-100 border border-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm max-w-md">
      <div className="font-bold mb-2">SEO Debug Panel</div>
      <div className="space-y-1 text-xs">
        <div><strong>Type:</strong> {type}</div>
        <div><strong>Identifier:</strong> {identifier}</div>
        <div><strong>Tab:</strong> {tab || 'none'}</div>
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        {error && <div><strong>Error:</strong> <span className="text-red-600">{error}</span></div>}
        {seoData && (
          <div className="mt-2">
            <div><strong>Title:</strong> {seoData.title || 'Not set'}</div>
            <div><strong>Description:</strong> {seoData.description || 'Not set'}</div>
            <div><strong>Robots:</strong> {seoData.robots || 'Not set'}</div>
          </div>
        )}
      </div>
      <button 
        onClick={fetchSeoData}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
      >
        Refresh
      </button>
      <button 
        onClick={async () => {
          // Test manual SEO application
          if (seoData) {
            console.log('[SeoDebugPanel] Manually applying SEO data:', seoData);
            // Let DynamicSEO handle this - just dispatch the event
            window.dispatchEvent(new CustomEvent('seo-updated', { detail: seoData }));
            alert('SEO data event dispatched! Check if DynamicSEO applies it.');
          }
        }}
        className="mt-2 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 ml-2"
      >
        Test Apply
      </button>
    </div>
  );
};

export default SeoDebugPanel;
