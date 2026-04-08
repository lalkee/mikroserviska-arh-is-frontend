import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

/**
 * MQTest Component
 * Sends messages to 'react_to_spring' and receives from 'spring_to_react'.
 */
const MQTest: React.FC = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    // 1. Setup the STOMP client for WebSocket communication
    const client = new Client({
      brokerURL: 'ws://localhost:15674/ws',
      connectHeaders: {
        login: 'guest',
        passcode: 'guest',
      },
      onConnect: () => {
        console.log('Successfully connected to RabbitMQ via Web-STOMP');
        
        // 2. Subscribe to the queue coming FROM Spring
        // Use headers to match Spring's durable/non-autodelete settings
        client.subscribe('/queue/spring_to_react', (message) => {
          if (message.body) {
            // Logs incoming messages from Spring to the console
            console.log(' [x] Received from Spring:', message.body);
          }
        }, { 
          durable: 'true', 
          'auto-delete': 'false' 
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Broker Error:', frame.headers['message']);
      },
    });

    client.activate();
    setStompClient(client);

    // Cleanup on component unmount
    return () => {
      if (client.active) client.deactivate();
    };
  }, []);

  const sendGenericMessage = () => {
    if (stompClient && stompClient.connected) {
      const payload = `Generic message sent at ${new Date().toLocaleTimeString()}`;
      
      // 3. Publish message to the queue Spring is listening to
      stompClient.publish({
        destination: '/queue/react_to_spring',
        body: payload,
        headers: { 
          // 'persistent' ensures the message is saved to disk in RabbitMQ
          persistent: 'true' 
        }
      });

      console.log(' [>] Sent to Spring:', payload);
    } else {
      console.warn('STOMP client not connected.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <button 
        onClick={sendGenericMessage}
        style={{ 
          padding: '12px 24px', 
          fontSize: '16px', 
          cursor: 'pointer',
          borderRadius: '4px',
          border: '1px solid #333'
        }}
      >
        Send Generic Message
      </button>
    </div>
  );
};

export default MQTest;