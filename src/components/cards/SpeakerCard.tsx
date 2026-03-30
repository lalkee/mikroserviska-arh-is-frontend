import React from 'react';
import type { Speaker } from '../../types';
import BaseCard from './BaseCard';

interface SpeakerCardProps {
  speaker: Speaker;
  onEdit?: (id: string) => void;
  className?: string;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, onEdit, className = "" }) => (
  <BaseCard id={speaker.id} onEdit={onEdit} className={className}>
    <div className="flex items-center gap-4 mb-4">
      <div>
        <h3 className="text-lg font-bold leading-tight">{speaker.firstName} {speaker.lastName}</h3>
        <p className="text-sm text-neutral-500">{speaker.title}</p>
      </div>
    </div>
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase text-neutral-400">Expertise</label>
      <p className="text-sm font-medium">{speaker.expertise}</p>
    </div>
  </BaseCard>
);

export default SpeakerCard;
