import Subcategory from '../models/Subcategory.js';
import Category from '../models/Category.js';
import ContactNumbersTab from '../models/tabs/ContactNumbers.tabs.js';
import ComplaintsTab from '../models/tabs/Complaint.tabs.js';
import {
  incrementCategoryCount,
  decrementCategoryCount,
} from '../middleware/subcategoryMiddleware.js';
import mongoose from 'mongoose';

// ✅ Create Subcategory
export const createSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: subcategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating subcategory',
      error: err.message,
    });
  }
};

// Create Company Page with Complete Data
export const createCompanyPage = async (req, res) => {
  try {
    const {
      // Home page data
      id,
      name,
      slug,
      phone,
      logo,
      verified = true,
      isActive = true,
      tags = [],
      address = 'All India',
      timing = 'Mon - Sat, 9 AM - 5 PM',
      parentCategory,
      order = 0,
      role = 'Support', // New role field for dynamic label
      
      // Company page data
      description = '',
      companyName = '',
      mainPhone = '',
      website = '',
      founded = '',
      headquarters = '',
      parentCompany = '',
      rating = 0,
      totalReviews = 0,
      
      // Contact tab data (if you want to link existing contact data)
      contactTabId = null
    } = req.body;

    // Validate required fields
    if (!id || !name || !slug || !phone || !parentCategory) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: id, name, slug, phone, parentCategory'
      });
    }

    // Check if subcategory already exists
    const existingSubcategory = await Subcategory.findOne({
      $or: [{ id }, { slug }]
    });

    if (existingSubcategory) {
      return res.status(409).json({
        success: false,
        message: 'Subcategory with this ID or slug already exists'
      });
    }

    // Create the company page with all data
    const companyPageData = {
      // Home page fields
      id,
      name,
      slug,
      phone,
      logo,
      verified,
      isActive,
      tags,
      address,
      timing,
      parentCategory,
      order,
      role, // Add role field
      
      // Company page fields
      description,
      companyName: companyName || name,
      mainPhone: mainPhone || phone,
      website,
      founded,
      headquarters,
      parentCompany,
      rating,
      totalReviews,
      
      // Link to existing contact tab if provided
      tabs: {
        numbers: contactTabId,
        complaints: null,
        quickhelp: null,
        video: null,
        overview: null
      }
    };

    const newCompanyPage = await Subcategory.create(companyPageData);

    res.status(201).json({
      success: true,
      message: 'Company page created successfully',
      data: {
        companyPage: newCompanyPage,
        homePageData: {
          id: newCompanyPage.id,
          name: newCompanyPage.name,
          phone: newCompanyPage.phone,
          logo: newCompanyPage.logo,
          timing: newCompanyPage.timing
        },
        companyPageData: {
          description: newCompanyPage.description,
          companyName: newCompanyPage.companyName,
          website: newCompanyPage.website,
          rating: newCompanyPage.rating
        }
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating company page',
      error: err.message
    });
  }
};

// Link Existing Contact Tab to Company Page
export const linkContactTabToCompany = async (req, res) => {
  try {
    const { subcategoryId, contactTabId } = req.body;

    if (!subcategoryId || !contactTabId) {
      return res.status(400).json({
        success: false,
        message: 'subcategoryId and contactTabId are required'
      });
    }

    // Find the subcategory
    const subcategory = await Subcategory.findOne({
      $or: [
        { _id: subcategoryId },
        { id: subcategoryId },
        { slug: subcategoryId }
      ]
    });

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Link the contact tab
    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      subcategory._id,
      { 'tabs.numbers': contactTabId },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Contact tab linked successfully',
      data: {
        subcategoryId: updatedSubcategory._id,
        contactTabId: contactTabId,
        companyName: updatedSubcategory.name
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error linking contact tab',
      error: err.message
    });
  }
};

// Get Company Page Data (for frontend)
export const getCompanyPageData = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Build query based on whether companyId looks like an ObjectId
    let query;
    if (companyId.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      query = { _id: companyId };
    } else {
      // It's a slug or id string
      query = {
        $or: [
          { id: companyId },
          { slug: companyId }
        ]
      };
    }

    const companyPage = await Subcategory.findOne(query).populate([
      { path: 'parentCategory', select: 'name slug' },
      { path: 'tabs.numbers', model: 'ContactNumbersTab' },
      { path: 'tabs.complaints', model: 'ComplaintsTab' }
    ]);

    if (!companyPage) {
      return res.status(404).json({
        success: false,
        message: 'Company page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company page data fetched successfully',
      data: companyPage
    });

  } catch (err) {
    console.error('Error in getCompanyPageData:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching company page data',
      error: err.message
    });
  }
};

// Bulk Create Subcategories
export const bulkCreateSubcategories = async (req, res) => {
  try {
    const { subcategories } = req.body;

    if (!subcategories || !Array.isArray(subcategories)) {
      return res.status(400).json({
        success: false,
        message: 'Subcategories array is required'
      });
    }

    const createdSubcategories = [];
    const errors = [];

    for (const subcategoryData of subcategories) {
      try {
        const {
          name,
          slug,
          number,
          id,
          phone,
          parentCategory,
          logo,
          tags,
          address,
          timing,
          website,
          rating,
          ratingCount,
          verified,
          serviceType,
          fullForm,
          available24x7,
          verifiedDate,
          order
        } = subcategoryData;

        if (!name || !slug || !number || !id || !phone || !parentCategory) {
          errors.push({ name, error: 'Required fields missing' });
          continue;
        }

        // Check if subcategory already exists
        const existingSubcategory = await Subcategory.findOne({
          $or: [{ slug }, { id }]
        });

        if (existingSubcategory) {
          errors.push({ name, error: 'Subcategory already exists' });
          continue;
        }

        // Verify parent category exists
        const parentCategoryExists = await Category.findById(parentCategory);
        if (!parentCategoryExists) {
          errors.push({ name, error: 'Parent category not found' });
          continue;
        }

        const subcategory = await Subcategory.create({
          name,
          slug,
          number,
          id,
          phone,
          parentCategory,
          logo: logo || '',
          tags: tags || [],
          address: address || 'All India',
          timing: timing || 'Mon - Sat, 9 AM - 5 PM',
          website: website || '#',
          rating: rating || 5,
          ratingCount: ratingCount || 1,
          verified: verified !== undefined ? verified : true,
          serviceType,
          fullForm,
          available24x7: available24x7 !== undefined ? available24x7 : true,
          verifiedDate,
          order: order || 0
        });

        await incrementCategoryCount(subcategory);
        createdSubcategories.push(subcategory);
      } catch (error) {
        errors.push({ name: subcategoryData.name, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdSubcategories.length} subcategories`,
      data: createdSubcategories,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating subcategories',
      error: err.message
    });
  }
};

// Bulk Create Subcategories by Category ID
export const bulkCreateSubcategoriesByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { subcategories } = req.body;

    if (!subcategories || !Array.isArray(subcategories)) {
      return res.status(400).json({
        success: false,
        message: 'Subcategories array is required'
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    // Find category by ObjectId
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category with ID '${categoryId}' not found`
      });
    }

    const createdSubcategories = [];
    const errors = [];

    for (const subcategoryData of subcategories) {
      try {
        const {
          id,
          name,
          slug,
          phone,
          logo,
          tags,
          address,
          timing,
          verified,
          order
        } = subcategoryData;

        // Validate required fields
        if (!id || !name || !slug || !phone) {
          errors.push({ name, error: 'id, name, slug, and phone are required' });
          continue;
        }

        // Check if subcategory already exists
        const existingSubcategory = await Subcategory.findOne({
          $or: [{ id }, { slug }]
        });

        if (existingSubcategory) {
          errors.push({ name, error: 'Subcategory with this id or slug already exists' });
          continue;
        }

        const subcategory = await Subcategory.create({
          id,
          name,
          slug,
          phone,
          parentCategory: category._id, // Use category ObjectId from URL
          logo: logo || '',
          tags: tags || [],
          address: address || 'All India',
          timing: timing || 'Mon - Sat, 9 AM - 5 PM',
          verified: verified !== undefined ? verified : true,
          order: order || 0
        });

        createdSubcategories.push(subcategory);
      } catch (error) {
        errors.push({ name: subcategoryData.name, error: error.message });
      }
    }

    // Update category count
    if (createdSubcategories.length > 0) {
      const newCount = category.subcategoryCount + createdSubcategories.length;
      await Category.findByIdAndUpdate(category._id, { subcategoryCount: newCount });
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdSubcategories.length} subcategories for category '${category.name}'`,
      data: {
        category: {
          _id: category._id,
          name: category.name,
          slug: category.slug
        },
        subcategories: createdSubcategories,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subcategories by category ID',
      error: error.message
    });
  }
};

// ✅ Get All Subcategories
export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ isActive: true })
      .populate('parentCategory', 'name slug')
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Subcategories fetched successfully',
      data: subcategories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategories',
      error: err.message
    });
  }
};

// ✅ Get Subcategories by Category ID
export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({
      parentCategory: req.params.categoryId,
      isActive: true
    })
      .populate('parentCategory', 'name slug')
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Subcategories fetched successfully',
      data: subcategories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategories',
      error: err.message
    });
  }
};

// Get Subcategory by ID
export const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id)
      .populate('parentCategory', 'name slug');

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory fetched successfully',
      data: subcategory
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategory',
      error: err.message
    });
  }
};

// Update Subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name slug');

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      data: subcategory
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating subcategory',
      error: err.message
    });
  }
};

// Update Company Page Data
export const updateCompanyPage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Build query based on whether id looks like an ObjectId
    let query;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      query = { _id: id };
    } else {
      // It's a slug or id string
      query = {
        $or: [
          { id: id },
          { slug: id }
        ]
      };
    }

    // Find the subcategory
    const subcategory = await Subcategory.findOne(query);
    
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Prepare update object
    const updateObject = {
      $set: {
        name: updateData.name,
        description: updateData.description,
        founded: updateData.founded,
        headquarters: updateData.headquarters,
        rating: updateData.rating,
        website: updateData.website,
        phone: updateData.phone,
        complaintContent: updateData.complaintContent,
      }
    };

    // Update the subcategory with new data
    const updatedSubcategory = await Subcategory.findOneAndUpdate(
      query,
      updateObject,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Company page updated successfully',
      data: updatedSubcategory
    });

  } catch (error) {
    console.error('Error updating company page:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating company page',
      error: error.message
    });
  }
};

// ✅ Delete Subcategory (with count update)
export const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    await decrementCategoryCount(subcategory); // Update count
    res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subcategory',
      error: err.message
    });
  }
};

// Create Contact Numbers Data and Auto-Link to Subcategory
export const createContactNumbersData = async (req, res) => {
  try {
    const {
      subcategoryId, // ID of the subcategory to link to
      tabTitle,
      tabDescription,
      topContactCards,
      nationalNumbersSection,
      helplineNumbersSection,
      allIndiaNumbersSection,
      stateWiseNumbersSection,
      smsServicesSection,
      ivrMenuSection,
      quickLinksSection,
      emailSupportSection,
      customerCareListSection
    } = req.body;

    // Validate required fields
    if (!subcategoryId || !tabTitle) {
      return res.status(400).json({
        success: false,
        message: 'subcategoryId and tabTitle are required'
      });
    }

    // Find the subcategory first
    const subcategory = await Subcategory.findOne({
      $or: [
        { _id: subcategoryId },
        { id: subcategoryId },
        { slug: subcategoryId }
      ]
    });

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Create the ContactNumbers document
    const contactNumbersData = {
      tabTitle,
      tabDescription,
      topContactCards,
      nationalNumbersSection,
      helplineNumbersSection,
      allIndiaNumbersSection,
      stateWiseNumbersSection,
      smsServicesSection,
      ivrMenuSection,
      quickLinksSection,
      emailSupportSection,
      customerCareListSection
    };

    const contactNumbers = await ContactNumbersTab.create(contactNumbersData);

    // Auto-link the contact numbers to the subcategory
    subcategory.tabs.numbers = contactNumbers._id;
    await subcategory.save();

    res.status(201).json({
      success: true,
      message: 'Contact numbers data created and linked successfully',
      data: {
        contactNumbersId: contactNumbers._id,
        subcategoryId: subcategory._id,
        subcategoryName: subcategory.name,
        tabTitle: contactNumbers.tabTitle
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating contact numbers data',
      error: err.message
    });
  }
};

// Add Contact Numbers Tab to Company by Slug (Single Step)
export const addContactNumbersToCompanyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const contactNumbersData = req.body;

    // Validate required fields
    if (!contactNumbersData.tabTitle) {
      return res.status(400).json({
        success: false,
        message: 'tabTitle is required'
      });
    }

    // Find the subcategory by slug
    const subcategory = await Subcategory.findOne({
      $or: [
        { slug: slug },
        { id: slug }
      ]
    });

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Create the ContactNumbers document
    const contactNumbers = await ContactNumbersTab.create(contactNumbersData);

    // Auto-link the contact numbers to the subcategory
    subcategory.tabs.numbers = contactNumbers._id;
    await subcategory.save();

    // Populate the contact numbers data
    await subcategory.populate('tabs.numbers');

    res.status(201).json({
      success: true,
      message: 'Contact numbers tab added to company successfully',
      data: {
        companyName: subcategory.name,
        companySlug: subcategory.slug,
        contactNumbersId: contactNumbers._id,
        tabTitle: contactNumbers.tabTitle,
        fullCompanyData: subcategory
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding contact numbers to company',
      error: err.message
    });
  }
};

// ✅ Add Complaints Tab to Company by Slug
export const addComplaintsToCompanyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const complaintsData = req.body;

    // Validate required fields
    if (!complaintsData.tabTitle) {
      return res.status(400).json({
        success: false,
        message: 'tabTitle is required'
      });
    }

    // Find the subcategory by slug
    const subcategory = await Subcategory.findOne({
      $or: [
        { slug: slug },
        { id: slug }
      ]
    });

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Create the ComplaintsTab document
    const complaintsTab = await ComplaintsTab.create(complaintsData);

    // Auto-link the complaints tab to the subcategory
    subcategory.tabs.complaints = complaintsTab._id;
    await subcategory.save();

    // Populate the complaints data
    await subcategory.populate('tabs.complaints');

    res.status(201).json({
      success: true,
      message: 'Complaints tab added to company successfully',
      data: {
        companyName: subcategory.name,
        companySlug: subcategory.slug,
        complaintsTabId: complaintsTab._id,
        tabTitle: complaintsTab.tabTitle,
        fullCompanyData: subcategory
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error adding complaints tab to company',
      error: err.message
    });
  }
};
