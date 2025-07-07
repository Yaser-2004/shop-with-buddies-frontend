
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, ShoppingBag, Users, ShoppingCart, Package, Heart } from 'lucide-react';
import { SearchDropdown } from './SearchDropdown';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ActiveUsersDropdown } from './ActiveUsersDropdown';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { useAppContext } from '@/context/AppContext.jsx';

interface ShoppingHeaderProps {
  activeTab: 'browse' | 'cart' | 'orders' | 'wishlist';
  onTabChange: (tab: 'browse' | 'cart' | 'orders' | 'wishlist') => void;
}

export const ShoppingHeader = ({ activeTab, onTabChange }: ShoppingHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {sharedCart, personalCart, user, roomCode} = useAppContext();

  console.log("shared cart:", sharedCart);

  const tabs = [
    { id: 'browse' as const, label: 'Browse', icon: ShoppingBag },
    { id: 'cart' as const, label: 'Cart', icon: ShoppingCart, badge: personalCart?.length },
    { id: 'orders' as const, label: 'Orders', icon: Package },
  ];

  const sharedTabs = [
    { id: 'browse' as const, label: 'Browse', icon: ShoppingBag },
    { id: 'cart' as const, label: 'Shared Cart', icon: ShoppingCart, badge: sharedCart?.length },
    { id: 'orders' as const, label: 'Orders', icon: Package }
  ];

  return (
          <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
           <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              CoShop
            </span>
          </div>

          {/* Search bar - Hidden on mobile, shown on md+ */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
            <SearchDropdown className="w-full" />
          </div>

          {/* Right section */}
         <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
            {roomCode && <ActiveUsersDropdown />}
            <ThemeToggle />

            <UserProfileDropdown />
          </div>
        </div>

        {/* Navigation tabs */}
          <div className="flex items-center justify-center mt-3 sm:mt-4 border-t border-gray-800 pt-3 sm:pt-4">
          <div className="flex flex-wrap sm:space-x-1 bg-gray-900 rounded-lg p-1 w-full sm:w-auto justify-center">
            {!localStorage.getItem('roomCode') ? tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`relative m-1 sm:m-0 flex-1 sm:flex-none min-w-0 ${
                    activeTab === tab.id 
                      ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                 <Icon className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <Badge className="ml-1 sm:ml-2 bg-blue-500 text-white text-xs px-1 py-0 min-w-0 flex-shrink-0">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            }) : sharedTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                    className={`relative m-1 sm:m-0 flex-1 sm:flex-none min-w-0 ${
                    activeTab === tab.id 
                      ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                       <Badge className="ml-1 sm:ml-2 bg-blue-500 text-white text-xs px-1 py-0 min-w-0 flex-shrink-0">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-3 sm:mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
