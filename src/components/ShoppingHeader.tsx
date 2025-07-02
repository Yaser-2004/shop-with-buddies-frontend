
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, ShoppingBag, Users, ShoppingCart, Package, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ActiveUsersDropdown } from './ActiveUsersDropdown';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';

interface ShoppingHeaderProps {
  cartItemsCount: number;
  activeTab: 'browse' | 'cart' | 'orders' | 'wishlist';
  onTabChange: (tab: 'browse' | 'cart' | 'orders' | 'wishlist') => void;
}

export const ShoppingHeader = ({ cartItemsCount, activeTab, onTabChange }: ShoppingHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'browse' as const, label: 'Browse', icon: ShoppingBag },
    { id: 'cart' as const, label: 'Cart', icon: ShoppingCart, badge: cartItemsCount },
    { id: 'orders' as const, label: 'Orders', icon: Package },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart },
  ];

  const sharedTabs = [
    { id: 'browse' as const, label: 'Browse', icon: ShoppingBag },
    { id: 'cart' as const, label: 'Shared Cart', icon: ShoppingCart, badge: cartItemsCount },
    { id: 'orders' as const, label: 'Orders', icon: Package }
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CoShop
            </span>
          </div>

          {/* Search bar - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search products, brands, or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs bg-red-500">
                3
              </Badge>
            </Button>
            <ActiveUsersDropdown />
            <ThemeToggle />

            <UserProfileDropdown />
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center justify-center mt-4 border-t dark:border-gray-700 pt-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {!localStorage.getItem('roomCode') ? tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`relative ${
                    activeTab === tab.id 
                      ? "bg-white dark:bg-gray-700 shadow-sm" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <Badge className="ml-2 bg-purple-600 text-white text-xs px-1.5 py-0.5">
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
                  className={`relative ${
                    activeTab === tab.id 
                      ? "bg-white dark:bg-gray-700 shadow-sm" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <Badge className="ml-2 bg-purple-600 text-white text-xs px-1.5 py-0.5">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-4">
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
