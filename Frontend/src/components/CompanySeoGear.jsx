import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SeoFloatingButton from './SeoFloatingButton.jsx';

const CompanySeoGear = () => {
  const location = useLocation();
  const params = useParams();
  const { companySlug, companyId } = params;
  const identifier = companySlug || companyId || 'pending';

  const parts = (location.pathname || '').split('/').filter(Boolean);
  const last = parts[parts.length - 1] || '';
  const tabCandidates = new Set(['contactnumber', 'complain', 'quickhelp', 'videoguide', 'overview']);
  const tab = tabCandidates.has(last) ? last : undefined;

  return (
    <SeoFloatingButton
      type="company"
      identifier={identifier}
      tab={tab}
      positionClass="top-3 right-4"
    />
  );
};

export default CompanySeoGear;











