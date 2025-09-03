import React from 'react';
import { 
  Phone, 
  Globe, 
  MessageSquare, 
  Headphones, 
  Mail, 
  UserPlus, 
  PhoneCall,
  Copy,
  Check,
  Clock,
  ChevronUp
} from 'lucide-react';

const LivePreview = ({ section, data, onCopy }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    onCopy?.(text, index);
  };

  const renderHelplinePreview = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]">
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">Helpline Numbers</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Quick access to all support numbers</div>
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
            {(Array.isArray(data)
              ? data
              : (data?.table?.rows
                  ? data.table.rows.map((row) => ({ service: row[0], number: row[1], available: row[2] }))
                  : (data?.rows
                      ? data.rows.map((row) => ({ service: row[0], number: row[1], available: row[2] }))
                      : (data?.items || [])))
            ).map((item, index) => (
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

  const renderAllIndiaPreview = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]">
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">All India Numbers</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Pan India support numbers</div>
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
            {(Array.isArray(data)
              ? data
              : (data?.table?.rows
                  ? data.table.rows.map((row) => ({ number: row[0], description: row[1] }))
                  : (data?.rows
                      ? data.rows.map((row) => ({ number: row[0], description: row[1] }))
                      : (data?.items || [])))
            ).map((item, index) => (
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

  const renderSMSServicesPreview = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]">
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50">
            <MessageSquare className="w-5 h-5 text-red-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">SMS & WhatsApp Services</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Quick SMS commands for instant service</div>
        </div>
        <button className="text-blue-600 text-xs flex items-center gap-1 hover:text-blue-700">
          View All SMS/WhatsApp Codes
          <ChevronUp className="w-3 h-3" />
        </button>
      </div>
      
      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-3">
        {(Array.isArray(data) ? data : (data?.services || [])).map((service, index) => {
          const colorSchemes = {
            blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
            green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
            orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
            red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" }
          };
          const color = colorSchemes.blue;
          
          return (
            <div key={index} className={`${color.bg} border-l-4 ${color.border} rounded-lg p-3`}>
              <div className={`font-semibold ${color.text} text-sm mb-2`}>{service.description}</div>
              <div className="text-xs text-gray-600 mb-2">Send the following SMS:</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`bg-white px-2 py-1 rounded border ${color.border} ${color.text} text-xs font-mono`}>
                  {service.command || service.code}
                </span>
                <button
                  onClick={() => handleCopy(service.command || service.code, `cmd-${index}`)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Copy SMS code"
                >
                  {copiedIndex === `cmd-${index}` ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-600">
                To: <span className={`${color.text} font-mono`}>{service.number}</span>
                <button
                  onClick={() => handleCopy(service.number, `num-${index}`)}
                  className="ml-1 p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Copy number"
                >
                  {copiedIndex === `num-${index}` ? (
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

  const renderIVRSMenuPreview = () => {
    const menus = Array.isArray(data)
      ? [{ title: data.title, options: data }]
      : (data?.menus && Array.isArray(data.menus))
        ? data.menus
        : (data?.options && Array.isArray(data.options))
          ? [{ title: data.title, options: data.options }]
          : [];

    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]">
        {/* Top: Logo, Name, Tag */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50">
              <Headphones className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 text-lg truncate">IVRS Menu</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Interactive Voice Response System</div>
          </div>
        </div>

        {/* IVRS Menus */}
        <div className="space-y-4">
          {menus.map((menu, menuIndex) => (
            <div key={menuIndex} className="border border-gray-200 rounded-lg p-4">
              {menu.title && (
                <h4 className="font-semibold text-gray-900 text-sm mb-2">{menu.title}</h4>
              )}
              {(menu.options || []).map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{item.option}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-sm">{item.title || item.description}</h5>
                      {item.description && <p className="text-xs text-gray-600">{item.description}</p>}
                    </div>
                  </div>
                  {item.subOptions && item.subOptions.length > 0 && (
                    <div className="ml-11 space-y-2">
                      {item.subOptions.map((subOption, subIndex) => (
                        <div key={subIndex} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">Press {subOption.option}:</span>
                          <span className="font-medium text-gray-700">{subOption.title || subOption.description}</span>
                          {subOption.action && <span className="text-gray-500">- {subOption.action}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEmailSupportPreview = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]">
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50">
            <Mail className="w-5 h-5 text-orange-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">Email Support</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Get help via email</div>
        </div>
      </div>
      
      {/* Email Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Service</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Email</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Response Time</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(data)
              ? data
              : (data?.table?.rows
                  ? data.table.rows.map((row) => ({ service: row[0], email: row[1], response: row[2] }))
                  : (data?.rows
                      ? data.rows.map((row) => ({ service: row[0], email: row[1], response: row[2] }))
                      : (data?.items || [])))
            ).map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 text-xs text-gray-700">{item.service}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600 font-medium text-xs">{item.email}</span>
                    <button
                      onClick={() => handleCopy(item.email, index)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                      title="Copy email"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2 text-xs text-gray-600">{item.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNRIPhoneBankingPreview = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]">
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50">
            <UserPlus className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">NRI Phone Banking</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">International support services</div>
        </div>
      </div>
      
      {/* NRI Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Country</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(data)
              ? data
              : (data?.table?.rows
                  ? data.table.rows.map((row) => ({ country: row[0], number: row[1] }))
                  : (data?.rows
                      ? data.rows.map((row) => ({ country: row[0], number: row[1] }))
                      : (data?.items || [])))
            ).map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 text-xs text-gray-700">{item.country}</td>
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

  const renderMissedCallServicePreview = () => (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col group hover:-translate-y-1 hover:scale-[1.02]">
      {/* Top: Logo, Name, Tag */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50">
            <PhoneCall className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900 text-lg truncate">Missed Call Service</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Give a missed call for instant service</div>
        </div>
      </div>
      
      {/* Missed Call Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Service</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(data)
              ? data
              : (data?.table?.rows
                  ? data.table.rows.map((row) => ({ service: row[0], number: row[1], description: row[2] }))
                  : (data?.rows
                      ? data.rows.map((row) => ({ service: row[0], number: row[1], description: row[2] }))
                      : (data?.items || [])))
            ).map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2">
                  <div className="text-xs text-gray-700">{item.service}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (section) {
      case 'helpline':
        return renderHelplinePreview();
      case 'allIndia':
        return renderAllIndiaPreview();
      case 'smsServices':
        return renderSMSServicesPreview();
      case 'ivrsMenu':
        return renderIVRSMenuPreview();
      case 'emailSupport':
        return renderEmailSupportPreview();
      case 'nriPhoneBanking':
        return renderNRIPhoneBankingPreview();
      case 'missedCallService':
        return renderMissedCallServicePreview();
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Select a tab to see the preview</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderPreview()}
    </div>
  );
};

export default LivePreview;


