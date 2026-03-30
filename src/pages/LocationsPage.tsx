import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import type { Location } from '../types/index';
import { locationService } from '../services/api';
import LocationCard from '../components/cards/LocationCard';

const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const response = await locationService.getAll();
      setLocations(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [locationPath.pathname]);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Locations</h1>
        <button onClick={() => navigate('/locations/new')} className="btn-primary">
          Add Location
        </button>
      </div>
      {loading ? (
        <div className="text-center py-20 text-neutral-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <LocationCard 
              key={loc.id} 
              location={loc} 
              onEdit={(id) => navigate(`/locations/edit/${id}`)}
            />
          ))}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default LocationsPage;