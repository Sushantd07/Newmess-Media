import React from 'react';
import { Copy } from 'lucide-react';

const ContactTable = ({ 
  headers, 
  data, 
  onCopy, 
  className = "w-full text-sm",
  rowClassName = (idx) => idx % 2 === 0 ? "bg-gray-50" : "",
  numberColumnIndex = null,
  copyButton = true
}) => {
  return (
    <table className={className}>
      <thead>
        <tr className="bg-gray-100 text-gray-700 text-left font-semibold">
          {headers.map((header, index) => (
            <th key={index} className="py-2 px-3">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className={rowClassName(idx)}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="py-3 px-3 text-[14px] text-gray-700 leading-snug">
                {cellIndex === numberColumnIndex && copyButton ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] text-green-700 font-semibold whitespace-nowrap">
                      {cell}
                    </span>
                    <button
                      onClick={() => onCopy(cell)}
                      title="Copy"
                      className="hover:text-blue-500"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="block max-w-sm">{cell}</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactTable; 