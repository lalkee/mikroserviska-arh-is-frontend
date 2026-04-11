import { type IMessage } from '@stomp/stompjs';
import { sharedClient } from './stompClient';
import type { Location } from '../types/index';

class LocationService {
  private client = sharedClient;

  activate(onConnect: () => void) {
    this.client.onConnect = onConnect;
    this.client.activate();
  }

  deactivate() {
    this.client.deactivate();
  }

  private requestResponse(destination: string, replyTo: string, body: any, callback: (data: any) => void) {
    const correlationId = crypto.randomUUID();

    const subscription = this.client.subscribe(replyTo, (message: IMessage) => {
      if (message.headers['correlation-id'] === correlationId) {
        callback(JSON.parse(message.body));
        subscription.unsubscribe();
      }
    });

    this.client.publish({
      destination,
      headers: { 
        'reply-to': replyTo,
        'correlation-id': correlationId 
      },
      body: JSON.stringify(body),
    });
  }

  fetchAll(callback: (data: Location[]) => void) {
    this.requestResponse('location.get.all', 'location.get.all.res', {}, callback);
  }

  fetchById(id: number, callback: (data: Location) => void) {
    this.requestResponse('location.get.id', 'location.get.id.res', id, callback);
  }

  save(location: Location) {
    this.client.publish({
      destination: 'location.save',
      headers: { 'correlation-id': crypto.randomUUID() },
      body: JSON.stringify(location),
    });
  }

  deleteLocation(id: number) {
    this.client.publish({
      destination: 'location.delete',
      headers: { 'correlation-id': crypto.randomUUID() },
      body: JSON.stringify(id),
    });
  }

  get isConnected() {
    return this.client.connected;
  }
}

export const locationService = new LocationService();