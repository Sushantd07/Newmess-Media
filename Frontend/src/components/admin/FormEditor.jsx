import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const FormEditor = ({ section, data, onAddRow, onRemoveRow, onUpdateRow }) => {
  const [expandedRows, setExpandedRows] = React.useState(new Set());

  const toggleRow = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const renderHelplineForm = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Helpline Numbers</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  value={row.service}
                  onChange={(e) => onUpdateRow(index, 'service', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Account Balance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                <input
                  type="text"
                  value={row.number}
                  onChange={(e) => onUpdateRow(index, 'number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1800 270 3333"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <input
                  type="text"
                  value={row.available}
                  onChange={(e) => onUpdateRow(index, 'available', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 24x7 Available"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => onRemoveRow(index)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAllIndiaForm = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">All India Numbers</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                <input
                  type="text"
                  value={row.number}
                  onChange={(e) => onUpdateRow(index, 'number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1860 266 0333"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => onUpdateRow(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Generate New Credit Card PIN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <input
                  type="text"
                  value={row.availability}
                  onChange={(e) => onUpdateRow(index, 'availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 24x7"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => onRemoveRow(index)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSMSServicesForm = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">SMS & WhatsApp Services</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Command</label>
                <input
                  type="text"
                  value={row.command}
                  onChange={(e) => onUpdateRow(index, 'command', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BAL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Number</label>
                <input
                  type="text"
                  value={row.number}
                  onChange={(e) => onUpdateRow(index, 'number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5676712"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => onUpdateRow(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Check account balance"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => onRemoveRow(index)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIVRSMenuForm = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">IVRS Menu</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Option
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => toggleRow(index)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expandedRows.has(index) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              <span className="font-medium">Option {row.option}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Option Number</label>
                <input
                  type="text"
                  value={row.option}
                  onChange={(e) => onUpdateRow(index, 'option', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={row.title}
                  onChange={(e) => onUpdateRow(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Balance Enquiry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => onUpdateRow(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Check your account balance"
                />
              </div>
            </div>

            {expandedRows.has(index) && (
              <div className="ml-6 border-l-2 border-gray-200 pl-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Sub-options</h4>
                  <button
                    onClick={() => {
                      const newSubOptions = [...(row.subOptions || []), { option: "", title: "", action: "" }];
                      onUpdateRow(index, 'subOptions', newSubOptions);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                  >
                    <Plus className="w-3 h-3" />
                    Add Sub-option
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(row.subOptions || []).map((subOption, subIndex) => (
                    <div key={subIndex} className="border border-gray-200 rounded p-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Sub-option</label>
                          <input
                            type="text"
                            value={subOption.option}
                            onChange={(e) => {
                              const newSubOptions = [...(row.subOptions || [])];
                              newSubOptions[subIndex].option = e.target.value;
                              onUpdateRow(index, 'subOptions', newSubOptions);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., 1"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                          <input
                            type="text"
                            value={subOption.title}
                            onChange={(e) => {
                              const newSubOptions = [...(row.subOptions || [])];
                              newSubOptions[subIndex].title = e.target.value;
                              onUpdateRow(index, 'subOptions', newSubOptions);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., Savings Account"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Action</label>
                          <input
                            type="text"
                            value={subOption.action}
                            onChange={(e) => {
                              const newSubOptions = [...(row.subOptions || [])];
                              newSubOptions[subIndex].action = e.target.value;
                              onUpdateRow(index, 'subOptions', newSubOptions);
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g., Check savings balance"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => {
                            const newSubOptions = (row.subOptions || []).filter((_, i) => i !== subIndex);
                            onUpdateRow(index, 'subOptions', newSubOptions);
                          }}
                          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-3">
              <button
                onClick={() => onRemoveRow(index)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmailSupportForm = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  value={row.service}
                  onChange={(e) => onUpdateRow(index, 'service', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., General Inquiries"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={row.email}
                  onChange={(e) => onUpdateRow(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., customercare@bank.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response Time</label>
                <input
                  type="text"
                  value={row.response}
                  onChange={(e) => onUpdateRow(index, 'response', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Within 24 hours"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => onRemoveRow(index)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNRIPhoneBankingForm = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">NRI Phone Banking</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={row.country}
                  onChange={(e) => onUpdateRow(index, 'country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., USA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={row.number}
                  onChange={(e) => onUpdateRow(index, 'number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 855-999-6061"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  value={row.service}
                  onChange={(e) => onUpdateRow(index, 'service', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Existing Account Holder Queries"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => onRemoveRow(index)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMissedCallServiceForm = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Missed Call Service</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  value={row.service}
                  onChange={(e) => onUpdateRow(index, 'service', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Account Balance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={row.number}
                  onChange={(e) => onUpdateRow(index, 'number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1800 270 3333"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => onUpdateRow(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Give a missed call to get balance"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => onRemoveRow(index)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderForm = () => {
    switch (section) {
      case 'helpline':
        return renderHelplineForm();
      case 'allIndia':
        return renderAllIndiaForm();
      case 'smsServices':
        return renderSMSServicesForm();
      case 'ivrsMenu':
        return renderIVRSMenuForm();
      case 'emailSupport':
        return renderEmailSupportForm();
      case 'nriPhoneBanking':
        return renderNRIPhoneBankingForm();
      case 'missedCallService':
        return renderMissedCallServiceForm();
      default:
        return <div>Select a tab to start editing</div>;
    }
  };

  return (
    <div className="space-y-6">
      {renderForm()}
    </div>
  );
};

export default FormEditor;


