import React from 'react';
import type { Event, Speaker, Location } from '../../types';
import BaseCard from './BaseCard';

interface EventCardProps {
  event: Event;
  onEdit?: (id: string) => void;
  onSelectLocation?: (location: Location) => void;
  onSelectSpeaker?: (speaker: Speaker) => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onSelectLocation, 
  onSelectSpeaker, 
  className = "" 
}) => {
  return (
    <BaseCard id={event.id} onEdit={onEdit} className={`flex flex-col md:flex-row gap-8 items-start ${className}`}>
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
          <button 
            onClick={() => {
              if (event.location && onSelectLocation) {
                onSelectLocation(event.location);
              }
            }}
            className="flex items-center text-neutral-500 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.location?.name || "No location set"}
          </button>
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
            <button 
              key={s.id} 
              onClick={() => onSelectSpeaker?.(s)}
              className="text-xs font-medium hover:text-blue-600 text-left transition-colors"
            >
              {s.firstName} {s.lastName}
            </button>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};

export default EventCard;