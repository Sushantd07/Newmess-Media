import React, { useState } from 'react';
import { 
  Phone, 
  Copy, 
  Check, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Building2,
  Globe,
  Smartphone,
  Users,
  Shield,
  AlertCircle,
  Star,
  Heart,
  ArrowRight,
  UserPlus,
  CreditCard,
  Wifi,
  ChevronUp,
  Edit3
} from 'lucide-react';

// NRI Support Card Component with inline editing
export const NRISupportCard = ({ 
  title = "NRI Support Services",
  backgroundColor = "#ffffff",
  textColor = "#1f2937",
  iconColor = "#3b82f6",
  onCopy,
  onCall,
  isEditing = false,
  onDataChange,
  phoneBankingData = [
    { country: "USA", number: "855-999-6061" },
    { country: "Canada", number: "855-999-6061" },
    { country: "Singapore", number: "800-101-2850" },
    { country: "Kenya", number: "0-800-721-740" },
    { country: "Other Countries", number: "91-2260006000" }
  ],
  accountOpeningData = [
    { country: "USA", number: "855-207-8106" },
    { country: "Canada", number: "855-846-3731" },
    { country: "UK", number: "800-756-2993" },
    { country: "Singapore", number: "800-101-2798" }
  ]
}) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    onCopy?.(text);
  };

  const handleCellEdit = (section, rowIndex, field, value) => {
    if (onDataChange) {
      onDataChange(section, rowIndex, field, value);
    }
  };

  const startEditing = (section, rowIndex, field, currentValue) => {
    setEditingCell(`${section}-${rowIndex}-${field}`);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingCell && onDataChange) {
      const [section, rowIndex, field] = editingCell.split('-');
      handleCellEdit(section, parseInt(rowIndex), field, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const renderEditableCell = (section, rowIndex, field, value) => {
    const cellKey = `${section}-${rowIndex}-${field}`;
    const isCurrentlyEditing = editingCell === cellKey;

    if (isCurrentlyEditing && isEditing) {
      return (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            className="text-xs border rounded px-1 py-0.5 w-full"
            autoFocus
          />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 group">
        <span className="text-xs text-gray-700">{value}</span>
        {isEditing && (
          <button
            onClick={() => startEditing(section, rowIndex, field, value)}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 transition-all"
            title="Edit"
          >
            <Edit3 className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]"
      style={{ backgroundColor }}
    >
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: iconColor + '20' }}
          >
            <Globe 
              className="w-5 h-5" 
              style={{ color: iconColor }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">
              {title}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            International Support Services
          </div>
        </div>
      </div>
      
      {/* NRI Phone Banking Support */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-gray-900">NRI Phone Banking Support</span>
        </div>
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
          <Clock className="h-3 w-3 text-green-500" />
          <span>Existing Account Holder Queries (24x7)</span>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Sr No.</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Country</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {phoneBankingData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-xs text-gray-600">{index + 1}</td>
                  <td className="px-3 py-2">
                    {renderEditableCell('phone', index, 'country', item.country)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {renderEditableCell('phone', index, 'number', item.number)}
                      <button
                        onClick={() => handleCopy(item.number, `phone-${index}`)}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Copy number"
                      >
                        {copiedIndex === `phone-${index}` ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NRI Account Opening Assistance */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <UserPlus className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-gray-900">NRI Account Opening Assistance (Toll Free)</span>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Sr No.</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Country</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {accountOpeningData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-xs text-gray-600">{index + 1}</td>
                  <td className="px-3 py-2">
                    {renderEditableCell('account', index, 'country', item.country)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {renderEditableCell('account', index, 'number', item.number)}
                      <button
                        onClick={() => handleCopy(item.number, `account-${index}`)}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Copy number"
                      >
                        {copiedIndex === `account-${index}` ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helpline Numbers Card Component
export const HelplineNumbersCard = ({ 
  title = "Helpline Numbers",
  backgroundColor = "#ffffff",
  textColor = "#1f2937",
  iconColor = "#3b82f6",
  onCopy,
  onCall
}) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    onCopy?.(text);
  };

  const services = [
    { service: "Account Balance", number: "1800 270 3333", available: "24x7 Available" },
    { service: "Fraud/Transaction Blocking", number: "1800 258 6161", available: "24x7 Available" },
    { service: "Mini Statement", number: "1800 270 3355", available: "24x7 Available" },
    { service: "Credit Card Support", number: "1800 266 4332", available: "24x7 Available" },
    { service: "Phone Banking", number: "1800 2600", available: "24x7 Available" },
    { service: "WhatsApp Banking", number: "70700 22222", available: "24x7 Available" }
  ];

  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]"
      style={{ backgroundColor }}
    >
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: iconColor + '20' }}
          >
            <Phone 
              className="w-5 h-5" 
              style={{ color: iconColor }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">
              {title}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Quick access to all support numbers
          </div>
        </div>
      </div>
      
      {/* Services Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Service</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Number</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2">
                  <div className="text-xs text-gray-700">{item.service}</div>
                  <div className="text-xs text-green-600">{item.available}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold text-xs">{item.number}</span>
                    <button
                      onClick={() => handleCopy(item.number, index)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      title="Copy number"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// All India Numbers Card Component
export const AllIndiaNumbersCard = ({ 
  title = "All India Numbers",
  backgroundColor = "#ffffff",
  textColor = "#1f2937",
  iconColor = "#10b981",
  onCopy,
  onCall
}) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    onCopy?.(text);
  };

  const numbers = [
    { number: "1860 266 0333", description: "Generate New Credit Card PIN" },
    { number: "72900 30000", description: "Report Fraud via WhatsApp" },
    { number: "1800 258 6161", description: "Customer Care (24x7)" },
    { number: "1800 266 4332", description: "Credit Card Support (24x7)" },
    { number: "1800 2600", description: "Phone Banking (24x7)" },
    { number: "1800 1600", description: "Alternate Phone Banking (24x7)" },
    { number: "1800 266 3310", description: "Account/Loan Assistance (10 AM-5 PM)" },
    { number: "70700 22222", description: "WhatsApp Banking (24x7)" }
  ];

  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]"
      style={{ backgroundColor }}
    >
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: iconColor + '20' }}
          >
            <Globe 
              className="w-5 h-5" 
              style={{ color: iconColor }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">
              {title}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Pan India support numbers
          </div>
        </div>
      </div>
      
      {/* Numbers Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Number</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
            </tr>
          </thead>
          <tbody>
            {numbers.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold text-xs">{item.number}</span>
                    <button
                      onClick={() => handleCopy(item.number, index)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      title="Copy number"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SMS & WhatsApp Services Card Component
export const SMSWhatsAppServicesCard = ({ 
  title = "SMS & WhatsApp Services",
  backgroundColor = "#ffffff",
  textColor = "#1f2937",
  iconColor = "#ef4444",
  onCopy
}) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [copiedNumber, setCopiedNumber] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    onCopy?.(code);
  };

  const handleCopyNumber = (number) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
    onCopy?.(number);
  };

  const services = [
    { description: "Check account balance", code: "BAL", number: "5676712", color: "blue" },
    { description: "Get mini statement", code: "MINI", number: "5676712", color: "green" },
    { description: "Request cheque book", code: "CHQBOOK", number: "5676712", color: "orange" },
    { description: "Stop cheque payment", code: "STOP", number: "5676712", color: "red" },
    { description: "Block debit card", code: "BLOCK", number: "5676712", color: "orange" },
    { description: "Generate ATM PIN", code: "PIN", number: "5676712", color: "blue" }
  ];

  const colorSchemes = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]"
      style={{ backgroundColor }}
    >
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: iconColor + '20' }}
          >
            <MessageSquare 
              className="w-5 h-5" 
              style={{ color: iconColor }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">
              {title}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Quick SMS commands for instant service
          </div>
        </div>
        <button className="text-blue-600 text-xs flex items-center gap-1 hover:text-blue-700">
          View All SMS/WhatsApp Codes
          <ChevronUp className="w-3 h-3" />
        </button>
      </div>
      
      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-3">
        {services.map((service, index) => {
          const color = colorSchemes[service.color] || colorSchemes.blue;
          return (
            <div key={index} className={`${color.bg} border-l-4 ${color.border} rounded-lg p-3`}>
              <div className={`font-semibold ${color.text} text-sm mb-2`}>{service.description}</div>
              <div className="text-xs text-gray-600 mb-2">Send the following SMS:</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`bg-white px-2 py-1 rounded border ${color.border} ${color.text} text-xs font-mono`}>
                  {service.code}
                </span>
                <button
                  onClick={() => handleCopyCode(service.code)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Copy SMS code"
                >
                  {copiedCode === service.code ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-600">
                To: <span className={`${color.text} font-mono`}>{service.number}</span>
                <button
                  onClick={() => handleCopyNumber(service.number)}
                  className="ml-1 p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Copy number"
                >
                  {copiedNumber === service.number ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export all components
export const CardComponents = {
  NRISupportCard,
  HelplineNumbersCard,
  AllIndiaNumbersCard,
  SMSWhatsAppServicesCard
};
