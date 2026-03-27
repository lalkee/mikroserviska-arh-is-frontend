import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Location } from '../types/index';
import { locationService } from '../services/api';
import Modal from './Modal';

const CreateLocationCard: React.FC = () => {
  const navigate = useNavigate();
  const [newLocation, setNewLocation] = useState<Location>({
    name: '',
    address: '',
    capacity: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await locationService.create(newLocation);
      navigate('/locations');
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={() => navigate('/locations')} 
      title="Add New Location"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Location Name</label>
          <input 
            type="text" 
            required
            className="input-field py-3 px-4 text-base" 
            placeholder="e.g. Grand Ballroom"
            value={newLocation.name}
            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Address</label>
          <input 
            type="text" 
            required
            className="input-field py-3 px-4 text-base" 
            placeholder="e.g. 123 University St"
            value={newLocation.address}
            onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Capacity</label>
          <input 
            type="number" 
            required
            className="input-field py-3 px-4 text-base" 
            placeholder="e.g. 200"
            value={newLocation.capacity}
            onChange={(e) => setNewLocation({ ...newLocation, capacity: parseInt(e.target.value) })}
          />
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full btn-primary py-4 text-base shadow-lg shadow-black/5">
            Save Location
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateLocationCard;
