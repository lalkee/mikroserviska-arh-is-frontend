import React, { useState } from 'react';
import type { Event, Location, Speaker } from '../types/index';
import { eventService, locationService, speakerService } from '../services/api';
import BaseCreateCard from './BaseCreateCard';

const CreateEventCard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  const toggleSpeaker = (newEvent: Partial<Event>, setNewEvent: React.Dispatch<React.SetStateAction<Partial<Event>>>, speaker: Speaker) => {
    const current = newEvent.speakers || [];
    const exists = current.find(s => s.id === speaker.id);
    setNewEvent({
      ...newEvent,
      speakers: exists ? current.filter(s => s.id !== speaker.id) : [...current, speaker]
    });
  };

  return (
    <BaseCreateCard<Partial<Event>>
      title={{ create: "Create Event", edit: "Edit Event" }}
      entityName="Event"
      initialData={{
        name: '',
        agenda: '',
        dateTime: '',
        duration: '',
        registrationFee: 0,
        location: undefined,
        speakers: [],
      }}
      redirectPath="/events"
      onInitialize={async () => {
        const [locs, spks] = await Promise.all([
          locationService.getAll(),
          speakerService.getAll(),
        ]);
        setLocations(locs.data);
        setSpeakers(spks.data);
      }}
      onFetch={async (id) => {
        const res = await eventService.getById(id);
        const eventData = res.data;
        if (eventData.dateTime) {
          eventData.dateTime = eventData.dateTime.slice(0, 16);
        }
        return eventData;
      }}
      onSave={(id, data) => id ? eventService.update(id, data as Event) : eventService.create(data as Event)}
      onDelete={(id) => eventService.delete(id)}
      submitButtonText={{ create: "Publish Event", edit: "Update Event" }}
    >
      {(newEvent, setNewEvent, isEditMode) => (
        <>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Event Name</label>
            <input 
              type="text" required className="input-field py-3 px-4"
              value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Agenda</label>
            <textarea 
              required className="input-field min-h-25 py-3 px-4"
              value={newEvent.agenda} onChange={(e) => setNewEvent({ ...newEvent, agenda: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Date</label>
              <input 
                type="datetime-local" required className="input-field py-3 px-4"
                value={newEvent.dateTime} onChange={(e) => setNewEvent({ ...newEvent, dateTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Duration</label>
              <input 
                type="text" required className="input-field py-3 px-4"
                value={newEvent.duration} onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Fee</label>
              <input 
                type="number" required className="input-field py-3 px-4"
                value={newEvent.registrationFee} onChange={(e) => setNewEvent({ ...newEvent, registrationFee: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Location</label>
              <select 
                required className="input-field py-3 px-4"
                value={newEvent.location?.id || ''}
                onChange={(e) => setNewEvent({ ...newEvent, location: locations.find(l => l.id === parseInt(e.target.value)) })}
              >
                <option value="">Select Location</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-3 tracking-widest">Speakers</label>
            <div className="flex flex-wrap gap-3">
              {speakers.map(s => {
                const isSelected = newEvent.speakers?.some(sel => sel.id === s.id);
                return (
                  <button
                    key={s.id} type="button" onClick={() => toggleSpeaker(newEvent, setNewEvent, s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-neutral-500 border-[#eaeaea]'}`}
                  >
                    {s.firstName} {s.lastName}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </BaseCreateCard>
  );
};

export default CreateEventCard;
