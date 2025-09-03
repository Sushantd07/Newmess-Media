import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SeoService from '../services/seoService.js';
import { useLocation } from 'react-router-dom';

// Debug flag and logger: enable by setting VITE_SEO_DEBUG=1 or localStorage 'seo:debug' = '1'
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

export const computeDefaultsFromDom = () => {
  const getMeta = (selector) => document.querySelector(selector)?.getAttribute('content') || '';
  const getHref = (selector) => document.querySelector(selector)?.getAttribute('href') || '';
  return {
    title: document.title || '',
    description: getMeta('meta[name="description"]'),
    keywords: getMeta('meta[name="keywords"]'),
    canonical: getHref('link[rel="canonical"]') || (typeof window !== 'undefined' ? window.location.href : ''),
    robots: getMeta('meta[name="robots"]') || 'index,follow',
    lang: document.documentElement.getAttribute('lang') || 'en',
    publisher: getMeta('meta[name="publisher"]'),
    ogTitle: getMeta('meta[property="og:title"]'),
    ogDescription: getMeta('meta[property="og:description"]'),
    ogImage: getMeta('meta[property="og:image"]'),
    twitterCard: getMeta('meta[name="twitter:card"]') || 'summary_large_image',
  };
};

const DynamicSEO = ({ type, identifier, tab }) => {
  // Safe mode: allow disabling this component to prevent blank screens
  const seoDisabled = (() => {
    try {
      if (import.meta?.env?.VITE_DISABLE_SEO === '1') return true;
      if (typeof window !== 'undefined') {
        const flag = window.localStorage.getItem('seo:disable');
        if (flag === '1' || flag === 'true') return true;
      }
    } catch (_) {}
    return false;
  })();
  
  if (seoDisabled) {
    return null;
  }
  
  // Early return if we're in a loading state or if the component is causing issues
  const [isComponentEnabled, setIsComponentEnabled] = useState(true);
  
  // Disable component if it's causing performance issues
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (document.title === 'Loading…' || document.title === '') {
        console.warn('[DynamicSEO] Component disabled due to performance issues');
        setIsComponentEnabled(false);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, []);
  
  if (!isComponentEnabled) {
    return null;
  }
  
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastEventApplyAtRef = useRef(0);

  // Simple render log to verify component is mounting
  dbg('[DynamicSEO] Component rendered with props:', { type, identifier, tab });
  dbg('[DynamicSEO] Component is DEFINITELY RENDERING!');

  // Normalize/compute canonical for current environment
  const computeCanonicalHref = (incoming) => {
    if (typeof window === 'undefined') return '';
    try {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      if (!incoming) return `${origin}${pathname}`;
      // If incoming is relative, resolve against current origin
      const resolved = new URL(incoming, origin);
      // Force current origin; keep pathname from incoming if it looks like a path, otherwise use current
      const finalPathname = resolved.pathname && resolved.pathname !== '/' ? resolved.pathname : pathname;
      return `${origin}${finalPathname}`;
    } catch (e) {
      return `${window.location.origin}${window.location.pathname}`;
    }
  };

  // Auto-detect page type and identifier if not provided
  const location = useLocation();
  const getPageInfo = () => {
    const currentPath = location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
    dbg('[DynamicSEO] Auto-detecting page info for path:', currentPath);
    
    // Home page – use route-based identifier for production parity
    if (currentPath === '/') {
      return { type: 'route', identifier: '/', tab: undefined };
    }
    
    // Company pages - check for all possible tab URLs
    if (currentPath.startsWith('/category/')) {
      const pathParts = currentPath.split('/').filter(Boolean); // remove empty segments
      const lastSegment = pathParts[pathParts.length - 1];
      const validTabs = ['contactnumber', 'complain', 'quickhelp', 'videoguide', 'overview'];
      if (validTabs.includes(lastSegment)) {
        const companySlug = pathParts[pathParts.length - 2];
        dbg('[DynamicSEO] Detected company page with tab:', companySlug, lastSegment);
        return { type: 'company', identifier: companySlug, tab: lastSegment };
      }
    }
    
    // Category pages (e.g., /category/:categoryId)
    if (/^\/category\/[^\/]+$/.test(currentPath)) {
      const categoryId = currentPath.split('/')[2];
      dbg('[DynamicSEO] Detected category page:', categoryId);
      return { type: 'category', identifier: categoryId, tab: undefined };
    }
    
    // All categories page – use route-based identifier for production parity
    if (currentPath === '/category') {
      dbg('[DynamicSEO] Detected all-categories page');
      return { type: 'route', identifier: '/category', tab: undefined };
    }
    
    // Route pages
    if (currentPath === '/about') {
      dbg('[DynamicSEO] Detected about page');
      return { type: 'route', identifier: '/about', tab: undefined };
    }
    
    // Default to provided props
    return { type, identifier, tab };
  };

  const pageInfo = useMemo(() => getPageInfo(), [location?.pathname, type, identifier, tab]);
  const actualType = pageInfo.type;
  const actualIdentifier = pageInfo.identifier;
  const actualTab = pageInfo.tab;
  
  dbg('[DynamicSEO] Using page info:', pageInfo);

  // Check if this component should be active for the current page
  const isActiveForCurrentPage = () => {
    const currentPath = location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
    dbg('[DynamicSEO] Checking if active for path:', currentPath, 'with detected info:', { actualType, actualIdentifier, actualTab });
    
    // Always active since we auto-detect the page type
    dbg('[DynamicSEO] Component is active for current page');
    return true;
  };

  const isActive = isActiveForCurrentPage();
  dbg('[DynamicSEO] Is active for current page:', isActive, 'Current path:', (typeof window !== 'undefined' ? window.location.pathname : ''));

  // Allow multiple instances; latest write wins. Removed conflicting guard that deactivated others.

  // Add a visible debug element to confirm component is rendering
  useEffect(() => {
    dbg('[DynamicSEO] useEffect triggered - component is definitely working!');
    // Only render the yellow debug overlay when debug is enabled
    if (!isSeoDebugEnabled) return;
    if (typeof document === 'undefined') return;
    if (!isActive) return;

    dbg('[DynamicSEO] Adding debug element to page');
    const debugDivId = `dynamic-seo-debug-${actualType}-${actualIdentifier}`;
    const debugDiv = document.createElement('div');
    debugDiv.id = debugDivId;
    debugDiv.setAttribute('data-dynamic-seo-active', 'true');
    debugDiv.style.cssText = 'position: fixed; top: 50px; right: 10px; z-index: 9999; background: yellow; color: black; padding: 10px; border: 2px solid red; font-size: 12px; max-width: 200px;';
    debugDiv.innerHTML = `
      <strong>DynamicSEO Debug (ACTIVE)</strong><br>
      Type: ${actualType}<br>
      Identifier: ${actualIdentifier}<br>
      Tab: ${actualTab || 'undefined'}<br>
      Has SEO Data: ${seo ? 'YES' : 'NO'}<br>
      SEO Title: ${seo?.title || 'NONE'}<br>
      Canonical: ${typeof document !== 'undefined' ? (document.querySelector('link[rel="canonical"]')?.getAttribute('href') || 'NONE') : 'N/A'}<br>
      Robots: ${typeof document !== 'undefined' ? (document.querySelector('meta[name="robots"]')?.getAttribute('content') || 'NONE') : 'N/A'}
    `;

    const existingDiv = document.getElementById(debugDivId);
    if (existingDiv) {
      document.body.removeChild(existingDiv);
    }

    document.body.appendChild(debugDiv);
    dbg('[DynamicSEO] Debug div added to page with ID:', debugDivId);

    const timeout = setTimeout(() => {
      if (document.body.contains(debugDiv)) {
        debugDiv.removeAttribute('data-dynamic-seo-active');
        document.body.removeChild(debugDiv);
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [actualType, actualIdentifier, actualTab, isActive]); // Removed 'seo' dependency to prevent infinite re-renders

  // Clear stale SEO immediately on route/target change so prior page data doesn't persist
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Reset local state
    setSeo(null);
    // Neutralize head quickly
    const neutralTitle = `Loading…`;
    document.title = neutralTitle;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', '');
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', '');
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'index,follow');
    // Self-referencing canonical for the new route
    const allCanonicals = Array.from(document.querySelectorAll('link[rel="canonical"]'));
    allCanonicals.slice(1).forEach(el => el.parentNode && el.parentNode.removeChild(el));
    let canonicalLink = allCanonicals[0];
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    if (typeof window !== 'undefined') {
      canonicalLink.setAttribute('href', `${window.location.origin}${window.location.pathname}`);
    }
  }, [location?.pathname, actualType, actualIdentifier, actualTab]);

  // Fetch SEO data
  useEffect(() => {
    let mounted = true;
    
    // Only fetch if this component is active for the current page
    if (!isActive) {
      dbg('[DynamicSEO] Skipping fetch - component not active for current page');
      return;
    }
    
    if (!actualIdentifier) {
      dbg('[DynamicSEO] Skipping fetch - no identifier provided');
      if (mounted) {
        setSeo(null);
      }
      return;
    }
    
    dbg('[DynamicSEO] Starting fetch for:', { actualType, actualIdentifier, actualTab });
    
    (async () => {
      try {
        dbg('[DynamicSEO] Making API call to fetch SEO data...');
        const data = await SeoService.get({ 
          type: actualType, 
          identifier: actualIdentifier, 
          // Always send current path to allow backend to resolve by path if needed
          path: typeof window !== 'undefined' ? window.location.pathname : undefined, 
          tab: actualTab 
        });
        dbg('[DynamicSEO] API response received:', data);
        
        if (mounted) {
          const justAppliedMsAgo = Date.now() - lastEventApplyAtRef.current;
          if (justAppliedMsAgo < 1200) {
            dbg('[DynamicSEO] Ignoring fetch result because recent event was applied', justAppliedMsAgo);
            return;
          }
          if (data) {
            dbg('[DynamicSEO] Setting SEO data:', data);
            setSeo(data);
          } else {
            dbg('[DynamicSEO] No SEO data found, setting to null');
            setSeo(null);
          }
        }
      } catch (error) {
        if (isSeoDebugEnabled) {
          // eslint-disable-next-line no-console
          console.error('[DynamicSEO] Error fetching SEO data:', error);
        }
        if (mounted) {
          setSeo(null);
        }
      }
    })();
    
    return () => { mounted = false; };
  }, [actualType, actualIdentifier, actualTab, isActive]);

  // Handle SEO updates from SeoSettingsPanel
  useEffect(() => {
    const handleUpdated = (e) => {
      const payload = e.detail || {};
      dbg('[DynamicSEO] Received seo-updated event:', payload);
      
      // Match against the detected page info, not the raw props (which may be undefined)
      const matchesType = !payload.type || payload.type === actualType;
      const matchesIdentifier = !payload.identifier || payload.identifier === actualIdentifier;
      const matchesTab = !actualTab || !payload.tab || payload.tab === actualTab;
      
      if (matchesType && matchesIdentifier && matchesTab) {
        dbg('[DynamicSEO] Updating SEO data from event for current page:', { actualType, actualIdentifier, actualTab });
        setSeo(payload);
        lastEventApplyAtRef.current = Date.now();

        // After a short delay, re-fetch from backend to ensure persistence and sync any normalization
        setTimeout(async () => {
          try {
            const refreshed = await SeoService.get({
              type: actualType,
              identifier: actualIdentifier,
              path: typeof window !== 'undefined' ? window.location.pathname : undefined,
              tab: actualTab,
            });
            if (refreshed) {
              dbg('[DynamicSEO] Refreshed SEO after save:', refreshed);
              setSeo(refreshed);
              lastEventApplyAtRef.current = Date.now();
            }
          } catch (_) {
            // ignore
          }
        }, 150);
      } else {
        dbg('[DynamicSEO] Ignored seo-updated event (not current page). Current:', { actualType, actualIdentifier, actualTab });
      }
    };
    
    window.addEventListener('seo-updated', handleUpdated);
    return () => window.removeEventListener('seo-updated', handleUpdated);
  }, [actualType, actualIdentifier, actualTab]);

  // Default values
  const defaults = {
    title: '',
    description: '',
    keywords: [],
    canonical: typeof window !== 'undefined' ? window.location.href : '',
    robots: 'index,follow',
    lang: 'en',
    publisher: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: '',
    structuredData: null,
  };
  
  const {
    title,
    description,
    keywords,
    canonical,
    robots,
    lang,
    publisher,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    structuredData,
  } = seo || defaults;

  // Debug current SEO state
  useEffect(() => {
    dbg('[DynamicSEO] Current SEO state:', {
      title,
      description,
      robots,
      canonical,
      hasSeoData: !!seo
    });
  }, [seo, title, description, robots, canonical]);

  // Apply SEO data to document head
  useLayoutEffect(() => {
    if (typeof document !== 'undefined' && seo && isActive) {
      dbg('[DynamicSEO] useLayoutEffect triggered with SEO data:', seo);
      dbg('[DynamicSEO] About to apply title:', seo.title);
      dbg('[DynamicSEO] About to apply description:', seo.description);
      
      // Set title
      if (seo.title) {
        const oldTitle = document.title;
        document.title = seo.title;
        dbg('[DynamicSEO] Title changed from:', oldTitle, 'to:', seo.title);
        
        // Verify title was set
        setTimeout(() => {
          dbg('[DynamicSEO] Title verification - Current title:', document.title);
          if (document.title !== seo.title) {
            dbg('[DynamicSEO] WARNING: Title was not set correctly! Expected:', seo.title, 'Got:', document.title);
          }
        }, 50);
      }
      
      // Set meta description
      if (seo.description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = seo.description;
        dbg('[DynamicSEO] Set meta description to:', seo.description);
      }
      
      // Set robots meta (default to index,follow if not provided)
      {
        let metaRobots = document.querySelector('meta[name="robots"]');
        if (!metaRobots) {
          metaRobots = document.createElement('meta');
          metaRobots.name = 'robots';
          document.head.appendChild(metaRobots);
        }
        const robotsValue = seo.robots || 'index,follow';
        metaRobots.content = robotsValue;
        dbg('[DynamicSEO] Set robots meta to:', robotsValue);
      }
      
      // Set or clear keywords meta
      {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (seo.keywords && seo.keywords.length > 0) {
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.name = 'keywords';
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords;
        dbg('[DynamicSEO] Set keywords meta to:', seo.keywords);
        } else if (metaKeywords) {
          // Clear stale keywords
          metaKeywords.content = '';
          dbg('[DynamicSEO] Cleared keywords meta (no keywords provided)');
        }
      }
      
      // Set canonical link (ensure a single canonical; default to origin+pathname)
      {
        const allCanonicals = Array.from(document.querySelectorAll('link[rel="canonical"]'));
        allCanonicals.slice(1).forEach(el => el.parentNode && el.parentNode.removeChild(el));
        let canonicalLink = allCanonicals[0];
        if (!canonicalLink) {
          canonicalLink = document.createElement('link');
          canonicalLink.rel = 'canonical';
          document.head.appendChild(canonicalLink);
        }
        const currentCanonical = (typeof window !== 'undefined') 
          ? `${window.location.origin}${window.location.pathname}`
          : '';
        // Always self-referencing canonical for SPA routes
        const canonicalHref = currentCanonical;
        canonicalLink.setAttribute('href', canonicalHref);
        dbg('[DynamicSEO] Set canonical link to:', canonicalHref);
      }
    } else {
      dbg('[DynamicSEO] useLayoutEffect - not applying SEO:', { 
        hasDocument: typeof document !== 'undefined', 
        hasSeo: !!seo,
        isActive,
        seoData: seo 
      });
    }
  }, [seo, isActive, location?.pathname]);

  // Persist canonical and robots against external changes (e.g., other libs rewriting head)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isActive) return;

    const desiredCanonical = (typeof window !== 'undefined')
      ? `${window.location.origin}${window.location.pathname}`
      : '';
    // Prefer index,follow unless SEO explicitly contains 'noindex'
    const desiredRobots = (seo && typeof seo.robots === 'string' && /noindex/i.test(seo.robots))
      ? seo.robots
      : 'index,follow';

    let enforcing = false;
    let debounceTimer = null;

    const getOrCreateCanonical = () => {
      let el = document.querySelector('link[rel="canonical"][data-dynamic-seo="true"]');
      if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        el.setAttribute('data-dynamic-seo', 'true');
        document.head.appendChild(el);
      }
      return el;
    };

    const getOrCreateRobots = () => {
      let el = document.querySelector('meta[name="robots"]');
      if (!el) {
        el = document.createElement('meta');
        el.name = 'robots';
        document.head.appendChild(el);
      }
      return el;
    };

    const enforce = () => {
      if (enforcing) return;
      enforcing = true;
      try {
        const canonicalEl = getOrCreateCanonical();
        const targetHref = (actualType === 'company' && seo?.canonical)
          ? computeCanonicalHref(seo.canonical)
          : desiredCanonical;
        if (canonicalEl.getAttribute('href') !== targetHref) {
          canonicalEl.setAttribute('href', targetHref);
          dbg('[DynamicSEO] Enforce canonical ->', targetHref);
        }

        const robotsEl = getOrCreateRobots();
        if (robotsEl.getAttribute('content') !== desiredRobots) {
          robotsEl.setAttribute('content', desiredRobots);
          dbg('[DynamicSEO] Enforce robots ->', desiredRobots);
        }
      } finally {
        enforcing = false;
      }
    };

    // Initial and single delayed enforcement
    enforce();
    const t1 = setTimeout(enforce, 100);

    // Observe only relevant elements and debounce reactions to avoid loops
    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(enforce, 60);
    });
    observer.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'content', 'rel'] });

    return () => {
      clearTimeout(t1);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [isActive, location?.pathname, seo?.canonical, seo?.robots]);

  // When no SEO is configured for the page, explicitly set clear/neutral tags
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isActive) return;
    if (seo !== null) return; // only when backend returned no SEO

    const currentPath = location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const neutralTitle = `SEO not configured · ${currentPath}`;
    const neutralDescription = 'SEO has not been configured for this page yet.';

    // Set a safe title so previous page title doesn't persist
    const oldTitle = document.title;
    document.title = neutralTitle;
    let titleTag = document.querySelector('title');
    if (!titleTag) {
      titleTag = document.createElement('title');
      document.head.appendChild(titleTag);
    }
    titleTag.textContent = neutralTitle;

    // Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = neutralDescription;

    // Robots: default to index,follow as requested
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'index,follow';

    // Canonical to current URL always (origin + pathname, remove duplicates)
    const allCanonicals = Array.from(document.querySelectorAll('link[rel="canonical"]'));
    allCanonicals.slice(1).forEach(el => el.parentNode && el.parentNode.removeChild(el));
    let canonicalLink = allCanonicals[0];
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    const canonicalHref = (typeof window !== 'undefined') ? `${window.location.origin}${window.location.pathname}` : '';
    canonicalLink.setAttribute('href', canonicalHref);

    // Ensure keywords do not persist
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.content = '';
    }

    dbg('[DynamicSEO] Applied neutral SEO because none configured. Old title:', oldTitle, 'New title:', neutralTitle);

    // Previously showed a visible banner; disabled per request to remove from every page
  }, [seo, isActive, location?.pathname, actualType, actualIdentifier]);

  // Manual override to ensure title is set
  useEffect(() => {
    if (title && typeof document !== 'undefined') {
      dbg('[DynamicSEO] Manual override - setting title to:', title);
      
      // Set title multiple times to ensure it sticks
      document.title = title;
      
      // Also try to find and update any existing title tag
      let titleTag = document.querySelector('title');
      if (!titleTag) {
        titleTag = document.createElement('title');
        document.head.appendChild(titleTag);
      }
      titleTag.textContent = title;
      
      // Force it multiple times to ensure it sticks
      setTimeout(() => {
        if (document.title !== title) {
          dbg('[DynamicSEO] Title still not set, forcing again...');
          document.title = title;
          if (titleTag) titleTag.textContent = title;
        }
      }, 100);
      
      setTimeout(() => {
        if (document.title !== title) {
          dbg('[DynamicSEO] Title still not set, final force...');
          document.title = title;
          if (titleTag) titleTag.textContent = title;
        }
      }, 500);
      
      // Final check after 1 second
      setTimeout(() => {
        dbg('[DynamicSEO] Final title check:', document.title);
        if (document.title !== title) {
          dbg('[DynamicSEO] WARNING: Title still not set correctly!');
        }
      }, 1000);
    }
  }, [title]);

  // Monitor for title changes and re-apply if overridden
  useEffect(() => {
    if (title && typeof document !== 'undefined') {
      dbg('[DynamicSEO] Setting up title change monitor for:', title);
      
      // Create a mutation observer to watch for title changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            const currentTitle = document.title;
            if (currentTitle !== title && currentTitle !== '') {
              dbg('[DynamicSEO] Title was changed by something else! Current:', currentTitle, 'Expected:', title);
              // Re-apply our title
              document.title = title;
              let titleTag = document.querySelector('title');
              if (titleTag) titleTag.textContent = title;
            }
          }
        });
      });
      
      // Start observing
      observer.observe(document.head, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['content']
      });
      
      return () => {
        observer.disconnect();
      };
    }
  }, [title]);

  // Simple test to verify data flow
  useEffect(() => {
    if (seo && isActive) {
      dbg('[DynamicSEO] SEO data received:', seo);
      dbg('[DynamicSEO] About to set title to:', seo.title);
      
      // Immediately try to set the title
      if (seo.title && typeof document !== 'undefined') {
        dbg('[DynamicSEO] Immediately setting title to:', seo.title);
        document.title = seo.title;
        
        // Verify it was set
        setTimeout(() => {
          dbg('[DynamicSEO] Title verification - Current title:', document.title);
          if (document.title !== seo.title) {
            dbg('[DynamicSEO] WARNING: Title was not set correctly!');
          }
        }, 100);
      }
      
      // Add a test button to manually set title (only in debug)
      if (isSeoDebugEnabled && typeof document !== 'undefined') {
        const testButtonId = `seo-title-${actualType}-${actualIdentifier}`;
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Set Title';
        testButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: red; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer;';
        testButton.onclick = () => {
          dbg('[DynamicSEO] Manual test - setting title to:', seo.title);
          document.title = seo.title;
          alert('Title set to: ' + seo.title);
        };
        
        // Remove any existing test button with this ID
        const existingButton = document.getElementById(testButtonId);
        if (existingButton) {
          document.body.removeChild(existingButton);
        }
        
        testButton.id = testButtonId;
        document.body.appendChild(testButton);
        
        // Remove button after 30 seconds
        setTimeout(() => {
          if (document.body.contains(testButton)) {
            document.body.removeChild(testButton);
          }
        }, 30000);
      }
    }
  }, [seo, isActive]);

  // Render head tags declaratively with Helmet for reliability (plus effects as backup)
  const canonicalFromHelmet = (typeof window !== 'undefined')
    ? ((actualType === 'company' && seo?.canonical)
        ? computeCanonicalHref(seo.canonical)
        : `${window.location.origin}${window.location.pathname}`)
    : '';
  const robotsFromHelmet = (seo && typeof seo.robots === 'string' && /noindex/i.test(seo.robots))
    ? seo.robots
    : 'index,follow';
  const titleFromHelmet = seo?.title || (seo === null ? `SEO not configured · ${(location?.pathname) || ''}` : '');
  const descriptionFromHelmet = seo?.description || (seo === null ? 'SEO has not been configured for this page yet.' : '');
  const keywordsFromHelmet = seo?.keywords ? (Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords) : '';

  return (
    <Helmet>
      {titleFromHelmet ? <title>{titleFromHelmet}</title> : null}
      {descriptionFromHelmet ? (
        <meta name="description" content={descriptionFromHelmet} />
      ) : null}
      <meta name="robots" content={robotsFromHelmet} />
      <meta name="keywords" content={keywordsFromHelmet} />
      {canonicalFromHelmet ? (
        <link rel="canonical" href={canonicalFromHelmet} data-dynamic-seo="true" />
      ) : null}
    </Helmet>
  );
};

export default DynamicSEO;


