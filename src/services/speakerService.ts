import { type IMessage } from '@stomp/stompjs';
import { sharedClient } from './stompClient';
import type { Speaker } from '../types/index';

class SpeakerService {
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

  fetchAll(callback: (data: Speaker[]) => void) {
    this.requestResponse('speaker.get.all', 'speaker.get.all.res', {}, callback);
  }

  fetchById(id: number, callback: (data: Speaker) => void) {
    this.requestResponse('speaker.get.id', 'speaker.get.id.res', id, callback);
  }

  save(speaker: Speaker) {
    this.client.publish({
      destination: 'speaker.save',
      headers: { 'correlation-id': crypto.randomUUID() },
      body: JSON.stringify(speaker),
    });
  }

  deleteSpeaker(id: number) {
    this.client.publish({
      destination: 'speaker.delete',
      headers: { 'correlation-id': crypto.randomUUID() },
      body: JSON.stringify(id),
    });
  }

  get isConnected() {
    return this.client.connected;
  }
}

export const speakerService = new SpeakerService();