import React, { useEffect, useMemo, useState } from 'react';
import EnhancedDynamicPageBuilder from '../components/admin/EnhancedDynamicPageBuilder.jsx';
import DynamicPageRenderer from '../components/admin/DynamicPageRenderer.jsx';
import { useParams, useSearchParams } from 'react-router-dom';

const DynamicPageStudio = () => {
  const { pageId: pageIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const pageId = useMemo(() => pageIdParam || searchParams.get('pageId') || 'customer-care-bob', [pageIdParam, searchParams]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dynamic-pages/${encodeURIComponent(pageId)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) setData(json.data);
        }
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [pageId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dynamic Page Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedDynamicPageBuilder 
      pageId={pageId} 
      initialData={data} 
      onSave={setData} 
    />
  );
};

export default DynamicPageStudio;


