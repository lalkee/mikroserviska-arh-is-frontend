import { Client } from '@stomp/stompjs';

export const sharedClient = new Client({
  brokerURL: 'ws://localhost:15674/ws',
  connectHeaders: { login: 'guest', passcode: 'guest' },
});