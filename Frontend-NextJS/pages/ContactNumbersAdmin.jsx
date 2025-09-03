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
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  // Main category slug to fetch companies for (change if needed)
  const mainCategorySlug = 'banking-services';
  // Hardcoded company override (ensures it shows in dropdown)
  const forcedCompany = { slug: 'jp-morgan', name: 'JP Morgan' };
  // JSON preview helpers
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonPreview, setJsonPreview] = useState(null);
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

  // CRUD table and modal state
  const [showRowModal, setShowRowModal] = useState(false);
  const [modalRow, setModalRow] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [importError, setImportError] = useState('');

  const getColumns = (section) => {
    switch (section) {
      case 'helpline':
        return [
          { key: 'service', label: 'Service' },
          { key: 'number', label: 'Number' },
          { key: 'available', label: 'Availability' }
        ];
      case 'allIndia':
        return [
          { key: 'number', label: 'Number' },
          { key: 'description', label: 'Description' },
          { key: 'availability', label: 'Availability' }
        ];
      case 'smsServices':
        return [
          { key: 'command', label: 'Command/Code' },
          { key: 'number', label: 'To Number' },
          { key: 'description', label: 'Description' }
        ];
      case 'ivrsMenu':
        return [
          { key: 'option', label: 'Option' },
          { key: 'title', label: 'Title' },
        ];
      case 'emailSupport':
        return [
          { key: 'service', label: 'Service' },
          { key: 'email', label: 'Email' },
          { key: 'response', label: 'Response' }
        ];
      case 'nriPhoneBanking':
        return [
          { key: 'country', label: 'Country' },
          { key: 'number', label: 'Contact Number' }
        ];
      case 'missedCallService':
        return [
          { key: 'service', label: 'Service' },
          { key: 'number', label: 'Contact Number' },
          { key: 'description', label: 'Description' }
        ];
      default:
        return [];
    }
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setModalRow(getDefaultRow(activeTab));
    setShowRowModal(true);
  };

  const openEditModal = (index) => {
    setEditingIndex(index);
    setModalRow({ ...(data[activeTab][index] || {}) });
    setShowRowModal(true);
  };

  const saveRowModal = () => {
    if (editingIndex === null) {
      setData((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], modalRow] }));
    } else {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((r, i) => (i === editingIndex ? modalRow : r))
      }));
    }
    setShowRowModal(false);
    setModalRow({});
    setEditingIndex(null);
  };

  const exportCurrentAsJSON = () => {
    const blob = new Blob([JSON.stringify(data[activeTab] || [], null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toCSV = (rows, columns) => {
    const header = columns.map(c => c.label).join(',');
    const body = (rows || []).map(r => columns.map(c => JSON.stringify(r[c.key] ?? '')).join(',')).join('\n');
    return header + '\n' + body;
  };

  const exportCurrentAsCSV = () => {
    const cols = getColumns(activeTab);
    const csv = toCSV(data[activeTab] || [], cols);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromFile = async (file) => {
    try {
      setImportError('');
      const text = await file.text();
      if (file.type.includes('json') || file.name.endsWith('.json')) {
        const rows = JSON.parse(text);
        if (!Array.isArray(rows)) throw new Error('JSON must be an array');
        setData(prev => ({ ...prev, [activeTab]: rows }));
        return;
      }
      // CSV fallback
      const cols = getColumns(activeTab);
      const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
      const headers = headerLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const map = headers.map(h => (cols.find(c => c.label.toLowerCase() === h.toLowerCase())?.key || cols.find(c => c.key.toLowerCase() === h.toLowerCase())?.key));
      const rows = lines.map(line => {
        const values = line.match(/\"([^\"]*)\"|[^,]+/g)?.map(v => v.replace(/^\"|\"$/g, '')) || [];
        const obj = {};
        map.forEach((key, i) => { if (key) obj[key] = values[i] ?? ''; });
        return obj;
      });
      setData(prev => ({ ...prev, [activeTab]: rows }));
    } catch (e) {
      setImportError('Import failed: ' + (e?.message || 'Unknown error'));
    }
  };

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
        setLoadingCompanies(true);
        // First try: fetch by main category slug (unpaginated)
        let list = [];
        try {
          const resCat = await fetch(`/api/company-pages/category/${encodeURIComponent(mainCategorySlug)}/all`);
          if (resCat.ok) {
            const jsonCat = await resCat.json();
            list = Array.isArray(jsonCat?.data) ? jsonCat.data : [];
          }
        } catch (_) {}

        // Fallback: all-lite if category returned empty
        if (!list.length) {
          // Use proper API base URL like other services
          const API_BASE_URL = 
            ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
            (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
            '/api');
          
          const resLite = await fetch(`${API_BASE_URL}/company-pages/all-lite`);
          if (!resLite.ok) throw new Error('Failed to fetch companies');
          const jsonLite = await resLite.json();
          list = Array.isArray(jsonLite?.data) ? jsonLite.data : [];
        }
        let mapped = list
          .map(c => ({ slug: c.slug || c._id, name: c.name || c.companyName || c.slug || c._id }))
          .filter(c => !!c.slug);
        // Inject JP Morgan if missing
        if (!mapped.find(x => x.slug === forcedCompany.slug)) {
          mapped.push(forcedCompany);
        }
        mapped.sort((a,b)=> a.name.localeCompare(b.name));
        setCompanies(mapped);
        // Default to JP Morgan if nothing selected
        if (!companySlug) {
          setCompanySlug(forcedCompany.slug);
        }
      } catch (e) {
        console.error('Failed to load companies', e);
      } finally {
        setLoadingCompanies(false);
      }
    };
    loadCompanies();

    const loadContactNumbers = async () => {
      try {
        // Use proper API base URL like other services
        const API_BASE_URL = 
          ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
          (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
          '/api');
        
        const qs = companySlug ? `?companySlug=${encodeURIComponent(companySlug)}` : '';
        const response = await fetch(`${API_BASE_URL}/contact-numbers${qs}`);
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
      // Use proper API base URL like other services
      const API_BASE_URL = 
        ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
        (typeof window !== 'undefined' && (window.__API_BASE_URL__ || `${window.location.origin}/api`)) ||
        '/api');
      
      const response = await fetch(`${API_BASE_URL}/contact-numbers`, {
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
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Company:</label>
                <select
                  value={companySlug}
                  onChange={(e) => setCompanySlug(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {!companies.length && (
                    <option value="" disabled>{loadingCompanies ? 'Loading companies...' : 'No companies found'}</option>
                  )}
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
                <button
                  onClick={() => {
                    setCompanies([]);
                    setCompanySlug('');
                    // re-run loader
                    (async () => {
                      try { await new Promise(r => setTimeout(r, 50)); } catch(_) {}
                    })();
                  }}
                  title="Clear selection"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    // manual refresh
                    (async () => {
                      try {
                        setCompanies([]);
                        await new Promise(r => setTimeout(r, 0));
                        // trigger loader by calling internal function via effect pattern
                        // simply call window.fetchers if attached; else reload
                        window.location.reload();
                      } catch(_) {}
                    })();
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                  title="Reload companies"
                >
                  Refresh
                </button>
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
                onClick={() => setJsonOpen(v => !v)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${jsonOpen ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                title="Paste JSON and preview on the right"
              >
                {jsonOpen ? 'Hide JSON Preview' : 'JSON Preview'}
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
            {jsonOpen && (
              <div className="border-b border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Paste JSON for Preview (no save)</h3>
                  {jsonError && <span className="text-xs text-red-600">{jsonError}</span>}
                </div>
                <textarea
                  value={jsonText}
                  onChange={(e)=> setJsonText(e.target.value)}
                  rows={8}
                  placeholder='{"helpline":[{"type":"Account Balance","number":"1800..."}]}'
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(jsonText || '{}');
                        setJsonPreview(parsed);
                        setJsonError('');
                      } catch (e) {
                        setJsonError('Invalid JSON');
                      }
                    }}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Preview JSON
                  </button>
                  <button
                    onClick={() => { setJsonText(''); setJsonError(''); setJsonPreview(null); }}
                    className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tip: Provide either full payload (keys like helpline, smsServices, ivrMenu...) or only the current tab data.</p>
              </div>
            )}
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
              {(() => {
                let previewData = data[activeTab];
                if (jsonPreview !== null) {
                  if (jsonPreview && typeof jsonPreview === 'object' && !Array.isArray(jsonPreview)) {
                    previewData = jsonPreview[activeTab] !== undefined ? jsonPreview[activeTab] : jsonPreview;
                  } else {
                    previewData = jsonPreview;
                  }
                }
                return <LivePreview section={activeTab} data={previewData} onCopy={handleCopy} />;
              })()}

              {/* CRUD Table */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">{tabs.find(t=>t.id===activeTab)?.label} Data</h4>
                  <div className="flex items-center gap-2">
                    <button onClick={openAddModal} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Add New Entry</button>
                    <button onClick={exportCurrentAsJSON} className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50">Export JSON</button>
                    <button onClick={exportCurrentAsCSV} className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50">Export CSV</button>
                    <label className="px-3 py-1.5 text-xs border rounded cursor-pointer hover:bg-gray-50">
                      Import
                      <input type="file" accept=".json,.csv" className="hidden" onChange={(e)=> e.target.files?.[0] && importFromFile(e.target.files[0])} />
                    </label>
                  </div>
                </div>
                {importError && <div className="mb-2 text-xs text-red-600">{importError}</div>}
                <div className="border rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {getColumns(activeTab).map(col => (
                          <th key={col.key} className="px-3 py-2 text-left text-xs font-medium text-gray-700">{col.label}</th>
                        ))}
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data[activeTab] || []).map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {getColumns(activeTab).map(col => (
                            <td key={col.key} className="px-3 py-2 text-xs text-gray-700">{row[col.key]}</td>
                          ))}
                          <td className="px-3 py-2 text-right">
                            <button onClick={() => openEditModal(idx)} className="text-blue-600 text-xs mr-2 hover:underline">Edit</button>
                            <button onClick={() => removeRow(activeTab, idx)} className="text-red-600 text-xs hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                      {!(data[activeTab] || []).length && (
                        <tr>
                          <td className="px-3 py-6 text-center text-xs text-gray-500" colSpan={getColumns(activeTab).length + 1}>No data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row Modal */}
      {showRowModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h4 className="text-lg font-semibold mb-4">{editingIndex === null ? 'Add New' : 'Edit'} Entry</h4>
            <div className="grid grid-cols-1 gap-3">
              {getColumns(activeTab).map(col => (
                <div key={col.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{col.label}</label>
                  <input
                    type="text"
                    value={modalRow[col.key] ?? ''}
                    onChange={(e)=> setModalRow({ ...modalRow, [col.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={()=>{ setShowRowModal(false); setEditingIndex(null); }} className="px-4 py-2 text-sm border rounded">Cancel</button>
              <button onClick={saveRowModal} className="px-4 py-2 text-sm bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactNumbersAdmin;
