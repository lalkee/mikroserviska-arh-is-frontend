import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Location } from '../types/index';
import Modal from './Modal';
import { locationService } from '../services/locationService';

const CreateLocationCard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Location>({ name: '', address: '', capacity: 0 });
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    locationService.activate(() => {
      if (isEditMode && id) {
        locationService.fetchById(Number(id), (data: Location) => {
          setFormData(data);
          setLoading(false);
        });
      }
    });

    return () => locationService.deactivate();
  }, [id, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationService.isConnected) return;

    locationService.save(isEditMode ? { ...formData, id: Number(id) } : formData);
    navigate('/locations');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure?') && locationService.isConnected) {
      locationService.deleteLocation(Number(id));
      navigate('/locations');
    }
  };

  return (
    <Modal 
      isOpen 
      onClose={() => navigate('/locations')} 
      title={isEditMode ? "Edit Location" : "Add New Location"}
    >
      {loading ? (
        <div className="text-center py-10 text-neutral-400">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Location Name</label>
            <input 
              type="text" required className="input-field py-3 px-4 text-base" 
              placeholder="e.g. Grand Ballroom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Address</label>
            <input 
              type="text" required className="input-field py-3 px-4 text-base" 
              placeholder="e.g. 123 University St"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Capacity</label>
            <input 
              type="number" required className="input-field py-3 px-4 text-base" 
              placeholder="e.g. 200"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            {isEditMode && (
              <button 
                type="button" 
                onClick={handleDelete}
                className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button type="submit" className="flex-1 btn-primary py-4">
              {isEditMode ? "Update Location" : "Save Location"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateLocationCard;