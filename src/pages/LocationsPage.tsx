import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs'; // Added
import type { Location } from '../types/index';
import LocationCard from '../components/cards/LocationCard';

const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:15674/ws',
      connectHeaders: { login: 'guest', passcode: 'guest' },
      onConnect: () => {
        client.subscribe('/queue/location.get.all.res', (message) => {
          setLocations(JSON.parse(message.body));
          setLoading(false);
        });

        client.publish({ destination: '/queue/location.get.all', body: JSON.stringify({}) });
      },
    });

    client.activate();
    return () => { client.deactivate(); };
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