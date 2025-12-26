import React, { createContext, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";


export const SocketContext = createContext(null);

// Custom hook for easy access
export const useSocket = () => useContext(SocketContext);

const socket = io(`${import.meta.env.VITE_BASE_URL}`);






const SocketProvider = ({ children }) => {
  

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected to the server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected from the server:", socket.id);
    });

    
  }, []);

  
  const recieveMessage = (event, callback) => {
    if (!socket) return;
    socket.on(event, callback);
  };

  
  const sendMessage = (event, message) => {
    if (!socket) return;
    socket.emit(event, message);
  };

  return (
    <SocketContext.Provider value={{ recieveMessage, sendMessage, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;