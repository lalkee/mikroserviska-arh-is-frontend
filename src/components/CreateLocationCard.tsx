import React from 'react';
import type { Location } from '../types/index';
import { locationService } from '../services/api';
import BaseCreateCard from './BaseCreateCard';

const CreateLocationCard: React.FC = () => {
  return (
    <BaseCreateCard<Location>
      title={{ create: "Add New Location", edit: "Edit Location" }}
      entityName="Location"
      initialData={{
        name: '',
        address: '',
        capacity: 0,
      }}
      redirectPath="/locations"
      onFetch={(id) => locationService.getById(id).then(res => res.data)}
      onSave={(id, data) => id ? locationService.update(id, data) : locationService.create(data)}
      onDelete={(id) => locationService.delete(id)}
    >
      {(newLocation, setNewLocation) => (
        <>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Location Name</label>
            <input 
              type="text" required className="input-field py-3 px-4 text-base" 
              placeholder="e.g. Grand Ballroom"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Address</label>
            <input 
              type="text" required className="input-field py-3 px-4 text-base" 
              placeholder="e.g. 123 University St"
              value={newLocation.address}
              onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Capacity</label>
            <input 
              type="number" required className="input-field py-3 px-4 text-base" 
              placeholder="e.g. 200"
              value={newLocation.capacity}
              onChange={(e) => setNewLocation({ ...newLocation, capacity: parseInt(e.target.value) })}
            />
          </div>
        </>
      )}
    </BaseCreateCard>
  );
};

export default CreateLocationCard;
