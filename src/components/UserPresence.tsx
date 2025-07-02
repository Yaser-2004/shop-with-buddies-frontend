
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Crown, Eye } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { socket } from '@/lib/socket';
import axios from 'axios';

interface UserPresenceProps {
  roomId: string;
}

export const UserPresence = ({ roomId }: UserPresenceProps) => {
  const users = [
    {
      id: 1,
      name: 'Sarah Miller',
      initials: 'SM',
      status: 'online',
      activity: 'Browsing Electronics',
      isHost: true,
      cursor: { x: 45, y: 67 }
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      initials: 'MR',
      status: 'online',
      activity: 'Viewing Wishlist',
      isHost: false,
      cursor: { x: 78, y: 23 }
    },
    {
      id: 3,
      name: 'You',
      initials: 'JD',
      status: 'online',
      activity: 'Active',
      isHost: false,
      cursor: { x: 60, y: 45 }
    }
  ];

  const navigate = useNavigate();
  const isHost = localStorage.getItem('isHost') === 'true';
  const roomCode = localStorage.getItem('roomCode');
  const username = localStorage.getItem('username') || '';
  const {setRoomCode, setSharedCart} = useAppContext();

  const leaveRoom = () => {
    socket.emit('leave-room', { roomCode, username });
    socket.disconnect();
    localStorage.removeItem('roomCode');
    setRoomCode(null);
    setSharedCart([]);
    navigate('/');
  };

  const endRoom = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/rooms/end`, { roomCode });
      socket.emit('end-room', roomCode);
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
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
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
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                {user.isHost && (
                  <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-xs">{user.name}</h4>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>{user.activity}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Cursors Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Live Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-100 rounded-lg h-32 overflow-hidden">
            {users.map((user) => (
              <div
                key={user.id}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"
                style={{
                  left: `${user.cursor.x}%`,
                  top: `${user.cursor.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={user.name}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
              Live cursors on shared screen
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
