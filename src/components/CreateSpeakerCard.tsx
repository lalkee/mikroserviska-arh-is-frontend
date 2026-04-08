import React, { useState, useEffect, useRef } from 'react';
import { Client, Stomp } from '@stomp/stompjs';
import type { Speaker } from '../types/index';
import BaseCreateCard from './BaseCreateCard';

const CreateSpeakerCard: React.FC = () => {
  const stompRef = useRef<Client | null>(null);
  const isConnected = useRef(false);

  const pendingRequests = useRef<(() => void)[]>([]);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:15674/ws',
      connectHeaders: { login: 'guest', passcode: 'guest' },
      onConnect: () => {
        isConnected.current = true;
        console.log("STOMP client connected");
        pendingRequests.current.forEach(request => request());
        pendingRequests.current = [];
      },
      onStompError: (frame) => {
        console.error('Error: ' + frame.headers['message']);
        isConnected.current = false;
      },
      onWebSocketClose: () => {
        console.log("Websocket closed");
        isConnected.current = false;
      }
    });

    client.activate();
    stompRef.current = client;

    return () => { client.deactivate(); };
  }, []);

  const mqRequest = (destination: string, responseQueue: string, body: any) => {
    return new Promise<any>((resolve, reject) => {
      const executeRequest = () => {
        const sub = stompRef.current?.subscribe(responseQueue, (msg) => {
            sub?.unsubscribe();
            try {
                const parsedBody = JSON.parse(msg.body);
                resolve(parsedBody);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                reject(new Error(`Error parsing JSON: ${errorMessage}`));
            }
        });
        stompRef.current?.publish({ destination, body: JSON.stringify(body) });
      };

      if (isConnected.current && stompRef.current?.connected) {
        executeRequest();
      } else {
        pendingRequests.current.push(executeRequest);
      }
    });
  };

  return (
    <BaseCreateCard<Speaker>
      title={{ create: "Add New Speaker", edit: "Edit Speaker" }}
      entityName="Speaker"
      initialData={{ firstName: '', lastName: '', title: '', expertise: '' }}
      redirectPath="/speakers"
      onFetch={(id) => mqRequest('/queue/speaker.get.id', '/queue/speaker.get.id.res', id)}
      onSave={async (id, data) => {
        const payload = id ? { ...data, id } : data;
        stompRef.current?.publish({ destination: '/queue/speaker.save', body: JSON.stringify(payload) });
      }}
      onDelete={async (id) => {
        stompRef.current?.publish({ destination: '/queue/speaker.delete', body: JSON.stringify(id) });
      }}
    >
      {(newSpeaker, setNewSpeaker) => (
        <>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">First Name</label>
            <input
              type="text" required className="input-field py-3 px-4 text-base"
              placeholder="e.g. John"
              value={newSpeaker.firstName}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Last Name</label>
            <input
              type="text" required className="input-field py-3 px-4 text-base"
              placeholder="e.g. Doe"
              value={newSpeaker.lastName}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, lastName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Title</label>
            <input
              type="text" required className="input-field py-3 px-4 text-base"
              placeholder="e.g. Software Engineer"
              value={newSpeaker.title}
              onChange={(e) => setNewSpeaker({ ...newSpeaker, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2 tracking-widest">Expertise</label>
            <input
              type="text" required className="input-field py-3 px-4 text-base"
              placeholder="e.g. Microservices, Cloud Computing"
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
