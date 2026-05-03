import { type IMessage } from '@stomp/stompjs';
import { sharedClient } from './stompClient';
import type { Event, Speaker } from '../types/index';

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
    this.requestResponse('event.get.all', 'event.get.all.res', {}, (events: Event[]) => {
      if (!events || events.length === 0) {
        callback([]);
        return;
      }

      const eventIds = events.map(e => e.id).filter((id): id is number => id !== undefined);

      this.requestResponse('speaker.get.byEventIds', 'speaker.get.byEventIds.res', eventIds, (speakerGroups: Speaker[][]) => {
        events.forEach((event, index) => {
          event.speakers = speakerGroups[index] || [];
        });
        callback(events);
      });
    });
  }

  fetchById(id: number, callback: (data: Event) => void) {
    this.requestResponse('event.get.id', 'event.get.id.res', id, callback);
  }

  // uses request-response pattern so it waits until update is finnished before updating ui
  save(event: any, callback: (data: any) => void) {
    this.requestResponse('event.save', 'event.save.res', event, (data) => {
      callback(data);
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