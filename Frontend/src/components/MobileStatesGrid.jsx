import React from 'react';
import { useNavigate } from 'react-router-dom';

const statesData = [
	{
		id: 'andhra-pradesh',
		name: 'Andhra Pradesh',
		image: '/images/states/andhra-pradesh.webp',
		alt: 'Beautiful landscape of Andhra Pradesh state with scenic views and cultural heritage',
		link: '/state/andhra-pradesh'
	},
	{
		id: 'arunachal-pradesh',
		name: 'Arunachal Pradesh',
		image: '/images/states/arunachal-pradesh.webp',
		alt: 'Stunning mountain ranges and valleys of Arunachal Pradesh, India\'s northeastern state',
		link: '/state/arunachal-pradesh'
	},
	{
		id: 'assam',
		name: 'Assam',
		image: '/images/states/assam.webp',
		alt: 'Lush tea gardens and Brahmaputra river views of Assam state in northeastern India',
		link: '/state/assam'
	},
	{
		id: 'bihar',
		name: 'Bihar',
		image: '/images/states/bihar.webp',
		alt: 'Ancient temples and historical monuments of Bihar, showcasing rich cultural heritage',
		link: '/state/bihar'
	},
	{
		id: 'chhattisgarh',
		name: 'Chhattisgarh',
		image: '/images/states/chhattisgarh.webp',
		alt: 'Tribal culture and natural beauty of Chhattisgarh state with waterfalls and forests',
		link: '/state/chhattisgarh'
	},
	{
		id: 'goa',
		name: 'Goa',
		image: '/images/states/goa.webp',
		alt: 'Sunny beaches and Portuguese architecture of Goa, India\'s coastal paradise',
		link: '/state/goa'
	},
	{
		id: 'gujarat',
		name: 'Gujarat',
		image: '/images/states/gujarat.webp',
		alt: 'Statue of Unity and vibrant culture of Gujarat state with rich traditions',
		link: '/state/gujarat'
	},
	{
		id: 'haryana',
		name: 'Haryana',
		image: '/images/states/haryana.webp',
		alt: 'Agricultural landscapes and modern development of Haryana state in northern India',
		link: '/state/haryana'
	},
	{
		id: 'himachal-pradesh',
		name: 'Himachal Pradesh',
		image: '/images/states/himachal-pradesh.webp',
		alt: 'Snow-capped Himalayas and scenic hill stations of Himachal Pradesh',
		link: '/state/himachal-pradesh'
	},
	{
		id: 'jammu-and-kashmir',
		name: 'Jammu & Kashmir',
		image: '/images/states/jammu-and-kashmir.webp',
		alt: 'Paradise on Earth - Dal Lake and majestic mountains of Jammu and Kashmir',
		link: '/state/jammu-and-kashmir'
	},
	{
		id: 'jharkhand',
		name: 'Jharkhand',
		image: '/images/states/jharkhand.webp',
		alt: 'Tribal heritage and natural resources of Jharkhand state with waterfalls',
		link: '/state/jharkhand'
	},
	{
		id: 'karnataka',
		name: 'Karnataka',
		image: '/images/states/karnataka.webp',
		alt: 'Ancient temples of Hampi and tech hub Bangalore in Karnataka state',
		link: '/state/karnataka'
	},
	{
		id: 'kerala',
		name: 'Kerala',
		image: '/images/states/kerala.webp',
		alt: 'Backwaters and coconut groves of Kerala, God\'s Own Country',
		link: '/state/kerala'
	},
	{
		id: 'lakshwadweep',
		name: 'Lakshadweep',
		image: '/images/states/lakshwadweep.webp',
		alt: 'Coral reefs and pristine beaches of Lakshadweep islands in Arabian Sea',
		link: '/state/lakshadweep'
	},
	{
		id: 'madhya-pradesh',
		name: 'Madhya Pradesh',
		image: '/images/states/madhya-pradesh.webp',
		alt: 'Heart of India - ancient temples and wildlife sanctuaries of Madhya Pradesh',
		link: '/state/madhya-pradesh'
	},
	{
		id: 'maharashtra',
		name: 'Maharashtra',
		image: '/images/states/maharahstra.webp',
		alt: 'Gateway of India and diverse landscapes of Maharashtra state',
		link: '/state/maharashtra'
	},
	{
		id: 'manipur',
		name: 'Manipur',
		image: '/images/states/manipur.webp',
		alt: 'Floating islands and cultural diversity of Manipur in northeastern India',
		link: '/state/manipur'
	},
	{
		id: 'meghalaya',
		name: 'Meghalaya',
		image: '/images/states/meghalaya.webp',
		alt: 'Living root bridges and wettest place on Earth - Meghalaya state',
		link: '/state/meghalaya'
	},
	{
		id: 'mizoram',
		name: 'Mizoram',
		image: '/images/states/mizzoram.webp',
		alt: 'Rolling hills and tribal culture of Mizoram in northeastern India',
		link: '/state/mizoram'
	},
	{
		id: 'nagaland',
		name: 'Nagaland',
		image: '/images/states/nagaland.webp',
		alt: 'Hornbill festival and tribal traditions of Nagaland state',
		link: '/state/nagaland'
	},
	{
		id: 'odisha',
		name: 'Odisha',
		image: '/images/states/odisha.webp',
		alt: 'Temple architecture and coastal beauty of Odisha state',
		link: '/state/odisha'
	},
	{
		id: 'puducherry',
		name: 'Puducherry',
		image: '/images/states/ponducherry.webp',
		alt: 'French colonial charm and beaches of Puducherry union territory',
		link: '/state/puducherry'
	},
	{
		id: 'punjab',
		name: 'Punjab',
		image: '/images/states/punjab.webp',
		alt: 'Golden Temple and agricultural prosperity of Punjab state',
		link: '/state/punjab'
	},
	{
		id: 'rajasthan',
		name: 'Rajasthan',
		image: '/images/states/rajasthan.webp',
		alt: 'Desert forts and royal heritage of Rajasthan, the Land of Kings',
		link: '/state/rajasthan'
	},
	{
		id: 'sikkim',
		name: 'Sikkim',
		image: '/images/states/sikhim.webp',
		alt: 'Buddhist monasteries and Himalayan beauty of Sikkim state',
		link: '/state/sikkim'
	},
	{
		id: 'tamil-nadu',
		name: 'Tamil Nadu',
		image: '/images/states/tamil-nadu.webp',
		alt: 'Ancient Dravidian temples and cultural heritage of Tamil Nadu',
		link: '/state/tamil-nadu'
	},
	{
		id: 'telangana',
		name: 'Telangana',
		image: '/images/states/telangana.webp',
		alt: 'Hyderabad city and historical monuments of Telangana state',
		link: '/state/telangana'
	},
	{
		id: 'tripura',
		name: 'Tripura',
		image: '/images/states/tirpura.webp',
		alt: 'Palace architecture and tribal culture of Tripura state',
		link: '/state/tripura'
	},
	{
		id: 'uttar-pradesh',
		name: 'Uttar Pradesh',
		image: '/images/states/uttar-pradesh.webp',
		alt: 'Taj Mahal and spiritual heritage of Uttar Pradesh state',
		link: '/state/uttar-pradesh'
	},
	{
		id: 'uttarakhand',
		name: 'Uttarakhand',
		image: '/images/states/uttrakhand.webp',
		alt: 'Char Dham pilgrimage sites and Himalayan beauty of Uttarakhand',
		link: '/state/uttarakhand'
	},
	{
		id: 'west-bengal',
		name: 'West Bengal',
		image: '/images/states/west-bengal.webp',
		alt: 'Cultural capital Kolkata and Sundarbans of West Bengal state',
		link: '/state/west-bengal'
	},
	{
		id: 'chandigarh',
		name: 'Chandigarh',
		image: '/images/states/chandigarh.webp',
		alt: 'Modern planned city Chandigarh with Le Corbusier architecture',
		link: '/state/chandigarh'
	},
	{
		id: 'dadra-nagar-haveli',
		name: 'Dadra & Nagar Haveli',
		image: '/images/states/dadra-nagar-haveli.webp',
		alt: 'Portuguese colonial heritage and tribal culture of Dadra and Nagar Haveli',
		link: '/state/dadra-nagar-haveli'
	},
	{
		id: 'andaman-nicobar',
		name: 'Andaman & Nicobar',
		image: '/images/states/andaman-nicobar.webp',
		alt: 'Tropical islands and pristine beaches of Andaman and Nicobar Islands',
		link: '/state/andaman-nicobar'
	}
];

function MobileStatesGrid() {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.log('useNavigate not available, using fallback');
    navigate = (path) => console.log('Would navigate to:', path);
  }

  const handleStateClick = (stateId) => {
    console.log(`Navigating to state: ${stateId}`);
    navigate(`/state/${stateId}`, { 
      state: { 
        stateId: stateId,
        stateName: statesData.find(s => s.id === stateId)?.name 
      } 
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-orange-700 mb-3 text-center">Discover Indian States</h2>
      <p className="text-xs text-gray-600 mb-4 text-center">Top States</p>
      
      {/* Main Grid - Exactly 3 rows (12 states) */}
      <div className="grid grid-cols-4 gap-2 w-full mb-4">
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
                alt={state.alt}
                className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg ${
                  state.id === 'gujarat' ? 'object-top' : 'object-center'
                }`}
              />
            </div>
            {/* State name */}
            <div className="mt-1.5 text-center">
              <h3 className="font-medium text-gray-900 text-xs leading-tight">{state.name}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Horizontal Scrollable Row for Remaining States */}
      {statesData.length > 12 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">More States</h3>
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
                      alt={state.alt}
                      className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-lg ${
                  state.id === 'gujarat' ? 'object-top' : 'object-center'
                }`}
                    />
                  </div>
                  {/* State name */}
                  <div className="mt-1.5 text-center">
                    <h3 className="font-medium text-gray-900 text-xs leading-tight">{state.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-3">
        <p className="text-xs text-gray-500">
          Tap any state to view details
        </p>
      </div>
    </div>
  );
}

export default MobileStatesGrid;