import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import type { Speaker } from '../types/index';
import { speakerService } from '../services/api';

const SpeakersPage: React.FC = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpeakers = async () => {
    try {
      const response = await speakerService.getAll();
      setSpeakers(response.data);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, [locationPath.pathname]);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Speakers</h1>
        </div>
        <button onClick={() => navigate('/speakers/new')} className="btn-primary">
          Add Speaker
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400">Loading speakers...</div>
      ) : speakers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#eaeaea] rounded-xl text-neutral-400">
          No speakers found. Start by adding one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="card group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-lg font-bold text-neutral-400 group-hover:bg-black group-hover:text-white transition-colors">
                  {speaker.firstName[0]}{speaker.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">
                    {speaker.firstName} {speaker.lastName}
                  </h3>
                  <p className="text-sm text-neutral-500">{speaker.title}</p>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Expertise</label>
                <p className="text-sm font-medium">{speaker.expertise}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default SpeakersPage;
