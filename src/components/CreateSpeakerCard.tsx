import React from 'react';
import type { Speaker } from '../types/index';
import { speakerService } from '../services/api';
import BaseCreateCard from './BaseCreateCard';

const CreateSpeakerCard: React.FC = () => {
  return (
    <BaseCreateCard<Speaker>
      title={{ create: "Add Professional Speaker", edit: "Edit Professional Speaker" }}
      entityName="Speaker"
      initialData={{
        firstName: '',
        lastName: '',
        title: '',
        expertise: '',
      }}
      redirectPath="/speakers"
      onFetch={(id) => speakerService.getById(id).then(res => res.data)}
      onSave={(id, data) => id ? speakerService.update(id, data) : speakerService.create(data)}
      onDelete={(id) => speakerService.delete(id)}
    >
      {(newSpeaker, setNewSpeaker) => (
        <>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">First Name</label>
              <input 
                type="text" required className="input-field py-3 px-4 text-base" 
                placeholder="Jane"
                value={newSpeaker.firstName}
                onChange={(e) => setNewSpeaker({ ...newSpeaker, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Last Name</label>
              <input 
                type="text" required className="input-field py-3 px-4 text-base" 
                placeholder="Doe"
                value={newSpeaker.lastName}
                onChange={(e) => setNewSpeaker({ ...newSpeaker, lastName: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Professional Title</label>
            <input 
              type="text" required className="input-field py-3 px-4 text-base" 
              placeholder="e.g. Professor, PhD"
              value={newSpeaker.title}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Expertise Areas</label>
            <textarea 
              required className="input-field min-h-30 py-3 px-4 text-base" 
              placeholder="e.g. Machine Learning, AI Ethics"
              value={newSpeaker.expertise}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, expertise: e.target.value })}
            />
          </div>
        </>
      )}
    </BaseCreateCard>
  );
};

export default CreateSpeakerCard;
