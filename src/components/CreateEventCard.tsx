import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event, Location, Speaker } from '../types/index';
import { eventService, locationService, speakerService } from '../services/api';
import Modal from './Modal';

const CreateEventCard: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: '',
    agenda: '',
    dateTime: '',
    duration: '',
    registrationFee: 0,
    location: undefined,
    speakers: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, speakersRes] = await Promise.all([
          locationService.getAll(),
          speakerService.getAll(),
        ]);
        setLocations(locationsRes.data);
        setSpeakers(speakersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventService.create(newEvent as Event);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const toggleSpeaker = (speaker: Speaker) => {
    const currentSpeakers = newEvent.speakers || [];
    const exists = currentSpeakers.find(s => s.id === speaker.id);
    if (exists) {
      setNewEvent({ ...newEvent, speakers: currentSpeakers.filter(s => s.id !== speaker.id) });
    } else {
      setNewEvent({ ...newEvent, speakers: [...currentSpeakers, speaker] });
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={() => navigate('/events')} 
      title="Create Professional Event"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Event Name</label>
          <input 
            type="text" 
            required
            className="input-field py-3 px-4 text-base" 
            placeholder="e.g. Annual Tech Symposium"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Agenda & Description</label>
          <textarea 
            required
            className="input-field min-h-[100px] py-3 px-4 text-base" 
            placeholder="Detailed description of the event..."
            value={newEvent.agenda}
            onChange={(e) => setNewEvent({ ...newEvent, agenda: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Date & Time</label>
            <input 
              type="datetime-local" 
              required
              className="input-field py-3 px-4" 
              value={newEvent.dateTime}
              onChange={(e) => setNewEvent({ ...newEvent, dateTime: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Duration</label>
            <input 
              type="text" 
              required
              className="input-field py-3 px-4 text-base" 
              placeholder="e.g. 2 hours"
              value={newEvent.duration}
              onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Registration Fee ($)</label>
            <input 
              type="number" 
              required
              className="input-field py-3 px-4 text-base" 
              value={newEvent.registrationFee}
              onChange={(e) => setNewEvent({ ...newEvent, registrationFee: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Location</label>
            <select 
              required
              className="input-field py-3 px-4 text-base"
              value={newEvent.location?.id || ''}
              onChange={(e) => {
                const loc = locations.find(l => l.id === parseInt(e.target.value));
                setNewEvent({ ...newEvent, location: loc });
              }}
            >
              <option value="">Select Location</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-3 tracking-widest">Select Speakers</label>
          <div className="flex flex-wrap gap-3">
            {speakers.map(s => {
              const isSelected = newEvent.speakers?.some(selected => selected.id === s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSpeaker(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    isSelected 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-neutral-500 border-[#eaeaea] hover:border-black'
                  }`}
                >
                  {s.firstName} {s.lastName}
                </button>
              );
            })}
          </div>
        </div>
        <div className="pt-6">
          <button type="submit" className="w-full btn-primary py-4 text-base shadow-lg shadow-black/5">
            Publish Professional Event
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEventCard;
