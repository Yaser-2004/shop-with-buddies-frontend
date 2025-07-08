import { useCall } from "@/context/CallContext";
import { PhoneOff, Mic, MicOff, Phone } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const FloatingCallUI = () => {
  const {
    callActive,
    endCall,
    muteAudio,
    muted,
    incomingCall,
    acceptIncomingCall,
    setIncomingCall,
  } = useCall();
  const [locallyMuted, setLocallyMuted] = useState(muted);

  const handleToggleMute = () => {
    const newMute = !locallyMuted;
    setLocallyMuted(newMute);
    muteAudio(newMute);
  };

  if (incomingCall && !callActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="fixed bottom-5 right-5 bg-white dark:bg-zinc-800 shadow-lg rounded-xl px-4 py-3 z-[9999] flex items-center gap-4 border border-gray-200 dark:border-zinc-700"
      >
        <div className="text-sm">
          <p className="text-zinc-800 dark:text-zinc-100 font-semibold">
            Incoming Call
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">
            From: {incomingCall.fromUser}
          </p>
        </div>

        <div className="flex gap-3 ml-4">
          <button
            onClick={() => acceptIncomingCall()}
            className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Phone className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIncomingCall(null)}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {callActive && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-5 right-5 bg-white dark:bg-zinc-800 shadow-lg rounded-xl px-4 py-3 z-[9999] flex items-center gap-4 border border-gray-200 dark:border-zinc-700"
        >
          <div className="text-sm">
            <p className="text-zinc-800 dark:text-zinc-100 font-semibold">In Voice Call</p>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs">Agora Voice Channel</p>
          </div>

          <div className="flex gap-3 ml-4">
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {locallyMuted ? (
                <MicOff className="w-5 h-5 text-red-500" />
              ) : (
                <Mic className="w-5 h-5 text-green-500" />
              )}
            </button>

            <button
              onClick={endCall}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
