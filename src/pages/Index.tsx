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
import axios from 'axios';
import { socket } from '@/lib/socket';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FocusedProductModal } from '@/components/FocusedProductModal';

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
  const { sharedCart, username, roomCode, setRoomCode, user, setSharedCart, products } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
      if (!socket || !user || !roomCode) return;
  
      // Emit join-room again on initial load / reconnect
      socket.emit("join-room", {
        roomCode,
        userId: user._id,
      });
    }, [user, roomCode]);

  useEffect(() => {
    // const userId = user?._id;

    const fetchCart = async () => {
      try {
        if (roomCode) {
          const res = await axios.get(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/rooms/${roomCode}/cart`);
          // console.log("Fetched shared cart:", res.data);
          setSharedCart(res.data.cart);
        }
        // } else if (userId) {
        //   const res = await axios.get(`/api/users/${userId}/cart`);
        //   setPersonalCart(res.data.cart);
        // }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart();
  }, []);
  
  
  useEffect(() => {
    if (!roomCode) return;

    console.log("Joining room for shared cart updates:", roomCode);

    const handleCartUpdate = (updatedCart) => {
      setSharedCart(updatedCart); // Replace the shared cart entirely
    };

    socket.on('cart-updated', handleCartUpdate);
    
    return () => {
      socket.off('cart-updated', handleCartUpdate);
    };
  }, [roomCode, setSharedCart]);


  useEffect(() => {
    const handleRoomEnded = () => {
      // Clear context + localStorage
      localStorage.removeItem('roomCode');
      setSharedCart([]);
      setRoomCode(null);
      navigate('/');
      toast({
        title: "Room Ended",
        description: "The shopping room has been ended by the host.",
        variant: "destructive",
      });
    };

    socket.on('room-ended', handleRoomEnded);

    return () => {
      socket.off('room-ended', handleRoomEnded);
    };
  }, []);

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
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="container mx-auto px-4 py-6">
        {activeTab === 'browse' && (
          <>
            {!localStorage.getItem('roomCode') ? (
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
                    Shop Together, Decide Together
                  </h1>
                  <p className="text-lg md:text-3xl text-blue-600 dark:text-blue-500 mb-6">
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
                <FocusedProductModal products={products} />
                
                {/* <div className="lg:col-span-1">
                  <ChatPanel roomId={roomCode} />
                </div> */}
              </div>
            )}
          </>
        )}

        {activeTab === 'cart' && (
          <ShoppingCart />
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
