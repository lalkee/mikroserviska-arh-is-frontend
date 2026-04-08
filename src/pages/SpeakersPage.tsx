import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import type { Speaker } from '../types/index';
import SpeakerCard from '../components/cards/SpeakerCard';

const SpeakersPage: React.FC = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:15674/ws',
      connectHeaders: { login: 'guest', passcode: 'guest' },
      onConnect: () => {
        // Subscribe to the response queue
        client.subscribe('/queue/speaker.get.all.res', (message) => {
          setSpeakers(JSON.parse(message.body));
          setLoading(false);
        });

        // Request all speakers
        client.publish({ destination: '/queue/speaker.get.all', body: JSON.stringify({}) });
      },
    });

    client.activate();
    return () => { client.deactivate(); };
  }, [locationPath.pathname]); // Dependency on locationPath.pathname ensures re-fetch on route change

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Speakers</h1>
        <button onClick={() => navigate('/speakers/new')} className="btn-primary">
          Add Speaker
        </button>
      </div>
      {loading ? (
        <div className="text-center py-20 text-neutral-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((speaker) => (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              onEdit={(id) => navigate(`/speakers/edit/${id}`)}
            />
          ))}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default SpeakersPage;