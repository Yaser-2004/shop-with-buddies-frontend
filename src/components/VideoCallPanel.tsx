import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mic, MicOff, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { useCall } from '@/context/CallContext';

interface VideoCallPanelProps {
  roomId: string;
}

export const VideoCallPanel = ({ roomId }: VideoCallPanelProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();
  const { users } = useAppContext();
  const { startCall, endCall, localStream, callActive, setCallActive } = useCall();

  const handleStartCall = () => {
    console.log("Starting call in room:", roomId);
    setCallActive(true);
    toast({
      title: "Audio Call Started",
      description: "You're now in an audio call with your shopping group",
    });
    startCall(roomId);
  };

  const handleEndCall = () => {
    setCallActive(false);
    toast({
      title: "Call Ended",
      description: "You've left the call",
    });
    endCall();
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !newMuteState;
      });
    }

    toast({
      title: newMuteState ? "Muted" : "Unmuted",
      description: newMuteState ? "Your microphone is now off" : "Your microphone is now on",
    });
  };

  if (!callActive) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Connect with your shopping group through audio call
          </div>

          <Button
            onClick={handleStartCall}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Start Audio Call
          </Button>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Online Members</div>
            <div className="flex -space-x-2">
              {users.map((participant) => (
                <div
                  key={participant._id}
                  className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center border-2 border-white dark:border-gray-900"
                  title={participant.firstName}
                >
                  {participant.firstName?.[0] ?? '?'}
                  {participant.lastName?.[0] ?? ''}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Audio Call
          <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="sm"
            onClick={toggleMute}
            className="w-12 h-12 rounded-full p-0"
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndCall}
            className="w-12 h-12 rounded-full p-0"
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
          {users.length + 1} participants in call
        </div>
      </CardContent>
    </Card>
  );
};
