import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
// Import the service instead of the Stomp Client
import { eventService } from '../services/eventService';
import type { Event, Speaker, Location as AppLocation } from '../types/index';
import Modal from '../components/Modal';
import EventCard from '../components/cards/EventCard';
import SpeakerCard from '../components/cards/SpeakerCard';
import LocationCard from '../components/cards/LocationCard';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<AppLocation | null>(null);

  useEffect(() => {
    eventService.activate(() => {
      eventService.fetchAll((data) => {
        setEvents(data);
        setLoading(false);
      });
    });

    return () => {
      eventService.deactivate();
    };
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
            <EventCard
              key={event.id}
              event={event}
              onEdit={(id) => navigate(`/events/edit/${id}`)}
              onSelectLocation={setSelectedLocation}
              onSelectSpeaker={setSelectedSpeaker}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedSpeaker}
        onClose={() => setSelectedSpeaker(null)}
        title="Speaker Details"
      >
        {selectedSpeaker && <SpeakerCard speaker={selectedSpeaker} />}
      </Modal>

      <Modal
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        title="Location Details"
      >
        {selectedLocation && <LocationCard location={selectedLocation} />}
      </Modal>

      <Outlet />
    </div>
  );
};

export default EventsPage;