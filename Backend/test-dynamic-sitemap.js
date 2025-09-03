import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = 'NumbersDB'; // Your actual database name

async function testSitemapGeneration() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URL);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
          // Test data retrieval
      console.log('\n📊 Fetching data for sitemap...');
      
      const subcategories = await db.collection('subcategories').find({ isActive: true }).project({ slug: 1, name: 1, parentCategory: 1, updatedAt: 1 }).toArray();
      console.log(`📂 Found ${subcategories.length} active subcategories (business listings)`);
      
      const companies = await db.collection('companypages').find({}).project({ categoryId: 1, subCategoryId: 1, slug: 1, updatedAt: 1 }).toArray();
      console.log(`🏢 Found ${companies.length} company pages`);
    
          // Generate sample sitemap XML
      console.log('\n🔗 Generating sample sitemap XML...');
      const siteUrl = process.env.SITE_URL || 'https://indiacustomerhelp.com';
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Static pages
      xml += `  <url>\n    <loc>${siteUrl}/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;
      xml += `  <url>\n    <loc>${siteUrl}/category</loc>\n    <priority>0.9</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
      
      // Business listings (from subcategories)
      for (const sub of subcategories.slice(0, 3)) { // Show first 3 for demo
        if (!sub.slug) continue;
        const categoryId = sub.parentCategory ? 'businesses' : 'general';
        const lastmod = sub.updatedAt ? new Date(sub.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        xml += `  <url>\n    <loc>${siteUrl}/category/${encodeURIComponent(categoryId)}/${encodeURIComponent(sub.slug)}</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`;
      }
      
      // Company pages
      for (const company of companies.slice(0, 3)) { // Show first 3 for demo
        if (!company.slug || company.slug === 'No slug') continue;
        const lastmod = company.updatedAt ? new Date(company.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        xml += `  <url>\n    <loc>${siteUrl}/company/${encodeURIComponent(company.slug)}</loc>\n    <priority>0.7</priority>\n    <changefreq>weekly</changefreq>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`;
      }
      
      xml += '</urlset>';
      
      console.log('\n📄 Sample Sitemap XML (first few entries):');
      console.log('=' .repeat(50));
      console.log(xml);
      console.log('=' .repeat(50));
      
      const totalUrls = 2 + subcategories.length + companies.length;
      console.log(`\n📈 Total URLs in sitemap: ${totalUrls}`);
      console.log(`🌐 Base URL: ${siteUrl}`);
    
    console.log('\n✅ Sitemap generation test completed successfully!');
    console.log('\n💡 To test the actual endpoints:');
    console.log(`   - XML: ${siteUrl}/sitemap.xml`);
    console.log(`   - JSON: ${siteUrl}/sitemap.json`);
    console.log(`   - Robots: ${siteUrl}/robots.txt`);
    
  } catch (error) {
    console.error('❌ Error testing sitemap generation:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

// Run the test
testSitemapGeneration();
