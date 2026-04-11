import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Speaker } from '../types/index';
import Modal from './Modal';
import { speakerService } from '../services/speakerService';

const CreateSpeakerCard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Speaker>({ 
    firstName: '', 
    lastName: '', 
    title: '', 
    expertise: '' 
  });
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    speakerService.activate(() => {
      if (isEditMode && id) {
        speakerService.fetchById(Number(id), (data: Speaker) => {
          setFormData(data);
          setLoading(false);
        });
      }
    });

    return () => speakerService.deactivate();
  }, [id, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!speakerService.isConnected) return;

    speakerService.save(isEditMode ? { ...formData, id: Number(id) } : formData);
    navigate('/speakers');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure?') && speakerService.isConnected) {
      speakerService.deleteSpeaker(Number(id));
      navigate('/speakers');
    }
  };

  return (
    <Modal 
      isOpen 
      onClose={() => navigate('/speakers')} 
      title={isEditMode ? "Edit Speaker" : "Add New Speaker"}
    >
      {loading ? (
        <div className="text-center py-10 text-neutral-400">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">First Name</label>
              <input 
                type="text" required className="input-field py-3 px-4" 
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Last Name</label>
              <input 
                type="text" required className="input-field py-3 px-4" 
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Professional Title</label>
            <input 
              type="text" required className="input-field py-3 px-4" 
              placeholder="e.g. Senior Software Architect"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Expertise</label>
            <input 
              type="text" required className="input-field py-3 px-4" 
              placeholder="e.g. Distributed Systems, Cloud Native"
              value={formData.expertise || ''}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
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
              {isEditMode ? "Update Speaker" : "Save Speaker"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CreateSpeakerCard;