
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, ThumbsUp, ThumbsDown, Star, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductBrowserProps {
  onProductSelect: (product: any) => void;
  selectedProduct: any;
}

export const ProductBrowser = ({ onProductSelect, selectedProduct }: ProductBrowserProps) => {
  const [reactions, setReactions] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  const mockProducts = [
    {
      id: 1,
      name: "Wireless Noise-Canceling Headphones",
      price: 299.99,
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 1234,
      store: "TechStore",
      category: "Electronics"
    },
    {
      id: 2,
      name: "Sustainable Cotton T-Shirt",
      price: 39.99,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 567,
      store: "EcoFashion",
      category: "Fashion"
    },
    {
      id: 3,
      name: "Smart Home Security Camera",
      price: 199.99,
      image: "/placeholder.svg",
      rating: 4.3,
      reviews: 890,
      store: "HomeTech",
      category: "Home Security"
    },
    {
      id: 4,
      name: "Ergonomic Office Chair",
      price: 449.99,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 345,
      store: "OfficeSupply",
      category: "Furniture"
    },
    {
      id: 5,
      name: "Portable Bluetooth Speaker",
      price: 79.99,
      image: "/placeholder.svg",
      rating: 4.4,
      reviews: 678,
      store: "AudioWorld",
      category: "Electronics"
    },
    {
      id: 6,
      name: "Premium Yoga Mat",
      price: 89.99,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 234,
      store: "FitnessPro",
      category: "Fitness"
    }
  ];

  const handleReaction = (productId: number, type: 'like' | 'dislike') => {
    const key = `${productId}_${type}`;
    setReactions(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
    
    toast({
      title: type === 'like' ? "👍 Liked!" : "👎 Disliked!",
      description: "Your reaction has been shared with the group",
    });
  };

  const addToWishlist = (product: any) => {
    toast({
      title: "Added to Wishlist!",
      description: `${product.name} has been added to your shared wishlist`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Browse Products</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            2 friends browsing
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {mockProducts.map((product) => (
          <Card 
            key={product.id} 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            onClick={() => onProductSelect(product)}
          >
            <CardContent className="p-4">
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.store}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-800">
                    ${product.price}
                  </span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReaction(product.id, 'like');
                      }}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {reactions[`${product.id}_like`] || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReaction(product.id, 'dislike');
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      {reactions[`${product.id}_dislike`] || 0}
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(product);
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(product);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
