
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Phone, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoCallPanelProps {
  roomId: string;
}

interface CallParticipant {
  id: string;
  name: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  avatar: string;
}

export const VideoCallPanel = ({ roomId }: VideoCallPanelProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const { toast } = useToast();

  const mockParticipants: CallParticipant[] = [
    { id: '1', name: 'Sarah M.', isVideoOn: true, isAudioOn: true, avatar: 'SM' },
    { id: '2', name: 'Mike R.', isVideoOn: false, isAudioOn: true, avatar: 'MR' },
  ];

  const startVideoCall = () => {
    setIsCallActive(true);
    setIsVideoCall(true);
    toast({
      title: "Video Call Started",
      description: "You're now in a video call with your shopping group",
    });
  };

  const startAudioCall = () => {
    setIsCallActive(true);
    setIsVideoCall(false);
    toast({
      title: "Audio Call Started",
      description: "You're now in an audio call with your shopping group",
    });
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsVideoCall(false);
    toast({
      title: "Call Ended",
      description: "You've left the call",
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: isMuted ? "Your microphone is now on" : "Your microphone is now off",
    });
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Video Off" : "Video On",
      description: isVideoOn ? "Your camera is now off" : "Your camera is now on",
    });
  };

  if (!isCallActive) {
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
            Connect with your shopping group through voice or video calls
          </div>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={startVideoCall}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Start Video Call
            </Button>
            
            <Button
              onClick={startAudioCall}
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Phone className="w-4 h-4 mr-2" />
              Start Audio Call
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Online Members</div>
            <div className="flex -space-x-2">
              {mockParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs flex items-center justify-center border-2 border-white dark:border-gray-900"
                  title={participant.name}
                >
                  {participant.avatar}
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
          {isVideoCall ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
          {isVideoCall ? 'Video Call' : 'Audio Call'}
          <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isVideoCall && (
          <div className="grid grid-cols-1 gap-3 mb-4">
            {/* Main video area */}
            <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              {isVideoOn ? (
                <div className="text-white text-sm">Your Video</div>
              ) : (
                <div className="text-gray-400 text-sm flex flex-col items-center">
                  <VideoOff className="w-8 h-8 mb-2" />
                  Camera Off
                </div>
              )}
            </div>
            
            {/* Participant videos */}
            <div className="grid grid-cols-2 gap-2">
              {mockParticipants.map((participant) => (
                <div key={participant.id} className="relative bg-gray-800 rounded aspect-video flex items-center justify-center">
                  {participant.isVideoOn ? (
                    <div className="text-white text-xs">{participant.name}</div>
                  ) : (
                    <div className="text-gray-400 text-xs flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs flex items-center justify-center mb-1">
                        {participant.avatar}
                      </div>
                      {participant.name}
                    </div>
                  )}
                  {!participant.isAudioOn && (
                    <MicOff className="absolute bottom-1 right-1 w-3 h-3 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call controls */}
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="sm"
            onClick={toggleMute}
            className="w-12 h-12 rounded-full p-0"
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          {isVideoCall && (
            <Button
              variant={!isVideoOn ? "destructive" : "outline"}
              size="sm"
              onClick={toggleVideo}
              className="w-12 h-12 rounded-full p-0"
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </Button>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            onClick={endCall}
            className="w-12 h-12 rounded-full p-0"
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
          {mockParticipants.length + 1} participants in call
        </div>
      </CardContent>
    </Card>
  );
};
