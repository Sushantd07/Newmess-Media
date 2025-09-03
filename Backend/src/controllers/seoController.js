import SeoSetting from '../models/SeoSetting.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const upsertSeo = asyncHandler(async (req, res) => {
  const { type, identifier, tab } = req.body;
  console.log('🔍 [seoController] upsertSeo called with:', { type, identifier, tab, body: req.body });
  if (!type || !identifier) {
    return res.status(400).json({ success: false, message: 'type and identifier are required' });
  }
  const update = { ...req.body, type };
  const filter = type === 'route' ? { identifier } : { type, identifier };
  let doc = await SeoSetting.findOne(filter);
  if (!doc) {
    // If creating a company record for a specific tab, store values under tabs[tab]
    if (type === 'company' && tab) {
      console.log('🔍 [seoController] Creating new company doc with tab:', tab);
      doc = await SeoSetting.create({
        type,
        identifier,
        tabs: {
          [tab]: { ...req.body },
        },
      });
      console.log('✅ [seoController] Created new doc:', doc._id);
    } else {
      doc = await SeoSetting.create(update);
    }
  } else {
    if (type === 'company' && tab) {
      console.log('🔍 [seoController] Updating existing company doc, tab:', tab);
      console.log('🔍 [seoController] Before update - tabs:', doc.tabs);
      
      // Initialize tabs if it doesn't exist
      if (!doc.tabs || typeof doc.tabs !== 'object') {
        console.log('🔍 [seoController] Initializing tabs object');
        doc.tabs = {};
      }
      
      // Update the specific tab - ensure we're creating/updating the tab properly
      console.log('🔍 [seoController] Setting tab data for:', tab);
      console.log('🔍 [seoController] Tab data being set:', req.body);
      doc.tabs[tab] = { ...req.body };
      console.log('🔍 [seoController] After update - tabs:', doc.tabs);
      console.log('🔍 [seoController] After update - tabs keys:', Object.keys(doc.tabs));
      
      // Mirror core fields to top-level for backward compatibility
      const mirrorKeys = ['title', 'description', 'keywords', 'canonical', 'robots', 'lang', 'publisher', 'ogTitle', 'ogDescription', 'ogImage', 'twitterCard', 'structuredData'];
      for (const key of mirrorKeys) {
        if (typeof req.body[key] !== 'undefined') {
          doc[key] = req.body[key];
        }
      }
      
      // Mark tabs as modified for Mongoose
      console.log('🔍 [seoController] Marking tabs as modified');
      doc.markModified('tabs');
      console.log('🔍 [seoController] About to save doc with tabs:', doc.tabs);
      console.log('🔍 [seoController] About to save doc with tabs keys:', Object.keys(doc.tabs));
    } else {
      Object.assign(doc, update);
    }
    
    try {
      console.log('🔍 [seoController] Attempting to save document...');
      const savedDoc = await doc.save();
      console.log('✅ [seoController] Doc saved successfully');
      console.log('🔍 [seoController] Saved doc tabs:', savedDoc.tabs);
      console.log('🔍 [seoController] Saved doc tabs keys:', savedDoc.tabs ? Object.keys(savedDoc.tabs) : 'No tabs');
    } catch (saveError) {
      console.error('❌ [seoController] Save failed:', saveError);
      throw saveError;
    }
  }
  // Return flattened view for the saved tab if applicable so clients can immediately reflect changes
  let response = doc.toObject ? doc.toObject() : doc;
  if (response && type === 'company' && tab && response.tabs && response.tabs[tab]) {
    response = { ...response, ...response.tabs[tab] };
  }
  console.log('🔍 [seoController] Returning response:', response);
  return res.json({ success: true, data: response });
});

export const getSeo = asyncHandler(async (req, res) => {
  const { type, identifier, path, tab } = req.query;
  console.log('🔍 [getSeo] Request query:', { type, identifier, path, tab });
  
  if (!type || !identifier) {
    return res.status(400).json({ success: false, message: 'type and identifier are required' });
  }
  
  // Support route-based lookup if type === 'route' (identifier is the pathname)
  let doc = null;
  if (type === 'route') {
    const routeId = path || identifier;
    doc = await SeoSetting.findOne({ type: 'route', identifier: routeId });
    if (!doc) {
      // Fallback for legacy docs saved without type
      doc = await SeoSetting.findOne({ identifier: routeId });
    }
    if (!doc) {
      // Friendly fallbacks for common static routes that may have been saved under previous types
      if (routeId === '/') {
        doc = await SeoSetting.findOne({ type: 'home', identifier: 'home' });
      } else if (routeId === '/category') {
        doc = await SeoSetting.findOne({ type: 'all-categories', identifier: 'all-categories' });
      }
    }
  } else {
    // 1) Exact match
    doc = await SeoSetting.findOne({ type, identifier });
    if (!doc) {
      // 2) Try decoded identifier
      const decoded = safeDecode(identifier);
      if (decoded && decoded !== identifier) {
        doc = await SeoSetting.findOne({ type, identifier: decoded });
      }
    }
    if (!doc) {
      // 3) Case-insensitive exact match using regex
      const escaped = escapeRegex(identifier);
      doc = await SeoSetting.findOne({ type, identifier: { $regex: `^${escaped}$`, $options: 'i' } });
    }
    if (!doc && type === 'company') {
      // 4) Fallback for legacy docs saved only inside tabs
      const or = [];
      const tabKeys = tab ? [tab] : ['contactnumber', 'complain', 'quickhelp', 'videoguide', 'overview'];
      for (const key of tabKeys) {
        or.push({ [`tabs.${key}.identifier`]: identifier });
        const decoded = safeDecode(identifier);
        if (decoded && decoded !== identifier) {
          or.push({ [`tabs.${key}.identifier`]: decoded });
        }
      }
      if (or.length) {
        doc = await SeoSetting.findOne({ $or: or });
      }
    }
  }
  
  console.log('🔍 [getSeo] Found doc:', doc ? {
    _id: doc._id,
    type: doc.type,
    identifier: doc.identifier,
    tabs: doc.tabs ? Object.keys(doc.tabs) : 'No tabs',
    hasTab: tab ? (doc.tabs && doc.tabs[tab] ? 'Yes' : 'No') : 'No tab specified'
  } : 'No doc found');
  
  let response = doc ? doc.toObject() : null;
  
  if (response && type === 'company' && tab && response.tabs && response.tabs[tab]) {
    console.log('🔍 [getSeo] Flattening response for tab:', tab);
    console.log('🔍 [getSeo] Tab data:', response.tabs[tab]);
    response = { ...response, ...response.tabs[tab] };
    console.log('🔍 [getSeo] Final flattened response keys:', Object.keys(response));
  } else if (response && type === 'company' && tab) {
    console.log('🔍 [getSeo] Tab not found or no tabs object:', {
      hasTabs: !!response.tabs,
      tabKeys: response.tabs ? Object.keys(response.tabs) : 'No tabs',
      requestedTab: tab
    });
  }
  
  console.log('🔍 [getSeo] Returning response:', response);
  return res.json({ success: true, data: response || null });
});

export const deleteSeo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await SeoSetting.findByIdAndDelete(id);
  return res.json({ success: true });
});

// Utils
function safeDecode(value) {
  try {
    return decodeURIComponent(value || '');
  } catch {
    return value;
  }
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


