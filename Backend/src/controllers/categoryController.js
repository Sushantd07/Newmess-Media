import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { 
      name, 
      slug, 
      description, 
      iconName, 
      icon, 
      order, 
      isActive, 
      featured, 
      metaTitle, 
      metaDescription, 
      keywords,
      color 
    } = req.body;
    

    
    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and slug are required' 
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      $or: [{ name }, { slug }] 
    });
    
    if (existingCategory) {
      return res.status(400).json({ 
        success: false, 
        message: 'Category with this name or slug already exists' 
      });
    }

    const categoryData = {
      name,
      slug,
      description,
      iconName,
      icon,
      order: order || 0,
      subcategoryCount: 0,
      isActive: isActive !== undefined ? isActive : true,
      featured: featured || false,
      metaTitle,
      metaDescription,
      keywords: keywords || []
    };

    const category = await Category.create(categoryData);



    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (err) {

    res.status(500).json({ 
      success: false, 
      message: 'Error creating category',
      error: err.message 
    });
  }
};

// Bulk Create Categories
export const bulkCreateCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    
    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Categories array is required' 
      });
    }

    const createdCategories = [];
    const errors = [];

    for (const categoryData of categories) {
      try {
        const { name, slug, description, iconName, icon, order } = categoryData;
        
        if (!name || !slug) {
          errors.push({ name, error: 'Name and slug are required' });
          continue;
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ 
          $or: [{ name }, { slug }] 
        });
        
        if (existingCategory) {
          errors.push({ name, error: 'Category already exists' });
          continue;
        }

        const category = await Category.create({
          name,
          slug,
          description,
          iconName,
          icon,
          order: order || 0,
          subcategoryCount: 0
        });

        createdCategories.push(category);
      } catch (error) {
        errors.push({ name: categoryData.name, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdCategories.length} categories`,
      data: createdCategories,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating categories',
      error: err.message 
    });
  }
};

// GET /api/categories → Basic data for /home/category
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();

    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        const count = await Subcategory.countDocuments({ 
          parentCategory: category._id,
          isActive: true 
        });
        return {
          ...category,
          subcategoryCount: count,
        };
      })
    );

    res.status(200).json({ 
      success: true, 
      message: 'Categories fetched successfully',
      data: updatedCategories 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching categories',
      error: err.message 
    });
  }
};

// Get Categories with Subcategories (Efficient for CategoryGrid)
export const getCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    // Get subcategories for each category efficiently
    const categoriesWithSubs = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({
          parentCategory: category._id,
          isActive: true
        })
        .select('_id id name slug phone logo verified tags address timing order')
        .sort({ order: 1 })
        .lean();

        return {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          subcategoryCount: subcategories.length,
          subcategories: subcategories
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Categories with subcategories fetched successfully',
      data: categoriesWithSubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories with subcategories',
      error: error.message
    });
  }
};

// Get Category Grid Data (Optimized for frontend)
export const getCategoryGridData = async (req, res) => {
  try {
    // Get top 10 categories with their subcategories
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .limit(10)
      .lean();

    const categoriesWithSubs = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({
          parentCategory: category._id,
          isActive: true
        })
        .select('_id id name slug phone logo verified tags address timing order mainPhone website')
        .sort({ order: 1 })
        .limit(20) // Limit subcategories for performance
        .lean();

        return {
          _id: category._id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          subcategoryCount: subcategories.length,
          subcategories: subcategories
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Category grid data fetched successfully',
      data: categoriesWithSubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category grid data',
      error: error.message
    });
  }
};

// Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: category
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching category',
      error: err.message 
    });
  }
};

// Get Category by Slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: category
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching category',
      error: err.message 
    });
  }
};

// Get Company Page Data (Detailed) by Subcategory ID or Slug
export const getCompanyPageData = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    
    // Find subcategory by ID or slug
    const query = {
      $or: [
        { _id: subcategoryId },
        { id: subcategoryId },
        { slug: subcategoryId }
      ]
    };

    const companyPage = await Subcategory.findOne(query).populate([
      { path: 'parentCategory', select: 'name slug' },
      { path: 'tabs.numbers', model: 'ContactNumbersTab' },
      { path: 'tabs.complaints', model: 'ComplaintsTab' },
      { path: 'tabs.quickhelp', model: 'QuickHelpTab' },
      { path: 'tabs.video', model: 'VideoGuideTab' },
      { path: 'tabs.overview', model: 'OverviewTab' }
    ]);
    
    if (!companyPage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company page not found' 
      });
    }

    // Determine which tabs are enabled based on actual content
    // Use stored selectedTabs from admin panel if available, otherwise detect dynamically
    let selectedTabs = companyPage.selectedTabs || [];
    
    // If no stored selectedTabs, detect dynamically based on content
    if (selectedTabs.length === 0) {
      if (companyPage.tabs.overview) selectedTabs.push("overview");
      if (companyPage.tabs.numbers) selectedTabs.push("numbers");
      if (companyPage.tabs.complaints) selectedTabs.push("complaints");
      if (companyPage.tabs.quickhelp) selectedTabs.push("quickhelp");
      if (companyPage.tabs.video) selectedTabs.push("video");
    }

    // Add selectedTabs to the response
    const subcategoryDataWithSelectedTabs = {
      ...companyPage.toObject(),
      selectedTabs
    };

    res.status(200).json({
      success: true,
      message: 'Company page data fetched successfully',
      data: subcategoryDataWithSelectedTabs
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching company page data',
      error: err.message 
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating category',
      error: err.message 
    });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Also delete all subcategories under this category
    await Subcategory.deleteMany({ parentCategory: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Category and its subcategories deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting category',
      error: err.message 
    });
  }
};

// Update Category Display Limit
export const updateCategoryDisplayLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayLimit } = req.body;
    
    // Validate display limit
    if (!displayLimit || displayLimit < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Display limit must be a positive number' 
      });
    }

    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    // Update the display limit
    category.displayLimit = displayLimit;
    await category.save();

    res.json({
      success: true,
      message: 'Category display limit updated successfully',
      data: {
        _id: category._id,
        name: category.name,
        displayLimit: category.displayLimit
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating category display limit',
      error: err.message 
    });
  }
};

// Upload Category Icon
export const uploadCategoryIcon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No icon file provided'
      });
    }

    // Validate file type
    if (!req.file.mimetype.includes('svg')) {
      return res.status(400).json({
        success: false,
        message: 'Only SVG files are allowed for category icons'
      });
    }

    // Validate file size (100KB limit)
    if (req.file.size > 100 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Icon file size must be less than 100KB'
      });
    }

    // Generate the public URL path for the uploaded icon
    const iconPath = `/category-icons/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Category icon uploaded successfully',
      iconPath: iconPath,
      filename: req.file.filename,
      size: req.file.size
    });

  } catch (err) {
    console.error('Error uploading category icon:', err);
    res.status(500).json({
      success: false,
      message: 'Error uploading category icon',
      error: err.message
    });
  }
};
