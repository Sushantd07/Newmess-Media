import CompanyPage from '../models/CompanyPage.js';
import Subcategory from '../models/Subcategory.js';

export const generateSitemap = async (req, res) => {
  try {
    // Set XML content type
    res.set('Content-Type', 'text/xml');
    
    // Get base URL from environment or use default
    const baseUrl = process.env.SITE_URL || 'https://indiacustomerhelp.com';
    
    // Start building XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add static pages
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/category</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    
    // Fetch all active subcategories (business listings)
    const subcategories = await Subcategory.find({ isActive: true }).select('slug name parentCategory updatedAt');
    
    // Add business listing pages
    for (const sub of subcategories) {
      if (!sub.slug) continue;
      
      const categoryId = sub.parentCategory ? 'businesses' : 'general';
      const lastmod = sub.updatedAt ? sub.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${baseUrl}/category/${encodeURIComponent(categoryId)}/${encodeURIComponent(sub.slug)}</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`;
    }
    
    // Fetch all company pages
    const companyPages = await CompanyPage.find().select('slug categoryId subCategoryId updatedAt');
    
    // Add company pages
    for (const company of companyPages) {
      if (!company.slug || company.slug === 'No slug') continue;
      const lastmod = company.updatedAt ? company.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${baseUrl}/company/${encodeURIComponent(company.slug)}</loc>\n    <priority>0.7</priority>\n    <changefreq>weekly</changefreq>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`;
    }
    
    // Close XML
    xml += '</urlset>';
    
    // Send XML response
    res.send(xml);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};

// Alternative: Generate sitemap as JSON for easier debugging
export const generateSitemapJson = async (req, res) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://indiacustomerhelp.com';
    
    // Fetch subcategories (business listings)
    const subcategories = await Subcategory.find({ isActive: true }).select('slug name parentCategory updatedAt');
    
    // Fetch company pages
    const companyPages = await CompanyPage.find().select('slug categoryId subCategoryId updatedAt');
    
    const sitemapData = {
      baseUrl,
      totalUrls: 2 + subcategories.length + companyPages.length,
      pages: [
        {
          url: '/',
          priority: 1.0,
          changefreq: 'daily'
        },
        {
          url: '/category',
          priority: 0.9,
          changefreq: 'weekly'
        }
      ],
      categories: [], // No separate categories collection
      subcategories: subcategories.map(sub => {
        if (!sub.slug) return null;
        const categoryId = sub.parentCategory ? 'businesses' : 'general';
        return {
          url: `/category/${categoryId}/${sub.slug}`,
          priority: 0.8,
          changefreq: 'weekly',
          lastmod: sub.updatedAt ? sub.updatedAt.toISOString().split('T')[0] : null,
          name: sub.name
        };
      }).filter(Boolean),
      companies: companyPages.map(company => {
        if (!company.slug || company.slug === 'No slug') return null;
        return {
          url: `/company/${company.slug}`,
          priority: 0.7,
          changefreq: 'weekly',
          lastmod: company.updatedAt ? company.updatedAt.toISOString().split('T')[0] : null
        };
      }).filter(Boolean)
    };
    
    res.json(sitemapData);
    
  } catch (error) {
    console.error('Error generating sitemap JSON:', error);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
};
