import React from 'react';
import { useNavigate } from 'react-router-dom';

const statesData = [
	{
		id: 'maharashtra',
		name: 'Maharashtra',
		image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
	},
	{
		id: 'delhi',
		name: 'Delhi',
		image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=300&h=200&fit=crop',
	},
	{
		id: 'karnataka',
		name: 'Karnataka',
		image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
	},
	{
		id: 'tamil_nadu',
		name: 'Tamil Nadu',
		image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
	},
	{
		id: 'andhra_pradesh',
		name: 'Andhra Pradesh',
		image: 'https://images.unsplash.com/photo-1583663848692-6b3f4764cf0b?fit=crop&w=300&h=200',
	},
	{
		id: 'arunachal_pradesh',
		name: 'Arunachal Pradesh',
		image: 'https://images.unsplash.com/photo-1625121342044-b3b94fd3f3b9?fit=crop&w=300&h=200',
	},
	{
		id: 'assam',
		name: 'Assam',
		image: 'https://images.unsplash.com/photo-1595847135932-27cba8e90d2b?fit=crop&w=300&h=200',
	},
	{
		id: 'bihar',
		name: 'Bihar',
		image: 'https://images.unsplash.com/photo-1598003789764-2a6d5272ab6c?fit=crop&w=300&h=200',
	},
	{
		id: 'chhattisgarh',
		name: 'Chhattisgarh',
		image: 'https://images.unsplash.com/photo-1620733100472-27c87b8e76ae?fit=crop&w=300&h=200',
	},
	{
		id: 'goa',
		name: 'Goa',
		image: 'https://images.unsplash.com/photo-1601275802430-4b7b8d7932c0?fit=crop&w=300&h=200',
	},
	{
		id: 'gujarat',
		name: 'Gujarat',
		image: 'https://images.unsplash.com/photo-1582721052784-4cc5df1944ec?fit=crop&w=300&h=200',
	},
	{
		id: 'haryana',
		name: 'Haryana',
		image: 'https://images.unsplash.com/photo-1646792006724-3cf61c56d93f?fit=crop&w=300&h=200',
	},
	{
		id: 'himachal_pradesh',
		name: 'Himachal Pradesh',
		image: 'https://images.unsplash.com/photo-1548013146-72479768bada?fit=crop&w=300&h=200',
	},
	{
		id: 'jharkhand',
		name: 'Jharkhand',
		image: 'https://images.unsplash.com/photo-1580137189272-c9379b0f6d0a?fit=crop&w=300&h=200',
	},
	{
		id: 'kerala',
		name: 'Kerala',
		image: 'https://images.unsplash.com/photo-1628164603882-80ae51cd74cc?fit=crop&w=300&h=200',
	},
	{
		id: 'madhya_pradesh',
		name: 'Madhya Pradesh',
		image: 'https://images.unsplash.com/photo-1603701973586-2c2acacdb138?fit=crop&w=300&h=200',
	},
	{
		id: 'manipur',
		name: 'Manipur',
		image: 'https://images.unsplash.com/photo-1582223151283-877dc7b2b8aa?fit=crop&w=300&h=200',
	},
	{
		id: 'meghalaya',
		name: 'Meghalaya',
		image: 'https://images.unsplash.com/photo-1608710449164-4a7cf6ea45fb?fit=crop&w=300&h=200',
	},
	{
		id: 'mizoram',
		name: 'Mizoram',
		image: 'https://images.unsplash.com/photo-1616052488425-2a785b42abbb?fit=crop&w=300&h=200',
	},
	{
		id: 'nagaland',
		name: 'Nagaland',
		image: 'https://images.unsplash.com/photo-1617032023622-3859651d4623?fit=crop&w=300&h=200',
	},
	{
		id: 'odisha',
		name: 'Odisha',
		image: 'https://images.unsplash.com/photo-1574169207510-8c4f5e6ffeb6?fit=crop&w=300&h=200',
	},
	{
		id: 'punjab',
		name: 'Punjab',
		image: 'https://images.unsplash.com/photo-1606813817202-7ff21d7d011a?fit=crop&w=300&h=200',
	},
	{
		id: 'rajasthan',
		name: 'Rajasthan',
		image: 'https://images.unsplash.com/photo-1585155777343-92a6e7422db5?fit=crop&w=300&h=200',
	},
	{
		id: 'sikkim',
		name: 'Sikkim',
		image: 'https://images.unsplash.com/photo-1624110052441-d1f7d01f55cb?fit=crop&w=300&h=200',
	},
	{
		id: 'telangana',
		name: 'Telangana',
		image: 'https://images.unsplash.com/photo-1600346025101-7c210c0cb2d4?fit=crop&w=300&h=200',
	},
	{
		id: 'tripura',
		name: 'Tripura',
		image: 'https://images.unsplash.com/photo-1632445487276-d75db8579c8c?fit=crop&w=300&h=200',
	},
	{
		id: 'uttar_pradesh',
		name: 'Uttar Pradesh',
		image: 'https://images.unsplash.com/photo-1594810909394-eae57a1808d5?fit=crop&w=300&h=200',
	},
	{
		id: 'uttarakhand',
		name: 'Uttarakhand',
		image: 'https://images.unsplash.com/photo-1612110806494-bc2b1e75c9cc?fit=crop&w=300&h=200',
	},
	{
		id: 'west_bengal',
		name: 'West Bengal',
		image: 'https://images.unsplash.com/photo-1606464714196-c4cc6615f4fa?fit=crop&w=300&h=200',
	},
	{
		id: 'chandigarh',
		name: 'Chandigarh',
		image: 'https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?fit=crop&w=300&h=200',
	},
	{
		id: 'jammu_kashmir',
		name: 'Jammu & Kashmir',
		image: 'https://images.unsplash.com/photo-1570696164395-426b7f3d5a70?fit=crop&w=300&h=200',
	},
	{
		id: 'ladakh',
		name: 'Ladakh',
		image: 'https://images.unsplash.com/photo-1623160937084-9a4c55dc5986?fit=crop&w=300&h=200',
	},
	{
		id: 'andaman_nicobar',
		name: 'Andaman & Nicobar',
		image: 'https://images.unsplash.com/photo-1608806307311-26c2c3f7926a?fit=crop&w=300&h=200',
	},
	{
		id: 'puducherry',
		name: 'Puducherry',
		image: 'https://images.unsplash.com/photo-1601034874029-3c04643f9e8f?fit=crop&w=300&h=200',
	},
	{
		id: 'dadra_nagar_haveli',
		name: 'Dadra & Nagar Haveli',
		image: 'https://images.unsplash.com/photo-1543832977-85db68f1b4df?fit=crop&w=300&h=200',
	}
];

const MobileStatesGrid = () => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.log('useNavigate not available, using fallback');
    navigate = (path) => console.log('Would navigate to:', path);
  }

  const handleStateClick = (stateId) => {
    // Demo route - you can replace this with actual routing later
    console.log(`Navigating to state: ${stateId}`);
    
    // For now, navigate to a demo route
    // You can replace this with your actual state routes later
    navigate(`/state/${stateId}`, { 
      state: { 
        stateId: stateId,
        stateName: statesData.find(s => s.id === stateId)?.name 
      } 
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center">Discover Indian States</h2>
      <p className="text-gray-600 mb-6 text-center">Top States</p>
      
      {/* Main Grid - Exactly 3 rows (12 states) */}
      <div className="grid grid-cols-4 gap-2 w-full mb-6">
        {statesData.slice(0, 12).map((state) => (
          <div
            key={state.id}
            onClick={() => handleStateClick(state.id)}
            className="cursor-pointer"
          >
            {/* Smaller square image */}
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={state.image}
                alt={state.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
              />
            </div>
            {/* State name */}
            <div className="mt-2 text-center">
              <h3 className="font-semibold text-gray-900 text-xs leading-tight">{state.name}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Horizontal Scrollable Row for Remaining States */}
      {statesData.length > 12 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">More States</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {statesData.slice(12).map((state) => (
                <div
                  key={state.id}
                  onClick={() => handleStateClick(state.id)}
                  className="cursor-pointer flex-shrink-0"
                  style={{ width: '120px' }}
                >
                  {/* Smaller image for scrollable row */}
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={state.image}
                      alt={state.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg"
                    />
                  </div>
                  {/* State name */}
                  <div className="mt-2 text-center">
                    <h3 className="font-semibold text-gray-900 text-xs leading-tight">{state.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          Tap any state to view details
        </p>
      </div>
    </div>
  );
};

export default MobileStatesGrid;
