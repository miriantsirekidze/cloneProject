import { useQuery } from '@tanstack/react-query';

type LocationData = {
  city: string;
  country: string;
};

const fetchLocationName = async (lat: number, long: number): Promise<LocationData> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`,
    {
      headers: { 'User-Agent': 'MyReactNativeApp/1.0' },
    },
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return {
    city:
      data.address.city ||
      data.address.town ||
      data.address.village ||
      'Unknown',
    country: data.address.country || 'Unknown',
  };
};

export const useGetCityAndCountry = (lat: number | null, long: number | null) => {
  return useQuery({
    queryKey: ['countryAndCity', lat, long],
    queryFn: () => fetchLocationName(lat!, long!),
    enabled: !!lat && !!long, 
  });
};