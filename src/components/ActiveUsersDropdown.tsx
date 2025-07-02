
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Crown, MapPin, Eye } from 'lucide-react';

export const ActiveUsersDropdown = () => {
  const [activeUsers] = useState([
    {
      id: 1,
      name: 'Sarah Miller',
      initials: 'SM',
      room: 'Weekend Shopping',
      roomId: 'ROOM-001',
      activity: 'Browsing Electronics',
      status: 'online',
      isHost: true,
      joinedAt: '2 hours ago'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      initials: 'MR',
      room: 'Wedding Prep',
      roomId: 'ROOM-002', 
      activity: 'Viewing Wishlist',
      status: 'online',
      isHost: false,
      joinedAt: '1 hour ago'
    },
    {
      id: 3,
      name: 'Lisa Kim',
      initials: 'LK',
      room: 'Home Decor Hunt',
      roomId: 'ROOM-003',
      activity: 'Adding to Cart',
      status: 'online',
      isHost: true,
      joinedAt: '30 minutes ago'
    },
    {
      id: 4,
      name: 'John Davis',
      initials: 'JD',
      room: 'Tech Shopping',
      roomId: 'ROOM-004',
      activity: 'Comparing Products',
      status: 'away',
      isHost: false,
      joinedAt: '15 minutes ago'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const onlineUsers = activeUsers.filter(user => user.status === 'online');
  const totalActiveUsers = activeUsers.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Users className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs bg-green-500 hover:bg-green-500">
            {onlineUsers.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Active Users</span>
              </div>
              <Badge variant="secondary">
                {totalActiveUsers} active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {activeUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active users</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {activeUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
                              {user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(user.status)}`} />
                          {user.isHost && (
                            <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${user.status === 'online' ? 'border-green-500 text-green-600' : 'border-yellow-500 text-yellow-600'}`}
                            >
                              {user.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{user.room}</span>
                            <span className="text-gray-400">({user.roomId})</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500 mt-1">
                            <Eye className="w-3 h-3" />
                            <span>{user.activity}</span>
                          </div>
                          
                          <p className="text-xs text-gray-400 mt-1">
                            Joined {user.joinedAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {activeUsers.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{onlineUsers.length} online now</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All Rooms
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
