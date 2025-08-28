import React from 'react';
import { getComponentByKey } from './ComponentRegistry.jsx';

const DynamicPageRenderer = ({ sections = [] }) => {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => {
        const Comp = getComponentByKey(section.component);
        if (!Comp) return null;
        return <Comp key={idx} {...(section.props || {})} />;
      })}
    </div>
  );
};

export default DynamicPageRenderer;


