import React from 'react';

const colorMap = {
  blue: 'bg-blue-50 border-blue-200',
  red: 'bg-red-50 border-red-200',
  green: 'bg-green-50 border-green-200',
  gray: 'bg-gray-50 border-gray-200',
};

const Card = ({ icon = '📞', title, subtitle, color = 'blue' }) => (
  <div className={`rounded-xl border p-4 ${colorMap[color] || colorMap.blue}`}>
    <div className="flex items-start gap-3">
      <div className="text-2xl leading-none">{icon}</div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
      </div>
    </div>
  </div>
);

const TripleInfoCards = ({ cards = [] }) => {
  const items = cards.slice(0, 3);
  while (items.length < 3) items.push({ title: 'Title', subtitle: 'Subtitle', icon: '📞', color: 'blue' });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((c, i) => (
        <Card key={i} {...c} />
      ))}
    </div>
  );
};

export default TripleInfoCards;


