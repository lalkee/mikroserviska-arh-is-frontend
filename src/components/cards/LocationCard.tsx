import React from 'react';
import type { Location } from '../../types';
import BaseCard from './BaseCard';

interface LocationCardProps {
  location: Location;
  onEdit?: (id: string) => void;
  className?: string;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onEdit, className = "" }) => (
  <BaseCard id={location.id} onEdit={onEdit} className={className}>
    <h3 className="text-lg font-bold mb-1">{location.name}</h3>
    <p className="text-sm text-neutral-500 mb-4">{location.address}</p>
    <div className="flex items-center text-xs font-medium text-neutral-400 uppercase tracking-wider">
      Capacity: {location.capacity}
    </div>
  </BaseCard>
);

export default LocationCard;
