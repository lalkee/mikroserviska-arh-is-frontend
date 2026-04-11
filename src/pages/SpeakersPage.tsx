import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { speakerService } from '../services/speakerService';
import type { Speaker } from '../types/index';
import SpeakerCard from '../components/cards/SpeakerCard';

const SpeakersPage: React.FC = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    speakerService.activate(() => {
      speakerService.fetchAll((data) => {
        setSpeakers(data);
        setLoading(false);
      });
    });

    return () => {
      speakerService.deactivate();
    };
  }, [locationPath.pathname]);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Speakers</h1>
        <button 
          onClick={() => navigate('/speakers/new')} 
          className="btn-primary"
        >
          Add Speaker
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400">Loading...</div>
      ) : speakers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#eaeaea] rounded-xl text-neutral-400">
          No speakers registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="relative group">
              <button
                onClick={() => navigate(`/speakers/edit/${speaker.id}`)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-lg text-neutral-400 hover:text-black  transition-all opacity-0 group-hover:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              
              <SpeakerCard speaker={speaker} />
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default SpeakersPage;