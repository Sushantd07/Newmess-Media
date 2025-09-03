// Dynamic Schema Generator - Fetches schema data from SEO database
import { getApiBaseUrl } from './apiHelper.js';

// Base schema that's always included
const getBaseSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.indiacustomerhelp.com/#organization",
      "name": "India Customer Help",
      "alternateName": "India's Most Trusted Business Directory",
      "url": "https://www.indiacustomerhelp.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.indiacustomerhelp.com/logo3-Photoroom.png",
        "width": 200,
        "height": 60
      },
      "description": "India's Most Trusted Business Directory. Connecting millions of Indians with verified toll-free numbers and authentic business information since 2022.",
      "foundingDate": "2022",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-1800-123-4567",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi"],
        "areaServed": "IN"
      },
      "email": "support@indiacustomerhelp.com",
      "sameAs": [
        "https://facebook.com/indiacustomerhelp",
        "https://twitter.com/indiacustomerhelp",
        "https://linkedin.com/company/indiacustomerhelp",
        "https://instagram.com/indiacustomerhelp"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "15000",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.indiacustomerhelp.com/#website",
      "url": "https://www.indiacustomerhelp.com",
      "name": "India Customer Help - Business Directory",
      "description": "Find verified toll-free numbers, business contacts, and essential services across India. Trusted by millions for authentic business information.",
      "publisher": {
        "@id": "https://www.indiacustomerhelp.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.indiacustomerhelp.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": ["en-IN", "hi-IN"],
      "dateModified": new Date().toISOString()
    }
  ]
});

// Generate dynamic schema based on page type and SEO data
export const generateDynamicSchema = async (type, identifier, tab, seoData) => {
  try {
    const baseSchema = getBaseSchema();
    const currentUrl = `https://www.indiacustomerhelp.com${typeof window !== 'undefined' ? window.location.pathname : ''}`;
    
    // Add breadcrumb for current page
    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `${currentUrl}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.indiacustomerhelp.com"
        }
      ]
    };

    // Add current page to breadcrumb if not home
    if (type !== 'home' && identifier !== 'home') {
      const pageName = seoData?.title || identifier || 'Page';
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        "position": 2,
        "name": pageName,
        "item": currentUrl
      });
    }

    baseSchema["@graph"].push(breadcrumbSchema);

    // Add page-specific schema based on type
    if (type === 'home') {
      // Home page specific schema
      baseSchema["@graph"].push({
        "@type": "ItemList",
        "@id": "https://www.indiacustomerhelp.com/#top-categories",
        "name": "Top Business Categories",
        "description": "Popular business categories with verified contact information",
        "numberOfItems": 8,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Service",
              "name": "Banking Services",
              "url": "https://www.indiacustomerhelp.com/category/banking-services",
              "description": "Find contact numbers for major banks, credit cards, and financial services"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Service",
              "name": "Telecom Services",
              "url": "https://www.indiacustomerhelp.com/category/telecom-services",
              "description": "Mobile operators, broadband services, and customer support numbers"
            }
          }
        ]
      });

      // FAQ Schema for home page
      baseSchema["@graph"].push({
        "@type": "FAQPage",
        "@id": "https://www.indiacustomerhelp.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I find a business contact number?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can search for any business by name, category, or location. Our directory contains verified toll-free numbers and contact information for businesses across India."
            }
          },
          {
            "@type": "Question",
            "name": "Are all the contact numbers verified?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we maintain a 99.9% verification rate. All contact numbers are regularly updated and verified to ensure accuracy."
            }
          }
        ]
      });

    } else if (type === 'category') {
      // Category page schema
      baseSchema["@graph"].push({
        "@type": "CollectionPage",
        "@id": `${currentUrl}#collection`,
        "name": seoData?.title || `Category: ${identifier}`,
        "description": seoData?.description || `Browse ${identifier} services and contact information`,
        "url": currentUrl,
        "mainEntity": {
          "@type": "ItemList",
          "name": `${identifier} Services`,
          "description": `List of ${identifier} services with contact information`
        }
      });

    } else if (type === 'company') {
      // Company page schema
      baseSchema["@graph"].push({
        "@type": "LocalBusiness",
        "@id": `${currentUrl}#business`,
        "name": seoData?.title || identifier,
        "description": seoData?.description || `Contact information for ${identifier}`,
        "url": currentUrl,
        "telephone": seoData?.phone || "+91-1800-123-4567",
        "email": seoData?.email || "support@indiacustomerhelp.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        },
        "serviceArea": {
          "@type": "Country",
          "name": "India"
        }
      });

    } else if (type === 'all-categories') {
      // All categories page schema
      baseSchema["@graph"].push({
        "@type": "CollectionPage",
        "@id": `${currentUrl}#categories`,
        "name": "All Business Categories",
        "description": "Browse all business categories and services",
        "url": currentUrl,
        "mainEntity": {
          "@type": "ItemList",
          "name": "Business Categories",
          "description": "Complete list of business categories with contact information"
        }
      });
    }

    // Add structured data from SEO database if available
    if (seoData?.structuredData) {
      try {
        const customSchema = typeof seoData.structuredData === 'string' 
          ? JSON.parse(seoData.structuredData) 
          : seoData.structuredData;
        
        if (Array.isArray(customSchema)) {
          baseSchema["@graph"].push(...customSchema);
        } else if (customSchema["@type"]) {
          baseSchema["@graph"].push(customSchema);
        }
      } catch (error) {
        console.warn('[SchemaGenerator] Error parsing structured data:', error);
      }
    }

    return baseSchema;

  } catch (error) {
    console.error('[SchemaGenerator] Error generating schema:', error);
    return getBaseSchema();
  }
};

// Function to inject schema into page
export const injectSchema = (schema) => {
  try {
    // Remove existing schema script
    const existingScript = document.querySelector('script[data-dynamic-schema="true"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create new schema script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic-schema', 'true');
    script.textContent = JSON.stringify(schema, null, 2);

    // Add to head
    document.head.appendChild(script);
    
    console.log('[SchemaGenerator] Schema injected:', schema);
  } catch (error) {
    console.error('[SchemaGenerator] Error injecting schema:', error);
  }
};
