import { useLocalStorage } from "@mantine/hooks";
import React, { createContext, useMemo } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const GetSocket = () => useContext(SocketContext);
const SocketProvider = ({ children }) => {
  const [user] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });

  const socket = useMemo(() =>
    io(importVITE_BACKEND_URL, { auth: { token: user?.token } })
  );
  return
  <SocketContext value={socket}>{children}</SocketContext>;
};

export {SocketProvider, GetSocket};
