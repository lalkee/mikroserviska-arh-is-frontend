import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Speaker } from '../types/index';
import { speakerService } from '../services/api';
import Modal from './Modal';

const CreateSpeakerCard: React.FC = () => {
  const navigate = useNavigate();
  const [newSpeaker, setNewSpeaker] = useState<Speaker>({
    firstName: '',
    lastName: '',
    title: '',
    expertise: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await speakerService.create(newSpeaker);
      navigate('/speakers');
    } catch (error) {
      console.error('Error creating speaker:', error);
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={() => navigate('/speakers')} 
      title="Add Professional Speaker"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">First Name</label>
            <input 
              type="text" 
              required
              className="input-field py-3 px-4 text-base" 
              placeholder="Jane"
              value={newSpeaker.firstName}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Last Name</label>
            <input 
              type="text" 
              required
              className="input-field py-3 px-4 text-base" 
              placeholder="Doe"
              value={newSpeaker.lastName}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, lastName: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Professional Title</label>
          <input 
            type="text" 
            required
            className="input-field py-3 px-4 text-base" 
            placeholder="e.g. Professor, PhD"
            value={newSpeaker.title}
            onChange={(e) => setNewSpeaker({ ...newSpeaker, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Expertise Areas</label>
          <textarea 
            required
            className="input-field min-h-[120px] py-3 px-4 text-base" 
            placeholder="e.g. Machine Learning, AI Ethics, Data Science"
            value={newSpeaker.expertise}
            onChange={(e) => setNewSpeaker({ ...newSpeaker, expertise: e.target.value })}
          />
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full btn-primary py-4 text-base shadow-lg shadow-black/5">
            Save Speaker
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSpeakerCard;
