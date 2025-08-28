import React from 'react';
import { CardComponents } from './CardComponents.jsx';

// Registry mapping component keys to renderers and editable prop schemas
export const componentRegistry = {
  // NRI Support Card
  NRISupportCard: {
    label: 'NRI Support Card',
    component: CardComponents.NRISupportCard,
    preview: (props) => <CardComponents.NRISupportCard {...(props || {})} />,
    schema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'NRI Support Services' },
      { key: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#1f2937' },
      { key: 'iconColor', label: 'Icon Color', type: 'color', defaultValue: '#3b82f6' },
      { key: 'isEditing', label: 'Enable Inline Editing', type: 'toggle', defaultValue: false }
    ],
    defaults: {
      title: 'NRI Support Services',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      iconColor: '#3b82f6',
      isEditing: false,
      phoneBankingData: [
        { country: "USA", number: "855-999-6061" },
        { country: "Canada", number: "855-999-6061" },
        { country: "Singapore", number: "800-101-2850" },
        { country: "Kenya", number: "0-800-721-740" },
        { country: "Other Countries", number: "91-2260006000" }
      ],
      accountOpeningData: [
        { country: "USA", number: "855-207-8106" },
        { country: "Canada", number: "855-846-3731" },
        { country: "UK", number: "800-756-2993" },
        { country: "Singapore", number: "800-101-2798" }
      ]
    }
  },

  // Helpline Numbers Card
  HelplineNumbersCard: {
    label: 'Helpline Numbers Card',
    component: CardComponents.HelplineNumbersCard,
    preview: (props) => <CardComponents.HelplineNumbersCard {...(props || {})} />,
    schema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'Helpline Numbers' },
      { key: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#1f2937' },
      { key: 'iconColor', label: 'Icon Color', type: 'color', defaultValue: '#3b82f6' }
    ],
    defaults: {
      title: 'Helpline Numbers',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      iconColor: '#3b82f6'
    }
  },

  // All India Numbers Card
  AllIndiaNumbersCard: {
    label: 'All India Numbers Card',
    component: CardComponents.AllIndiaNumbersCard,
    preview: (props) => <CardComponents.AllIndiaNumbersCard {...(props || {})} />,
    schema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'All India Numbers' },
      { key: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#1f2937' },
      { key: 'iconColor', label: 'Icon Color', type: 'color', defaultValue: '#10b981' }
    ],
    defaults: {
      title: 'All India Numbers',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      iconColor: '#10b981'
    }
  },

  // SMS & WhatsApp Services Card
  SMSWhatsAppServicesCard: {
    label: 'SMS & WhatsApp Services Card',
    component: CardComponents.SMSWhatsAppServicesCard,
    preview: (props) => <CardComponents.SMSWhatsAppServicesCard {...(props || {})} />,
    schema: [
      { key: 'title', label: 'Title', type: 'text', defaultValue: 'SMS & WhatsApp Services' },
      { key: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#1f2937' },
      { key: 'iconColor', label: 'Icon Color', type: 'color', defaultValue: '#ef4444' }
    ],
    defaults: {
      title: 'SMS & WhatsApp Services',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      iconColor: '#ef4444'
    }
  }
};

export const getComponentByKey = (key) => componentRegistry[key]?.component || null;


