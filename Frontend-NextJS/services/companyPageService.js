const API_BASE_URL =
  ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
  '/api');

class CompanyPageService {
  static async getCompanyPageBySlug(slug) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/company/${slug}`);
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the data object
      } else {
        throw new Error(data.message || 'Failed to fetch company page');
      }
    } catch (error) {
      console.error('Error fetching company page by slug:', error);
      throw error;
    }
  }

  static async getCompanyPageById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/company/${id}`);
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the data object
      } else {
        throw new Error(data.message || 'Failed to fetch company page');
      }
    } catch (error) {
      console.error('Error fetching company page by ID:', error);
      throw error;
    }
  }

  static async createCompanyPage(companyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/create-company-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the created company
      } else {
        throw new Error(data.message || 'Failed to create company page');
      }
    } catch (error) {
      console.error('Error creating company page:', error);
      throw error;
    }
  }

  static async updateCompanyPage(id, companyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating company page:', error);
      throw error;
    }
  }

  static async deleteCompanyPage(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting company page:', error);
      throw error;
    }
  }

  static async getSubcategoriesByCategory(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/category/${categoryId}`);
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the data array
      } else {
        throw new Error(data.message || 'Failed to fetch subcategories');
      }
    } catch (error) {
      console.error('Error fetching subcategories by category:', error);
      throw error;
    }
  }

  static async getAllSubcategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories`);
      const data = await response.json();
      if (data.success) {
        return data.data; // Return just the data array
      } else {
        throw new Error(data.message || 'Failed to fetch all subcategories');
      }
    } catch (error) {
      console.error('Error fetching all subcategories:', error);
      throw error;
    }
  }

  static async linkContactTabToCompany(subcategoryId, contactTabId) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/link-contact-tab`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subcategoryId, contactTabId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error linking contact tab to company:', error);
      throw error;
    }
  }

  static async addContactNumbersToCompany(slug, contactNumbersData) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/company/${slug}/add-contact-numbers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactNumbersData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding contact numbers to company:', error);
      throw error;
    }
  }

  static async addComplaintsToCompany(slug, complaintsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/subcategories/company/${slug}/add-complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintsData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding complaints to company:', error);
      throw error;
    }
  }
}

export default CompanyPageService;