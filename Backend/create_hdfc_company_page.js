import mongoose from 'mongoose';
import CompanyPage from './src/models/CompanyPage.js';
import ContactNumbersTab from './src/models/tabs/ContactNumbers.tabs.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    const dbName = 'NumbersDB';
    
    await mongoose.connect(`${mongoUrl}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully to:', `${mongoUrl}/${dbName}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create HDFC Bank company page with contact numbers
const createHDFCCompanyPage = async () => {
  try {
    console.log('Creating HDFC Bank company page...');
    
    // Step 1: Create contact numbers tab data
    const contactNumbersData = {
      tabTitle: "Contact Numbers",
      tabDescription: "Customer care, helpline, toll-free numbers for HDFC Bank",
      
      topContactCards: {
        heading: {
          key: "topContactCards",
          text: "Top Contact Cards",
          subText: "Most frequently used numbers"
        },
        cards: [
          {
            title: "Customer Care",
            number: "1800-258-6161",
            description: "24x7 General banking support",
            icon: "phone",
            priority: 1
          },
          {
            title: "Credit Card Support",
            number: "1800-266-4332",
            description: "Credit card related queries",
            icon: "credit-card",
            priority: 2
          },
          {
            title: "NRI Services",
            number: "1800-425-4332",
            description: "NRI account and remittance support",
            icon: "globe",
            priority: 3
          }
        ]
      },
      
      nationalNumbersSection: {
        heading: {
          key: "nationalNumbers",
          text: "National Numbers",
          subText: "All India toll-free numbers"
        },
        items: [
          {
            type: "Customer Care",
            number: "1800-258-6161",
            description: "General banking support and account inquiries",
            available: "24x7",
            languages: ["Hindi", "English", "Regional Languages"],
            avgWaitTime: "1-2 minutes"
          },
          {
            type: "Credit Card Support",
            number: "1800-266-4332",
            description: "Credit card related queries and support",
            available: "24x7",
            languages: ["Hindi", "English"],
            avgWaitTime: "2-3 minutes"
          },
          {
            type: "NRI Services",
            number: "1800-425-4332",
            description: "NRI account and remittance support",
            available: "24x7",
            languages: ["Hindi", "English"],
            avgWaitTime: "2-3 minutes"
          }
        ]
      },
      
      helplineNumbersSection: {
        heading: {
          key: "helplineNumbers",
          text: "Helpline Numbers",
          subText: "Specialized support numbers"
        },
        table: {
          headers: ["Service", "Number", "Available", "Description"],
          rows: [
            ["Phone Banking", "1800-258-6161", "24x7", "Account balance, mini statement"],
            ["Credit Card", "1800-266-4332", "24x7", "Card activation, billing queries"],
            ["NRI Services", "1800-425-4332", "24x7", "NRI accounts, remittances"],
            ["Investment", "1800-425-4332", "9 AM - 6 PM", "Mutual funds, insurance"]
          ]
        }
      },
      
      allIndiaNumbersSection: {
        heading: {
          key: "allIndiaNumbers",
          text: "All India Numbers",
          subText: "Regional office numbers"
        },
        table: {
          headers: ["City", "Number", "Type"],
          rows: [
            ["Mumbai", "022-6652-1000", "Head Office"],
            ["New Delhi", "011-6652-1000", "Regional Office"],
            ["Bangalore", "080-6652-1000", "Regional Office"],
            ["Chennai", "044-6652-1000", "Regional Office"],
            ["Kolkata", "033-6652-1000", "Regional Office"]
          ]
        }
      },
      
      smsServicesSection: {
        heading: {
          key: "smsServices",
          text: "SMS Services",
          subText: "Missed call and SMS banking"
        },
        services: [
          { code: "BAL", description: "Check your account balance", number: "5676712" },
          { code: "MINI", description: "Get mini statement", number: "5676712" },
          { code: "CHQBOOK", description: "Request cheque book", number: "5676712" },
          { code: "STOP", description: "Stop cheque payment", number: "5676712" },
          { code: "BLOCK", description: "Block ATM/Debit card", number: "5676712" },
          { code: "UNBLOCK", description: "Unblock ATM/Debit card", number: "5676712" }
        ]
      },
      
      quickLinksSection: {
        heading: {
          key: "quickLinks",
          text: "Quick Links",
          subText: "Online services and support"
        },
        links: [
          { name: "Internet Banking", href: "https://netbanking.hdfcbank.com" },
          { name: "Mobile Banking", href: "https://www.hdfcbank.com/personal/mobile-banking" },
          { name: "Branch Locator", href: "https://www.hdfcbank.com/personal/branch-locator" },
          { name: "ATM Locator", href: "https://www.hdfcbank.com/personal/atm-locator" }
        ]
      }
    };
    
    // Step 2: Create contact numbers tab
    const contactNumbersTab = await ContactNumbersTab.create(contactNumbersData);
    console.log('✅ Created contact numbers tab with ID:', contactNumbersTab._id);
    
    // Step 3: Create HDFC company page
    const hdfcCompanyData = {
      categoryId: "banking",
      subCategoryId: "private-banks",
      slug: "hdfc-bank",
      name: "HDFC Bank",
      logo: "/company-logos/Bank/hdfc_bank.svg",
      description: "India's leading private sector bank offering comprehensive banking and financial services including savings accounts, loans, credit cards, and digital banking solutions.",
      rating: 4.8,
      totalReviews: 3245,
      monthlySearches: "48K",
      founded: "1994",
      headquarters: "Mumbai, Maharashtra",
      website: "https://www.hdfcbank.com",
      parentCompany: "HDFC Limited",
      tabs: {
        numbers: contactNumbersTab._id,
        complaints: null,
        quickhelp: null,
        video: null,
        overview: null
      }
    };
    
    // Check if company already exists
    const existingCompany = await CompanyPage.findOne({ slug: "hdfc-bank" });
    
    let hdfcCompany;
    if (existingCompany) {
      console.log('⚠️ HDFC Bank already exists, updating...');
      hdfcCompany = await CompanyPage.findByIdAndUpdate(
        existingCompany._id,
        hdfcCompanyData,
        { new: true }
      );
    } else {
      hdfcCompany = await CompanyPage.create(hdfcCompanyData);
    }
    
    console.log('✅ Created/Updated HDFC Bank company page with ID:', hdfcCompany._id);
    console.log('Company Details:', {
      name: hdfcCompany.name,
      slug: hdfcCompany.slug,
      categoryId: hdfcCompany.categoryId,
      subCategoryId: hdfcCompany.subCategoryId,
      tabs: hdfcCompany.tabs
    });
    
    // Step 4: Test the API endpoints
    console.log('\n🧪 Testing API endpoints...');
    
    // Test main company page
    const companyResponse = await fetch('http://localhost:3000/api/company-pages/hdfc-bank');
    if (companyResponse.ok) {
      const companyData = await companyResponse.json();
      console.log('✅ Main company page API works!');
      console.log('Company name:', companyData.data.name);
    } else {
      console.log('❌ Main company page API failed:', companyResponse.status);
    }
    
    // Test contact numbers tab
    const tabResponse = await fetch('http://localhost:3000/api/company-pages/hdfc-bank/tab/numbers');
    if (tabResponse.ok) {
      const tabData = await tabResponse.json();
      console.log('✅ Contact numbers tab API works!');
      console.log('Tab title:', tabData.data.tabData.tabTitle);
    } else {
      console.log('❌ Contact numbers tab API failed:', tabResponse.status);
    }
    
  } catch (error) {
    console.error('Error creating HDFC company page:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await createHDFCCompanyPage();
  await mongoose.disconnect();
  console.log('\nScript completed successfully');
};

main(); 