import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Event, Location, Speaker } from '../types/index';
import Modal from './Modal';
import { eventService } from '../services/eventService';
import { locationService } from '../services/locationService';
import { speakerService } from '../services/speakerService';

const CreateEventCard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<Event>>({
    name: '',
    agenda: '',
    dateTime: '',
    duration: '',
    registrationFee: 0,
    location: undefined,
    speakers: [],
  });
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    eventService.activate(() => {
      // Fetch support data
      locationService.fetchAll((locs) => setLocations(locs || []));
      speakerService.fetchAll((spks) => setSpeakers(spks || []));

      if (isEditMode && id) {
        eventService.fetchById(Number(id), (data, err) => {
          if (err) {
            setError(err);
          } else if (data) {
            if (data.dateTime) {
              data.dateTime = data.dateTime.slice(0, 16);
            }
            setFormData(data);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      eventService.deactivate();
    };
  }, [id, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventService.isConnected) return;

    const payload = {
      name: formData.name,
      agenda: formData.agenda,
      dateTime: formData.dateTime,
      duration: formData.duration,
      registrationFee: formData.registrationFee,
      locationId: formData.location?.id,
      speakerIds: formData.speakers?.map(s => s.id) || [],
      ...(isEditMode && { id: Number(id) }) 
    };

    eventService.save(payload as any, (_, err) => {
      if (err) {
        setError(err);
      } else {
        navigate('/events');
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure?') && eventService.isConnected) {
      eventService.deleteEvent(Number(id));
      navigate('/events');
    }
  };

  const toggleSpeaker = (speaker: Speaker) => {
    const current = formData.speakers || [];
    const exists = current.find(s => s.id === speaker.id);

    setFormData({
      ...formData,
      speakers: exists
        ? current.filter(s => s.id !== speaker.id)
        : [...current, speaker],
    });
  };

  return (
    <Modal 
      isOpen 
      onClose={() => navigate('/events')} 
      title={isEditMode ? "Edit Event" : "Create Event"}
    >
      {loading ? (
        <div className="text-center py-10 text-neutral-400">Loading...</div>
      ) : error ? (
        <div className="text-center py-10">
          <div className="text-red-500 font-medium mb-4">Error: {error}</div>
          <button 
            onClick={() => navigate('/events')}
            className="text-sm text-neutral-500 underline"
          >
            Back to Events
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Event Name</label>
            <input 
              type="text" required className="input-field py-3 px-4" 
              value={formData?.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Agenda</label>
            <textarea 
              required className="input-field min-h-25 py-3 px-4" 
              value={formData?.agenda || ''}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Date</label>
              <input 
                type="datetime-local" required className="input-field py-3 px-4" 
                value={formData?.dateTime || ''}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Duration</label>
              <input 
                type="text" required className="input-field py-3 px-4" 
                value={formData?.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Fee</label>
              <input 
                type="number" required className="input-field py-3 px-4" 
                value={formData?.registrationFee || 0}
                onChange={(e) => setFormData({ ...formData, registrationFee: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Location</label>
              <select 
                required className="input-field py-3 px-4"
                value={formData?.location?.id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  location: locations.find(l => l.id === parseInt(e.target.value))
                })}
              >
                <option value="">Select Location</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-3 tracking-widest">Speakers</label>
            <div className="flex flex-wrap gap-3">
              {speakers.map(s => {
                const isSelected = formData?.speakers?.some(sel => sel.id === s.id);
                return (
                  <button
                    key={s.id} type="button"
                    onClick={() => toggleSpeaker(s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      isSelected ? 'bg-black text-white border-black' : 'bg-white text-neutral-500 border-[#eaeaea]'
                    }`}
                  >
                    {s.firstName} {s.lastName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            {isEditMode && (
              <button 
                type="button" onClick={handleDelete}
                className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button type="submit" className="flex-1 btn-primary py-4">
              {isEditMode ? "Update Event" : "Publish Event"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateEventCard;