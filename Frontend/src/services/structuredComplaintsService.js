// services/structuredComplaintsService.js

const API_BASE_URL = 'http://localhost:3000/api/structured-complaints';

export const structuredComplaintsService = {
  // Get structured complaints data for a company
  async getStructuredComplaints(companyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${companyId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching structured complaints:', error);
      throw error;
    }
  },

  // Create or update structured complaints data
  async saveStructuredComplaints(companyId, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving structured complaints:', error);
      throw error;
    }
  },

  // Process Word document and extract structure
  async processWordDocument(companyId, content) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${companyId}/process-word`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error processing Word document:', error);
      throw error;
    }
  },

  // Delete structured complaints data
  async deleteStructuredComplaints(companyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${companyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting structured complaints:', error);
      throw error;
    }
  },

  // Get processing status
  async getProcessingStatus(companyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/company/${companyId}/status`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting processing status:', error);
      throw error;
    }
  },

  // Extract structure from HTML content (client-side processing)
  extractStructureFromContent(content) {
    try {
      // Create a temporary DOM element to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;

      const structuredData = {
        mainHeading: { title: '', description: '' },
        complaintMethods: {
          heading: { text: 'How to File a Complaint', subText: 'Choose from multiple methods to file your complaint' },
          methods: []
        },
        escalationLevels: {
          heading: { text: 'Escalation Levels', subText: 'Follow these levels if your complaint is not resolved' },
          levels: []
        },
        documentsRequired: {
          heading: { text: 'Documents Required', subText: 'Prepare these documents before filing your complaint' },
          documents: []
        },
        resolutionTimeline: {
          heading: { text: 'Resolution Timeline', subText: 'Expected timeframes for complaint resolution' },
          timelines: []
        },
        note: ''
      };

      // Extract main heading - improved detection
      const h1 = tempDiv.querySelector('h1');
      if (h1) {
        structuredData.mainHeading.title = h1.textContent.trim();
        structuredData.mainHeading.description = 'Complaint redressal process';
      } else {
        // Fallback: look for the first strong heading or large text
        const firstHeading = tempDiv.querySelector('h2, h3, strong, b');
        if (firstHeading && firstHeading.textContent.trim().length > 0) {
          structuredData.mainHeading.title = firstHeading.textContent.trim();
          structuredData.mainHeading.description = 'Complaint redressal process';
        }
      }

      // Improved complaint methods extraction
      const methods = [];
      const allElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div');
      let currentMethod = null;
      let methodIndex = 1;

      allElements.forEach((element) => {
        const text = element.textContent.trim().toLowerCase();
        const tagName = element.tagName.toLowerCase();
        
        // Detect method headings with improved patterns
        if (tagName.match(/^h[1-6]$/) && 
            (text.includes('method') || 
             text.includes('step') || 
             text.includes('process') || 
             text.includes('procedure') ||
             text.includes('way') ||
             text.includes('approach') ||
             /\d+\./.test(element.textContent.trim()) ||
             /^step\s*\d+/i.test(element.textContent.trim()) ||
             /^method\s*\d+/i.test(element.textContent.trim()))) {
          
          // Save previous method if exists
          if (currentMethod && currentMethod.title) {
            methods.push(currentMethod);
          }
          
          // Start new method
          currentMethod = {
            methodNumber: methodIndex++,
            title: element.textContent.trim(),
            description: '',
            steps: [],
            contactInfo: {
              phoneNumbers: [],
              emailAddresses: [],
              websites: []
            }
          };
        } else if (currentMethod && tagName === 'p' && text.length > 20) {
          // Add description to current method
          if (!currentMethod.description) {
            currentMethod.description = element.textContent.trim();
          }
        } else if (currentMethod && (tagName === 'ul' || tagName === 'ol')) {
          // Extract steps from lists
          const listItems = element.querySelectorAll('li');
          listItems.forEach((item, stepIndex) => {
            const stepText = item.textContent.trim();
            if (stepText.length > 0) {
              currentMethod.steps.push({
                stepNumber: stepIndex + 1,
                title: stepText,
                description: '',
                details: []
              });
            }
          });
        }
      });
      
      // Add the last method if exists
      if (currentMethod && currentMethod.title) {
        methods.push(currentMethod);
      }
      
      structuredData.complaintMethods.methods = methods;

      // Improved escalation levels extraction
      const escalationKeywords = ['escalation', 'level', 'hierarchy', 'tier', 'stage'];
      const escalationElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
      const levels = [];
      let levelIndex = 1;

      escalationElements.forEach((element) => {
        const text = element.textContent.trim().toLowerCase();
        if (escalationKeywords.some(keyword => text.includes(keyword)) || 
            /level\s*\d+/i.test(element.textContent.trim()) ||
            /tier\s*\d+/i.test(element.textContent.trim())) {
          
          levels.push({
            levelNumber: levelIndex++,
            title: element.textContent.trim(),
            description: '',
            contactDetails: {
              phoneNumbers: [],
              emailAddresses: [],
              websites: []
            }
          });
        }
      });
      
      structuredData.escalationLevels.levels = levels;

      // Improved documents required extraction
      const documentKeywords = ['document', 'required', 'needed', 'proof', 'evidence', 'copy'];
      const documentElements = tempDiv.querySelectorAll('ul, ol, p');
      const documents = [];

      documentElements.forEach((element) => {
        const text = element.textContent.trim().toLowerCase();
        if (documentKeywords.some(keyword => text.includes(keyword))) {
          // Extract list items
          const listItems = element.querySelectorAll('li');
          listItems.forEach(item => {
            const docText = item.textContent.trim();
            if (docText.length > 0 && !documents.includes(docText)) {
              documents.push(docText);
            }
          });
        }
      });
      
      structuredData.documentsRequired.documents = documents;

      // Improved resolution timeline extraction
      const timelineKeywords = ['timeline', 'resolution', 'time', 'days', 'weeks', 'duration'];
      const timelineElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
      const timelines = [];

      timelineElements.forEach((element) => {
        const text = element.textContent.trim().toLowerCase();
        if (timelineKeywords.some(keyword => text.includes(keyword)) || 
            /\d+\s*(days?|weeks?|months?)/i.test(element.textContent.trim())) {
          
          timelines.push({
            level: element.textContent.trim(),
            days: '3-5 days',
            description: 'Standard resolution time'
          });
        }
      });
      
      structuredData.resolutionTimeline.timelines = timelines;

      // Improved note extraction
      const noteKeywords = ['note', 'important', 'warning', 'caution', 'remember'];
      const noteElements = tempDiv.querySelectorAll('p, div');
      
      noteElements.forEach((element) => {
        const text = element.textContent.trim().toLowerCase();
        if (noteKeywords.some(keyword => text.includes(keyword)) && text.length > 0) {
          structuredData.note = element.textContent.trim();
        }
      });

      // If no structured data was extracted, create a basic structure
      if (methods.length === 0 && levels.length === 0 && documents.length === 0) {
        // Create a basic method from the content
        const paragraphs = tempDiv.querySelectorAll('p');
        if (paragraphs.length > 0) {
          const firstParagraph = paragraphs[0].textContent.trim();
          if (firstParagraph.length > 0) {
            structuredData.complaintMethods.methods.push({
              methodNumber: 1,
              title: 'General Complaint Process',
              description: firstParagraph,
              steps: [],
              contactInfo: {
                phoneNumbers: [],
                emailAddresses: [],
                websites: []
              }
            });
          }
        }
      }

      return structuredData;
    } catch (error) {
      console.error('Error extracting structure from content:', error);
      throw error;
    }
  }
};

export default structuredComplaintsService; 