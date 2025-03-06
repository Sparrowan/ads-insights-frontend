"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8080"; // Ensure this matches your NestJS WebSocket server

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realTimeData, setRealTimeData] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"], // Ensure WebSocket transport is used
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket server:", newSocket.id);
    });

    newSocket.on("adsDataUpdate", (newData) => {
      console.log("📡 Real-time update received:", newData);
      setRealTimeData(newData.data);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { realTimeData };
};
