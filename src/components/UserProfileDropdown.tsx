
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, Package, MapPin, CreditCard, Settings, LogOut, Truck, Heart } from 'lucide-react';
import { UserAuthModal } from './UserAuthModal';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';

export const UserProfileDropdown = () => {
  const { user, token } = useAppContext();
  console.log("UserProfileDropdown user:", user);
  
  // Mock user data
//   const user = {
//     name: "John Doe",
//     email: "john@example.com",
//     avatar: "",
//     memberSince: "2023",
//     orders: [
//       { id: "ORD-001", status: "Delivered", total: 299.99, date: "2024-06-15" },
//       { id: "ORD-002", status: "Processing", total: 159.99, date: "2024-06-20" },
//       { id: "ORD-003", status: "Shipped", total: 89.99, date: "2024-06-18" }
//     ],
//     addresses: [
//       { id: 1, type: "Home", address: "123 Main St, New York, NY 10001", isDefault: true },
//       { id: 2, type: "Work", address: "456 Office Ave, New York, NY 10002", isDefault: false }
//     ]
//   };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optionally, you can also reset user state in context
        // setUser(null);
        // setToken(null);
        window.location.reload(); // Reload to reflect changes
    } catch (error) {
        console.error("Logout error:", error);
        toast.error("Failed to log out. Please try again.");
    } finally {
        toast.success('Logged out successfully!');
    }
  }

  if (!user || !token) {
    return (
      <UserAuthModal>
        <Button variant="ghost" size="sm">
          <User className="w-5 h-5" />
        </Button>
      </UserAuthModal>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {user?.firstName[0]}{user?.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {/* {user.name.split(' ').map(n => n[0]).join('')} */}
                  {user?.firstName[0]}{user?.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <Badge variant="secondary" className="text-xs">Member since 2023</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recent Orders */}
            {/* <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Recent Orders
              </h4>
              <div className="space-y-2">
                {user.orders.slice(0, 2).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium">${order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* <Separator /> */}

            {/* Addresses */}
            {/* <div>
              <h4 className="font-medium mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Saved Addresses
              </h4>
              <div className="space-y-2">
                {user.addresses.slice(0, 1).map((address) => (
                  <div key={address.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{address.type}</span>
                      {address.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{address.address}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* <Separator /> */}
          </CardContent>
        </Card>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <Package className="w-4 h-4 mr-2" />
          View All Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Truck className="w-4 h-4 mr-2" />
          Track Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Heart className="w-4 h-4 mr-2" />
          Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Account Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 dark:text-red-400"
          onClick={() => handleLogout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
