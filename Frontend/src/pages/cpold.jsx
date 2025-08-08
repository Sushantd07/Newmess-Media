import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Star,
  Clock,
  Shield,
  ShieldAlert,
  Lock,
  User2,
  MapPin,
  Globe,
  ChevronRight,
  ArrowLeft,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Award,
  Target,
  Zap,
  Eye,
  PlayCircle,
  Download,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Flag,
  Info,
  HelpCircle,
  FileText,
  Calendar,
  Mail,
  Building2,
  CreditCard,
  Headphones,
  Smartphone,
  PhoneCall,
  Check,
  MessageSquare,
  ChevronDown,
  Volume2,
  Menu,
  Settings,
  Search,
  X,
  Clock3,
  UserCheck,
  Scale,
  Home,
  User,
  Smile,
  Paperclip,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
const icons = [PhoneCall, AlertCircle, CreditCard, Shield];
const sbiContacts = {
  tollFree: [
    { number: "1930", label: "Cyber Crime" },
    { number: "1800 1234", label: "Phone Banking (24x7)" },
    { number: "1800 2100", label: "Alternate Phone Banking (24x7)" },
    { number: "1800 11 2211", label: "Customer Support (24x7)" },
    { number: "1800 425 3800", label: "Phone Banking Helpline (24x7)" },
    {
      number: "1800 11 1109",
      label: "Report Unauthorised Electronic Transactions",
    },
  ],
  allIndia: [
    {
      number: "080-2659 9990",
      label: "Phone Banking/Report Unauthorised Electronic Transactions (24x7)",
    },
    { number: "90226 90226", label: "WhatsApp Banking" },
    {
      number: "92237 66666",
      label: "Missed Call No. For Balance Enquiry (SMS)",
    },
    {
      number: "92238 66666",
      label: "Missed Call No. For Mini Statement (SMS)",
    },
    { number: "8008 20 20 20", label: "SMS No. For Bank Service Feedback" },
    {
      number: "9449 11 22 11",
      label: "Alternate No. To Report Unauthorised Electronic Transactions",
    },
  ],
  international: [
    { number: "+91-80-26599990", label: "International Toll Free No." },
  ],
};

const CompanyPage = () => {
  const { categoryId, companySlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for comment dropdown menus
  const [openDropdown, setOpenDropdown] = useState(null);
  // Map URL segment to tab id
  const tabUrlToId = {
    contactnumber: "numbers",
    complain: "complaints",
    quickhelp: "quickhelp",
    videoguide: "video",
    overview: "overview",
  };
  const tabIdToUrl = {
    numbers: "contactnumber",
    complaints: "complain",
    quickhelp: "quickhelp",
    video: "videoguide",
    overview: "overview",
  };
  // Get the last segment of the path
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const initialTab = tabUrlToId[lastSegment] || "numbers";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedState, setSelectedState] = useState("all");
  const [copiedNumber, setCopiedNumber] = useState("");
  const [showComplaintSteps, setShowComplaintSteps] = useState(false);
  const [showStatewiseNumbers, setShowStatewiseNumbers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // New state for API data
  const [contactNumbersData, setContactNumbersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [smsDropdownOpen, setSmsDropdownOpen] = useState(false);
  // Add at the top of the component, after other useState hooks
  const [selectedIVRS, setSelectedIVRS] = useState(0);
  const ivrsSteps = [
    [
      { title: "Press 1: Account Balance & Statement", sub: ["Press 1: Balance Enquiry", "Press 2: Mini Statement"] },
      { title: "Press 2: Fund Transfer & Payment", sub: ["Press 1: Block Card", "Press 2: Card Limit Enquiry"] },
      { title: "Press 3: Card Services", sub: ["Press 1: Debit card blocking and replacement", "Press 2: Block UPI services"] },
      { title: "Press 4: Loan Services", sub: ["Press 1: Generate ATM Pin", "Press 2: Generate T-pin"] },
      { title: "Press 5: Fixed Deposit Services", sub: ["Press 1: FD Information", "Press 2: FD Renewal"] },
      { title: "Press 6: Complaint Registration", sub: [] },
    ],
    [
      { title: "Press 1: Credit Card Services", sub: ["Press 1: Card Balance", "Press 2: Card Statement"] },
      { title: "Press 2: Card Activation", sub: ["Press 1: Activate Card", "Press 2: Set PIN"] },
      { title: "Press 3: Card Blocking", sub: ["Press 1: Block Card", "Press 2: Report Fraud"] },
    ],
    [
      { title: "Press 1: Loan Services", sub: ["Press 1: Loan Balance", "Press 2: Loan Statement"] },
      { title: "Press 2: EMI Services", sub: ["Press 1: EMI Schedule", "Press 2: Pay EMI"] },
      { title: "Press 3: Foreclosure", sub: ["Press 1: Foreclosure Quote"] },
    ],
  ];

  // Fetch contact numbers data from API
  const fetchContactNumbersData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/tabs/contact-numbers');
      if (!response.ok) {
        throw new Error('Failed to fetch contact numbers data');
      }
      const result = await response.json();
      if (result.success) {
        setContactNumbersData(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contact numbers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or when switching to numbers tab
  useEffect(() => {
    if (activeTab === "numbers") {
      fetchContactNumbersData();
    }
  }, [activeTab]);

  // Redirect to /contactnumber if no tab is present in the URL
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    // Only redirect if the last segment is the companySlug (i.e., no tab present)
    if (lastSegment === companySlug) {
      navigate(`/category/${categoryId}/${companySlug}/contactnumber`, { replace: true });
    }
  }, [categoryId, companySlug, location.pathname, navigate]);

  // Company data
  const companyData = {
    telecom: {
      "mobile-networks": {
        jio: {
          name: "Reliance Jio",
          logo: "https://logos-world.net/wp-content/uploads/2020/09/Jio-Logo.png",
          description:
            "India's largest 4G network provider offering comprehensive digital services including mobile plans, fiber broadband, and digital entertainment.",
          rating: 4.8,
          totalReviews: 2847,
          monthlySearches: "45K",
          founded: "2016",
          headquarters: "Mumbai, Maharashtra",
          website: "https://www.jio.com",
          parentCompany: "Reliance Industries Limited",
          services: [
            "Mobile Plans & Recharge",
            "JioFiber Broadband",
            "JioTV & Digital Services",
            "Enterprise Solutions",
            "IoT & 5G Services",
          ],
          nationalNumbers: [
            {
              type: "Customer Care",
              number: "199",
              description: "General customer support and service inquiries",
              available: "24x7",
              languages: ["Hindi", "English", "Regional Languages"],
              avgWaitTime: "2-3 minutes",
            },
            {
              type: "Technical Support",
              number: "198",
              description: "Network issues, internet connectivity problems",
              available: "24x7",
              languages: ["Hindi", "English"],
              avgWaitTime: "3-5 minutes",
            },
            {
              type: "Sales & New Connections",
              number: "1800-889-9999",
              description: "New connections, plan upgrades, sales inquiries",
              available: "9 AM - 9 PM",
              languages: ["Hindi", "English", "Regional Languages"],
              avgWaitTime: "1-2 minutes",
            },
          ],
          stateWiseNumbers: {
            Maharashtra: [
              {
                city: "Mumbai",
                number: "022-6666-7777",
                type: "Regional Office",
              },
              {
                city: "Pune",
                number: "020-6666-8888",
                type: "Regional Office",
              },
              {
                city: "Nagpur",
                number: "0712-666-9999",
                type: "Regional Office",
              },
            ],
            Delhi: [
              {
                city: "New Delhi",
                number: "011-6666-1111",
                type: "Regional Office",
              },
              {
                city: "Gurgaon",
                number: "0124-666-2222",
                type: "Regional Office",
              },
            ],
            Karnataka: [
              {
                city: "Bangalore",
                number: "080-6666-3333",
                type: "Regional Office",
              },
              {
                city: "Mysore",
                number: "0821-666-4444",
                type: "Regional Office",
              },
            ],
            "Tamil Nadu": [
              {
                city: "Chennai",
                number: "044-6666-5555",
                type: "Regional Office",
              },
              {
                city: "Coimbatore",
                number: "0422-666-6666",
                type: "Regional Office",
              },
            ],
          },
          complaintSteps: [
            {
              step: 1,
              title: "Try Customer Care First",
              description:
                "Call 199 for immediate assistance. Most issues are resolved within the first call.",
              icon: Phone,
            },
            {
              step: 2,
              title: "Use MyJio App",
              description:
                "Download MyJio app and use the complaint section for faster resolution.",
              icon: Smartphone,
            },
            {
              step: 3,
              title: "Visit Jio Store",
              description:
                "Visit your nearest Jio store with required documents for complex issues.",
              icon: Building2,
            },
            {
              step: 4,
              title: "Online Complaint Portal",
              description:
                "Use Jio's official website complaint portal for detailed issue reporting.",
              icon: Globe,
            },
            {
              step: 5,
              title: "Social Media",
              description:
                "Reach out via Twitter @JioCare or Facebook for public complaint resolution.",
              icon: MessageCircle,
            },
            {
              step: 6,
              title: "Consumer Forum",
              description:
                "If unresolved, approach consumer court or TRAI for regulatory intervention.",
              icon: FileText,
            },
          ],
          videoGuide: {
            title: "How to File a Complaint with Jio Customer Care",
            videoId: "dQw4w9WgXcQ",
            thumbnail:
              "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            duration: "5:32",
            views: "1.2M",
            description:
              "Complete step-by-step guide on how to file and track complaints with Jio customer care through various channels.",
          },
        },
        airtel: {
          name: "Airtel",
          logo: "https://logos-world.net/wp-content/uploads/2020/09/Airtel-Logo.png",
          description:
            "Leading telecommunications company providing mobile, broadband, and digital TV services across India.",
          rating: 4.7,
          totalReviews: 2156,
          monthlySearches: "38K",
          founded: "1995",
          headquarters: "New Delhi, India",
          website: "https://www.airtel.in",
          parentCompany: "Bharti Enterprises",
          services: [
            "Mobile Plans & Recharge",
            "Airtel Xstream Fiber",
            "DTH Services",
            "Enterprise Solutions",
            "Digital Payments",
          ],
          nationalNumbers: [
            {
              type: "Customer Care",
              number: "121",
              description: "General customer support and service inquiries",
              available: "24x7",
              languages: ["Hindi", "English", "Regional Languages"],
              avgWaitTime: "2-4 minutes",
            },
            {
              type: "Technical Support",
              number: "198",
              description: "Network issues, internet connectivity problems",
              available: "24x7",
              languages: ["Hindi", "English"],
              avgWaitTime: "3-5 minutes",
            },
          ],
          stateWiseNumbers: {
            Delhi: [
              {
                city: "New Delhi",
                number: "011-4567-8901",
                type: "Regional Office",
              },
            ],
            Maharashtra: [
              {
                city: "Mumbai",
                number: "022-4567-8901",
                type: "Regional Office",
              },
            ],
          },
          complaintSteps: [
            {
              step: 1,
              title: "Call Customer Care",
              description:
                "Call 121 for immediate assistance and complaint registration.",
              icon: Phone,
            },
            {
              step: 2,
              title: "Use Airtel Thanks App",
              description:
                "Use the official Airtel Thanks app for complaint tracking.",
              icon: Smartphone,
            },
          ],
          videoGuide: {
            title: "Airtel Customer Care Guide",
            videoId: "dQw4w9WgXcQ",
            thumbnail:
              "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            duration: "4:15",
            views: "850K",
            description:
              "How to contact Airtel customer care and resolve issues quickly.",
          },
        },
      },
    },
    banking: {
      "private-banks": {
        "hdfc-bank": {
          name: "HDFC Bank Customer Care – Toll-Free Numbers & Support ",
          logo: "/company-logos/bank-hdfc.png",
          description:
            "India's leading private sector bank offering comprehensive banking and financial services.",
          rating: 4.8,
          totalReviews: 3245,
          monthlySearches: "48K",
          founded: "1994",
          headquarters: "Mumbai, Maharashtra",
          website: "https://www.hdfcbank.com",
          parentCompany: "HDFC Limited",
          services: [
            "Savings & Current Accounts",
            "Credit Cards",
            "Personal & Home Loans",
            "Investment Services",
            "Digital Banking",
          ],
          nationalNumbers: [
            {
              type: "Customer Care",
              number: "1800-258-6161",
              description: "General banking support and account inquiries",
              available: "24x7",
              languages: ["Hindi", "English", "Regional Languages"],
              avgWaitTime: "1-2 minutes",
            },
            {
              type: "Credit Card Support",
              number: "1800-266-4332",
              description: "Credit card related queries and support",
              available: "24x7",
              languages: ["Hindi", "English"],
              avgWaitTime: "2-3 minutes",
            },
          ],
          stateWiseNumbers: {
            Maharashtra: [
              { city: "Mumbai", number: "022-6171-2000", type: "Head Office" },
            ],
          },
          complaintSteps: [
            {
              step: 1,
              title: "Call Customer Care",
              description:
                "Call the dedicated customer care number for your service.",
              icon: Phone,
            },
            {
              step: 2,
              title: "Visit Branch",
              description:
                "Visit your nearest HDFC Bank branch for assistance.",
              icon: Building2,
            },
          ],
          videoGuide: {
            title: "HDFC Bank Customer Support Guide",
            videoId: "dQw4w9WgXcQ",
            thumbnail:
              "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            duration: "6:20",
            views: "1.5M",
            description:
              "Complete guide to HDFC Bank customer support services.",
          },
          smsServices: [
            { code: "BAL", description: "Check your account balance", number: "5676712" },
            { code: "MINI", description: "Get mini statement", number: "5676712" },
            { code: "CHQBOOK", description: "Request cheque book", number: "5676712" },
            { code: "STOP", description: "Stop cheque payment", number: "5676712" },
          ],
          ivrMenu: {
            mainMenu: [
              { option: "1", description: "Account Balance & Statement" },
              { option: "2", description: "Fund Transfer & Payment" },
              { option: "3", description: "Card Services" },
              { option: "4", description: "Loan Services" },
              { option: "5", description: "Fixed Deposit Services" },
              { option: "6", description: "Complaint Registration" },
              { option: "0", description: "Talk to Customer Service" },
            ],
            subMenus: {
              "1": [
                { option: "1", description: "Balance Enquiry" },
                { option: "2", description: "Mini Statement" },
              ],
              "2": [
                { option: "1", description: "Block Card" },
                { option: "2", description: "Card Limit Enquiry" },
              ],
            }
          }
        },
      },
    },
  };

  // Find the company by searching all subcategories
  let company = null;
  if (companyData[categoryId]) {
    for (const subcatKey of Object.keys(companyData[categoryId])) {
      if (companyData[categoryId][subcatKey][companySlug]) {
        company = companyData[categoryId][subcatKey][companySlug];
        break;
      }
    }
  }

  // Debugging log
  console.log({ categoryId, companySlug, company });

  useEffect(() => {
    if (!company) {
      navigate("/category");
    }
  }, [company, navigate]);

  // Sync activeTab with URL
  React.useEffect(() => {
    const seg = location.pathname.split("/").pop();
    setActiveTab(tabUrlToId[seg] || "numbers");
  }, [location.pathname]);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company information...</p>
        </div>
      </div>
    );
  }

  const handleCall = (number) => {
    if (window.confirm(`Call ${company.name} at ${number}?`)) {
      window.location.href = `tel:${number}`;
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const copyToClipboard = (number) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    showToast(`Copied: ${number}`);
    setTimeout(() => setCopiedNumber(""), 2000);
  };

  const states = Object.keys(company.stateWiseNumbers);

  // List of all 36 states and union territories
  const allStates = [
    { state: "Andhra Pradesh", city: "", type: "", number: "" },
    { state: "Arunachal Pradesh", city: "", type: "", number: "" },
    { state: "Assam", city: "", type: "", number: "" },
    { state: "Bihar", city: "", type: "", number: "" },
    { state: "Chhattisgarh", city: "", type: "", number: "" },
    { state: "Goa", city: "", type: "", number: "" },
    { state: "Gujarat", city: "", type: "", number: "" },
    { state: "Haryana", city: "", type: "", number: "" },
    { state: "Himachal Pradesh", city: "", type: "", number: "" },
    { state: "Jharkhand", city: "", type: "", number: "" },
    { state: "Karnataka", city: "", type: "", number: "" },
    { state: "Kerala", city: "", type: "", number: "" },
    { state: "Madhya Pradesh", city: "", type: "", number: "" },
    {
      state: "Maharashtra",
      city: "Mumbai",
      type: "Head Office",
      number: "022-6171-2000",
    },
    { state: "Manipur", city: "", type: "", number: "" },
    { state: "Meghalaya", city: "", type: "", number: "" },
    { state: "Mizoram", city: "", type: "", number: "" },
    { state: "Nagaland", city: "", type: "", number: "" },
    { state: "Odisha", city: "", type: "", number: "" },
    { state: "Punjab", city: "", type: "", number: "" },
    { state: "Rajasthan", city: "", type: "", number: "" },
    { state: "Sikkim", city: "", type: "", number: "" },
    { state: "Tamil Nadu", city: "", type: "", number: "" },
    { state: "Telangana", city: "", type: "", number: "" },
    { state: "Tripura", city: "", type: "", number: "" },
    { state: "Uttar Pradesh", city: "", type: "", number: "" },
    { state: "Uttarakhand", city: "", type: "", number: "" },
    { state: "West Bengal", city: "", type: "", number: "" },
    { state: "Andaman and Nicobar Islands", city: "", type: "", number: "" },
    { state: "Chandigarh", city: "", type: "", number: "" },
    {
      state: "Dadra and Nagar Haveli and Daman and Diu",
      city: "",
      type: "",
      number: "",
    },
    { state: "Delhi", city: "", type: "", number: "" },
    { state: "Jammu and Kashmir", city: "", type: "", number: "" },
    { state: "Ladakh", city: "", type: "", number: "" },
    { state: "Lakshadweep", city: "", type: "", number: "" },
    { state: "Puducherry", city: "", type: "", number: "" },
  ];
  // Fill in data from company.stateWiseNumbers if available
  const stateTableRows = allStates.map((row) => {
    const offices = company.stateWiseNumbers[row.state];
    if (offices && offices.length > 0) {
      return {
        state: row.state,
        city: offices[0].city,
        type: offices[0].type,
        number: offices[0].number,
      };
    }
    return row;
  });

  const [copiedSms, setCopiedSms] = useState(null);

  // Toast notification component
  const Toast = ({ message, type = 'success', onClose }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      {type === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      {message}
    </motion.div>
  );

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6"> {/* Reduced vertical padding */}
          {/* Professional Breadcrumb */}
          <div className="flex items-center gap-3 text-white/80 mb-3">
            <button 
              onClick={() => navigate('/category')}
              className="hover:text-white transition-colors flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              All Categories
            </button>
            <ChevronRight className="h-4 w-4" />
            <button 
              onClick={() => navigate(`/category/${categoryId}`)}
              className="hover:text-white transition-colors font-medium"
            >
              {categoryId === "telecom" ? "Telecommunications" : "Banking & Finance"}
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-semibold">{company.name}</span>
          </div>
          {/* Company Header */}
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4"> {/* Less gap/margin */}
                <div className={`w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden ${
                  company.name.includes('HDFC Bank') 
                    ? 'bg-white/95 shadow-lg border border-gray-200/50' 
                    : 'bg-white/95 shadow-lg border border-gray-200/50'
                }`}>
                  {company.name.includes('HDFC Bank') ? (
                    <img
                      src="/company-logos/Bank/hdfc_bank.svg"
                      alt="HDFC Bank logo"
                      className="w-16 h-16 object-contain shadow-md rounded-lg"
                      onError={(e) => {
                        const target = e.target;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling;
                        if (fallback) {
                          fallback.textContent = company.name.charAt(0);
                          fallback.classList.remove("hidden");
                        }
                      }}
                    />
                  ) : (
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        const target = e.target;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling;
                        if (fallback) {
                          fallback.textContent = company.name.charAt(0);
                          fallback.classList.remove("hidden");
                        }
                      }}
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-4xl md:text-3xl font-bold mb-2">
                    {company.name}
                  </h1>
                </div>
              </div>

              <p className="text-lg text-white/90 mb-4 leading-relaxed"> {/* Less margin below */}
                {company.description}
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCall(company.nationalNumbers[0].number)}
                  className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                >
                  <Phone className="h-4 w-4" />
                  Call Now: {company.nationalNumbers[0].number}
                </button>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-2 text-sm"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {company.name === 'HDFC Bank' ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <h3 className="text-base font-semibold text-white mb-2 text-center">How to Complain of HDFC Bank</h3>
                <a
                  href={`https://www.youtube.com/watch?v=${company.videoGuide?.videoId || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/20 mb-2 h-32">
                    <img
                      src={company.videoGuide?.thumbnail}
                      alt={company.videoGuide?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/80 rounded-full p-2 shadow-lg">
                        <PlayCircle className="h-7 w-7 text-blue-700" />
                      </div>
                    </div>
                  </div>
                </a>
                <div className="text-white/90 text-xs text-center mb-1 font-semibold">{company.videoGuide?.title}</div>
                <div className="text-white/80 text-[11px] text-center mb-1">{company.videoGuide?.description}</div>
                <div className="text-white/60 text-[11px] text-center">Duration: {company.videoGuide?.duration} &bull; {company.videoGuide?.views} views</div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Company Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Founded</span>
                    <span className="font-bold text-white">
                      {company.founded}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Headquarters</span>
                    <span className="font-bold text-white">
                      {company.headquarters}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Parent Company</span>
                    <span className="font-bold text-white">
                      {company.parentCompany}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Rating</span>
                    <span className="font-bold text-white">
                      {company.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "numbers", label: "Contact Numbers", icon: Phone },
              { id: "complaints", label: "Complaint Redressal Process", icon: FileText },
              { id: "quickhelp", label: "Quick Help", icon: HelpCircle },
              { id: "video", label: "Video Guide", icon: PlayCircle },
              { id: "overview", label: "Overview", icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    navigate(`/category/${categoryId}/${companySlug}/${tabIdToUrl[tab.id]}`);
                  }}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto bg-[#F4F8FF] px-4 sm:px-6 lg:px-8 py-12">
        {/* Numbers Tab */}
        {activeTab === "numbers" && (
          <div className="w-full bg-[#F4F8FF]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
              {/* Main Content (Left) */}
              <div className="space-y-12">
                {/* Statewise Numbers Toggle Button */}
                {/* <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowStatewiseNumbers(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <MapPin className="h-5 w-5" />
                    Statewise Numbers
                  </button>
                </div> */}

                {/* Statewise Numbers Modal */}
                {showStatewiseNumbers && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl w-full relative animate-fade-in">
                      <button
                        onClick={() => setShowStatewiseNumbers(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 text-xl font-bold"
                        title="Close"
                      >
                        ×
                      </button>
                      <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-blue-500" /> Statewise Contact Numbers
                      </h2>
                      <div className="overflow-x-auto max-h-[60vh]">
                        <table className="min-w-full text-sm border border-blue-100 rounded-xl">
                          <thead className="bg-blue-50 text-blue-900 font-bold">
                            <tr>
                              <th className="py-2 px-3">State/UT</th>
                              <th className="py-2 px-3">City</th>
                              <th className="py-2 px-3">Type</th>
                              <th className="py-2 px-3">Contact Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stateTableRows.map((row, idx) => (
                              <tr key={row.state} className={idx % 2 === 0 ? "bg-blue-50/40" : "bg-white"}>
                                <td className="py-2 px-3 font-semibold text-gray-800">{row.state}</td>
                                <td className="py-2 px-3 text-gray-700">{row.city}</td>
                                <td className="py-2 px-3 text-gray-700">{row.type}</td>
                                <td className="py-2 px-3 text-blue-700 font-semibold whitespace-nowrap flex items-center gap-1">
                                  {row.number}
                                  {row.number && (
                                    <button
                                      onClick={() => copyToClipboard(row.number)}
                                      title="Copy"
                                      className="hover:text-blue-500"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading contact numbers...</span>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={fetchContactNumbersData}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* Top Contact Cards */}
                {contactNumbersData?.topContactCards && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactNumbersData.topContactCards.cards.map((item, index) => {
                      const Icon = icons[index] || PhoneCall;
                      return (
                        <div
                          key={index}
                          className="p-4 rounded-xl shadow hover:shadow-md transition"
                          style={{ backgroundColor: item.colors?.cardBg || '#f8fafc' }}
                        >
                          <div
                            className="w-12 h-12 rounded-md flex items-center justify-center mb-3"
                            style={{ backgroundColor: item.colors?.iconBg || '#e2e8f0' }}
                          >
                            <Icon 
                              className="w-6 h-6" 
                              style={{ color: item.colors?.textColor || '#3b82f6' }}
                            />
                          </div>
                          <h4 className="text-sm font-semibold text-gray-800">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-lg font-extrabold text-blue-600">
                              {item.number}
                            </p>
                            <button
                              onClick={() => copyToClipboard(item.number)}
                              title="Copy Number"
                              className="hover:text-blue-500"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">{item.subtitle}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Helpline Numbers */}
                  {contactNumbersData?.helplineNumbersSection && (
                    <div className="bg-white rounded-xl shadow p-4">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <Phone className="w-5 h-5 text-blue-600" /> 
                        {contactNumbersData.helplineNumbersSection.heading?.text || "Helpline Numbers"}
                      </h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                            <th className="py-2 px-3">Service</th>
                            <th className="py-2 px-3">Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contactNumbersData.helplineNumbersSection.table?.rows?.map((row, idx) => (
                            <tr
                              key={idx}
                              className={idx % 2 === 0 ? "bg-gray-50" : ""}
                            >
                              <td className="py-3 px-3 text-[15px] text-gray-800">
                                <div className="flex items-center h-full">
                                  <span className="inline-block border-l-4 border-blue-600 pl-2 font-semibold">
                                    {row[0]}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-[16px] text-blue-600 font-semibold whitespace-nowrap">
                                    {row[1]}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(row[1])}
                                    title="Copy"
                                    className="hover:text-blue-500"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
                                  <span className="text-xs text-green-600 font-medium">24x7 Available</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* All India Numbers */}
                  {contactNumbersData?.allIndiaNumbersSection && (
                    <div className="bg-white rounded-xl shadow p-4 h-fit">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <Phone className="w-5 h-5 text-green-600" /> 
                        {contactNumbersData.allIndiaNumbersSection.heading?.text || "All India Numbers"}
                      </h3>
                      <table className="w-full text-[15px]">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                            {contactNumbersData.allIndiaNumbersSection.table?.headers?.map((header, idx) => (
                              <th key={idx} className="py-2 px-3">{header}</th>
                            )) || (
                              <>
                                <th className="py-2 px-3">Number</th>
                                <th className="py-2 px-3">Description</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {contactNumbersData.allIndiaNumbersSection.table?.rows?.map((row, idx) => (
                            <tr
                              key={idx}
                              className={idx % 2 === 0 ? "bg-gray-50" : ""}
                            >
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="py-3 px-3">
                                  {cellIdx === 0 ? (
                                    <div className="text-[16px] text-green-700 font-semibold whitespace-nowrap flex items-center gap-2">
                                      {cell}
                                      <button
                                        onClick={() => copyToClipboard(cell)}
                                        title="Copy"
                                        className="hover:text-blue-500"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[14px] text-gray-700 leading-snug block max-w-sm">
                                      {cell}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              
                {/* SMS & WhatsApp Services */}
                {contactNumbersData?.smsServicesSection && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                        {contactNumbersData.smsServicesSection.heading?.text || "SMS & WhatsApp Services"}
                      </h3>
                      <button
                        onClick={() => setSmsDropdownOpen(!smsDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        View All SMS/WhatsApp Codes
                        <ChevronDown className={`h-4 w-4 transition-transform ${smsDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    <AnimatePresence>
                      {smsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {contactNumbersData.smsServicesSection.services?.map((service, index) => {
                              const colors = [
                                { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', borderText: 'text-blue-900' },
                                { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', borderText: 'text-green-900' },
                                { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700', borderText: 'text-yellow-900' },
                                { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', borderText: 'text-red-900' },
                                { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', borderText: 'text-orange-900' }
                              ];
                              const color = colors[index % colors.length];
                              
                              return (
                                <div key={service.code} className={`${color.bg} border-l-4 ${color.border} rounded-xl p-5 flex flex-col gap-2 shadow-sm`}>
                                  <div>
                                    <div className={`font-bold ${color.text} text-lg mb-1`}>{service.description}</div>
                                    <div className="text-gray-700 text-[15px] mb-1">Send the following SMS:</div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`font-mono bg-white px-2 py-1 rounded border ${color.border} ${color.borderText} text-sm`}>
                                        {service.code}
                                      </span>
                                      <button 
                                        onClick={() => copyToClipboard(service.code)} 
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors" 
                                        title="Copy message"
                                      >
                                        <Copy className="h-5 w-5" />
                                      </button>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      To: <span className={`font-mono ${color.text} font-bold`}>{service.number}</span> 
                                      <button 
                                        onClick={() => copyToClipboard(service.number)} 
                                        className="hover:text-blue-500" 
                                        title="Copy number"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* IVRS Menu */}
                <div className="mb-8">
                  <div className="bg-gray-50 rounded-2xl shadow border border-gray-100 p-6 max-w-5xl mx-auto">
                    <div className="mb-4 text-center flex justify-center items-center gap-0">
                      <span className="font-bold text-lg text-blue-900 mr-3">IVRS Menu:</span>
                      {[0, 1, 2].map((idx) => {
                        const number = company?.nationalNumbers?.[idx]?.number;
                        const isActive = selectedIVRS === idx;
                        const isRealNumber = !!number;
                        return (
                          <React.Fragment key={idx}>
                            {idx > 0 && <span className="mx-2 text-gray-300 font-bold text-lg">/</span>}
                            <button
                              onClick={() => isRealNumber && setSelectedIVRS(idx)}
                              className={
                                `flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                                text-base font-medium shadow-sm
                                ${isActive
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                                  : isRealNumber
                                    ? 'bg-white text-blue-700 border-blue-300 hover:bg-blue-100 hover:shadow'
                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}
                                `
                              }
                              style={{ minWidth: 140, cursor: isRealNumber ? 'pointer' : 'not-allowed' }}
                              disabled={!isRealNumber}
                            >
                              <Phone className="inline h-5 w-5 mb-1" />
                              {number || `Number ${idx + 1}`}
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div className="text-gray-700 text-sm mb-4 text-center font-normal">
                      <span className="font-medium">After selecting preferred language: Hindi, English, Marathi</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedIVRS}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ul className="space-y-4">
                          {ivrsSteps[selectedIVRS].map((item, index) => (
                            <li key={index}>
                              <div className="font-medium text-blue-800">
                                {item.title}
                              </div>
                              {item.sub && item.sub.length > 0 && (
                                <ul className="ml-6 mt-2 space-y-1 border-l-2 border-blue-100 pl-4 bg-blue-50 rounded">
                                  {item.sub.map((child, childIndex) => (
                                    <li key={childIndex}>
                                      <span className="font-medium text-blue-700">{child}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Compact Modern Quick Links Section */}
                {/* <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-900 leading-tight">Quick Links</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {[
                      { title: "NetBanking", url: "https://netbanking.hdfcbank.com/netbanking/", icon: Building2, color: 'bg-blue-100 text-blue-600' },
                      { title: "Branch/ATM", url: "https://near-me.hdfcbank.com/branch-atm-locator/", icon: MapPin, color: 'bg-green-100 text-green-600' },
                      { title: "Customer Care", url: "https://www.hdfcbank.com/personal/need-help/customer-care", icon: Phone, color: 'bg-indigo-100 text-indigo-600' },
                      { title: "Credit Card", url: "https://www.hdfcbank.com/personal/ways-to-bank/online-banking/credit-card-netbanking", icon: CreditCard, color: 'bg-yellow-100 text-yellow-600' },
                      { title: "Block Card", url: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/block-loststolen-card", icon: ShieldAlert, color: 'bg-red-100 text-red-600' },
                      { title: "Report Fraud", url: "https://www.hdfcbank.com/personal/need-help/contact-us/unauthorized-electronic-banking", icon: Shield, color: 'bg-pink-100 text-pink-600' },
                      { title: "Complaint", url: "https://leads.hdfcbank.com/applications/webforms/apply/complaint_form_new.asp", icon: FileText, color: 'bg-purple-100 text-purple-600' },
                      { title: "Track Complaint", url: "https://leads.hdfcbank.com/applications/misc/CST/cstracker.aspx", icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
                      { title: "Support", url: "https://www.hdfcbank.com/personal/about-us/corporate-governance/banking-customer-helpdesk", icon: Headphones, color: 'bg-green-100 text-green-600' },
                      { title: "Savings Acct", url: "https://www.hdfcbank.com/personal/save/accounts/savings-accounts", icon: Building2, color: 'bg-blue-100 text-blue-600' },
                      { title: "Apply Card", url: "https://applyonline.hdfcbank.com/cards/credit-cards.html", icon: CreditCard, color: 'bg-yellow-100 text-yellow-600' },
                      { title: "Loan", url: "https://www.hdfcbank.com/personal/borrow/popular-loans", icon: Zap, color: 'bg-indigo-100 text-indigo-600' },
                      { title: "Mobile App", url: "https://play.google.com/store/apps/details?id=com.snapwork.hdfc", icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
                      { title: "PayZapp", url: "https://play.google.com/store/apps/details?id=com.enstage.wibmo.hdfc", icon: CreditCard, color: 'bg-yellow-100 text-yellow-600' },
                      { title: "MyCards", url: "https://play.google.com/store/apps/details?id=com.hdfcbank.mycards", icon: CreditCard, color: 'bg-purple-100 text-purple-600' },
                      { title: "Loan Assist", url: "https://www.hdfcbank.com/personal/borrow/loans/loan-assist", icon: Home, color: 'bg-green-100 text-green-600' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.title}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col items-center gap-2 hover:border-blue-500 hover:shadow-lg transition-all duration-150 focus:outline-none scale-100 hover:scale-105"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 text-lg font-bold ${item.color} transition-colors`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-xs font-semibold text-gray-900 text-center truncate w-full group-hover:text-blue-700 transition-colors">
                            {item.title}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div> */}

                {/* Email Support (full width, below) */}
                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-blue-600" /> Email Support
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-3">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["General Enquiries", "support@sbi.co.in", "24x7"],
                        [
                          "Credit Card Support",
                          "cards@sbi.co.in",
                          "10 AM – 5 PM",
                        ],
                        ["Internet Banking", "onlinesbi@sbi.co.in", "24x7"],
                        ["Complaints", "complaints@sbi.co.in", "24x7"],
                        ["Cyber Security", "cybersecurity@sbi.co.in", "24x7"],
                      ].map(([label, email, timing], idx) => (
                        <tr
                          key={label}
                          className={idx % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <td className="py-3 px-3 font-semibold text-[15px] text-gray-800">
                            <span className="inline-block border-l-4 border-blue-600 pl-2">
                              {label}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-blue-600 font-bold whitespace-nowrap flex items-center gap-2 text-[15px]">
                            {email}
                            <button
                              onClick={() => copyToClipboard(email)}
                              title="Copy"
                              className="hover:text-blue-500"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Service-wise Numbers Table (unique modern style) */}
                <div className="bg-white rounded-2xl shadow-lg p-4 overflow-x-auto">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <Phone className="w-6 h-6 text-blue-500" /> Service-wise Toll
                    Free Numbers
                  </h3>
                  <table className="min-w-full text-sm table-fixed border border-blue-100">
                    <thead className="bg-blue-50 text-blue-900 font-bold">
                      <tr>
                        <th className="py-2 px-3 w-10 text-center">#</th>
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-3">Toll Free No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Reporting Unauthorised Transactions", ["1800111109"]],
                        ["SBI YONO", ["1800111101"]],
                        [
                          "Pensioners",
                          ["1800110009", "18004253800", "1800112211"],
                        ],
                        ["PMJDY", ["1800110001"]],
                        ["SBI FASTag", ["1800110018"]],
                        ["Home Loan", ["1800112018"]],
                        ["Income Tax Refund Orders (ITRO)", ["18004259760"]],
                        ["Wealth & Platinum Customers", ["18008900"]],
                        ["Doorstep Banking Services", ["1800111103"]],
                        ["Senior Citizen & Differently-abled", ["18008888"]],
                        ["Other PMJDY Numbers", ["1800110001", "18001801111"]],
                        ["GST Related Queries", ["1800112017"]],
                        ["Credit Card Payment Queries", ["8422845515"]],
                        ["Available Credit Limit", ["8108100986"]],
                        ["Report Unauthorised Transactions", ["9449112211"]],
                        ["Doorstep Banking", ["9152202020"]],
                        ["Credit Card Queries", ["18001801290"]],
                      ].map(([service, numbers], idx) => (
                        <tr
                          key={service}
                          className={idx % 2 === 0 ? "bg-blue-50/40" : "bg-white"}
                        >
                          <td className="py-2 px-3 text-center text-gray-700 font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3 text-gray-800 truncate max-w-[250px]">
                            {service}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex flex-wrap gap-x-2 gap-y-1 text-blue-700 font-semibold">
                              {numbers.map((num) => (
                                <div
                                  key={num}
                                  className="flex items-center text-[15px] gap-1 whitespace-nowrap"
                                >
                                  {num}
                                  <button
                                    onClick={() => copyToClipboard(num)}
                                    title="Copy"
                                    className="hover:text-blue-500"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Additional Tables from Uploaded Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Missed Call Service */}
                  <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Missed Call Service
                    </h3>
                    <table className="min-w-full text-sm text-left table-auto">
                      <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                          <th className="py-2 px-3">Sr No.</th>
                          <th className="py-2 px-3">Service Name</th>
                          <th className="py-2 px-3">Contact No.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["For Balance Enquiry", "9223766666"],
                          ["For Mini Statement", "9223866666"],
                          ["For Home Loan", "7208933140"],
                          ["For Car Loan", "7208933141"],
                          ["For Gold Loan", "7208933143"],
                          ["For Personal Loan", "7208933142"],
                          ["For SME", "7208933144"],
                        ].map(([service, number], idx) => (
                          <tr
                            key={service}
                            className={idx % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="py-2 px-3 text-gray-700">{idx + 1}</td>
                            <td className="py-2 px-3 text-gray-800">{service}</td>
                            <td className="py-2 px-3 text-blue-700 text-[15px] font-semibold whitespace-nowrap flex items-center gap-1">
                              {number}
                              <button
                                onClick={() => copyToClipboard(number)}
                                title="Copy"
                                className="hover:text-blue-500"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Other Emails */}
                  <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Other Emails
                    </h3>
                    <table className="min-w-full text-sm text-left table-auto">
                      <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                          <th className="py-2 px-3">Sr No.</th>
                          <th className="py-2 px-3">Services</th>
                          <th className="py-2 px-3">Email Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [
                            "General Head",
                            "socialreply@sbi.co.in, gm.customer@sbi.co.in",
                          ],
                          [
                            "Aadhaar Seeding",
                            "nodalofficer.aadhaarseeding@sbi.co.in",
                          ],
                          ["Home Loan", "customercare.homeloans@sbi.co.in"],
                          [
                            "To block your card",
                            "unauthorisedtransaction@sbi.co.in",
                          ],
                          [
                            "To report any cyber incident",
                            "report.phishing@sbi.co.in",
                          ],
                          [
                            "For Home Loan Query",
                            "customercare.homeloans@sbi.co.in",
                          ],
                        ].map(([service, email], idx) => (
                          <tr
                            key={service}
                            className={idx % 2 === 0 ? "bg-gray-50" : ""}
                          >
                            <td className="py-2 px-3 text-gray-700">{idx + 1}</td>
                            <td className="py-2 px-3 text-gray-800">{service}</td>
                            <td className="py-2 px-3 text-blue-700 font-semibold whitespace-nowrap flex items-center gap-1">
                              {email}
                              <button
                                onClick={() => copyToClipboard(email)}
                                title="Copy"
                                className="hover:text-blue-500"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="mt-8 bg-white rounded-xl shadow p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Comments & Feedback</h3>
                      <p className="text-sm text-gray-600">Share your experience or ask questions</p>
                    </div>
                  </div>

                  {/* Comment Form */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Share your thoughts, ask questions, or provide feedback..."
                          className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-blue-50/30 text-gray-800 placeholder-gray-400 resize-none shadow-sm"
                          rows="3"
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50">
                              <Paperclip className="h-4 w-4" />
                              Attach file
                            </button>
                          </div>
                          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-medium">
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {/* Sample Comment */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-green-700">JD</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">John Doe</span>
                              <span className="text-xs text-gray-500">2 hours ago</span>
                            </div>
                            <div className="relative">
                              <button 
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                onClick={() => setOpenDropdown(openDropdown === 'comment1' ? null : 'comment1')}
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                              </button>
                              {openDropdown === 'comment1' && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                  <button 
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    onClick={() => {
                                      // Handle delete comment 1
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">
                            The missed call service is really helpful! I used it to check my balance and it worked perfectly. Great service from HDFC Bank.
                          </p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span>12</span>
                            </button>
                            <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                              Reply
                            </button>
                            <button className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Another Sample Comment */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-purple-700">SM</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">Sarah Miller</span>
                              <span className="text-xs text-gray-500">1 day ago</span>
                            </div>
                            <div className="relative">
                              <button 
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                onClick={() => setOpenDropdown(openDropdown === 'comment2' ? null : 'comment2')}
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-500" />
                              </button>
                              {openDropdown === 'comment2' && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                  <button 
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                    onClick={() => {
                                      // Handle delete comment 2
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">
                            I had an issue with my home loan application. The email support team responded quickly and helped me resolve the problem. Very satisfied with the service!
                          </p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span>8</span>
                            </button>
                            <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                              Reply
                            </button>
                            <button className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Load More Comments */}
                    <div className="text-center pt-4">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Load more comments
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Sidebar: Customer Care List */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-[260px] w-full">
                    <div className="bg-blue-700 rounded-t-2xl px-4 py-3">
                      <h3 className="text-white text-lg font-bold text-center">Customer Care List</h3>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {[
                        { name: 'SBI Customer Care', href: '/category/banking-services/sbi-bank/contactnumber' },
                        { name: 'Axis Bank Customer Care', href: '#' },
                        { name: 'Union Bank of India Customer Care', href: '#' },
                        { name: 'ICICI Bank Customer Care', href: '#' },
                        { name: 'Standard Chartered Customer Care', href: '#' },
                        { name: 'Kotak Mahindra Bank Customer Care', href: '#' },
                        { name: 'Indian Bank Customer Care', href: '#' },
                        { name: 'Bank of India Customer Care', href: '#' },
                        { name: 'Bank of Maharashtra Customer Care', href: '#' },
                        { name: 'IndusInd Bank Customer Care', href: '#' },
                        { name: 'Punjab National Bank Customer Care', href: '#' },
                      ].map(link => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="block px-4 py-2 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-colors text-sm font-medium w-full"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* Complaints Tab - Modern, Professional Visuals */}
        {activeTab === "complaints" && (
          <div className="w-full bg-[#F4F8FF] px-2 md:px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-2 lg:gap-4">
              {/* Main Content (Left, 60%) */}
              <div className="flex flex-col gap-3 p-0 md:p-1">
                {/* Unified Complaint Escalation Card */}
                <div className="bg-white border border-blue-200 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col gap-4">
                  {/* Header + Standout Mandatory Steps */}
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-blue-800 mb-1">HDFC Bank Step-by-Step Complaint/Grievance Filing Guide</h2>
                    <p className="text-xs md:text-sm text-gray-700 mb-2">If you've submitted a complaint to HDFC Bank—online or offline—and haven't received a resolution after 30 days, follow these steps to escalate your complaint and get it resolved faster.</p>
                    {/* Mandatory Prerequisite Section */}
                    <div className="bg-blue-50 border border-blue-400 rounded-xl shadow-sm p-3 md:p-4 mb-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-blue-700 text-base md:text-lg">Mandatory Prerequisite: SCORES Registration</h3>
                      </div>
                      <div className="text-xs md:text-sm text-gray-800 mb-1">
                        <span className="font-semibold">Before escalating, you must register your complaint on the <a href='https://scores.gov.in' className='text-blue-700 underline' target='_blank' rel='noopener noreferrer'>SCORES portal</a> (SEBI Complaints Redress System).</span> This is required for regulatory tracking and faster resolution.
                      </div>
                      <div className="text-sm md:text-sm text-gray-800 font-semibold mb-1">Details required for SCORES registration:</div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 list-none pl-0">
                        <li className="flex items-center gap-2 text-xs"><span className="text-green-600">✔️</span> <span className="text-[14px]">Name (as per bank records)</span></li>
                        <li className="flex items-center gap-2 text-xs"><span className="text-green-600">✔️</span> <span className="text-[14px]">PAN (Permanent Account Number)</span></li>
                        <li className="flex items-center gap-2 text-xs"><span className="text-green-600">✔️</span> <span className="text-[14px]">Address (current)</span></li>
                        <li className="flex items-center gap-2 text-xs"><span className="text-green-600">✔️</span> <span className="text-[14px]">Mobile Number (active)</span></li>
                        <li className="flex items-center gap-2 text-xs"><span className="text-green-600">✔️</span> <span className="text-[14px]">Email ID (registered)</span></li>
                      </ul>
                    </div>
                    <p className="text-blue-600 text-xs md:text-sm flex items-center gap-1 mb-1"><span>📹</span> If you're looking to file a fresh complaint, you can also watch the step-by-step video guide below.</p>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-blue-100 my-2"></div>
                  {/* Level 1 */}
                  <div>
                    <h4 className="font-bold text-blue-700 text-base md:text-lg mb-1 flex items-center gap-1">Level 1: HDFC Bank Customer Care</h4>
                    <div className="text-xs md:text-sm text-gray-800">To register your complaint, reach out to HDFC Bank's Customer Care team through call, email, or online form. They are available 24x7 to help you with any  customer complaint:</div>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <div className="flex items-center gap-2 text-xs md:text-sm"><span className="font-semibold">📞 Phone:</span> <span className="font-mono">1800 1600</span> / <span className="font-mono">1800 2600</span></div>
                      <div className="flex items-center gap-2 text-xs md:text-sm"><span className="font-semibold">✉️ Email:</span> <a href="mailto:support@hdfcbank.com" className="text-blue-700 underline">support@hdfcbank.com</a></div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-700 font-semibold mt-1">Alternative Options:</div>
                    <ul className="list-disc list-inside ml-3 text-xs md:text-sm text-gray-700 space-y-0.5">
                      <li>Connect with Eva/Chat Bot for quick solutions</li>
                      <li>Visit/Contact your nearest branch</li>
                    </ul>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-blue-100 my-2"></div>
                  {/* Level 2 */}
                  <div>
                    <h4 className="font-bold text-blue-700 text-base md:text-lg mb-1 flex items-center gap-1">Level 2: Grievance Redressal Officer</h4>
                    <div className="text-xs md:text-sm text-gray-800 mb-1">Still not satisfied after Level 2? You can escalate your complaint to HDFC Bank's Principal Nodal Officer for faster resolution. This is the highest level of grievance redressal within the bank.</div>
                    <div className="overflow-x-auto mb-1">
                      <table className="min-w-full w-full text-xs md:text-sm border border-blue-100 rounded">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="py-1 px-2 border text-xs md:text-sm">Product</th>
                            <th className="py-1 px-2 border text-xs md:text-sm">Contact Number</th>
                            <th className="py-1 px-2 border text-xs md:text-sm">Hours</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="border px-2 py-1">Banking/Digital Lending</td>
                            <td className="border px-2 py-1 font-mono">1800 266 4060</td>
                            <td className="border px-2 py-1">Mon-Sat, 9:30am-5:30pm<br/>2nd & 4th Sat, Sun, Holidays: Closed</td>
                          </tr>
                          <tr className="bg-blue-50">
                            <td className="border px-2 py-1">Credit Cards</td>
                            <td className="border px-2 py-1 font-mono">044-61084900</td>
                            <td className="border px-2 py-1">Mon-Sat, 9:30am-5:30pm<br/>2nd & 4th Sat, Sun, Holidays: Closed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold text-xs md:text-sm">Email:</span>
                      <ul className="list-disc list-inside ml-3 text-xs md:text-sm text-gray-700 space-y-0.5">
                        <li>Digital: <a href="mailto:grievance.redressaldl@hdfcbank.com" className="text-blue-700 underline">grievance.redressaldl@hdfcbank.com</a></li>
                        <li>Non-Credit Card: <a href="mailto:grievance.redressal@hdfcbank.com" className="text-blue-700 underline">grievance.redressal@hdfcbank.com</a></li>
                        <li>Credit Card: <a href="mailto:grievance.redressalcc@hdfcbank.com" className="text-blue-700 underline">grievance.redressalcc@hdfcbank.com</a></li>
                      </ul>
                    </div>
                    <div className="mb-1 text-xs md:text-sm">Fill out the <a href="#" className="text-blue-700 underline">Complaints/Query/Request Form</a></div>
                    <div className="mb-1 text-gray-600 text-xs md:text-sm">Resolution Time: 10 days</div>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-blue-100 my-2"></div>
                  {/* Level 3 */}
                  <div>
                    <h4 className="font-bold text-blue-700 text-base md:text-lg mb-1 flex items-center gap-1">Level 3: Principal Nodal Officer</h4>
                    <div className="text-xs md:text-sm text-gray-800 mb-1">If Level 2 doesn't resolve your concern, contact the Principal Nodal Officer:</div>
                    <div className="flex flex-col gap-0.5 mb-1">
                      <div className="flex items-center gap-2 text-xs md:text-sm"><span className="font-semibold">✉️ Email:</span> <a href="mailto:pnohdfcbank@hdfcbank.com" className="text-blue-700 underline">pnohdfcbank@hdfcbank.com</a></div>
                      <div className="flex items-center gap-2 text-xs md:text-sm"><span className="font-semibold">🕒 Hours:</span> Mon-Sat, 9:30am-5:30pm (Excl. 2nd & 4th Sat, Holidays)</div>
                    </div>
                    <div className="mb-1 font-semibold text-xs md:text-sm">Regional Nodal Officers (sample):</div>
                    <div className="overflow-x-auto mb-1">
                      <table className="min-w-full w-full text-xs md:text-sm border border-blue-100 rounded">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="py-1 px-2 border text-xs md:text-sm">Region</th>
                            <th className="py-1 px-2 border text-xs md:text-sm">Contact</th>
                            <th className="py-1 px-2 border text-xs md:text-sm">Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white"><td className="border px-2 py-1">AP & Telangana</td><td className="border px-2 py-1 font-mono">040-67921327</td><td className="border px-2 py-1 font-mono">044-69039236</td></tr>
                          <tr className="bg-blue-50"><td className="border px-2 py-1">Bihar</td><td className="border px-2 py-1 font-mono">9973665832</td><td className="border px-2 py-1 font-mono">7267850740</td></tr>
                          <tr className="bg-white"><td className="border px-2 py-1">Delhi</td><td className="border px-2 py-1 font-mono">9211583131</td><td className="border px-2 py-1 font-mono">9354914683</td></tr>
                          <tr className="bg-blue-50"><td className="border px-2 py-1">Mumbai</td><td className="border px-2 py-1 font-mono">022-24811081</td><td className="border px-2 py-1 font-mono">022-62841505</td></tr>
                          <tr className="bg-white"><td className="border px-2 py-1">West Bengal</td><td className="border px-2 py-1 font-mono">033-44065165</td><td className="border px-2 py-1 font-mono">033-44065165</td></tr>
                        </tbody>
                      </table>
                    </div>
                    {/* Full Regional Email IDs Table */}
                    <div className="mt-4">
                      <h4 className="font-bold text-blue-700 text-xs md:text-sm mb-1">Regional Email IDs for Nodal Officers</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs md:text-sm border border-blue-200 rounded bg-white">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="py-2 px-3 border text-left">Region</th>
                              <th className="py-2 px-3 border text-left">State(s)</th>
                              <th className="py-2 px-3 border text-left">Email ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td className="border px-3 py-1">Ahmedabad</td><td className="border px-3 py-1">Gujarat</td><td className="border px-3 py-1"><a href="mailto:bohdfcahm@hdfcbank.com" className="text-blue-700 underline">bohdfcahm@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Guwahati</td><td className="border px-3 py-1">Assam/Manipur/Meghalaya/Tripura/Sikkim/Mizoram/Arunachal Pradesh/Nagaland</td><td className="border px-3 py-1"><a href="mailto:bohdfcasm@hdfcbank.com" className="text-blue-700 underline">bohdfcasm@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Bengaluru</td><td className="border px-3 py-1">Karnataka</td><td className="border px-3 py-1"><a href="mailto:bohdfcblr@hdfcbank.com" className="text-blue-700 underline">bohdfcblr@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Bhubaneswar</td><td className="border px-3 py-1">Odisha</td><td className="border px-3 py-1"><a href="mailto:bohdfcbr@hdfcbank.com" className="text-blue-700 underline">bohdfcbr@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Bhopal</td><td className="border px-3 py-1">Madhya Pradesh</td><td className="border px-3 py-1"><a href="mailto:bohdfcbpl@hdfcbank.com" className="text-blue-700 underline">bohdfcbpl@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Chandigarh/Shimla</td><td className="border px-3 py-1">Himachal Pradesh/Punjab/Chandigarh</td><td className="border px-3 py-1"><a href="mailto:bohdfccgh@hdfcbank.com" className="text-blue-700 underline">bohdfccgh@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Chennai I & II</td><td className="border px-3 py-1">Tamil Nadu</td><td className="border px-3 py-1"><a href="mailto:bohdfccfn@hdfcbank.com" className="text-blue-700 underline">bohdfccfn@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Dehradun</td><td className="border px-3 py-1">Uttarakhand</td><td className="border px-3 py-1"><a href="mailto:bohdfccddn@hdfcbank.com" className="text-blue-700 underline">bohdfccddn@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Delhi I & II</td><td className="border px-3 py-1">Delhi & Haryana</td><td className="border px-3 py-1"><a href="mailto:bohdfcdel@hdfcbank.com" className="text-blue-700 underline">bohdfcdel@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Hyderabad</td><td className="border px-3 py-1">Andhra Pradesh/Telangana</td><td className="border px-3 py-1"><a href="mailto:bohdfchyd@hdfcbank.com" className="text-blue-700 underline">bohdfchyd@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Jammu</td><td className="border px-3 py-1">Jammu/Kashmir</td><td className="border px-3 py-1"><a href="mailto:bohdfcjammu@hdfcbank.com" className="text-blue-700 underline">bohdfcjammu@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Jaipur</td><td className="border px-3 py-1">Rajasthan</td><td className="border px-3 py-1"><a href="mailto:bohdfcjr@hdfcbank.com" className="text-blue-700 underline">bohdfcjr@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Kolkata I & II</td><td className="border px-3 py-1">West Bengal</td><td className="border px-3 py-1"><a href="mailto:bohdfckol@hdfcbank.com" className="text-blue-700 underline">bohdfckol@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Kanpur</td><td className="border px-3 py-1">Uttar Pradesh</td><td className="border px-3 py-1"><a href="mailto:bohdfckpr@hdfcbank.com" className="text-blue-700 underline">bohdfckpr@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Mumbai I & II</td><td className="border px-3 py-1">Maharashtra/Goa</td><td className="border px-3 py-1"><a href="mailto:bohdfcmum@hdfcbank.com" className="text-blue-700 underline">bohdfcmum@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Patna</td><td className="border px-3 py-1">Bihar</td><td className="border px-3 py-1"><a href="mailto:bohdfcptn@hdfcbank.com" className="text-blue-700 underline">bohdfcptn@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Raipur</td><td className="border px-3 py-1">Chhattisgarh</td><td className="border px-3 py-1"><a href="mailto:bohdfcraip@hdfcbank.com" className="text-blue-700 underline">bohdfcraip@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Ranchi</td><td className="border px-3 py-1">Jharkhand</td><td className="border px-3 py-1"><a href="mailto:bohdfcrnc@hdfcbank.com" className="text-blue-700 underline">bohdfcrnc@hdfcbank.com</a></td></tr>
                            <tr><td className="border px-3 py-1">Thiruvananthapuram</td><td className="border px-3 py-1">Kerala/Lakshadweep</td><td className="border px-3 py-1"><a href="mailto:bohdfctrv@hdfcbank.com" className="text-blue-700 underline">bohdfctrv@hdfcbank.com</a></td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="text-gray-600 text-xs md:text-sm mt-2">Resolution Time: 10 days</div>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-blue-100 my-2"></div>
                  {/* Level 4 */}
                  <div>
                    <h4 className="font-bold text-blue-700 text-base md:text-lg mb-1 flex items-center gap-1">Level 4: Banking Ombudsman</h4>
                    <ul className="list-disc list-inside ml-3 text-xs md:text-sm text-gray-700 mb-1">
                      <li>If your issue remains unresolved after Level 1-3, or no reply within 30 days, contact the Banking Ombudsman (RBI).</li>
                      <li>Use the <a href="https://cms.rbi.org.in" className="text-blue-700 underline">RBI Banking Ombudsman</a> or Centralized Public Grievance Redress And Monitoring System.</li>
                    </ul>
                    <div className="text-xs md:text-sm text-gray-500">Note: Keep proof of all complaints filed for your records.</div>
                  </div>
                </div>
              </div>
              {/* Sidebar (Right, 40%) - Video and Complaint Tips, hidden on mobile */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 flex flex-col gap-3">
                  {/* Video Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 max-w-[320px] w-full overflow-hidden">
                    <div className="bg-blue-700 rounded-t px-3 py-2">
                      <h3 className="text-white text-base font-bold text-center">How to File a Complaint (Video)</h3>
                    </div>
                    <div className="p-2 flex flex-col items-center">
                      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="block w-full">
                        <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/20 mb-2 h-32 w-full bg-black flex items-center justify-center">
                          <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" alt="How to File a Complaint" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/80 rounded-full p-2 shadow-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-700">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </a>
                      <div className="text-center text-gray-700 text-xs md:text-sm font-semibold">Watch this short video to learn how to file a complaint with HDFC Bank step by step.</div>
                    </div>
                  </div>
                  {/* Complaint Tips Card */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 max-w-[320px] w-full overflow-hidden">
                    <div className="bg-orange-700 rounded-t px-3 py-2">
                      <h3 className="text-white text-base font-bold text-center">Complaint Tips</h3>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      <li className="px-3 py-2 text-gray-700 text-xs md:text-sm">✔️ Keep all complaint reference numbers safe</li>
                      <li className="px-3 py-2 text-gray-700 text-xs md:text-sm">✔️ Always use your registered email/phone</li>
                      <li className="px-3 py-2 text-gray-700 text-xs md:text-sm">✔️ Attach supporting documents/screenshots</li>
                      <li className="px-3 py-2 text-gray-700 text-xs md:text-sm">✔️ Escalate only if not resolved in time</li>
                      <li className="px-3 py-2 text-gray-700 text-xs md:text-sm">✔️ For urgent issues, call customer care directly</li>
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* Quick Help Tab */}
        {activeTab === "quickhelp" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Help Center</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Get instant help for common issues. Find answers to frequently asked questions and get quick solutions.
                </p>
              </div>
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Professional Quick Links Section */}
              <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Quick Links</h3>
                    <p className="text-sm text-gray-600">Access HDFC Bank services</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[
                    // Banking Services
                    {
                      title: "NetBanking Login",
                      url: "https://netbanking.hdfcbank.com/netbanking/",
                      description: "Daily banking transactions",
                      icon: Building2
                    },
                    {
                      title: "Find Branch/ATM",
                      url: "https://near-me.hdfcbank.com/branch-atm-locator/",
                      description: "Location-based searches",
                      icon: MapPin
                    },
                    {
                      title: "Customer Care",
                      url: "https://www.hdfcbank.com/personal/need-help/customer-care",
                      description: "24/7 customer support",
                      icon: Phone
                    },
                    // Credit Card Services
                    {
                      title: "Credit Card NetBanking",
                      url: "https://www.hdfcbank.com/personal/ways-to-bank/online-banking/credit-card-netbanking",
                      description: "Manage your credit cards",
                      icon: CreditCard
                    },
                    {
                      title: "Block Credit Card",
                      url: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/block-loststolen-card",
                      description: "Block lost/stolen card",
                      icon: ShieldAlert
                    },
                    // Security & Complaints
                    {
                      title: "Report Fraud",
                      url: "https://www.hdfcbank.com/personal/need-help/contact-us/unauthorized-electronic-banking",
                      description: "Report unauthorized transactions",
                      icon: Shield
                    },
                    {
                      title: "File Complaint",
                      url: "https://leads.hdfcbank.com/applications/webforms/apply/complaint_form_new.asp",
                      description: "Submit a complaint",
                      icon: FileText
                    },
                    {
                      title: "Track Complaint",
                      url: "https://leads.hdfcbank.com/applications/misc/CST/cstracker.aspx",
                      description: "Check complaint status",
                      icon: TrendingUp
                    },
                    {
                      title: "Support Center",
                      url: "https://www.hdfcbank.com/personal/about-us/corporate-governance/banking-customer-helpdesk",
                      description: "Escalation support",
                      icon: Headphones
                    },
                    // Account Services
                    {
                      title: "Open Savings Account",
                      url: "https://www.hdfcbank.com/personal/save/accounts/savings-accounts",
                      description: "New account opening",
                      icon: Building2
                    },
                    {
                      title: "Apply Credit Card",
                      url: "https://applyonline.hdfcbank.com/cards/credit-cards.html",
                      description: "New credit card application",
                      icon: CreditCard
                    },
                    {
                      title: "Instant Loan",
                      url: "https://www.hdfcbank.com/personal/borrow/popular-loans",
                      description: "Quick loan applications",
                      icon: Zap
                    },
                    // Mobile Apps
                    {
                      title: "Mobile Banking",
                      url: "https://play.google.com/store/apps/details?id=com.snapwork.hdfc",
                      description: "All-in-one banking app",
                      icon: Smartphone
                    },
                    {
                      title: "PayZapp",
                      url: "https://play.google.com/store/apps/details?id=com.enstage.wibmo.hdfc",
                      description: "UPI, wallet, shopping",
                      icon: CreditCard
                    },
                    {
                      title: "MyCards",
                      url: "https://play.google.com/store/apps/details?id=com.hdfcbank.mycards",
                      description: "Credit card control",
                      icon: CreditCard
                    },
                    {
                      title: "Loan Assist",
                      url: "https://www.hdfcbank.com/personal/borrow/loans/loan-assist",
                      description: "Track/apply loans",
                      icon: Home
                    },
                  ].map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors mb-1">
                              {link.title}
                            </h4>
                            <p className="text-gray-500 text-xs leading-relaxed">
                              {link.description}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center">
                    All links open in new tabs • Secure and verified connections
                  </p>
                </div>
              </div>


            </div>
          </div>
        )}

        {/* Video Guide Tab */}
        {activeTab === "video" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Video Tutorials</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Watch step-by-step video guides to help you resolve issues and learn about our services.
                </p>
              </div>
              {/* Featured Video */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                      <PlayCircle className="h-12 w-12 text-gray-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      How to Contact {company.name} Customer Support
                    </h3>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <span>Duration: 5:32</span>
                      <span>•</span>
                      <span>1.2M views</span>
                      <span>•</span>
                      <span>98% helpful</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold">
                    <PlayCircle className="h-5 w-5" />
                    Watch Now
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <Download className="h-5 w-5" />
                    Download
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <Share2 className="h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>
              {/* Related Videos */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Related Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Check Account Balance", duration: "2:15", views: "500K" },
                    { title: "Recharge Your Account", duration: "3:45", views: "750K" },
                    { title: "Network Settings Guide", duration: "4:20", views: "300K" },
                    { title: "Complaint Resolution Process", duration: "6:10", views: "420K" },
                    { title: "Using Mobile App", duration: "5:30", views: "680K" },
                    { title: "Bill Payment Methods", duration: "3:55", views: "290K" },
                  ].map((video, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                        <PlayCircle className="h-8 w-8 text-gray-500 group-hover:text-gray-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.views} views</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Company Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Founded", value: company.founded, icon: Calendar },
                { label: "Rating", value: `${company.rating}/5`, icon: Star },
                { label: "Monthly Searches", value: company.monthlySearches, icon: TrendingUp },
                { label: "Total Reviews", value: company.totalReviews.toLocaleString(), icon: Users },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-lg"
                  >
                    <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
            {/* Services Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-600" />
                Services Offered
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {company.services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Contact Information Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Phone className="h-6 w-6 text-green-600" />
                  Primary Contact Numbers
                </h3>
                <div className="space-y-4">
                  {company.nationalNumbers.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">{contact.type}</div>
                        <div className="text-sm text-gray-600">{contact.available}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCall(contact.number)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          {contact.number}
                        </button>
                        <button
                          onClick={() => copyToClipboard(contact.number)}
                          className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                  Online Presence
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">Official Website</div>
                      <div className="text-sm text-gray-600">Complete services online</div>
                    </div>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                    >
                      Visit
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">Customer Rating</div>
                      <div className="text-sm text-gray-600">{company.totalReviews.toLocaleString()} reviews</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-bold text-gray-900">{company.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-500" />
                <span className="font-medium">Verified Information</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Updated Daily</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-orange-500" />
                <span className="font-medium">Trusted by Millions</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Last verified:{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;

// CollapsibleTable component (add above export default)
const CollapsibleTable = ({ title, icon, description, columns, rows, copyIndex }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-blue-700 font-semibold mb-2 focus:outline-none hover:underline"
        aria-expanded={open}
      >
        {icon}
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className="text-xs text-gray-500 mb-2 ml-7">{description}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-blue-100 mb-2">
                <thead className="bg-blue-50 text-blue-900 font-bold">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="py-2 px-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row[0]} className={idx % 2 === 0 ? "bg-blue-50/40" : "bg-white"}>
                      {row.map((cell, i) => (
                        <td key={i} className="py-2 px-3 text-gray-800">
                          {i === copyIndex ? (
                            <span className="flex items-center gap-1">
                              {cell}
                              <button onClick={() => navigator.clipboard.writeText(cell)} className="hover:text-blue-500" title="Copy">
                                <Copy className="w-4 h-4" />
                              </button>
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};