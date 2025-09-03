import React from 'react';
import { Copy } from 'lucide-react';

const CompanyCard = ({ 
  title, 
  icon: Icon, 
  children, 
  className = "bg-white rounded-xl shadow p-4",
  iconColor = "text-blue-600" 
}) => {
  return (
    <div className={className}>
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColor} bg-transparent`} style={{ background: 'none' }} /> 
        {title}
      </h3>
      {children}
    </div>
  );
};

export default CompanyCard; 