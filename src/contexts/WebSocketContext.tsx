import React, { createContext, useContext, useState } from 'react';
import { CompatClient } from '@stomp/stompjs';

interface WebSocketContextType {
  client: CompatClient | null;
  connected: boolean;
  setClient: (client: CompatClient | null) => void;
  setConnected: (connected: boolean) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<CompatClient | null>(null);
  const [connected, setConnectedState] = useState(false);

  return (
    <WebSocketContext.Provider
      value={{
        client,
        connected,
        setClient,
        setConnected: setConnectedState,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
