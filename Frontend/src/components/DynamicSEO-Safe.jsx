import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import SeoService from '../services/seoService.js';
import { generateDynamicSchema, injectSchema } from '../utils/schemaGenerator.js';
import { generateAutomaticSEO, getCurrentPageInfo } from '../utils/autoSEO.js';

// Safe, simplified DynamicSEO component that won't cause freezing
const DynamicSEOSafe = ({ type, identifier, tab, ssrData }) => {
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  // Simple page detection without complex logic
  const getPageInfo = () => {
    const currentPath = location?.pathname || '/';
    
    if (currentPath === '/') {
      return { type: 'route', identifier: '/', tab: undefined };
    }
    
    if (currentPath.startsWith('/category/')) {
      const pathParts = currentPath.split('/').filter(Boolean);
      const lastSegment = pathParts[pathParts.length - 1];
      const validTabs = ['contactnumber', 'complain', 'quickhelp', 'videoguide', 'overview'];
      
      if (validTabs.includes(lastSegment)) {
        const companySlug = pathParts[pathParts.length - 2];
        return { type: 'company', identifier: companySlug, tab: lastSegment };
        }
    }
    
    if (/^\/category\/[^\/]+$/.test(currentPath)) {
      const categoryId = currentPath.split('/')[2];
      return { type: 'category', identifier: categoryId, tab: undefined };
    }
    
    if (currentPath === '/category') {
      return { type: 'route', identifier: '/category', tab: undefined };
    }
    
    if (currentPath === '/about') {
      return { type: 'route', identifier: '/about', tab: undefined };
    }
    
    return { type, identifier, tab };
  };

  const pageInfo = getPageInfo();
  const actualType = pageInfo.type;
  const actualIdentifier = pageInfo.identifier;
  const actualTab = pageInfo.tab;

  // Helper: build self-referencing canonical (ignores hash)
  const buildSelfCanonical = () => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const { origin, pathname, search } = window.location;
        return `${origin}${pathname}${search || ''}`;
      }
    } catch (_) {}
    // SSR-safe fallback
    const baseUrl = 'https://www.indiacustomerhelp.com';
    const pathname = location?.pathname || '/';
    const search = location?.search || '';
    return `${baseUrl}${pathname}${search}`;
  };

  // Use SSR data if available, otherwise fetch
  useEffect(() => {
    if (ssrData) {
      setSeo(ssrData);
      setLoading(false);
      return;
    }
    
    if (!actualIdentifier || !actualType) return;
    
    let mounted = true;
    
    const fetchSEO = async () => {
      try {
        setLoading(true);
        // optional fetch log removed for production cleanliness
        
        // Use SeoService instead of hardcoded fetch
        const data = await SeoService.get({ 
          type: actualType, 
          identifier: actualIdentifier, 
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
          tab: actualTab 
        });
        
        
        
        if (mounted) {
          setSeo(data);
        }
      } catch (error) {
        if (mounted) {
          console.warn('[DynamicSEOSafe] SEO fetch failed:', error.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Debounce the fetch
    const timeoutId = setTimeout(fetchSEO, 300);
    
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [actualType, actualIdentifier, actualTab, ssrData]);

  // Generate and inject dynamic schema when SEO data changes
  useEffect(() => {
    if (seo && actualType && actualIdentifier) {
      const generateSchema = async () => {
        try {
          
          
          const schema = await generateDynamicSchema(actualType, actualIdentifier, actualTab, seo);
          
          // Inject schema into page
          if (typeof window !== 'undefined') {
            injectSchema(schema);
          }
          
          
        } catch (error) {
          console.error('[DynamicSEOSafe] Error generating schema:', error);
        }
      };
      
      generateSchema();
    }
  }, [seo, actualType, actualIdentifier, actualTab]);

  // Show loading state but still render basic SEO
  if (loading) {
    return (
      <Helmet>
        <title>Loading...</title>
        <meta name="description" content="Loading page..." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={buildSelfCanonical()} />
      </Helmet>
    );
  }

  // Get current page info for automatic SEO generation
  const currentPageInfo = getCurrentPageInfo();
  
  // Generate automatic SEO data (only for title/description fallbacks, not canonical)
  const automaticSEO = generateAutomaticSEO(
    seo || {},
    actualType,
    actualIdentifier,
    currentPageInfo.pathname,
    currentPageInfo.search
  );
  
  // Generate intelligent fallbacks based on page type
  const generateIntelligentFallbacks = () => {
    let fallbackTitle = 'India Customer Help | Verified Helpline & Support Numbers';
    let fallbackDescription = 'Find verified India customer care numbers for HDFC, Jio, IRCTC, Flipkart & more. Quick access to emergency helplines & real support solutions.';
    
    // Page-specific fallbacks
    if (actualType === 'home' || actualIdentifier === 'home') {
      fallbackTitle = 'India Customer Help | Verified Helpline & Support Numbers';
      fallbackDescription = 'Find verified India customer care numbers for HDFC, Jio, IRCTC, Flipkart & more. Quick access to emergency helplines & real support solutions.';
    } else if (actualType === 'all-categories' || actualIdentifier === 'all-categories') {
      fallbackTitle = 'All Business Categories | India Customer Help';
      fallbackDescription = 'Browse through our comprehensive directory of business categories. Find verified customer care numbers and support for all major companies in India.';
    } else if (actualType === 'category') {
      const categoryName = actualIdentifier?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category';
      fallbackTitle = `${categoryName} - Customer Care Numbers | India Customer Help`;
      fallbackDescription = `Find verified ${categoryName} customer care numbers, helpline numbers, and support contact information. Get instant help and expert support.`;
    } else if (actualType === 'company') {
      const companyName = actualIdentifier?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Company';
      fallbackTitle = `${companyName} Customer Care Number | India Customer Help`;
      fallbackDescription = `Get ${companyName} customer care number, helpline, and support contact information. Verified numbers for instant help and support.`;
    }
    
    return { fallbackTitle, fallbackDescription };
  };
  
  const { fallbackTitle, fallbackDescription } = generateIntelligentFallbacks();
  
  // FORCE self-referencing canonical and indexable robots by default
  const canonicalUrl = buildSelfCanonical();
  const robotsDirectives = automaticSEO.robots || 'index,follow';

  const defaults = {
    title: automaticSEO.title || fallbackTitle,
    description: automaticSEO.description || fallbackDescription,
    keywords: automaticSEO.keywords || ['customer service', 'complaints', 'help', 'helpline', 'support', 'India'],
    canonical: canonicalUrl,
    robots: robotsDirectives,
    lang: automaticSEO.lang || 'en',
    ogTitle: automaticSEO.ogTitle || automaticSEO.title || fallbackTitle,
    ogDescription: automaticSEO.ogDescription || automaticSEO.description || fallbackDescription,
    ogImage: automaticSEO.ogImage || 'https://www.indiacustomerhelp.com/logo3-Photoroom.png',
    ogUrl: canonicalUrl,
    twitterCard: automaticSEO.twitterCard || 'summary_large_image',
  };

  // Debug logging removed for production

  return (
    <Helmet>
      <title>{defaults.title}</title>
      <meta name="description" content={defaults.description} />
      <meta name="keywords" content={defaults.keywords.join(', ')} />
      <meta name="robots" content={defaults.robots} />
      <link rel="canonical" href={defaults.canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={defaults.ogTitle} />
      <meta property="og:description" content={defaults.ogDescription} />
      <meta property="og:image" content={defaults.ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={defaults.ogUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={defaults.twitterCard} />
      <meta name="twitter:title" content={defaults.ogTitle} />
      <meta name="twitter:description" content={defaults.ogDescription} />
      <meta name="twitter:image" content={defaults.ogImage} />
    </Helmet>
  );
};

export default DynamicSEOSafe;
