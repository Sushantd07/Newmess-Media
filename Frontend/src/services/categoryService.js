const API_BASE_URL = '/api';

class CategoryService {
  static async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();

      if (data.success) {
        return data.data; // Return just the data array
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  static async getCategoriesWithSubcategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/with-subcategories`);
      const data = await response.json();

      if (data.success) {
        return data.data; // includes badges in each category
      } else {
        throw new Error(data.message || 'Failed to fetch categories with subcategories');
      }
    } catch (error) {
      console.error('Error fetching categories with subcategories:', error);
      throw error;
    }
  }

  static async getCategoryBySlug(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/slug/${slug}`);
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the data object
      } else {
        throw new Error(data.message || 'Failed to fetch category by slug');
      }
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  }

  static async getCategoryWithSubcategories(slug) {
    try {
      // Get all categories with subcategories and find the specific one
      const allCategories = await this.getCategoriesWithSubcategories();
      const category = allCategories.find(cat => cat.slug === slug);
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      return category;
    } catch (error) {
      console.error('Error fetching category with subcategories:', error);
      throw error;
    }
  }

  static async getCategoryGridData() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/grid-data`);
      const data = await response.json();

      if (data.success) {
        return data.data; // Return just the data array
      } else {
        throw new Error(data.message || 'Failed to fetch category grid data');
      }
    } catch (error) {
      console.error('Error fetching category grid data:', error);
      throw error;
    }
  }

  static async getCategoryById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the data object
      } else {
        throw new Error(data.message || 'Failed to fetch category');
      }
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the created category
      } else {
        throw new Error(data.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the updated category
      } else {
        throw new Error(data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the deleted category
      } else {
        throw new Error(data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Cache management methods
  static clearCacheKey(key) {
    // Simple cache clearing - in a real app you might use a more sophisticated caching system
    console.log(`Clearing cache for key: ${key}`);
    // For now, just log the cache clear operation
    return true;
  }

  static clearAllCache() {
    console.log('Clearing all category cache');
    return true;
  }
}

export default CategoryService;