import { useLocalStorage } from "@mantine/hooks";
import React, { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const GetSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [user] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });

  const socket = useMemo(() => {
    if (user?.token) {
      return io(import.meta.env.VITE_BACKEND_URL, {
        query: { userId: user._id },
      });
    }
    return null; // Si no hay token, devolver null
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, GetSocket };
