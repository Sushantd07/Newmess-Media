const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Get contact numbers data for a company by slug
export const getContactNumbers = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories/company/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data && data.data.tabs && data.data.tabs.numbers) {
      return {
        success: true,
        data: {
          tabData: data.data.tabs.numbers
        }
      };
    } else {
      // Return empty data if no contact numbers exist
      return {
        success: true,
        data: {
          tabData: {}
        }
      };
    }
  } catch (error) {
    console.error('Error fetching contact numbers:', error);
    throw error;
  }
};

// Update contact numbers data for a company by slug
export const updateContactNumbers = async (slug, contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories/company/${slug}/add-contact-numbers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating contact numbers:', error);
    throw error;
  }
};

// Alternative method using company page routes
export const updateContactNumbersViaCompanyPage = async (slug, contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/company-pages/${slug}/contact-numbers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating contact numbers via company page:', error);
    throw error;
  }
};

// Create new contact numbers data
export const createContactNumbers = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subcategories/create-contact-numbers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating contact numbers:', error);
    throw error;
  }
};