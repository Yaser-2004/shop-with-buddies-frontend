import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Crown, Eye } from 'lucide-react';
import { InviteModal } from './InviteModal';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { socket } from '@/lib/socket';
import axios from 'axios';

interface UserPresenceProps {
  roomId: string;
}

export const UserPresence = ({ roomId }: UserPresenceProps) => {
  const navigate = useNavigate();
  const { setRoomCode, setSharedCart } = useAppContext();

  const {users, setUsers} = useAppContext();
  const [hostId, setHostId] = useState<string | null>(null);
  const {user} = useAppContext();

  const isHost = hostId === user?._id;

  const fetchRoomUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/rooms/${roomId}/members`);
      setUsers(res.data.members);
      setHostId(res.data.host);
    } catch (err) {
      console.error("Failed to fetch room members:", err);
    }
  };

    useEffect(() => {
      const handleUserJoined = (data: { user: any }) => {
        console.log('User joined:', data.user);
        setUsers((prev) => {
          // Avoid duplicates
          const exists = prev.find((u) => u._id === data.user._id);
          return exists ? prev : [...prev, data.user];
        });
      };

      const handleUserLeft = (data: { userId: string }) => {
        console.log('User left:', data.userId);
        setUsers((prev) => prev.filter((u) => u._id !== data.userId));
      };

      socket.on('user-joined', handleUserJoined);
      socket.on('user-left', handleUserLeft);

      return () => {
        socket.off('user-joined', handleUserJoined);
        socket.off('user-left', handleUserLeft);
      };
    }, []);



  useEffect(() => {
    fetchRoomUsers();
  }, [roomId]);

  const leaveRoom = () => {
    socket.emit('leave-room', { roomCode: roomId, userId: user?._id });
    socket.disconnect();
    localStorage.removeItem('roomCode');
    setRoomCode(null);
    setSharedCart([]);
    navigate('/');
  };

  const endRoom = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/rooms/end`, {
        roomCode: roomId,
        userId: user?._id,
      });
      socket.emit('end-room', roomId);
    } catch (err) {
      console.error('Failed to end room', err);
    } finally {
      leaveRoom();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Room Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span className='text-lg'>Room: {roomId}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {users.length} active
            </Badge>
            <InviteModal roomCode={roomId}>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </InviteModal>
          </div>
          <div className="space-y-2">
            {isHost && (
              <button
                onClick={endRoom}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                End Room
              </button>
            )}
            <button
              onClick={leaveRoom}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Leave Room
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle>Active Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.map((usr: any) => (
            <div key={usr._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-600 to-pink-600 text-white">
                    {usr.firstName?.[0] ?? '?'}
                    {usr.lastName?.[0] ?? ''}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor('online')}`} />
                {usr._id === hostId && (
                  <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-xs">
                    {usr.firstName} {usr.lastName}
                    {usr._id === user?._id ? ' (You)' : ''}
                  </h4>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
