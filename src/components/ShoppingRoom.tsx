
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Copy, ExternalLink,UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InviteModal } from '@/components/InviteModal';
import axios from 'axios';
import { useAppContext } from "@/context/AppContext";
import { socket } from "@/lib/socket";
import { useNavigate } from "react-router-dom";



interface ShoppingRoomProps {
  onJoinRoom: (roomId: string) => void;
}

export const ShoppingRoom = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { roomCode, setRoomCode } = useAppContext();
  const { user, token } = useAppContext();

  const mockActiveRooms = [
    { id: 'room1', name: 'Weekend Shopping', members: 3, host: 'Sarah M.', activity: 'Electronics' },
    { id: 'room2', name: 'Wedding Prep', members: 5, host: 'Mike R.', activity: 'Fashion' },
    { id: 'room3', name: 'Home Decor Hunt', members: 2, host: 'Lisa K.', activity: 'Home & Garden' },
  ];

  const createRoom = async (userId: string) => {
    if (!userId) return alert("Please login first!");
    try {
      setIsCreating(true);
      const response = await axios.post(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/rooms/create`, {
        userId
      });

      const { roomCode } = response.data;
      setRoomCode(roomCode);
      localStorage.setItem("roomCode", roomCode);

      if (!socket.connected) socket.connect();
      socket.emit("join-room", { roomCode, userId });

      // Redirect to the room
      navigate(`/room/${roomCode}`);
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        title: "Error Creating Room",
        description: "There was an issue creating the room. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      if (!user) {
        return toast({ title: "Please login before joining", description: "Go to settings to set your username", variant: "destructive" });
      } 

      const res = await axios.get(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/rooms/${roomId}`);
      if (!res.data.roomCode) throw new Error();

      // Proceed to join
      socket.connect();
      socket.emit("join-room", { roomCode: roomId, userId: user?._id });

      localStorage.setItem("roomCode", roomId);
      setRoomCode(roomId);
      navigate(`/room/${roomId}`);

      toast({ title: "Joined Room!", description: "Welcome!" });
    } catch (err) {
      toast({ title: "Invalid Room", description: "This room doesn't exist", variant: "destructive" });
    }
  };

  const copyRoomLink = (roomId: string) => {
    navigator.clipboard.writeText(`https://coshop.app/room/${roomId}`);
    toast({
      title: "Link Copied!",
      description: "Room link copied to clipboard",
    });
  };

  return (
    <div className="space-y-8">
      {/* Create or Join Room */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Room */}
        <Card className="bg-blue-500 to-pink-500 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Shopping Room</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-purple-100">
              Start a new shopping session and invite friends to join you
            </p>
            <Button 
              onClick={createRoom.bind(null, user?._id || '')}
              disabled={isCreating}
              className="w-full bg-white text-purple-600 hover:bg-gray-100"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </Button>
          </CardContent>
        </Card>

        {/* Join Room */}
        <Card className="bg-yellow-500 to-teal-500 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="w-5 h-5" />
              <span>Join Room</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-blue-100">
              Enter a room code to join an existing shopping session
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              <Button 
                onClick={() => joinRoom(roomCode)}
                disabled={!roomCode}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
