import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import type { Event } from '../types/index';
import { eventService } from '../services/api';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const eventsRes = await eventService.getAll();
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [locationPath.pathname]);

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Events</h1>
        <button onClick={() => navigate('/events/new')} className="btn-primary">
          Create Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400">Loading...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#eaeaea] rounded-xl text-neutral-400">
          No events scheduled.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {events.map((event) => (
            <div key={event.id} className="card flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-neutral-100 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                    {new Date(event.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-sm text-neutral-500 font-medium">{event.duration}</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">{event.name}</h2>
                <p className="text-neutral-600 mb-6 max-w-2xl">{event.agenda}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center text-neutral-500">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location?.name}, {event.location?.address}
                  </div>
                  <div className="flex items-center text-neutral-500">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fee: {event.registrationFee} RSD
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-64 border-l border-[#eaeaea] pl-0 md:pl-8 mt-6 md:mt-0">
                <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block mb-4">Speakers</label>
                <div className="flex flex-wrap md:flex-col gap-3">
                  {event.speakers?.map(s => (
                    <div key={s.id} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold">
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <span className="text-xs font-medium">{s.firstName} {s.lastName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default EventsPage;
