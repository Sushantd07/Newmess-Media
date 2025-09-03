import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SnameMap from '../../assets/lastMap.svg?react';
import { MapPin, ArrowRight, Users, Shield, Phone, Lock, Unlock } from 'lucide-react';
import MobileStatesGrid from './MobileStatesGrid';

export const statesData = [
	{
		id: 'maharashtra',
		svgId: 'INMH',
		name: 'Maharashtra',
		image: '/images/states/maharahstra.webp',
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
		svgId: 'Delhi',
		name: 'Delhi',
		image: '/images/states/delhi.webp',
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
		svgId: 'Karnataka',
		name: 'Karnataka',
		image: '/images/states/karnataka.webp',
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
		svgId: 'Tamil_Nadu',
		name: 'Tamil Nadu',
		image: '/images/states/tamil-nadu.webp',
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
		svgId: 'Andhra_Pradesh',
		name: 'Andhra Pradesh',
		image: '/images/states/andhra-pradesh.webp',
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
		svgId: 'Arunachal_Pradesh',
		name: 'Arunachal Pradesh',
		image: '/images/states/arunachal-pradesh.webp',
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
		svgId: 'Assam',
		name: 'Assam',
		image: '/images/states/assam.webp',
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
		svgId: 'Bihar',
		name: 'Bihar',
		image: '/images/states/bihar.webp',
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
		svgId: 'Chhattisgarh',
		name: 'Chhattisgarh',
		image: '/images/states/chattisgarh.webp',
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
		svgId: 'Goa',
		name: 'Goa',
		image: '/images/states/goa.webp',
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
		svgId: 'Gujarat',
		name: 'Gujarat',
		image: '/images/states/gujarat.webp',
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
		svgId: 'Haryana',
		name: 'Haryana',
		image: '/images/states/haryana.webp',
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
		svgId: 'Himachal_Pradesh',
		name: 'Himachal Pradesh',
		image: '/images/states/himachal-pradesh.webp',
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
		svgId: 'Jharkhand',
		name: 'Jharkhand',
		image: '/images/states/jharkhand.webp',
		info: [
			{ label: 'CM Helpline', value: '181' },
			{ label: 'Electricity', value: '1912' },
			{ label: 'Police', value: '100' },
			{ label: 'Fire', value: '100' },
			{ label: 'Ambulance', value: '108' }
		]
	},
	{
		id: 'kerala',
		svgId: 'Kerala',
		name: 'Kerala',
		image: '/images/states/kerala.webp',
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
		svgId: 'Madhya_Pradesh',
		name: 'Madhya Pradesh',
		image: '/images/states/madhya-pradesh.webp',
		info: [
			{ label: 'CM Helpline', value: '181' },
			{ label: 'Electricity', value: '1912' },
			{ label: 'Police', value: '100' },
			{ label: 'Fire', value: '100' },
			{ label: 'Ambulance', value: '108' }
		]
	},
	{
		id: 'manipur',
		svgId: 'Manipur',
		name: 'Manipur',
		image: '/images/states/manipur.webp',
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
		svgId: 'Meghalaya',
		name: 'Meghalaya',
		image: '/images/states/meghalaya.webp',
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
		svgId: 'Mizoram',
		name: 'Mizoram',
		image: '/images/states/mizoram.webp',
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
		svgId: 'Nagaland',
		name: 'Nagaland',
		image: '/images/states/nagaland.webp',
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
		svgId: 'Odisha',
		name: 'Odisha',
		image: '/images/states/odisha.webp',
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
		svgId: 'Punjab',
		name: 'Punjab',
		image: '/images/states/punjab.webp',
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
		svgId: 'Rajasthan',
		name: 'Rajasthan',
		image: '/images/states/rajasthan.webp',
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
		svgId: 'Sikkim',
		name: 'Sikkim',
		image: '/images/states/sikkim.webp',
		info: [
			{ label: 'CM Helpline', value: '181' },
			{ label: 'Electricity', value: '03592-202233' },
			{ label: 'Police', value: '100' },
			{ label: 'Fire', value: '100' },
			{ label: 'Ambulance', value: '108' }
		]
	},
	{
		id: 'telangana',
		svgId: 'Telangana',
		name: 'Telangana',
		image: '/images/states/telangana.webp',
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
		svgId: 'Tripura',
		name: 'Tripura',
		image: '/images/states/tripura.webp',
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
		svgId: 'Uttar_Pradesh',
		name: 'Uttar Pradesh',
		image: '/images/states/uttar-pradesh.webp',
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
		svgId: 'Uttarakhand',
		name: 'Uttarakhand',
		image: '/images/states/uttarakhand.webp',
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
		svgId: 'West_Bengal',
		name: 'West Bengal',
		image: '/images/states/west-bengal.webp',
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
		id: 'chandigarh',
		svgId: 'Chandigarh',
		name: 'Chandigarh',
		image: '/images/states/chandigarh.webp',
		info: [
			{ label: 'CM Helpline', value: '112' },
			{ label: 'Electricity', value: '1912' },
			{ label: 'Police', value: '100' },
			{ label: 'Fire', value: '101' },
			{ label: 'Ambulance', value: '102' }
		]
	},
	{
		id: 'jammu_kashmir',
		svgId: 'Jammu_and_Kashmir_disp',
		name: 'Jammu & Kashmir',
		image: '/images/states/jammu-kashmir.webp',
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
		svgId: 'Ladakh_disp',
		name: 'Ladakh',
		image: '/images/states/ladakh.webp',
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
		svgId: 'Andaman_and_Nicobar_Islands',
		name: 'Andaman & Nicobar',
		image: '/images/states/andaman-nicobar.webp',
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
		svgId: 'Puducherry',
		name: 'Puducherry',
		image: '/images/states/puducherry.webp',
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
		svgId: 'Dadra_and_Nagar_Haveli_and_Daman_and_Diu',
		name: 'Dadra & Nagar Haveli',
		image: '/images/states/dadra-nagar-haveli.webp',
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

// Helper: Map svgId to state id
const svgIdToStateId = Object.fromEntries(statesData.map(s => [s.svgId, s.id]));

// SVG Map Wrapper to inject hover handlers
const InteractiveMap = ({ onStateHover, onStateLeave, onStateClick, hoveredState, clickedState }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const node = mapRef.current;
    
    // Remove existing listeners
    if (node.__listenersAttached) {
      Object.keys(svgIdToStateId).forEach(svgId => {
        const region = node.querySelector(`#${svgId}`);
        if (region) {
          region.removeEventListener('mouseenter', node[`__mouseenter_${svgId}`]);
          region.removeEventListener('mouseleave', node[`__mouseleave_${svgId}`]);
          region.removeEventListener('click', node[`__click_${svgId}`]);
        }
      });
    }

    // Attach new listeners
    Object.keys(svgIdToStateId).forEach(svgId => {
      const region = node.querySelector(`#${svgId}`);
      if (region) {
        region.style.cursor = 'pointer';
        region.style.transition = 'all 0.3s ease';
        
        // Store function references for cleanup
        const mouseEnterHandler = () => {
          const stateId = svgIdToStateId[svgId];
          console.log('Hovered:', stateId);
          onStateHover(stateId);
          
          // Add hover visual effect (only if not clicked)
          if (clickedState !== stateId) {
            region.style.fill = '#d1451a'; // Dark orange
            region.style.stroke = '#a34700';
            region.style.strokeWidth = '3';
            region.style.filter = 'drop-shadow(0 0 8px rgba(209, 69, 26, 0.6))';
          }
        };
        
        const mouseLeaveHandler = () => {
          const stateId = svgIdToStateId[svgId];
          onStateLeave();
          
          // Remove hover visual effect (only if not clicked)
          if (clickedState !== stateId) {
            region.style.fill = '#f79647';
            region.style.stroke = '#a34700';
            region.style.strokeWidth = '1';
            region.style.filter = 'none';
          }
        };

        const clickHandler = () => {
          const stateId = svgIdToStateId[svgId];
          console.log('Clicked:', stateId);
          onStateClick(stateId);
          
          // Visual feedback for click - dark colors
          region.style.fill = '#8b4513'; // Dark brown
          region.style.stroke = '#654321';
          region.style.strokeWidth = '4';
          region.style.filter = 'drop-shadow(0 0 12px rgba(139, 69, 19, 0.8))';
        };

        // Store references for cleanup
        node[`__mouseenter_${svgId}`] = mouseEnterHandler;
        node[`__mouseleave_${svgId}`] = mouseLeaveHandler;
        node[`__click_${svgId}`] = clickHandler;
        
        region.addEventListener('mouseenter', mouseEnterHandler);
        region.addEventListener('mouseleave', mouseLeaveHandler);
        region.addEventListener('click', clickHandler);
      }
    });

    node.__listenersAttached = true;

    // Cleanup function
    return () => {
      if (node.__listenersAttached) {
        Object.keys(svgIdToStateId).forEach(svgId => {
          const region = node.querySelector(`#${svgId}`);
          if (region && node[`__mouseenter_${svgId}`]) {
            region.removeEventListener('mouseenter', node[`__mouseenter_${svgId}`]);
            region.removeEventListener('mouseleave', node[`__mouseleave_${svgId}`]);
            region.removeEventListener('click', node[`__click_${svgId}`]);
          }
        });
      }
    };
  }, [onStateHover, onStateLeave, onStateClick, clickedState]);

  // Reset all states to default appearance
  useEffect(() => {
    if (!mapRef.current) return;
    
    const node = mapRef.current;
    Object.keys(svgIdToStateId).forEach(svgId => {
      const region = node.querySelector(`#${svgId}`);
      if (region) {
        region.style.fill = '#f79647';
        region.style.stroke = '#a34700';
        region.style.strokeWidth = '1';
        region.style.filter = 'none';
      }
    });
  }, []);

  return (
    <SnameMap
      ref={mapRef}
      style={{ 
        width: '100%', 
        maxWidth: 530, 
        maxHeight: 550, 
        objectFit: 'contain', 
        display: 'block',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
      }}
    />
  );
};



const StatewiseSection = () => {
  console.log('StatewiseSection component rendering...');
  const [hoveredState, setHoveredState] = useState(null);
  const [clickedState, setClickedState] = useState(null);
  const [isTableLocked, setIsTableLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  
  // Determine which state data to show
  const activeState = clickedState || hoveredState;
  const activeStateData = activeState ? statesData.find(s => s.id === activeState) : null;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleStateHover = (stateId) => {
    setHoveredState(stateId);
  };

  const handleStateLeave = () => {
    if (!isTableLocked) {
      setHoveredState(null);
    }
  };

  const handleStateClick = (stateId) => {
    if (isMobile) {
      navigate(`/state/${stateId}`);
      return;
    }
    if (clickedState === stateId) {
      setClickedState(null);
      setIsTableLocked(false);
    } else {
      setClickedState(stateId);
      setIsTableLocked(true);
    }
  };

  const unlockTable = () => {
    setClickedState(null);
    setIsTableLocked(false);
    setHoveredState(null);
  };

  return (
    <section className="py-6 md:py-10 bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
      
      {/* Section Header - hidden on mobile to save vertical space */}
      <div className="hidden md:block max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-4 md:mb-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-[15px] font-semibold mb-2 md:mb-3">
            <MapPin className="h-3 w-3 md:h-4 md:w-4" />
            State Directory
          </div>
          <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold md:font-extrabold text-gray-900 mb-2 md:mb-3 leading-tight">
            Find Numbers by <span className="text-orange-600">Indian States</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Access state-specific toll-free numbers, emergency services, and government helplines organized by location across India.
          </p>
          <div className="w-16 md:w-24 h-0.5 md:h-1 bg-orange-400 rounded-full mt-2 md:mt-4 mb-2" />
        </div>
      </div>

      {/* Mobile View - States Grid */}
      <div className="block md:hidden max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white/90 rounded-2xl overflow-hidden p-3 shadow-sm border border-gray-100">
          <MobileStatesGrid />
        </div>
      </div>

      {/* Desktop View - Original Map Layout */}
      <div className="hidden md:block max-w-9xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white/90 rounded-3xl shadow-2xl border border-orange-200 overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
          
          {/* Left column */}
          <div className="flex flex-col px-4 py-8 bg-gradient-to-b from-orange-50 to-white border-r border-orange-100 md:w-[335px] w-full">
            {/* Intro */}
            <div>
              <h2 className="text-2xl font-bold text-orange-700 mb-3">View All Statewise Numbers</h2>
              <p className="text-gray-700 mb-4 text-base">
                Browse the complete directory of helpline and emergency numbers for every Indian state and union territory.
              </p>
              <a
                href="/statewise-numbers"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow transition"
              >
                <ArrowRight className="h-5 w-5" />
                Browse Statewise Page
              </a>
            </div>

            {/* Stats Container */}
            <div className="flex flex-wrap justify-center gap-5 my-7">
              {stats.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center text-center flex-1 min-w-[90px]">
                  <span className="text-xl font-bold text-orange-600">{s.value}</span>
                  <span className="text-gray-700 text-xs">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Checklist */}
            <ul className="mt-3 space-y-2 text-gray-700 text-sm">
              <li className="flex items-center gap-2"><span className="text-orange-500">✔</span> 100% verified numbers</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">✔</span> Updated monthly</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">✔</span> Covers all states & UTs</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">✔</span> Emergency & utility contacts</li>
            </ul>
          </div>

          {/* Center column (SVG Map) */}
          <div className="flex flex-col flex-1 bg-transparent p-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-orange-700 text-center flex-1">
                {activeStateData ? `${activeStateData.name} ${clickedState ? '(Locked)' : '(Hovering)'}` : 'Indian States & UTs Emergency Map'}
              </h2>
              {isTableLocked && (
                <button
                  onClick={unlockTable}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow transition"
                  title="Unlock table"
                >
                  <Unlock className="h-4 w-4" />
                  Unlock
                </button>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div
                style={{
                  width: '100%',
                  maxWidth: 530,
                  maxHeight: 510,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '100px',
                }}
              >
                <InteractiveMap
                  onStateHover={handleStateHover}
                  onStateLeave={handleStateLeave}
                  onStateClick={handleStateClick}
                  hoveredState={hoveredState}
                  clickedState={clickedState}
                />
              </div>
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">
              <p>💡 <strong>Tip:</strong> Click on any state to lock the information panel. Hover over other states to compare data.</p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col justify-between items-center px-4 py-8 bg-gradient-to-b from-white to-orange-50 border-t md:border-t-0 md:border-l border-orange-100 md:w-[320px] w-full">
            <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-orange-700 sticky top-0 bg-white z-10">
                  {activeStateData ? `${activeStateData.name} Numbers` : 'State Information'}
                </h2>
                {isTableLocked && (
                  <Lock className="h-5 w-5 text-red-500" />
                )}
              </div>
              {activeStateData ? (
                <>
                  <div className="mb-4">
                    <img 
                      src={activeStateData.image} 
                      alt={activeStateData.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  </div>
                  <table className="w-full text-sm border border-orange-200 rounded-lg overflow-hidden bg-white shadow">
                    <tbody>
                      {activeStateData.info.map((row, idx) => (
                        <tr key={idx} className="even:bg-orange-50 hover:bg-orange-100 transition-colors">
                          <td className="font-semibold pr-2 py-2 text-gray-700 w-1/2 border-b border-orange-100">{row.label}</td>
                          <td className="py-2 text-gray-900 border-b border-orange-100 font-mono">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-3">
                    {isTableLocked 
                      ? "Table is locked. Click 'Unlock' or click the same state again to unlock." 
                      : "All numbers are regularly updated and verified for accuracy."
                    }
                  </p>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center text-gray-400 mb-4">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                    <span className="text-center">Hover over any state to see emergency numbers and information</span>
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
                        <tr key={idx} className="even:bg-orange-50 hover:bg-orange-100 transition-colors">
                          <td className="py-2 px-2 text-gray-700">{state.name}</td>
                          <td className="py-2 px-2 text-gray-900 font-mono">{state.info[0]?.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-3">Browse any state to see all helpline and emergency numbers.</p>
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