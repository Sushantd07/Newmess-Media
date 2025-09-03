import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SitemapPage = () => {
  const [sitemapData, setSitemapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSitemapData();
  }, []);

  const fetchSitemapData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/sitemap.json');
      if (!response.ok) {
        throw new Error('Failed to fetch sitemap data');
      }
      const data = await response.json();
      
      setSitemapData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sitemap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Sitemap</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchSitemapData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!sitemapData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Website Sitemap</h1>
          <p className="text-lg text-gray-600 mb-2">
            Complete list of all pages on {sitemapData.baseUrl}
          </p>
          <p className="text-sm text-gray-500">
            Total: {sitemapData.totalUrls} pages • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Download Links */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Download Sitemap</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/sitemap.xml"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              📄 XML Sitemap
            </a>
            <a
              href="/sitemap.json"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              📊 JSON Format
            </a>
            <a
              href="/robots.txt"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
            >
              🤖 Robots.txt
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Static Pages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🏠 Static Pages
            </h2>
            <div className="space-y-3">
              {sitemapData.pages.map((page, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <Link 
                    to={page.url} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {page.url === '/' ? 'Homepage' : page.url}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    Priority: {page.priority} • Update: {page.changefreq}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📁 Categories ({sitemapData.categories.length})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sitemapData.categories.map((category, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <Link 
                    to={category.url} 
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    {category.url.split('/').pop()}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    Priority: {category.priority} • Update: {category.changefreq}
                    {category.lastmod && ` • Modified: ${category.lastmod}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              📂 Subcategories ({sitemapData.subcategories.length})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sitemapData.subcategories.map((subcategory, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4">
                  <Link 
                    to={subcategory.url} 
                    className="text-yellow-600 hover:text-yellow-800 font-medium"
                  >
                    {subcategory.url.split('/').pop()}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    Priority: {subcategory.priority} • Update: {subcategory.changefreq}
                    {subcategory.lastmod && ` • Modified: ${subcategory.lastmod}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Companies */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🏢 Companies ({sitemapData.companies.length})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sitemapData.companies.map((company, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <Link 
                    to={company.url} 
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    {company.url.split('/').pop()}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    Priority: {company.priority} • Update: {company.changefreq}
                    {company.lastmod && ` • Modified: ${company.lastmod}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This sitemap is automatically generated and updated based on your website content.
          </p>
          <p className="mt-2">
            Search engines will automatically discover and use this sitemap for better indexing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
