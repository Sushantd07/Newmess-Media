import React, { useState, useRef, useEffect } from 'react';
import IndiaMap from '../assets/india-map.svg?react';
import { MapPin, ArrowRight, Users, Shield, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statesData = [
  {
    id: 'maharashtra',
    svgId: 'INMH',
    name: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    info: [
      { label: 'CM Helpline', value: '1800-222-111' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'delhi',
    svgId: 'INDL',
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&h=200&fit=crop',
    info: [
      { label: 'CM Helpline', value: '1800-110-001' },
      { label: 'Electricity', value: '19123' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  },
  {
    id: 'karnataka',
    svgId: 'INKA',
    name: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    info: [
      { label: 'CM Helpline', value: '1800-425-9339' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'tamil_nadu',
    svgId: 'INTN',
    name: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    info: [
      { label: 'CM Helpline', value: '1800-425-0111' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'andhra_pradesh',
    svgId: 'INAP',
    name: 'Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1583663848692-6b3f4764cf0b?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1902' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '1100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'arunachal_pradesh',
    svgId: 'INAR',
    name: 'Arunachal Pradesh',
    image: 'https://images.unsplash.com/photo-1625121342044-b3b94fd3f3b9?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '155250' },
      { label: 'Electricity', value: '0370-2290065' },
      { label: 'Police', value: '1100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'assam',
    svgId: 'INAS',
    name: 'Assam',
    image: 'https://images.unsplash.com/photo-1595847135932-27cba8e90d2b?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'bihar',
    svgId: 'INBR',
    name: 'Bihar',
    image: 'https://images.unsplash.com/photo-1598003789764-2a6d5272ab6c?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1905' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'chhattisgarh',
    svgId: 'INCJ',
    name: 'Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1620733100472-27c87b8e76ae?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'goa',
    svgId: 'INGA',
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1601275802430-4b7b8d7932c0?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '155250' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'gujarat',
    svgId: 'INGJ',
    name: 'Gujarat',
    image: 'https://images.unsplash.com/photo-1582721052784-4cc5df1944ec?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1100' },
      { label: 'Electricity', value: '1800-233-3003' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'haryana',
    svgId: 'INHR',
    name: 'Haryana',
    image: 'https://images.unsplash.com/photo-1646792006724-3cf61c56d93f?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'himachal_pradesh',
    svgId: 'INHP',
    name: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'jharkhand',
    svgId: 'INJH',
    name: 'Jharkhand',
    image: 'https://images.unsplash.com/photo-1580137189272-c9379b0f6d0a?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '181' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'karnataka',
    svgId: 'INKA',
    name: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1593951553463-e9ef97ed80ae?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1902' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'kerala',
    svgId: 'INKL',
    name: 'Kerala',
    image: 'https://images.unsplash.com/photo-1628164603882-80ae51cd74cc?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '155300' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'madhya_pradesh',
    svgId: 'INMP',
    name: 'Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1603701973586-2c2acacdb138?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '181' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'maharashtra',
    svgId: 'INMH',
    name: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1800-222-111' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'manipur',
    svgId: 'INMN',
    name: 'Manipur',
    image: 'https://images.unsplash.com/photo-1582223151283-877dc7b2b8aa?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '181' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'meghalaya',
    svgId: 'INML',
    name: 'Meghalaya',
    image: 'https://images.unsplash.com/photo-1608710449164-4a7cf6ea45fb?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '14410' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'mizoram',
    svgId: 'INMZ',
    name: 'Mizoram',
    image: 'https://images.unsplash.com/photo-1616052488425-2a785b42abbb?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1098' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'nagaland',
    svgId: 'INNL',
    name: 'Nagaland',
    image: 'https://images.unsplash.com/photo-1617032023622-3859651d4623?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '112' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'odisha',
    svgId: 'INOR',
    name: 'Odisha',
    image: 'https://images.unsplash.com/photo-1574169207510-8c4f5e6ffeb6?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '155335' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'punjab',
    svgId: 'INPB',
    name: 'Punjab',
    image: 'https://images.unsplash.com/photo-1606813817202-7ff21d7d011a?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'rajasthan',
    svgId: 'INRJ',
    name: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1585155777343-92a6e7422db5?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '181' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'sikkim',
    svgId: 'INSK',
    name: 'Sikkim',
    image: 'https://images.unsplash.com/photo-1624110052441-d1f7d01f55cb?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '181' },
      { label: 'Electricity', value: '03592-202233' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'tamil_nadu',
    svgId: 'INTN',
    name: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'telangana',
    svgId: 'INTG',
    name: 'Telangana',
    image: 'https://images.unsplash.com/photo-1600346025101-7c210c0cb2d4?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1902' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'tripura',
    svgId: 'INTR',
    name: 'Tripura',
    image: 'https://images.unsplash.com/photo-1632445487276-d75db8579c8c?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1905' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'uttar_pradesh',
    svgId: 'INUP',
    name: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1594810909394-eae57a1808d5?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1076' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'uttarakhand',
    svgId: 'INUT',
    name: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1612110806494-bc2b1e75c9cc?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1905' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },
  {
    id: 'west_bengal',
    svgId: 'INWB',
    name: 'West Bengal',
    image: 'https://images.unsplash.com/photo-1606464714196-c4cc6615f4fa?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '100' },
      { label: 'Ambulance', value: '108' }
    ]
  },

  // Union Territories
  {
    id: 'delhi',
    svgId: 'INDL',
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1031' },
      { label: 'Electricity', value: '19123' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  },
  {
    id: 'jammu_kashmir',
    svgId: 'INJK',
    name: 'Jammu & Kashmir',
    image: 'https://images.unsplash.com/photo-1570696164395-426b7f3d5a70?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '155255' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  },
  {
    id: 'ladakh',
    svgId: 'INLA',
    name: 'Ladakh',
    image: 'https://images.unsplash.com/photo-1623160937084-9a4c55dc5986?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  },
  {
    id: 'andaman_nicobar',
    svgId: 'INAN',
    name: 'Andaman & Nicobar',
    image: 'https://images.unsplash.com/photo-1608806307311-26c2c3f7926a?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '112' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  },
  {
    id: 'chandigarh',
    svgId: 'INCH',
    name: 'Chandigarh',
    image: 'https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '112' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  },
  {
    id: 'puducherry',
    svgId: 'INPY',
    name: 'Puducherry',
    image: 'https://images.unsplash.com/photo-1601034874029-3c04643f9e8f?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '1031' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  },
  {
    id: 'dadra_nagar_haveli',
    svgId: 'INDN',
    name: 'Dadra & Nagar Haveli',
    image: 'https://images.unsplash.com/photo-1543832977-85db68f1b4df?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  },
  {
    id: 'daman_diu',
    svgId: 'INDD',
    name: 'Daman & Diu',
    image: 'https://images.unsplash.com/photo-1632445438965-e2d474e6ea9a?fit=crop&w=300&h=200',
    info: [
      { label: 'CM Helpline', value: '100' },
      { label: 'Electricity', value: '1912' },
      { label: 'Police', value: '100' },
      { label: 'Fire', value: '101' },
      { label: 'Ambulance', value: '102' }
    ]
  }
];

const stats = [
  { icon: MapPin, label: 'States Covered', value: '28+' },
  { icon: Shield, label: 'Emergency Numbers', value: '500+' },
  { icon: Phone, label: 'Verified Numbers', value: '2000+' },
  { icon: Users, label: 'Daily Searches', value: '50K+' }
];
import { statesData, stats } from '../data/statesData';

const StatewiseSection = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const handleStateHover = (stateId, evt) => {
    const state = statesData.find(s => s.id === stateId);
    if (state) {
      setHoveredState(state);
      if (evt) {
        const svgRect = mapRef.current.getBoundingClientRect();
        setPopupPos({
          x: evt.clientX - svgRect.left,
          y: evt.clientY - svgRect.top
        });
      }
    }
  };

  const handleStateLeave = () => setHoveredState(null);
  const handleRedirect = () => window.location.href = '/statewise-numbers';

  useEffect(() => {
    const svgDoc = mapRef.current;
    if (!svgDoc) return;
    statesData.forEach(({ id, svgId }) => {
      const el = svgDoc.getElementById(svgId);
      if (el) {
        el.style.cursor = 'pointer';
        el.style.fill = '#fb923c';
        el.style.transition = 'fill 0.25s';
        el.addEventListener('mouseenter', (evt) => {
          handleStateHover(id, evt);
          el.style.fill = '#ea580c';
        });
        el.addEventListener('mousemove', (evt) => handleStateHover(id, evt));
        el.addEventListener('mouseleave', () => {
          handleStateLeave();
          el.style.fill = '#fb923c';
        });
      }
    });
    return () => {
      statesData.forEach(({ svgId }) => {
        const el = svgDoc.getElementById(svgId);
        if (el) {
          el.onmouseenter = null;
          el.onmouseleave = null;
          el.onmousemove = null;
          el.style.fill = '#fb923c';
        }
      });
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="h-4 w-4" /> State Directory
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Numbers by <span className="text-orange-600">Indian States</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access state-specific toll-free numbers, emergency services, and government helplines organized by location across India.
          </p>
        </div>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 lg:p-10 shadow-xl border border-orange-200">
          {/* Left Content */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Explore State-wise <br />
              <span className="text-orange-600">Helpline Directory</span>
            </h3>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Get instant access to verified contact numbers for government services, emergency helplines,
              and essential services specific to your state. All numbers are regularly updated and verified.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-orange-600 bg-transparent" style={{ background: 'none' }} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleRedirect}
              className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3"
            >
              Browse State Directory <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform bg-transparent" style={{ background: 'none' }} />
            </button>
          </div>

          {/* Right Map Section */}
          <div className="relative">
            <div className="relative group">
              <svg
                ref={mapRef}
                viewBox="0 0 1000 1200"
                className="w-full max-w-md h-auto drop-shadow-lg mx-auto"
              >
                <IndiaMap />
              </svg>

              <AnimatePresence>
                {hoveredState && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute z-50"
                    style={{
                      left: popupPos.x + 20,
                      top: popupPos.y - 40,
                      pointerEvents: 'none',
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                      padding: '1rem',
                      minWidth: '200px',
                      maxWidth: '260px',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <img
                      src={hoveredState.image}
                      alt={hoveredState.name}
                      className="w-full h-10 object-cover rounded mb-2 opacity-80 border border-orange-100"
                    />
                    <h4 className="font-bold text-orange-700 mb-2 text-sm text-center">
                      {hoveredState.name}
                    </h4>
                    <table className="w-full text-xs text-left">
                      <tbody>
                        {hoveredState.info.map((row, idx) => (
                          <tr key={idx}>
                            <td className="font-semibold pr-2">{row.label}</td>
                            <td>{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Icons */}
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full p-3 shadow-lg animate-bounce">
                <Phone className="h-5 w-5" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-full p-3 shadow-lg animate-bounce"
                style={{ animationDelay: '1s' }}
              >
                <Shield className="h-5 w-5" />
              </div>
            </div>

            {/* View All Numbers Table */}
            <div className="mt-6 bg-white p-4 rounded-xl shadow border border-orange-200 text-sm max-h-[200px] overflow-y-auto">
              <h4 className="font-semibold text-orange-600 mb-2">View All Numbers</h4>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="pb-2">State</th>
                    <th className="pb-2">CM Helpline</th>
                  </tr>
                </thead>
                <tbody>
                  {statesData.slice(0, 10).map((state, idx) => (
                    <tr key={idx}>
                      <td className="py-1 text-gray-800">{state.name}</td>
                      <td className="py-1 text-orange-700 font-semibold">{state.info[0].value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatewiseSection;
