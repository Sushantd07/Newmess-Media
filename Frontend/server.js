import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set default crawlability headers for all routes (can be overridden per-route)
app.use((req, res, next) => {
  res.set('X-Robots-Tag', 'index, follow');
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Import your App component (we'll need to modify it for SSR)
import App from './src/App.jsx';

// Proxy dynamic sitemap and robots.txt from backend in production SSR
const BACKEND_ORIGIN = process.env.VITE_BACKEND_ORIGIN || 'https://newmess-media-backend.onrender.com';

app.get(['/sitemap.xml', '/sitemap.json', '/robots.txt'], async (req, res) => {
  try {
    const upstreamUrl = `${BACKEND_ORIGIN}${req.path}`;
    const upstream = await fetch(upstreamUrl);
    if (!upstream.ok) {
      return res.status(upstream.status).send(`Upstream error ${upstream.status}`);
    }
    // Set appropriate content type based on path
    if (req.path.endsWith('.xml')) {
      res.set('Content-Type', 'text/xml');
    } else if (req.path.endsWith('.json')) {
      res.set('Content-Type', 'application/json');
    } else if (req.path === '/robots.txt') {
      res.set('Content-Type', 'text/plain');
    }
    const body = await upstream.text();
    return res.status(200).send(body);
  } catch (error) {
    console.error('[SSR] Proxy error for', req.path, error);
    return res.status(502).send('Bad Gateway');
  }
});

// Function to fetch SEO data server-side
async function fetchSeoData(pathname) {
  try {
    const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://newmess-media-backend.onrender.com/api';
    
    // Determine SEO type and identifier based on pathname
    let seoType = 'route';
    let seoIdentifier = pathname;
    
    if (pathname === '/') {
      seoType = 'home';
      seoIdentifier = 'home';
    } else if (pathname === '/category') {
      seoType = 'all-categories';
      seoIdentifier = 'all-categories';
    } else if (pathname.startsWith('/category/')) {
      // Extract category name from URL
      const categoryName = pathname.replace('/category/', '');
      seoType = 'category';
      seoIdentifier = categoryName;
    } else if (pathname.startsWith('/company/')) {
      // Extract company name from URL
      const companyName = pathname.replace('/company/', '');
      seoType = 'company';
      seoIdentifier = companyName;
    }
    
    console.log(`[SSR] Fetching SEO for: ${seoType} - ${seoIdentifier} (path: ${pathname})`);
    
    const seoResponse = await fetch(
      `${API_BASE_URL}/seo?type=${seoType}&identifier=${encodeURIComponent(seoIdentifier)}&path=${encodeURIComponent(pathname)}`
    );
    
    if (!seoResponse.ok) {
      console.warn(`[SSR] SEO API returned ${seoResponse.status}`);
      return null;
    }
    
    const seoData = await seoResponse.json();
    console.log(`[SSR] SEO data received:`, seoData.data ? {
      title: seoData.data.title,
      description: seoData.data.description,
      type: seoData.data.type,
      identifier: seoData.data.identifier
    } : 'No data');
    
    return seoData.data;
  } catch (error) {
    console.error('[SSR] Error fetching SEO data:', error.message);
    return null;
  }
}

// Function to generate dynamic schema for SSR
async function generateSSRSchema(pathname, seoData) {
  try {
    // Determine page type
    let type = 'route';
    let identifier = pathname;
    
    if (pathname === '/') {
      type = 'home';
      identifier = 'home';
    } else if (pathname === '/category') {
      type = 'all-categories';
      identifier = 'all-categories';
    }
    
    // Import the schema generator dynamically
    const { generateDynamicSchema } = await import('./src/utils/schemaGenerator.js');
    return await generateDynamicSchema(type, identifier, null, seoData);
  } catch (error) {
    console.error('[SSR] Error generating schema:', error);
    return null;
  }
}

// Function to generate automatic canonical URL and robots directive
function generateAutomaticSEO(pathnameWithSearch, origin) {
  const canonicalUrl = `${origin}${pathnameWithSearch}`;
  let robotsDirective = 'index,follow';
  
  // Determine robots directive based on page type
  if (pathnameWithSearch.includes('/admin') || pathnameWithSearch.includes('/login')) {
    robotsDirective = 'noindex,nofollow';
  } else if (pathnameWithSearch.includes('/error')) {
    robotsDirective = 'noindex,nofollow';
  } else if (pathnameWithSearch.includes('/private') || pathnameWithSearch.includes('/temp')) {
    robotsDirective = 'noindex,nofollow';
  } else {
    // Default for all other pages
    robotsDirective = 'index,follow';
  }
  
  return { canonicalUrl, robotsDirective };
}

// Function to generate HTML with SEO meta tags
async function generateHTML(app, helmet, seoData, pathnameWithSearch, origin) {
  const { title, description, keywords, canonical, robots, ogTitle, ogDescription, ogImage } = seoData || {};
  
  // Generate automatic SEO using current origin
  const { canonicalUrl, robotsDirective } = generateAutomaticSEO(pathnameWithSearch, origin);
  
  // Generate better fallbacks based on page type
  const generateFallbacks = (pathname, seoData) => {
    // Default fallbacks
    let fallbackTitle = 'India Customer Help | Verified Helpline & Support Numbers';
    let fallbackDescription = 'Find verified India customer care numbers for HDFC, Jio, IRCTC, Flipkart & more. Quick access to emergency helplines & real support solutions.';
    
    // Page-specific fallbacks
    if (pathname === '/') {
      fallbackTitle = 'India Customer Help | Verified Helpline & Support Numbers';
      fallbackDescription = 'Find verified India customer care numbers for HDFC, Jio, IRCTC, Flipkart & more. Quick access to emergency helplines & real support solutions.';
    } else if (pathname === '/category') {
      fallbackTitle = 'All Business Categories | India Customer Help';
      fallbackDescription = 'Browse through our comprehensive directory of business categories. Find verified customer care numbers and support for all major companies in India.';
    } else if (pathname.startsWith('/category/')) {
      const categoryName = pathname.replace('/category/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      fallbackTitle = `${categoryName} - Customer Care Numbers | India Customer Help`;
      fallbackDescription = `Find verified ${categoryName} customer care numbers, helpline numbers, and support contact information. Get instant help and expert support.`;
    } else if (pathname.startsWith('/company/')) {
      const companyName = pathname.replace('/company/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      fallbackTitle = `${companyName} Customer Care Number | India Customer Help`;
      fallbackDescription = `Get ${companyName} customer care number, helpline, and support contact information. Verified numbers for instant help and support.`;
    }
    
    return { fallbackTitle, fallbackDescription };
  };
  
  const { fallbackTitle, fallbackDescription } = generateFallbacks(pathnameWithSearch.split('?')[0], seoData);
  
  // Use SEO data or intelligent fallbacks
  const pageTitle = title || fallbackTitle;
  const pageDescription = description || fallbackDescription;
  const pageKeywords = keywords ? keywords.join(', ') : 'customer service, complaints, help, helpline, support, India';
  const pageCanonical = canonical || canonicalUrl;
  const pageRobots = robots || robotsDirective;
  const pageOgTitle = ogTitle || title || fallbackTitle;
  const pageOgDescription = ogDescription || description || fallbackDescription;
  const pageOgImage = ogImage || `${origin}/logo3-Photoroom.png`;
  
  // Generate dynamic schema
  const dynamicSchema = await generateSSRSchema(pathnameWithSearch.split('?')[0], seoData);
  const schemaScript = dynamicSchema ? `<script type="application/ld+json">${JSON.stringify(dynamicSchema)}</script>` : '';
  
  // Resolve client bundle (production) or fall back to dev entry
  let clientScriptTag = '<script type="module" src="/src/main.jsx"></script>';
  let cssTags = '';
  try {
    const manifestPath = path.join(__dirname, 'dist', 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const entry = manifest['src/main.jsx'] || manifest['src/main.tsx'] || manifest['index.html'];
      if (entry && entry.file) {
        clientScriptTag = `<script type="module" src="/${entry.file}"></script>`;
        if (Array.isArray(entry.css)) {
          cssTags = entry.css.map(href => `<link rel="stylesheet" href="/${href}" />`).join('\n');
        }
      }
    }
  } catch {}

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/png" href="/logo3-Photoroom.png" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <!-- Server-Side Rendered SEO Meta Tags -->
        <title>${pageTitle}</title>
        <meta name="description" content="${pageDescription}" />
        <meta name="keywords" content="${pageKeywords}" />
        <meta name="robots" content="${pageRobots}" />
        <link rel="canonical" href="${pageCanonical}" />
        
        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="${pageOgTitle}" />
        <meta property="og:description" content="${pageOgDescription}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${pageCanonical}" />
        <meta property="og:image" content="${pageOgImage}" />
        
        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${pageOgTitle}" />
        <meta name="twitter:description" content="${pageOgDescription}" />
        <meta name="twitter:image" content="${pageOgImage}" />
        
        <!-- Additional SEO Meta Tags -->
        <meta name="author" content="India Customer Help" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        
        <!-- Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1MHX3NRBQ1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
          gtag('config', 'G-1MHX3NRBQ1');
        </script>
        
                 <!-- React Helmet will add additional tags here -->
         ${helmet.title.toString()}
         ${helmet.meta.toString()}
         ${helmet.link.toString()}
         ${helmet.script.toString()}
         
         <!-- Dynamic JSON-LD Structured Data Schema -->
         ${schemaScript}
        ${cssTags}
      </head>
      <body>
        <div id="root">${app}</div>
        ${clientScriptTag}
      </body>
    </html>
  `;
}

// Main SSR route handler
app.get('*', async (req, res) => {
  try {
    console.log(`[SSR] Rendering route: ${req.url}`);
    
    // Fetch SEO data server-side
    const seoData = await fetchSeoData(req.path);
    
    // Create context for StaticRouter
    const context = {};
    
    // Resolve current origin and full path (including query)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const origin = `${protocol}://${host}`;
    const fullPath = req.originalUrl || req.url;
    
    // Render the React app server-side
    const helmetContext = {};
    const app = ReactDOMServer.renderToString(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={req.url} context={context}>
          <App seoData={seoData} />
        </StaticRouter>
      </HelmetProvider>
    );
    
    // Get helmet data
    const { helmet } = helmetContext;
    
         // Generate the final HTML
     const html = await generateHTML(app, helmet, seoData, fullPath, origin);
    
    // Send the rendered HTML
    res.send(html);
    
  } catch (error) {
    console.error('[SSR] Error rendering:', error);
    
    // Fallback to client-side rendering
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SSR Server running on port ${PORT}`);
  console.log(`📊 SEO data will be fetched server-side for crawlers`);
});
