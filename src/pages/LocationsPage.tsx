import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { locationService } from '../services/locationService';
import type { Location } from '../types/index';
import LocationCard from '../components/cards/LocationCard';

const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    locationService.activate(() => {
      locationService.fetchAll((data, err) => {
        if (err) {
          setError(err);
        } else if (data) {
          setLocations(data);
        }
        setLoading(false);
      });
    });

    return () => locationService.deactivate();
  }, []);

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
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-medium">
          Error: {error}
        </div>
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