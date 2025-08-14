// Script to create standardized tabs for all banks
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContactNumbersTab from './src/models/tabs/ContactNumbers.tabs.js';
import ComplaintsTab from './src/models/tabs/Complaint.tabs.js';
import QuickHelpTab from './src/models/tabs/QuickHelp.tabs.js';
import VideoGuideTab from './src/models/tabs/VideoGuide.tabs.js';
import OverviewTab from './src/models/tabs/OverviewTabs.js';
import Subcategory from './src/models/Subcategory.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Standard Overview Tab Content for all banks
const createStandardOverviewTab = async () => {
  try {
    const overviewData = {
      tabTitle: "Bank Overview & Services",
      tabDescription: "Comprehensive overview of banking services, features, and general information",
      mainContent: {
        heading: "Banking Services Overview",
        description: "Comprehensive banking solutions for individuals and businesses",
        sections: [
          {
            title: "Personal Banking",
            items: [
              "Savings Accounts",
              "Current Accounts", 
              "Fixed Deposits",
              "Recurring Deposits",
              "Personal Loans",
              "Home Loans",
              "Vehicle Loans",
              "Credit Cards",
              "Debit Cards"
            ]
          },
          {
            title: "Business Banking",
            items: [
              "Business Accounts",
              "Working Capital Loans",
              "Term Loans",
              "Trade Finance",
              "Cash Management",
              "Payment Solutions"
            ]
          },
          {
            title: "Digital Banking",
            items: [
              "Internet Banking",
              "Mobile Banking App",
              "UPI Services",
              "IMPS Transfer",
              "NEFT/RTGS",
              "Digital Wallets"
            ]
          }
        ]
      },
      additionalInfo: {
        features: [
          "24/7 Customer Support",
          "Wide Branch Network",
          "ATM Services",
          "Online Banking",
          "Mobile Banking",
          "SMS Banking"
        ],
        benefits: [
          "Competitive Interest Rates",
          "Low Processing Fees",
          "Quick Loan Approvals",
          "Flexible Repayment Options",
          "Digital Transaction Security"
        ]
      }
    };

    const overviewTab = await OverviewTab.create(overviewData);
    console.log('✅ Standard Overview Tab created:', overviewTab._id);
    return overviewTab._id;
  } catch (error) {
    console.error('❌ Error creating Overview Tab:', error);
    return null;
  }
};

// Standard Complaints Tab Content for all banks
const createStandardComplaintsTab = async () => {
  try {
    const complaintsData = {
      tabTitle: "Complaint Redressal Process",
      tabDescription: "Step-by-step guide to register and resolve banking complaints",
      complaintProcess: {
        heading: "How to Register a Complaint",
        steps: [
          {
            step: 1,
            title: "Contact Bank First",
            description: "Call the bank's customer care or visit the nearest branch",
            action: "Use the contact numbers provided in the Contact Numbers tab"
          },
          {
            step: 2,
            title: "Escalate to Branch Manager",
            description: "If not resolved, escalate to the branch manager",
            action: "Visit the branch and request to meet the manager"
          },
          {
            step: 3,
            title: "Contact Nodal Officer",
            description: "If still unresolved, contact the bank's nodal officer",
            action: "Email or call the nodal officer (details in Contact Numbers tab)"
          },
          {
            step: 4,
            title: "Banking Ombudsman",
            description: "As a last resort, approach the Banking Ombudsman",
            action: "File complaint at https://rbi.org.in/ombudsman"
          }
        ]
      },
      complaintTypes: {
        heading: "Common Complaint Categories",
        categories: [
          {
            type: "Account Related",
            examples: [
              "Account opening issues",
              "Transaction problems",
              "Balance discrepancies",
              "Statement errors"
            ]
          },
          {
            type: "Card Related",
            examples: [
              "Card not working",
              "Unauthorized transactions",
              "Card delivery issues",
              "PIN problems"
            ]
          },
          {
            type: "Loan Related",
            examples: [
              "Loan processing delays",
              "EMI calculation errors",
              "Prepayment issues",
              "Documentation problems"
            ]
          },
          {
            type: "Digital Banking",
            examples: [
              "Login issues",
              "Transaction failures",
              "App problems",
              "OTP not received"
            ]
          }
        ]
      },
      escalationMatrix: {
        heading: "Escalation Timeline",
        timeline: [
          {
            level: "Bank Customer Care",
            timeframe: "24-48 hours",
            contact: "Use numbers from Contact Numbers tab"
          },
          {
            level: "Branch Manager",
            timeframe: "3-5 working days",
            contact: "Visit nearest branch"
          },
          {
            level: "Nodal Officer",
            timeframe: "7-10 working days",
            contact: "Email/call nodal officer"
          },
          {
            level: "Banking Ombudsman",
            timeframe: "30-45 days",
            contact: "Online complaint portal"
          }
        ]
      }
    };

    const complaintsTab = await ComplaintsTab.create(complaintsData);
    console.log('✅ Standard Complaints Tab created:', complaintsTab._id);
    return complaintsTab._id;
  } catch (error) {
    console.error('❌ Error creating Complaints Tab:', error);
    return null;
  }
};

// Standard Quick Help Tab Content for all banks
const createStandardQuickHelpTab = async () => {
  try {
    const quickHelpData = {
      tabTitle: "Quick Help & FAQs",
      tabDescription: "Frequently asked questions and quick solutions for common banking issues",
      faqs: [
        {
          question: "How do I check my account balance?",
          answer: "You can check your balance through: 1) Internet Banking, 2) Mobile Banking App, 3) SMS Banking, 4) ATM, 5) Phone Banking, 6) Visit nearest branch"
        },
        {
          question: "What should I do if I lose my debit card?",
          answer: "Immediately call the bank's 24/7 helpline to block your card. You can also block it through Internet Banking or Mobile Banking App. Visit the nearest branch to get a replacement card."
        },
        {
          question: "How can I transfer money to another account?",
          answer: "You can transfer money through: 1) NEFT/RTGS (next day), 2) IMPS (instant), 3) UPI (instant), 4) Internet Banking, 5) Mobile Banking App"
        },
        {
          question: "What is the process to apply for a loan?",
          answer: "1) Check eligibility online, 2) Fill application form, 3) Submit required documents, 4) Complete KYC verification, 5) Wait for approval, 6) Sign loan agreement and receive disbursement"
        },
        {
          question: "How do I register for Internet Banking?",
          answer: "1) Visit your bank branch, 2) Fill registration form, 3) Submit ID proof and address proof, 4) Receive User ID and Password, 5) Login and change password on first use"
        },
        {
          question: "What should I do if I forget my Internet Banking password?",
          answer: "1) Click 'Forgot Password' on login page, 2) Enter your registered mobile number, 3) Receive OTP, 4) Set new password, 5) Login with new password"
        },
        {
          question: "How can I update my mobile number?",
          answer: "1) Visit nearest branch, 2) Fill update form, 3) Submit ID proof, 4) Provide new mobile number, 5) Receive confirmation SMS, 6) Update completed within 24-48 hours"
        },
        {
          question: "What are the charges for different services?",
          answer: "Service charges vary by bank and account type. Check your bank's website or visit nearest branch for detailed fee structure. Most banks provide fee-free services for premium accounts."
        }
      ],
      quickSolutions: {
        heading: "Common Issues - Quick Solutions",
        solutions: [
          {
            issue: "Cannot login to Internet Banking",
            solution: "Check if caps lock is on, clear browser cache, try different browser, contact customer care if problem persists"
          },
          {
            issue: "Transaction failed but amount deducted",
            answer: "Amount will be automatically reversed within 24-48 hours. If not reversed, contact customer care with transaction details"
          },
          {
            issue: "OTP not received",
            solution: "Check mobile network, ensure number is correct, wait 2-3 minutes, try resending OTP, contact customer care if issue continues"
          },
          {
            issue: "Card declined at ATM/POS",
            solution: "Check if card is blocked, verify sufficient balance, ensure card is not expired, contact customer care for assistance"
          }
        ]
      },
      emergencyContacts: {
        heading: "Emergency Contacts",
        contacts: [
          {
            service: "24/7 Customer Care",
            number: "Use numbers from Contact Numbers tab",
            available: "24/7"
          },
          {
            service: "Card Blocking",
            number: "Use numbers from Contact Numbers tab",
            available: "24/7"
          },
          {
            service: "Fraud Reporting",
            number: "Use numbers from Contact Numbers tab",
            available: "24/7"
          }
        ]
      }
    };

    const quickHelpTab = await QuickHelpTab.create(quickHelpData);
    console.log('✅ Standard Quick Help Tab created:', quickHelpTab._id);
    return quickHelpTab._id;
  } catch (error) {
    console.error('❌ Error creating Quick Help Tab:', error);
    return null;
  }
};

// Standard Video Guide Tab Content for all banks
const createStandardVideoGuideTab = async () => {
  try {
    const videoGuideData = {
      tabTitle: "Video Guides & Tutorials",
      tabDescription: "Step-by-step video tutorials for common banking operations",
      videoCategories: [
        {
          category: "Account Management",
          videos: [
            {
              title: "How to Open a Bank Account",
              description: "Complete guide to open a new bank account",
              duration: "5:30",
              thumbnail: "/videos/thumbnails/open-account.jpg",
              videoUrl: "https://example.com/videos/open-account.mp4"
            },
            {
              title: "How to Check Account Balance",
              description: "Multiple ways to check your account balance",
              duration: "3:45",
              thumbnail: "/videos/thumbnails/check-balance.jpg",
              videoUrl: "https://example.com/videos/check-balance.mp4"
            },
            {
              title: "How to Download Bank Statement",
              description: "Download and print your bank statements",
              duration: "4:15",
              thumbnail: "/videos/thumbnails/download-statement.jpg",
              videoUrl: "https://example.com/videos/download-statement.mp4"
            }
          ]
        },
        {
          category: "Digital Banking",
          videos: [
            {
              title: "Internet Banking Registration",
              description: "Complete process to register for Internet Banking",
              duration: "6:20",
              thumbnail: "/videos/thumbnails/internet-banking.jpg",
              videoUrl: "https://example.com/videos/internet-banking.mp4"
            },
            {
              title: "Mobile Banking App Setup",
              description: "How to set up and use mobile banking app",
              duration: "7:10",
              thumbnail: "/videos/thumbnails/mobile-banking.jpg",
              videoUrl: "https://example.com/videos/mobile-banking.mp4"
            },
            {
              title: "UPI Payment Guide",
              description: "How to make UPI payments safely",
              duration: "4:50",
              thumbnail: "/videos/thumbnails/upi-payment.jpg",
              videoUrl: "https://example.com/videos/upi-payment.mp4"
            }
          ]
        },
        {
          category: "Card Services",
          videos: [
            {
              title: "Activate Debit Card",
              description: "Steps to activate your new debit card",
              duration: "3:20",
              thumbnail: "/videos/thumbnails/activate-card.jpg",
              videoUrl: "https://example.com/videos/activate-card.mp4"
            },
            {
              title: "Generate ATM PIN",
              description: "How to generate and change ATM PIN",
              duration: "4:05",
              thumbnail: "/videos/thumbnails/generate-pin.jpg",
              videoUrl: "https://example.com/videos/generate-pin.mp4"
            },
            {
              title: "Block Lost Card",
              description: "Emergency steps to block lost/stolen card",
              duration: "2:30",
              thumbnail: "/videos/thumbnails/block-card.jpg",
              videoUrl: "https://example.com/videos/block-card.mp4"
            }
          ]
        },
        {
          category: "Loan Services",
          videos: [
            {
              title: "Apply for Personal Loan",
              description: "Complete loan application process",
              duration: "8:15",
              thumbnail: "/videos/thumbnails/personal-loan.jpg",
              videoUrl: "https://example.com/videos/personal-loan.mp4"
            },
            {
              title: "Home Loan Application",
              description: "Step-by-step home loan application guide",
              duration: "10:30",
              thumbnail: "/videos/thumbnails/home-loan.jpg",
              videoUrl: "https://example.com/videos/home-loan.mp4"
            },
            {
              title: "EMI Calculator Guide",
              description: "How to use EMI calculator and plan loans",
              duration: "5:45",
              thumbnail: "/videos/thumbnails/emi-calculator.jpg",
              videoUrl: "https://example.com/videos/emi-calculator.mp4"
            }
          ]
        }
      ],
      quickTips: {
        heading: "Quick Banking Tips",
        tips: [
          "Always keep your mobile number updated for OTP services",
          "Never share your OTP, PIN, or password with anyone",
          "Use strong passwords and change them regularly",
          "Enable transaction alerts for better security",
          "Keep your card details confidential",
          "Report any suspicious transactions immediately"
        ]
      }
    };

    const videoGuideTab = await VideoGuideTab.create(videoGuideData);
    console.log('✅ Standard Video Guide Tab created:', videoGuideTab._id);
    return videoGuideTab._id;
  } catch (error) {
    console.error('❌ Error creating Video Guide Tab:', error);
    return null;
  }
};

// Update all existing banks to include all 5 tabs
const updateAllBanksWithStandardTabs = async () => {
  try {
    console.log('🔄 Updating all banks with standard tabs...');
    
    // Get all bank subcategories
    const banks = await Subcategory.find({
      'parentCategory': { $exists: true }
    }).populate('parentCategory');
    
    console.log(`📊 Found ${banks.length} companies to update`);
    
    // Create standard tabs first
    const overviewTabId = await createStandardOverviewTab();
    const complaintsTabId = await createStandardComplaintsTab();
    const quickHelpTabId = await createStandardQuickHelpTab();
    const videoGuideTabId = await createStandardVideoGuideTab();
    
    if (!overviewTabId || !complaintsTabId || !quickHelpTabId || !videoGuideTabId) {
      console.error('❌ Failed to create some standard tabs');
      return;
    }
    
    // Update each bank with all tabs
    for (const bank of banks) {
      try {
        // Check if bank already has tabs
        const hasTabs = bank.tabs && (
          bank.tabs.overview || 
          bank.tabs.complaints || 
          bank.tabs.quickhelp || 
          bank.tabs.video
        );
        
        if (!hasTabs) {
          // Update bank with all standard tabs
          await Subcategory.findByIdAndUpdate(bank._id, {
            $set: {
              'tabs.overview': overviewTabId,
              'tabs.complaints': complaintsTabId,
              'tabs.quickhelp': quickHelpTabId,
              'tabs.video': videoGuideTabId,
              'selectedTabs': [
                'overview',
                'contact-numbers', 
                'complaints',
                'quick-help',
                'video-guide'
              ]
            }
          });
          
          console.log(`✅ Updated ${bank.name} with all standard tabs`);
        } else {
          console.log(`ℹ️ ${bank.name} already has tabs, skipping...`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${bank.name}:`, error.message);
      }
    }
    
    console.log('🎉 All banks updated successfully with standard tabs!');
    
  } catch (error) {
    console.error('❌ Error updating banks:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await updateAllBanksWithStandardTabs();
    console.log('✅ Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

main();
