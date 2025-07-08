// src/context/CallContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  createAgoraClient,
  joinCall,
  leaveCall,
  toggleMute,
} from "@/lib/useAgoraCall";
import { socket } from "@/lib/socket";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const [callActive, setCallActive] = useState(false);
  const [localTrack, setLocalTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [client, setClient] = useState(null); // 🆕 store client

  const { user, roomCode } = useAppContext();
  const uid = String(user?._id || Math.floor(Math.random() * 10000));

  useEffect(() => {
    socket.on("start-agora-call", ({ token, channelName, fromUser }) => {
      setIncomingCall({ token, channelName, fromUser });
    });

    return () => {
      socket.off("start-agora-call");
    };
  }, []);

  useEffect(() => {
    if (!roomCode || !user?._id) return;

    socket.emit("join-room", { roomCode, userId: user._id });

    socket.on("incoming-agora-call", ({ token, channelName, fromUser }) => {
      console.log("📞 Incoming Agora call from", channelName);
      setIncomingCall({ token, channelName, fromUser });
    });

    return () => {
      socket.off("incoming-agora-call");
    };
  }, [roomCode, user?._id]);

  const joinAgoraCall = async ({ token, channelName }) => {
    const newClient = createAgoraClient();
    setClient(newClient);

    const { localTrack: track } = await joinCall({
      client: newClient,
      appId: import.meta.env.VITE_AGORA_APP_ID,
      token,
      channel: channelName,
      uid,
      onRemoteUsersUpdated: (user) =>
        setRemoteUsers((prev) => [...prev, user]),
    });

    setLocalTrack(track);
    setCallActive(true);
  };

  const acceptIncomingCall = async () => {
    if (!incomingCall) return;

    const response = await axios.post("http://localhost:5000/agora/token", {
      channelName: incomingCall.channelName,
      uid,
    });

    const token = response.data.token;
    await joinAgoraCall({ token, channelName: incomingCall.channelName });

    setIncomingCall(null);
  };

  const startCall = async (roomId) => {
    const channelName = roomId;

    const response = await axios.post("http://localhost:5000/agora/token", {
      channelName,
      uid,
    });

    const { token } = response.data;

    socket.emit("start-agora-call", {
      roomCode: roomId,
      token,
      channelName,
      fromUser: user.firstName,
    });

    await joinAgoraCall({ token, channelName });
  };

  const endCall = async () => {
    await leaveCall(client, localTrack);
    setLocalTrack(null);
    setRemoteUsers([]);
    setCallActive(false);
    setClient(null);
  };

  const muteAudio = (mute) => {
    toggleMute(localTrack, mute);
    setMuted(mute);
  };

  return (
    <CallContext.Provider
      value={{
        callActive,
        setCallActive,
        startCall,
        endCall,
        muteAudio,
        muted,
        localTrack,
        remoteUsers,
        incomingCall,
        acceptIncomingCall,
        setIncomingCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
