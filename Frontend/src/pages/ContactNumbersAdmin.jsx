import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Globe, 
  MessageSquare, 
  Headphones, 
  Mail, 
  UserPlus, 
  PhoneCall,
  Plus,
  Trash2,
  Save,
  Eye,
  Copy,
  Check
} from 'lucide-react';
import FormEditor from '../components/admin/FormEditor.jsx';
import LivePreview from '../components/admin/LivePreview.jsx';

const ContactNumbersAdmin = () => {
  const [activeTab, setActiveTab] = useState('helpline');
  const [companySlug, setCompanySlug] = useState('');
  const [companies, setCompanies] = useState([]);
  const [companyQuery, setCompanyQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [data, setData] = useState({
    helpline: [
      { service: "Account Balance", number: "1800 270 3333", available: "24x7 Available" },
      { service: "Fraud/Transaction Blocking", number: "1800 258 6161", available: "24x7 Available" },
      { service: "Mini Statement", number: "1800 270 3355", available: "24x7 Available" },
      { service: "Credit Card Support", number: "1800 266 4332", available: "24x7 Available" },
      { service: "Phone Banking", number: "1800 2600", available: "24x7 Available" },
      { service: "WhatsApp Banking", number: "70700 22222", available: "24x7 Available" }
    ],
    allIndia: [
      { number: "1860 266 0333", description: "Generate New Credit Card PIN", availability: "24x7" },
      { number: "72900 30000", description: "Report Fraud via WhatsApp", availability: "24x7" },
      { number: "1800 258 6161", description: "Customer Care", availability: "24x7" },
      { number: "1800 266 4332", description: "Credit Card Support", availability: "24x7" },
      { number: "1800 2600", description: "Phone Banking", availability: "24x7" },
      { number: "1800 1600", description: "Alternate Phone Banking", availability: "24x7" },
      { number: "1800 266 3310", description: "Account/Loan Assistance", availability: "10 AM-5 PM" },
      { number: "70700 22222", description: "WhatsApp Banking", availability: "24x7" }
    ],
    smsServices: [
      { command: "BAL", number: "5676712", description: "Check account balance" },
      { command: "MINI", number: "5676712", description: "Get mini statement" },
      { command: "CHQBOOK", number: "5676712", description: "Request cheque book" },
      { command: "STOP", number: "5676712", description: "Stop cheque payment" },
      { command: "BLOCK", number: "5676712", description: "Block debit card" },
      { command: "PIN", number: "5676712", description: "Generate ATM PIN" }
    ],
    ivrsMenu: [
      {
        option: "1",
        title: "Balance Enquiry",
        description: "Check your account balance",
        subOptions: [
          { option: "1", title: "Savings Account", action: "Check savings balance" },
          { option: "2", title: "Current Account", action: "Check current balance" },
          { option: "3", title: "Credit Card", action: "Check credit card balance" }
        ]
      },
      {
        option: "2", 
        title: "Mini Statement",
        description: "Get last 5 transactions",
        subOptions: []
      },
      {
        option: "3",
        title: "Card Services", 
        description: "Manage your cards",
        subOptions: [
          { option: "1", title: "Block Card", action: "Block your card temporarily" },
          { option: "2", title: "Unblock Card", action: "Unblock your card" },
          { option: "3", title: "Change PIN", action: "Change your card PIN" }
        ]
      }
    ],
    emailSupport: [
      { service: "General Inquiries", email: "customercare@bank.com", response: "Within 24 hours" },
      { service: "Technical Support", email: "techsupport@bank.com", response: "Within 4 hours" },
      { service: "Complaints", email: "complaints@bank.com", response: "Within 48 hours" },
      { service: "NRI Services", email: "nri@bank.com", response: "Within 24 hours" },
      { service: "Business Banking", email: "business@bank.com", response: "Within 12 hours" }
    ],
    nriPhoneBanking: [
      { country: "USA", number: "855-999-6061", service: "Existing Account Holder Queries" },
      { country: "Canada", number: "855-999-6061", service: "Existing Account Holder Queries" },
      { country: "Singapore", number: "800-101-2850", service: "Existing Account Holder Queries" },
      { country: "Kenya", number: "0-800-721-740", service: "Existing Account Holder Queries" },
      { country: "Other Countries", number: "91-2260006000", service: "Existing Account Holder Queries" }
    ],
    missedCallService: [
      { service: "Account Balance", number: "1800 270 3333", description: "Give a missed call to get balance" },
      { service: "Mini Statement", number: "1800 270 3355", description: "Give a missed call to get statement" },
      { service: "Cheque Book Request", number: "1800 270 3366", description: "Give a missed call to request cheque book" }
    ]
  });

  const tabs = [
    { id: 'helpline', label: 'Helpline Numbers', icon: Phone },
    { id: 'allIndia', label: 'All India Numbers', icon: Globe },
    { id: 'smsServices', label: 'SMS & WhatsApp Services', icon: MessageSquare },
    { id: 'ivrsMenu', label: 'IVRS Menu', icon: Headphones },
    { id: 'emailSupport', label: 'Email Support', icon: Mail },
    { id: 'nriPhoneBanking', label: 'NRI Phone Banking', icon: UserPlus },
    { id: 'missedCallService', label: 'Missed Call Service', icon: PhoneCall }
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const addRow = (section) => {
    const newRow = getDefaultRow(section);
    setData(prev => ({
      ...prev,
      [section]: [...prev[section], newRow]
    }));
  };

  const removeRow = (section, index) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const updateRow = (section, index, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map((row, i) => 
        i === index ? { ...row, [field]: value } : row
      )
    }));
  };

  const getDefaultRow = (section) => {
    switch(section) {
      case 'helpline':
        return { service: "", number: "", available: "24x7 Available" };
      case 'allIndia':
        return { number: "", description: "", availability: "24x7" };
      case 'smsServices':
        return { command: "", number: "5676712", description: "" };
      case 'ivrsMenu':
        return { option: "", title: "", description: "", subOptions: [] };
      case 'emailSupport':
        return { service: "", email: "", response: "Within 24 hours" };
      case 'nriPhoneBanking':
        return { country: "", number: "", service: "Existing Account Holder Queries" };
      case 'missedCallService':
        return { service: "", number: "", description: "" };
      default:
        return {};
    }
  };

  // Load existing data on component mount
  useEffect(() => {
    // Load companies for dropdown
    const loadCompanies = async () => {
      try {
        const merged = [];
        const pushUnique = (arr) => {
          for (const c of arr) {
            const slug = c.slug || c._id;
            const name = c.name || c.companyName || slug;
            if (!slug) continue;
            if (!merged.find(x => x.slug === slug)) merged.push({ slug, name });
          }
        };

        // 1) Try lightweight endpoint
        try {
          const resLite = await fetch('/api/company-pages/all-lite');
          if (resLite.ok) {
            const jsonLite = await resLite.json();
            pushUnique(Array.isArray(jsonLite?.data) ? jsonLite.data : []);
          }
        } catch (_) {}

        // 2) Try category-specific endpoint for banking-services
        try {
          const resCat = await fetch('/api/company-pages/category/banking-services');
          if (resCat.ok) {
            const jsonCat = await resCat.json();
            pushUnique(Array.isArray(jsonCat?.data) ? jsonCat.data : []);
          }
        } catch (_) {}

        // 3) Fallback: paginate through main listing
        try {
          let page = 1; const limit = 100; let totalPages = 1;
          do {
            const res = await fetch(`/api/company-pages?page=${page}&limit=${limit}`);
            if (!res.ok) break;
            const json = await res.json();
            pushUnique(Array.isArray(json?.data) ? json.data : []);
            totalPages = Number(json?.totalPages) || 1;
            page += 1;
          } while (page <= totalPages && page < 200);
        } catch (_) {}

        merged.sort((a,b) => a.name.localeCompare(b.name));
        setCompanies(merged);
        if (!companySlug && merged.length) setCompanySlug(merged[0].slug);
      } catch (e) {
        console.error('Failed to load companies', e);
      }
    };
    loadCompanies();

    const loadContactNumbers = async () => {
      try {
        const qs = companySlug ? `?companySlug=${encodeURIComponent(companySlug)}` : '';
        const response = await fetch(`/api/contact-numbers${qs}`);
        if (response.ok) {
          const existingData = await response.json();
          if (existingData && Object.keys(existingData).length > 0) {
            setData(existingData);
          }
        }
      } catch (error) {
        console.error('Error loading contact numbers:', error);
      }
    };

    loadContactNumbers();
  }, [companySlug]);

  // Search companies by name/slug and merge into dropdown
  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      try {
        const q = companyQuery?.trim();
        if (!q || q.length < 2) return; // wait for 2+ chars
        const res = await fetch(`/api/company-pages/search?q=${encodeURIComponent(q)}&limit=50`, { signal: ctrl.signal });
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        const merged = [...companies];
        for (const c of list) {
          const slug = c.slug || c._id;
          const name = c.name || c.companyName || slug;
          if (slug && !merged.find(x => x.slug === slug)) merged.push({ slug, name });
        }
        merged.sort((a,b)=> a.name.localeCompare(b.name));
        setCompanies(merged);
      } catch (_) {}
    };
    const t = setTimeout(run, 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [companyQuery]);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/contact-numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companySlug, ...data })
      });
      
      if (response.ok) {
        alert('Contact numbers saved successfully!');
      } else {
        alert('Error saving contact numbers');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving contact numbers');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Numbers Admin Panel</h1>
              <p className="text-gray-600 mt-1">Manage all contact numbers and support services</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Company:</label>
                <select
                  value={companySlug}
                  onChange={(e) => setCompanySlug(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {companies.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={companyQuery}
                  onChange={(e)=> setCompanyQuery(e.target.value)}
                  placeholder="Search companies..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  style={{width:'220px'}}
                />
              </div>
              <button
                onClick={async () => {
                  if (!companySlug) return alert('Select a company first');
                  if (!confirm('This will clear ALL tabs (helpline, all india, sms, ivrs, email, nri, missed call) for this company. Continue?')) return;
                  try {
                    const sections = ['helpline','allIndia','smsServices','ivrsMenu','emailSupport','nriPhoneBanking','missedCallService'];
                    for (const section of sections) {
                      await fetch(`/api/contact-numbers/${encodeURIComponent(companySlug)}/section/${encodeURIComponent(section)}`, { method: 'DELETE' });
                    }
                    setData(prev => ({
                      ...prev,
                      helpline: [],
                      allIndia: [],
                      smsServices: [],
                      ivrsMenu: [],
                      emailSupport: [],
                      nriPhoneBanking: [],
                      missedCallService: []
                    }));
                    alert('All contact numbers cleared for this company');
                  } catch (e) {
                    alert('Failed to clear company contact numbers');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                Clear Company Contact Numbers
              </button>
              <button
                onClick={() => window.open('/contact-numbers', '_blank')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Live Page
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Form Editor */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <FormEditor 
                section={activeTab} 
                data={data[activeTab]} 
                onAddRow={() => addRow(activeTab)}
                onRemoveRow={(index) => removeRow(activeTab, index)}
                onUpdateRow={(index, field, value) => updateRow(activeTab, index, field, value)}
              />
              <div className="mt-6 flex justify-between">
                <button
                  onClick={async () => {
                    if (!companySlug) return alert('Select a company first');
                    if (!confirm('Clear this entire section for selected company?')) return;
                    const res = await fetch(`/api/contact-numbers/${encodeURIComponent(companySlug)}/section/${encodeURIComponent(activeTab)}`, { method: 'DELETE' });
                    if (res.ok) {
                      setData(prev => ({ ...prev, [activeTab]: [] }));
                      alert('Section cleared');
                    } else {
                      alert('Failed to clear section');
                    }
                  }}
                  className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Clear This Section
                </button>
                <div />
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              <p className="text-sm text-gray-600">See how your changes will appear on the live page</p>
            </div>
            <div className="p-6">
              <LivePreview section={activeTab} data={data[activeTab]} onCopy={handleCopy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactNumbersAdmin;
