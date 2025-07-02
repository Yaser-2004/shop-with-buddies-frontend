
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/pages/Index';

interface SharedWishlistProps {
  wishlistItems?: Product[];
  onAddToCart?: (product: Product) => void;
  onRemoveFromWishlist?: (productId: string) => void;
  isFullPage?: boolean;
}

export const SharedWishlist = ({ 
  wishlistItems = [], 
  onAddToCart,
  onRemoveFromWishlist,
  isFullPage = false
}: SharedWishlistProps) => {
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart`,
      });
    }
  };

  const handleRemoveFromWishlist = (productId: number) => {
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(productId);
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist",
      });
    }
  };

  if (isFullPage) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{wishlistItems.length} items saved</p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600">Save items you love to view them later</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.store}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-800">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span>Shared Wishlist</span>
          <Badge variant="secondary" className="ml-auto">
            {wishlistItems.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No items in wishlist</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {wishlistItems.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-600">${product.price}</p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {wishlistItems.length > 5 && (
              <p className="text-xs text-gray-500 text-center">
                +{wishlistItems.length - 5} more items
              </p>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2 border-t">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Shared with 2 friends</span>
        </div>
      </CardContent>
    </Card>
  );
};
