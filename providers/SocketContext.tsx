import React from "react";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const SocketContext = React.createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

type SocketProviderProps = {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const ENDPOINT = `${window.location.origin}/`;
  const socket = io(ENDPOINT, { transports: ["websocket", "polling"] });
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
