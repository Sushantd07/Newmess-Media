/**
 * Automatic SEO Generation Utility
 * Generates canonical URLs and robots directives automatically for every page
 */

const BASE_URL = 'https://www.indiacustomerhelp.com';

/**
 * Generate automatic canonical URL based on current page
 * @param {string} pathname - Current page path
 * @param {string} search - Current search parameters
 * @param {string} customCanonical - Custom canonical from SEO settings
 * @returns {string} Canonical URL
 */
export const generateCanonicalUrl = (pathname = '', search = '', customCanonical = null) => {
  // Use custom canonical if provided
  if (customCanonical) {
    return customCanonical;
  }
  
  // Generate automatic canonical URL
  let canonicalUrl = BASE_URL + pathname;
  
  // Add search params if they're important for SEO (not tracking params)
  if (search) {
    const searchParams = new URLSearchParams(search);
    const importantParams = [];
    
    // Keep only SEO-relevant parameters
    for (const [key, value] of searchParams.entries()) {
      if (!['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'].includes(key)) {
        importantParams.push(`${key}=${value}`);
      }
    }
    
    if (importantParams.length > 0) {
      canonicalUrl += '?' + importantParams.join('&');
    }
  }
  
  return canonicalUrl;
};

/**
 * Generate automatic robots directive based on page type
 * @param {string} type - Page type (home, category, company, etc.)
 * @param {string} identifier - Page identifier
 * @param {string} pathname - Current page path
 * @param {string} customRobots - Custom robots directive from SEO settings
 * @returns {string} Robots directive
 */
export const generateRobotsDirective = (type = '', identifier = '', pathname = '', customRobots = null) => {
  // Use custom robots directive if provided
  if (customRobots) {
    return customRobots;
  }
  
  // Determine robots directive based on page type and path
  if (type === 'admin' || identifier?.includes('admin') || pathname?.includes('/admin')) {
    return 'noindex,nofollow';
  }
  
  if (type === 'login' || identifier?.includes('login') || pathname?.includes('/login')) {
    return 'noindex,nofollow';
  }
  
  if (type === 'error' || identifier?.includes('error') || pathname?.includes('/error')) {
    return 'noindex,nofollow';
  }
  
  // Private pages that shouldn't be indexed
  if (pathname?.includes('/private') || pathname?.includes('/temp')) {
    return 'noindex,nofollow';
  }
  
  // Default for all other pages - index and follow
  return 'index,follow';
};

/**
 * Generate complete automatic SEO data
 * @param {Object} seoData - SEO data from database
 * @param {string} type - Page type
 * @param {string} identifier - Page identifier
 * @param {string} pathname - Current page path
 * @param {string} search - Current search parameters
 * @returns {Object} Complete SEO data with automatic canonical and robots
 */
export const generateAutomaticSEO = (seoData = {}, type = '', identifier = '', pathname = '', search = '') => {
  const canonicalUrl = generateCanonicalUrl(pathname, search, seoData.canonical);
  const robotsDirective = generateRobotsDirective(type, identifier, pathname, seoData.robots);
  
  return {
    ...seoData,
    canonical: canonicalUrl,
    robots: robotsDirective,
    // Ensure Open Graph URL matches canonical
    ogUrl: canonicalUrl,
  };
};

/**
 * Get current page information for SEO
 * @returns {Object} Current page info
 */
export const getCurrentPageInfo = () => {
  if (typeof window === 'undefined') {
    return {
      pathname: '',
      search: '',
      href: '',
      origin: ''
    };
  }
  
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    href: window.location.href,
    origin: window.location.origin
  };
};

/**
 * Check if current page should be indexed
 * @param {string} type - Page type
 * @param {string} identifier - Page identifier
 * @param {string} pathname - Current page path
 * @returns {boolean} Whether page should be indexed
 */
export const shouldIndexPage = (type = '', identifier = '', pathname = '') => {
  const robots = generateRobotsDirective(type, identifier, pathname);
  return robots.includes('index');
};

/**
 * Get SEO-friendly URL parameters
 * @param {string} search - Search string
 * @returns {string} SEO-friendly search string
 */
export const getSEOFriendlySearch = (search = '') => {
  if (!search) return '';
  
  const searchParams = new URLSearchParams(search);
  const seoParams = [];
  
  // Keep only SEO-relevant parameters
  for (const [key, value] of searchParams.entries()) {
    if (!['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref'].includes(key)) {
      seoParams.push(`${key}=${value}`);
    }
  }
  
  return seoParams.length > 0 ? '?' + seoParams.join('&') : '';
};
