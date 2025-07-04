import { useState, useEffect } from 'react';
import { ShoppingHeader } from '@/components/ShoppingHeader';
import { ShoppingRoom } from '@/components/ShoppingRoom';
import { ProductGrid } from '@/components/ProductGrid';
import { SharedWishlist } from '@/components/SharedWishlist';
import ChatInterface  from '@/components/ChatPanel';
import { UserPresence } from '@/components/UserPresence';
import { ShoppingCart } from '@/components/ShoppingCart';
import { OrderHistory } from '@/components/OrderHistory';
import { VideoCallPanel } from '@/components/VideoCallPanel';
import { useAppContext } from '@/context/AppContext.jsx';

export interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'cart' | 'orders' | 'wishlist'>('browse');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { sharedCart, username, roomCode, setRoomCode } = useAppContext();

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === product._id);
      if (existingItem) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item._id !== productId));
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const addToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      if (prev.find(item => item._id === product._id)) {
        return prev.filter(item => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <div className="min-h-screen bg-gray/white-900 dark:via-purple-900 dark:to-gray-800">
      <ShoppingHeader 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'browse' && (
          <>
            {!localStorage.getItem('roomCode') ? (
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold bg-blue-600 bg-clip-text text-transparent mb-4">
                    Shop Together, Decide Together
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
                    Experience the joy of shopping with friends in real-time, or browse solo
                  </p>
                  <ShoppingRoom />
                </div>
                
                <ProductGrid 
                  onProductSelect={setSelectedProduct}
                  selectedProduct={selectedProduct}
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  isInWishlist={isInWishlist}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 ">
                <div className="lg:col-span-1 space-y-4">  
                  <UserPresence roomId={localStorage.getItem('roomCode')} />
                  <VideoCallPanel roomId={localStorage.getItem('roomCode')} />
                  {/* <SharedWishlist 
                    wishlistItems={wishlistItems}
                    onAddToCart={addToCart}
                    onRemoveFromWishlist={(productId) => 
                      setWishlistItems(prev => prev.filter(item => item.id !== productId))
                    }
                  /> */}
                </div>
                
                <div className="lg:col-span-5">
                  <ProductGrid 
                    onProductSelect={setSelectedProduct}
                    selectedProduct={selectedProduct}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                    isInWishlist={isInWishlist}
                    isCollabMode={true}
                  />
                </div>
                
                {/* <div className="lg:col-span-1">
                  <ChatPanel roomId={roomCode} />
                </div> */}
              </div>
            )}
          </>
        )}

        {activeTab === 'cart' && (
          <ShoppingCart 
            cartItems={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onAddToWishlist={addToWishlist}
            isInWishlist={isInWishlist}
          />
        )}

        {activeTab === 'orders' && <OrderHistory />}

        {activeTab === 'wishlist' && (
          <SharedWishlist 
            wishlistItems={wishlistItems}
            onAddToCart={addToCart}
            onRemoveFromWishlist={(productId) => 
              setWishlistItems(prev => prev.filter(item => item._id !== productId))
            }
            isFullPage={true}
          />
        )}
      </div>

      {localStorage.getItem('roomCode') ? <ChatInterface /> : null}
    </div>
  );
};

export default Index;
