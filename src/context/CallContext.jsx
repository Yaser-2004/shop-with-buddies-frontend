// src/context/CallContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { socket } from '@/lib/socket';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [callActive, setCallActive] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const peerConnectionRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null); // ✅ Add this


  const servers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
    ],
  };

  const startCall = async (roomCode) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      const pc = new RTCPeerConnection(servers);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, roomCode });
        }
      };

      peerConnectionRef.current = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('call-offer', { offer, roomCode });
      setCallActive(true);
    } catch (err) {
      console.error('Error starting call:', err);
    }
  };

  const acceptCall = async ({ offer, roomCode }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      const pc = new RTCPeerConnection(servers);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, roomCode });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('call-answer', { answer, roomCode });
      peerConnectionRef.current = pc;
      setCallActive(true);
    } catch (err) {
      console.error('Error accepting call:', err);
    }
  };

  const handleAnswer = async ({ answer }) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleICE = ({ candidate }) => {
    const pc = peerConnectionRef.current;
    if (!pc || !candidate) return;
    pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const endCall = () => {
    const pc = peerConnectionRef.current;
    if (pc) {
      pc.close();
      peerConnectionRef.current = null;
    }
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setCallActive(false);
  };

//   useEffect(() => {
//     socket.on('call-offer', acceptCall);
//     socket.on('call-answer', handleAnswer);
//     socket.on('ice-candidate', handleICE);

//     return () => {
//       socket.off('call-offer', acceptCall);
//       socket.off('call-answer', handleAnswer);
//       socket.off('ice-candidate', handleICE);
//     };
//   }, []);

    useEffect(() => {
        socket.on('call-offer', ({ offer, roomCode }) => {
            console.log('📞 Incoming call offer received:', roomCode);
            setIncomingCall({ offer, roomCode }); // ✅ Store the call info for UI
        });

        socket.on('call-answer', handleAnswer);
        socket.on('ice-candidate', handleICE);

        return () => {
            socket.off('call-offer');
            socket.off('call-answer');
            socket.off('ice-candidate');
        };
    }, []);

  return (
    <CallContext.Provider value={{
      callActive,
      setCallActive,
      startCall,
      endCall,
      localStream,
      remoteStream,
      incomingCall,
      acceptCall
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
