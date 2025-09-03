import express from 'express';
import { generateSitemap, generateSitemapJson } from '../controllers/sitemapController.js';

const router = express.Router();

// Generate XML sitemap
router.get('/sitemap.xml', generateSitemap);

// Generate JSON sitemap (for debugging/testing)
router.get('/sitemap.json', generateSitemapJson);

// Alternative route for XML sitemap
router.get('/sitemap', generateSitemap);

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
  const siteUrl = process.env.SITE_URL || 'https://indiacustomerhelp.com';
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1`;
  
  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

export default router;
