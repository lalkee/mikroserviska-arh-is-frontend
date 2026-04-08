import React, { useState, useEffect, useRef } from 'react';
import { Client, Stomp } from '@stomp/stompjs';
import type { Location } from '../types/index';
import BaseCreateCard from './BaseCreateCard';

const CreateLocationCard: React.FC = () => {
  const stompRef = useRef<Client | null>(null);
  const isConnected = useRef(false);

  const pendingRequests = useRef<(() => void)[]>([]);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:15674/ws',
      connectHeaders: { login: 'guest', passcode: 'guest' },
      onConnect: () => {
        isConnected.current = true;
        console.log("STOMP client connected!");
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
    <BaseCreateCard<Location>
      title={{ create: "Add New Location", edit: "Edit Location" }}
      entityName="Location"
      initialData={{ name: '', address: '', capacity: 0 }}
      redirectPath="/locations"
      onFetch={(id) => mqRequest('/queue/location.get.id', '/queue/location.get.id.res', id)}
      onSave={async (id, data) => {
        const payload = id ? { ...data, id } : data;
        stompRef.current?.publish({ destination: '/queue/location.save', body: JSON.stringify(payload) });
      }}
      onDelete={async (id) => {
        stompRef.current?.publish({ destination: '/queue/location.delete', body: JSON.stringify(id) });
      }}
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