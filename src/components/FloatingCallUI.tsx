import { useCall } from "@/context/CallContext";
import { PhoneOff, Phone, Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingCallUI = () => {
  const {
    callActive,
    endCall,
    localStream,
    remoteStream,
    incomingCall,
    acceptCall,
  } = useCall();

  const [muted, setMuted] = useState(false);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [callAccepted, setCallAccepted] = useState(false);

  // 🔊 Attach streams
  useEffect(() => {
    if (localAudioRef.current && localStream) {
        console.log("🎙️ Local stream attached");
        localAudioRef.current.srcObject = localStream;
    }

    if (remoteAudioRef.current && remoteStream) {
        console.log("🎧 Remote stream attached");
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.volume = 1;

        remoteStream.getAudioTracks().forEach(track => {
        console.log("🔈 Remote audio track label:", track.label);
        console.log("🎧 Enabled:", track.enabled);
        });

        // 👇 Force play (important in Chrome/Mobile)
        remoteAudioRef.current
        .play()
        .then(() => console.log("🔊 Remote audio playing"))
        .catch(err => console.error("🚫 Failed to play remote audio:", err));
    }
    }, [localStream, remoteStream]);


  // 🎤 Mute toggle
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }, [muted, localStream]);

  const handleAccept = () => {
    if (incomingCall) { 
        setCallAccepted(true);
        acceptCall(incomingCall);
    } else {
        alert("No incoming call to accept");
    }
  };

    const handleEndCall = () => {
        endCall();
        setCallAccepted(false);
        setMuted(false);
    };

  return (
    <AnimatePresence>
      {/* Incoming Call UI */}
      {incomingCall && !callAccepted && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-5 right-5 bg-white dark:bg-zinc-800 shadow-lg rounded-xl px-4 py-3 z-[99999] flex items-center gap-4 border border-gray-200 dark:border-zinc-700 pointer-events-auto"
        >
          <div className="text-sm">
            <p className="text-zinc-800 dark:text-zinc-100 font-semibold">Incoming Call</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs">Room: {incomingCall.roomCode}</p>
          </div>

          <div className="flex gap-3 ml-4">
            <button
              onClick={handleAccept}
              className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.location.reload()} // simple way to decline
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Active Call UI */}
      {callActive && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-5 right-5 bg-white dark:bg-zinc-800 shadow-lg rounded-xl px-4 py-3 z-[9999] flex items-center gap-4 border border-gray-200 dark:border-zinc-700"
        >
          <div className="text-sm">
            <p className="text-zinc-800 dark:text-zinc-100 font-semibold">In Voice Call</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs">Room active</p>
          </div>

          <div className="flex gap-3 ml-4">
            <button
              onClick={() => setMuted((m) => !m)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {muted ? (
                <MicOff className="w-5 h-5 text-red-500" />
              ) : (
                <Mic className="w-5 h-5 text-green-500" />
              )}
            </button>

            <button
              onClick={handleEndCall}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>

          {/* Hidden audio streams */}
          <audio ref={localAudioRef} autoPlay muted />
          <audio ref={remoteAudioRef} autoPlay controls playsInline />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
