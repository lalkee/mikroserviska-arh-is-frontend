import { type IMessage } from '@stomp/stompjs';
import { sharedClient } from './stompClient';
import type { Event } from '../types/index';

class EventService {
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

  fetchAll(callback: (data: Event[]) => void) {
    this.requestResponse('event.get.all', 'event.get.all.res', {}, callback);
  }

  fetchById(id: number, callback: (data: Event) => void) {
    this.requestResponse('event.get.id', 'event.get.id.res', id, callback);
  }

  save(event: Event) {
    this.client.publish({
      destination: 'event.save',
      headers: { 'correlation-id': crypto.randomUUID() },
      body: JSON.stringify(event),
    });
  }

  deleteEvent(id: number) {
    this.client.publish({
      destination: 'event.delete',
      headers: { 'correlation-id': crypto.randomUUID() },
      body: JSON.stringify(id),
    });
  }

  get isConnected() {
    return this.client.connected;
  }
}

export const eventService = new EventService();