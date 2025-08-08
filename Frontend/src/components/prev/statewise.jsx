import React, { useState } from 'react';
import FinalMap from '../assets/Final_Map.svg?react';
import { MapPin, ArrowRight, Users, Shield, Phone } from 'lucide-react';

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

const StatewiseSection = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const hoveredStateData = hoveredState
    ? statesData.find((s) => s.id === hoveredState)
    : null;

  // Customizable crop amount for SVG map (in pixels)
  const cropAmount = 15; // Change this value to crop more or less from the bottom
  const visibleHeight = 520;

  return (
    <section className="py-10 bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white/90 rounded-3xl shadow-2xl border border-orange-200 overflow-hidden flex flex-col md:flex-row h-auto">
          
          {/* Left Column */}
          <div className="flex flex-col px-4 py-8 bg-gradient-to-b from-orange-50 to-white border-r border-orange-100 md:w-[350px] w-full">
            <div>
              <h2 className="text-2xl font-bold text-orange-700 mb-3">
                Statewise Emergency Contacts
              </h2>
              <p className="text-gray-700 mb-4 text-base">
                Browse the up-to-date helpline and emergency numbers for every Indian state and union territory.
              </p>
              <a
                href="/statewise-numbers"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow transition"
              >
                <ArrowRight className="h-5 w-5 bg-transparent" style={{ background: 'none' }} />
                Browse Statewise Page
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-5 my-7">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center flex-1 min-w-[90px]"
                >
                  <span className="text-xl font-bold text-orange-600">{s.value}</span>
                  <span className="text-gray-700 text-xs">{s.label}</span>
                </div>
              ))}
            </div>
            <ul className="mt-3 space-y-2 text-gray-700 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✔</span> 100% verified numbers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✔</span> Updated monthly
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✔</span> Covers all states & UTs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✔</span> Emergency & utility contacts
              </li>
            </ul>
          </div>

          {/* Middle (Replaces '1' box with Heading and Bigger Map) */}
          <div className="flex-1 px-2 py-8 flex flex-col items-center bg-gradient-to-b from-white to-orange-50 min-w-[400px]">
            {/* Heading replacing the '1' box */}
            <div className="w-full mb-2 flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl text-orange-700 font-extrabold text-center">
                Indian States & UTs Emergency Map
              </h2>
            </div>
            {/* Map Box - crop customizable amount from bottom using overflow hidden on parent */}
            <div style={{ width: '100%', maxWidth: 520, height: visibleHeight, overflow: 'hidden', margin: '0 auto' }}>
              <FinalMap
                style={{
                  width: '100%',
                  height: visibleHeight + cropAmount,
                  maxWidth: 520,
                  maxHeight: visibleHeight + cropAmount,
                  display: 'block',
                  background: 'none',
                  margin: '0 auto',
                }}
                onMouseLeave={() => setHoveredState(null)}
              />
            </div>
            {/* Live Tip or Hint */}
            <div className="mt-4 text-sm text-gray-700 text-center w-full">
              <span>
                <span className="font-bold text-orange-500">Tip:</span> Hover over a state on the map to see helpline details in the panel.
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-between items-center px-4 py-8 bg-gradient-to-b from-white to-orange-50 border-t md:border-t-0 md:border-l border-orange-100 md:w-[350px] w-full">
            <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-orange-700 sticky top-0 bg-white z-10">
                {hoveredStateData ? `Emergency Numbers: ${hoveredStateData.name}` : 'Select a State'}
              </h2>
              {hoveredStateData ? (
                <>
                  <img
                    className="w-full h-32 object-cover rounded-md mb-3 border border-orange-100"
                    src={hoveredStateData.image}
                    alt={hoveredStateData.name}
                  />
                  <table className="w-full text-sm border border-orange-200 rounded-lg overflow-hidden bg-white shadow">
                    <tbody>
                      {hoveredStateData.info.map((row, idx) => (
                        <tr key={idx} className="even:bg-orange-50">
                          <td className="font-semibold pr-2 py-2 text-gray-700 w-1/2 border-b border-orange-100">
                            {row.label}
                          </td>
                          <td className="py-2 text-gray-900 border-b border-orange-100">
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-3">
                    All numbers are regularly updated and verified for accuracy.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center text-gray-400 mb-4">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                    <span>Hover over a state to see numbers</span>
                  </div>
                  <table className="w-full text-sm border border-orange-200 rounded-lg overflow-hidden bg-white shadow">
                    <thead>
                      <tr className="bg-orange-100">
                        <th className="py-2 px-2 text-left font-semibold text-orange-700">State</th>
                        <th className="py-2 px-2 text-left font-semibold text-orange-700">CM Helpline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statesData.slice(0, 5).map((state, idx) => (
                        <tr key={idx} className="even:bg-orange-50">
                          <td className="py-2 px-2 text-gray-700">{state.name}</td>
                          <td className="py-2 px-2 text-gray-900">{state.info[0]?.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-3">
                    Browse a state to see all helpline and emergency numbers.
                  </p>
                </>
              )}
            </div>
          
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatewiseSection;
