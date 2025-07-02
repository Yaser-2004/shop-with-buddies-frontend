
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

  const mockActiveRooms = [
    { id: 'room1', name: 'Weekend Shopping', members: 3, host: 'Sarah M.', activity: 'Electronics' },
    { id: 'room2', name: 'Wedding Prep', members: 5, host: 'Mike R.', activity: 'Fashion' },
    { id: 'room3', name: 'Home Decor Hunt', members: 2, host: 'Lisa K.', activity: 'Home & Garden' },
  ];

  const createRoom = async (username: string) => {
    if (!username) return alert("Please enter a username!");
    try {
      setIsCreating(true);
      const response = await axios.post(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/rooms/create`, {
        username: username.trim()
      });

      const { roomCode } = response.data;
      setRoomCode(roomCode);

      // Optional: Save username in localStorage for later use
      localStorage.setItem("username", username);
      localStorage.setItem("roomCode", roomCode);

      if (!socket.connected) socket.connect();
      socket.emit("join-room", { roomCode, username: username.trim() });

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
      if (!localStorage.getItem("username")) {
        return toast({ title: "Please login before joining", description: "Go to settings to set your username", variant: "destructive" });
      } 

      const res = await axios.get(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/rooms/${roomId}`);
      if (!res.data.roomCode) throw new Error();

      // Proceed to join
      socket.connect();
      socket.emit("join-room", { roomCode: roomId, username: localStorage.getItem("username")});

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
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
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
              onClick={createRoom.bind(null, localStorage.getItem("username") || "Yaser" )}
              disabled={isCreating}
              className="w-full bg-white text-purple-600 hover:bg-gray-100"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </Button>
          </CardContent>
        </Card>

        {/* Join Room */}
        <Card className="bg-gradient-to-br from-blue-500 to-teal-500 text-white border-0">
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

      {/* Active Rooms */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Active Shopping Rooms</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockActiveRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {room.activity}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-gray-200">
                      {room.host.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">Hosted by {room.host}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{room.members} members</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyRoomLink(room.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => joinRoom(room.id)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
