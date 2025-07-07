import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { socket } from '@/lib/socket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, Heart, ShoppingBag, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/pages/Index';
import axios from 'axios';

export const ShoppingCart = () => {
  const {
    user,
    personalCart,
    setPersonalCart,
    sharedCart,
    setSharedCart,
  } = useAppContext();
  const { toast } = useToast();

  const roomCode = localStorage.getItem('roomCode');
  const isInRoom = !!roomCode;
  const cartItems = isInRoom ? sharedCart : personalCart;

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string, discount: number } | null>(null);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (isInRoom) {
      // Optional: Add socket emit to update quantity
      // e.g., socket.emit('update-quantity', { productId, quantity, roomCode });
    } else {
      setPersonalCart(prev => 
        prev.map(item => item._id === productId ? { ...item, quantity } : item)
      );
    }
  };

  const handleAddToWishlist = (item: CartItem) => {
    toast({
      title: "Wishlist Feature",
      description: "Added to wishlist (dummy).",
    });
    // Integrate your actual wishlist logic
  };

  const isInWishlist = (id: string) => false; // Replace with actual logic

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const promoDiscount = appliedPromo ? subtotal * (appliedPromo.discount / 100) : 0;
  const total = subtotal + tax + shipping - promoDiscount;

  const handleApplyPromo = () => {
    const validPromoCodes = {
      'SAVE10': 10, 'WELCOME20': 20, 'SUMMER15': 15
    };
    const discount = validPromoCodes[promoCode as keyof typeof validPromoCodes];
    if (discount) {
      setAppliedPromo({ code: promoCode, discount });
      toast({ title: "Promo Applied", description: `You saved ${discount}%` });
    } else {
      toast({ title: "Invalid Code", description: "Try again", variant: "destructive" });
    }
  };

  const handleCheckout = () => {
    toast({ title: "Proceeding to checkout", description: "Integrate payment logic here." });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-16">
          <CardContent>
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Button className="bg-blue-600">Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                {isInRoom ? `Shared Cart (${cartItems?.length} items)` : `Your Cart (${cartItems?.length})`}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id || item.productId} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.title} className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg" />

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        {isInRoom && item.addedBy && (
                          <p className="text-xs text-gray-500">Added by: {item.addedBy === user?._id ? "You" : item.addedBy}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Button variant="ghost" size="sm" onClick={() => handleAddToWishlist(item)}>
                          <Heart className={`w-4 h-4 ${isInWishlist(item._id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                        </Button>
                        {!isInRoom && (
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateQuantity(item._id, 0)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isInRoom}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item._id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          type="number"
                          disabled={isInRoom}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          disabled={isInRoom}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">${item.price} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-32">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Promo Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <Button variant="outline" onClick={handleApplyPromo} disabled={!promoCode || !!appliedPromo}>
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Code: {appliedPromo.code}</span>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setAppliedPromo(null);
                      setPromoCode('');
                    }}>
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.discount}%)</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
                </div>
              )}

              <Button className="w-full bg-blue-600" onClick={handleCheckout}>
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>

              <div className="text-xs text-gray-500 text-center">
                Secure checkout with 256-bit SSL encryption
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
