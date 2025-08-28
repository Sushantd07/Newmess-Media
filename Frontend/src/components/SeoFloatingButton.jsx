import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import SeoSettingsPanel from './admin/SeoSettingsPanel.jsx';

const SeoFloatingButton = ({ type, identifier, defaults, positionClass = 'top-4 left-4', tab, style }) => {
  const [open, setOpen] = useState(false);
  console.debug('[SEO] Floating button render', { type, identifier, tab });
  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <button
        onClick={() => setOpen(true)}
        title="SEO Settings"
        className={`fixed z-[2147483000] bg-orange-600 text-white rounded-full w-12 h-12 shadow-xl flex items-center justify-center hover:bg-orange-700 pointer-events-auto ${positionClass}`}
        style={style}
        aria-label="Open SEO Settings"
      >
        ⚙️
      </button>
      {open && (
        <SeoSettingsPanel
          type={type}
          identifier={identifier || (type === 'route' ? window.location.pathname : '')}
          defaults={defaults}
          tab={tab}
          onClose={() => setOpen(false)}
        />
      )}
    </>,
    document.body
  );
};

export default SeoFloatingButton;


