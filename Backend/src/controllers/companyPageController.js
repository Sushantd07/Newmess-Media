import CompanyPage from '../models/CompanyPage.js';
import ContactNumbersTab from '../models/tabs/ContactNumbers.tabs.js';
import ComplaintsTab from '../models/tabs/Complaint.tabs.js';
import QuickHelpTab from '../models/tabs/QuickHelp.tabs.js';
import OverviewTab from '../models/tabs/OverviewTabs.js';
import VideoGuideTab from '../models/tabs/VideoGuide.tabs.js';

// Create Company Page
export const createCompanyPage = async (req, res) => {
  try {
    const companyPage = await CompanyPage.create(req.body);
    res.status(201).json({ success: true, data: companyPage });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Create Company Page with Contact Numbers
export const createCompanyPageWithContactNumbers = async (req, res) => {
  try {
    const { companyData, contactNumbersData } = req.body;
    
    // Step 1: Create contact numbers tab
    const contactNumbersTab = await ContactNumbersTab.create(contactNumbersData);
    
    // Step 2: Create company page with contact numbers tab linked
    const companyPageData = {
      ...companyData,
      tabs: {
        numbers: contactNumbersTab._id,
        complaints: null,
        quickhelp: null,
        video: null,
        overview: null
      }
    };
    
    const companyPage = await CompanyPage.create(companyPageData);
    
    // Step 3: Populate the contact numbers data
    await companyPage.populate('tabs.numbers');
    
    res.status(201).json({ 
      success: true, 
      data: companyPage,
      message: 'Company page created with contact numbers successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Create Contact Numbers Tab Only
export const createContactNumbersTab = async (req, res) => {
  try {
    const contactNumbersTab = await ContactNumbersTab.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: contactNumbersTab,
      message: 'Contact numbers tab created successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Add Contact Numbers Tab to Existing Company Page
export const addContactNumbersToCompany = async (req, res) => {
  try {
    const { slug } = req.params;
    const contactNumbersData = req.body;
    
    // Step 1: Find the company page
    const companyPage = await CompanyPage.findOne({ slug });
    
    if (!companyPage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company page not found' 
      });
    }
    
    // Step 2: Create contact numbers tab
    const contactNumbersTab = await ContactNumbersTab.create(contactNumbersData);
    
    // Step 3: Update company page to link the contact numbers tab
    const updatedCompanyPage = await CompanyPage.findByIdAndUpdate(
      companyPage._id,
      {
        tabs: {
          ...companyPage.tabs,
          numbers: contactNumbersTab._id
        }
      },
      { new: true }
    ).populate('tabs.numbers');
    
    res.status(200).json({ 
      success: true, 
      data: updatedCompanyPage,
      message: 'Contact numbers tab added to company page successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get All Company Pages
export const getAllCompanyPages = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, subCategoryId } = req.query;
    
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (subCategoryId) filter.subCategoryId = subCategoryId;

    const companyPages = await CompanyPage.find(filter)
      .populate('tabs.numbers')
      .populate('tabs.complaints')
      .populate('tabs.quickhelp')
      .populate('tabs.video')
      .populate('tabs.overview')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await CompanyPage.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: companyPages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Company Page by Slug
export const getCompanyPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const companyPage = await CompanyPage.findOne({ slug })
      .populate('tabs.numbers')
      .populate('tabs.complaints')
      .populate('tabs.quickhelp')
      .populate('tabs.video')
      .populate('tabs.overview');

    if (!companyPage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company page not found' 
      });
    }

    res.status(200).json({ success: true, data: companyPage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Company Page by Category and Subcategory
export const getCompanyPagesByCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;
    
    const filter = { categoryId };
    if (subCategoryId) filter.subCategoryId = subCategoryId;

    const companyPages = await CompanyPage.find(filter)
      .select('name logo description rating totalReviews slug')
      .sort({ name: 1 });

    res.status(200).json({ success: true, data: companyPages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Company Page
export const updateCompanyPage = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const companyPage = await CompanyPage.findOneAndUpdate(
      { slug },
      req.body,
      { new: true, runValidators: true }
    ).populate('tabs.numbers')
     .populate('tabs.complaints')
     .populate('tabs.quickhelp')
     .populate('tabs.video')
     .populate('tabs.overview');

    if (!companyPage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company page not found' 
      });
    }

    res.status(200).json({ success: true, data: companyPage });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete Company Page
export const deleteCompanyPage = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const companyPage = await CompanyPage.findOneAndDelete({ slug });

    if (!companyPage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company page not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Company page deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Search Company Pages
export const searchCompanyPages = async (req, res) => {
  try {
    const { q, categoryId, subCategoryId } = req.query;
    
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (subCategoryId) filter.subCategoryId = subCategoryId;
    
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ];
    }

    const companyPages = await CompanyPage.find(filter)
      .select('name logo description rating totalReviews slug categoryId subCategoryId')
      .sort({ rating: -1, name: 1 });

    res.status(200).json({ success: true, data: companyPages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Company Page with Specific Tab
export const getCompanyPageTab = async (req, res) => {
  try {
    const { slug, tabName } = req.params;
    
    const companyPage = await CompanyPage.findOne({ slug })
      .populate(`tabs.${tabName}`);

    if (!companyPage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company page not found' 
      });
    }

    const tabData = companyPage.tabs[tabName];
    if (!tabData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tab not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        companyInfo: {
          name: companyPage.name,
          logo: companyPage.logo,
          slug: companyPage.slug
        },
        tabData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Contact Numbers Tab
export const updateContactNumbersTab = async (req, res) => {
  try {
    const { slug } = req.params;
    const contactNumbersData = req.body;
    
    // Step 1: Find the company page
    const companyPage = await CompanyPage.findOne({ slug });
    
    if (!companyPage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company page not found' 
      });
    }

    // Step 2: Check if contact numbers tab exists
    if (!companyPage.tabs.numbers) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact numbers tab not found for this company' 
      });
    }

    // Step 3: Update the contact numbers tab
    const updatedContactNumbers = await ContactNumbersTab.findByIdAndUpdate(
      companyPage.tabs.numbers,
      contactNumbersData,
      { new: true, runValidators: true }
    );

    if (!updatedContactNumbers) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact numbers tab not found' 
      });
    }

    // Step 4: Return the updated company page with populated contact numbers
    const updatedCompanyPage = await CompanyPage.findById(companyPage._id)
      .populate('tabs.numbers')
      .populate('tabs.complaints')
      .populate('tabs.quickhelp')
      .populate('tabs.video')
      .populate('tabs.overview');

    res.status(200).json({ 
      success: true, 
      data: updatedCompanyPage,
      message: 'Contact numbers updated successfully'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Save Dynamic Components
export const saveDynamicComponents = async (req, res) => {
  try {
    const { companySlug, components } = req.body;
    
    if (!companySlug || !components) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company slug and components are required' 
      });
    }

    // Find the company page
    const companyPage = await CompanyPage.findOne({ slug: companySlug });
    
    if (!companyPage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company page not found' 
      });
    }

    // Update the company page with dynamic components
    companyPage.dynamicComponents = components;
    await companyPage.save();

    res.status(200).json({ 
      success: true, 
      data: companyPage,
      message: 'Dynamic components saved successfully'
    });
  } catch (err) {
    console.error('Error saving dynamic components:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}; 