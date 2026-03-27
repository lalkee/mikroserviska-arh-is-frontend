import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import type { Location } from '../types/index';
import { locationService } from '../services/api';

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
      console.error('Error fetching locations:', error);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Locations</h1>
          <p className="text-neutral-500">Manage event venues and their capacities.</p>
        </div>
        <button onClick={() => navigate('/locations/new')} className="btn-primary">
          Add Location
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400">Loading locations...</div>
      ) : locations.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#eaeaea] rounded-xl text-neutral-400">
          No locations found. Start by adding one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div key={loc.id} className="card">
              <h3 className="text-lg font-bold mb-1">{loc.name}</h3>
              <p className="text-sm text-neutral-500 mb-4">{loc.address}</p>
              <div className="flex items-center text-xs font-medium text-neutral-400 uppercase tracking-wider">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Capacity: {loc.capacity}
              </div>
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default LocationsPage;
