import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Edit3,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Link,
  Settings,
  Users,
  Globe,
  Building,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import {
  HeadingEditor,
  TopContactCardsEditor,
  TableEditor,
  SectionWrapper,
  PhoneNumberItemsEditor
} from './ContactNumbersEditorComponents';

const ContactNumbersEditor = ({ 
  contactData, 
  onSave, 
  onCancel,
  isVisible = false 
}) => {
  const [editingData, setEditingData] = useState({});
  const [activeSection, setActiveSection] = useState('topContactCards');
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set(['topContactCards']));
  const [previewMode, setPreviewMode] = useState(false);

  // Initialize editing data
  useEffect(() => {
    if (contactData) {
      setEditingData(JSON.parse(JSON.stringify(contactData)));
    }
  }, [contactData]);

  const handleEditField = (field, value) => {
    setEditingField(field);
    setTempValue(value || '');
  };

  const handleSaveField = () => {
    if (editingField) {
      setEditingData(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
      setEditingField(null);
      setTempValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleSaveChanges = async () => {
    try {
      await onSave(editingData);
      setShowSaveModal(false);
    } catch (error) {
      console.error('Error saving contact numbers:', error);
    }
  };

  // Generic Editable Field Component
  const EditableField = ({ field, value, label, type = 'text', className = '', placeholder = '' }) => {
    const isEditing = editingField === field;
    
    return (
      <div className={`mb-4 ${className}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {isEditing ? (
          <div className="flex gap-2">
            {type === 'textarea' ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder={placeholder}
              />
            ) : (
              <input
                type={type}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={placeholder}
              />
            )}
            <button
              onClick={handleSaveField}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
            <span className="text-gray-700">
              {value || <span className="text-gray-400 italic">Not set</span>}
            </span>
            <button
              onClick={() => handleEditField(field, value)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Contact Numbers Editor
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                previewMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {[
                { id: 'topContactCards', label: 'Top Contact Cards', icon: Phone },
                { id: 'nationalNumbersSection', label: 'National Numbers', icon: Globe },
                { id: 'helplineNumbersSection', label: 'Helpline Numbers', icon: Phone },
                { id: 'allIndiaNumbersSection', label: 'All India Numbers', icon: Building },
                { id: 'serviceWiseNumbersSection', label: 'Service-wise Numbers', icon: Settings },
                { id: 'stateWiseNumbersSection', label: 'State-wise Numbers', icon: MapPin },
                { id: 'smsServicesSection', label: 'SMS Services', icon: MessageSquare },
                { id: 'ivrMenuSection', label: 'IVR Menu', icon: Phone },
                { id: 'quickLinksSection', label: 'Quick Links', icon: Link },
                { id: 'emailSupportSection', label: 'Email Support', icon: Mail },
                { id: 'nriPhoneBankingSection', label: 'NRI Phone Banking', icon: Users },
                { id: 'missedCallServiceSection', label: 'Missed Call Service', icon: Phone },
                { id: 'customerCareListSection', label: 'Customer Care List', icon: FileText },
                { id: 'additionalTables', label: 'Additional Tables', icon: FileText }
              ].map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Top Contact Cards Section */}
              {activeSection === 'topContactCards' && (
                <SectionWrapper 
                  id="topContactCards" 
                  title="Top Contact Cards" 
                  icon={Phone}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <TopContactCardsEditor 
                    editingData={editingData} 
                    setEditingData={setEditingData} 
                  />
                </SectionWrapper>
              )}

              {/* National Numbers Section */}
              {activeSection === 'nationalNumbersSection' && (
                <SectionWrapper 
                  id="nationalNumbersSection" 
                  title="National Numbers" 
                  icon={Globe}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="nationalNumbersSection"
                    heading={editingData.nationalNumbersSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      nationalNumbersSection: { ...prev.nationalNumbersSection, heading }
                    }))}
                  />
                  <PhoneNumberItemsEditor
                    items={editingData.nationalNumbersSection?.items}
                    onUpdate={(items) => setEditingData(prev => ({
                      ...prev,
                      nationalNumbersSection: { ...prev.nationalNumbersSection, items }
                    }))}
                  />
                </SectionWrapper>
              )}

              {/* Helpline Numbers Section */}
              {activeSection === 'helplineNumbersSection' && (
                <SectionWrapper 
                  id="helplineNumbersSection" 
                  title="Helpline Numbers" 
                  icon={Phone}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="helplineNumbersSection"
                    heading={editingData.helplineNumbersSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      helplineNumbersSection: { ...prev.helplineNumbersSection, heading }
                    }))}
                  />
                  <TableEditor
                    sectionKey="helplineNumbersSection"
                    tableData={editingData.helplineNumbersSection?.table}
                    onUpdate={(table) => setEditingData(prev => ({
                      ...prev,
                      helplineNumbersSection: { ...prev.helplineNumbersSection, table }
                    }))}
                  />
                </SectionWrapper>
              )}

              {/* All India Numbers Section */}
              {activeSection === 'allIndiaNumbersSection' && (
                <SectionWrapper 
                  id="allIndiaNumbersSection" 
                  title="All India Numbers" 
                  icon={Building}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="allIndiaNumbersSection"
                    heading={editingData.allIndiaNumbersSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      allIndiaNumbersSection: { ...prev.allIndiaNumbersSection, heading }
                    }))}
                  />
                  <TableEditor
                    sectionKey="allIndiaNumbersSection"
                    tableData={editingData.allIndiaNumbersSection?.table}
                    onUpdate={(table) => setEditingData(prev => ({
                      ...prev,
                      allIndiaNumbersSection: { ...prev.allIndiaNumbersSection, table }
                    }))}
                  />
                </SectionWrapper>
              )}

              {/* Service-wise Numbers Section */}
              {activeSection === 'serviceWiseNumbersSection' && (
                <SectionWrapper 
                  id="serviceWiseNumbersSection" 
                  title="Service-wise Numbers" 
                  icon={Settings}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="serviceWiseNumbersSection"
                    heading={editingData.serviceWiseNumbersSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      serviceWiseNumbersSection: { ...prev.serviceWiseNumbersSection, heading }
                    }))}
                  />
                  <TableEditor
                    sectionKey="serviceWiseNumbersSection"
                    tableData={editingData.serviceWiseNumbersSection?.table}
                    onUpdate={(table) => setEditingData(prev => ({
                      ...prev,
                      serviceWiseNumbersSection: { ...prev.serviceWiseNumbersSection, table }
                    }))}
                  />
                </SectionWrapper>
              )}

              {/* State-wise Numbers Section */}
              {activeSection === 'stateWiseNumbersSection' && (
                <SectionWrapper 
                  id="stateWiseNumbersSection" 
                  title="State-wise Numbers" 
                  icon={MapPin}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="stateWiseNumbersSection"
                    heading={editingData.stateWiseNumbersSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      stateWiseNumbersSection: { ...prev.stateWiseNumbersSection, heading }
                    }))}
                  />
                  {/* Add state office editor here */}
                  <div className="text-center text-gray-500 py-4">
                    State office editor coming soon...
                  </div>
                </SectionWrapper>
              )}

              {/* SMS Services Section */}
              {activeSection === 'smsServicesSection' && (
                <SectionWrapper 
                  id="smsServicesSection" 
                  title="SMS Services" 
                  icon={MessageSquare}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="smsServicesSection"
                    heading={editingData.smsServicesSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      smsServicesSection: { ...prev.smsServicesSection, heading }
                    }))}
                  />
                  {/* Add SMS services editor here */}
                  <div className="text-center text-gray-500 py-4">
                    SMS services editor coming soon...
                  </div>
                </SectionWrapper>
              )}

              {/* IVR Menu Section */}
              {activeSection === 'ivrMenuSection' && (
                <SectionWrapper 
                  id="ivrMenuSection" 
                  title="IVR Menu" 
                  icon={Phone}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="ivrMenuSection"
                    heading={editingData.ivrMenuSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      ivrMenuSection: { ...prev.ivrMenuSection, heading }
                    }))}
                  />
                  {/* Add IVR menu editor here */}
                  <div className="text-center text-gray-500 py-4">
                    IVR menu editor coming soon...
                  </div>
                </SectionWrapper>
              )}

              {/* Quick Links Section */}
              {activeSection === 'quickLinksSection' && (
                <SectionWrapper 
                  id="quickLinksSection" 
                  title="Quick Links" 
                  icon={Link}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="quickLinksSection"
                    heading={editingData.quickLinksSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      quickLinksSection: { ...prev.quickLinksSection, heading }
                    }))}
                  />
                  {/* Add quick links editor here */}
                  <div className="text-center text-gray-500 py-4">
                    Quick links editor coming soon...
                  </div>
                </SectionWrapper>
              )}

              {/* Email Support Section */}
              {activeSection === 'emailSupportSection' && (
                <SectionWrapper 
                  id="emailSupportSection" 
                  title="Email Support" 
                  icon={Mail}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="emailSupportSection"
                    heading={editingData.emailSupportSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      emailSupportSection: { ...prev.emailSupportSection, heading }
                    }))}
                  />
                  <TableEditor
                    sectionKey="emailSupportSection"
                    tableData={editingData.emailSupportSection?.table}
                    onUpdate={(table) => setEditingData(prev => ({
                      ...prev,
                      emailSupportSection: { ...prev.emailSupportSection, table }
                    }))}
                  />
                </SectionWrapper>
              )}

              {/* NRI Phone Banking Section */}
              {activeSection === 'nriPhoneBankingSection' && (
                <SectionWrapper 
                  id="nriPhoneBankingSection" 
                  title="NRI Phone Banking" 
                  icon={Users}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="nriPhoneBankingSection"
                    heading={editingData.nriPhoneBankingSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      nriPhoneBankingSection: { ...prev.nriPhoneBankingSection, heading }
                    }))}
                  />
                  {/* Add NRI subsections editor here */}
                  <div className="text-center text-gray-500 py-4">
                    NRI subsections editor coming soon...
                  </div>
                </SectionWrapper>
              )}

              {/* Missed Call Service Section */}
              {activeSection === 'missedCallServiceSection' && (
                <SectionWrapper 
                  id="missedCallServiceSection" 
                  title="Missed Call Service" 
                  icon={Phone}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="missedCallServiceSection"
                    heading={editingData.missedCallServiceSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      missedCallServiceSection: { ...prev.missedCallServiceSection, heading }
                    }))}
                  />
                  <TableEditor
                    sectionKey="missedCallServiceSection"
                    tableData={editingData.missedCallServiceSection?.table}
                    onUpdate={(table) => setEditingData(prev => ({
                      ...prev,
                      missedCallServiceSection: { ...prev.missedCallServiceSection, table }
                    }))}
                  />
                </SectionWrapper>
              )}

              {/* Customer Care List Section */}
              {activeSection === 'customerCareListSection' && (
                <SectionWrapper 
                  id="customerCareListSection" 
                  title="Customer Care List" 
                  icon={FileText}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  <HeadingEditor
                    sectionKey="customerCareListSection"
                    heading={editingData.customerCareListSection?.heading}
                    onUpdate={(heading) => setEditingData(prev => ({
                      ...prev,
                      customerCareListSection: { ...prev.customerCareListSection, heading }
                    }))}
                  />
                  {/* Add customer care links editor here */}
                  <div className="text-center text-gray-500 py-4">
                    Customer care links editor coming soon...
                  </div>
                </SectionWrapper>
              )}

              {/* Additional Tables Section */}
              {activeSection === 'additionalTables' && (
                <SectionWrapper 
                  id="additionalTables" 
                  title="Additional Tables" 
                  icon={FileText}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                >
                  {/* Add additional tables editor here */}
                  <div className="text-center text-gray-500 py-4">
                    Additional tables editor coming soon...
                  </div>
                </SectionWrapper>
              )}

              {/* Default message when no section is selected */}
              {!activeSection && (
                <div className="text-center text-gray-500 py-8">
                  Select a section from the sidebar to start editing
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Save Contact Numbers Changes
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to save all the changes made to the contact numbers? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSaveChanges}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactNumbersEditor; 