
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from './Index';
import axios from 'axios';

const ProductDetails = () => {
  const { productId } = useParams();
  console.log("Product ID:", productId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product>(null);

  const fetchProductDetails = async () => {
    if (!productId) {
        return;
    }
    try {
        console.log("Heyyyyyyyy");
        
      const response = await axios.get(`${import.meta.env.VITE_PUBLIC_BASEURL}/api/products/${productId}`);
      console.log("---------->", response);
      
    //   if (!response.ok) throw new Error('Product not found');
    //   const data = await response.json();
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
      navigate('/404');
    }
  }

    useEffect(() => {
        if (!productId) {
            console.error("No productId provided");
            return;
        }
        console.log("useEffect called with productId:", productId);
        fetchProductDetails();
    }, []);

  const shippingOptions = [
    { name: "Standard Delivery", time: "5-7 business days", price: 0, icon: Truck },
    { name: "Express Delivery", time: "2-3 business days", price: 15.99, icon: Truck },
    { name: "Next Day Delivery", time: "1 business day", price: 25.99, icon: Truck }
  ];

  const reviews = [
    { id: 1, user: "John D.", rating: 5, comment: "Excellent sound quality and comfort!", date: "2024-06-15" },
    { id: 2, user: "Sarah M.", rating: 4, comment: "Great headphones, battery life is amazing.", date: "2024-06-10" },
    { id: 3, user: "Mike R.", rating: 5, comment: "Worth every penny. Noise cancellation is top-notch.", date: "2024-06-08" }
  ];

  const addToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product?.title} added to your cart.`,
    });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product?.title} ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={product?.image}
                alt={product?.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-purple-500' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div> */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product?.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                {/* <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div> */}
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-purple-600">${product?.price}</span>
                {/* {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )} */}
                <Badge variant="destructive">25% OFF</Badge>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300">{product?.description}</p>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">({product?.stock} in stock)</span>
              </div>

              <div className="flex space-x-4">
                <Button onClick={addToCart} className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={toggleWishlist}>
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            {/* <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>

        {/* Shipping Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Shipping Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shippingOptions.map((option, index) => (
                <div key={index} className="border rounded-lg p-4 hover:border-purple-500 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{option.name}</h4>
                    <option.icon className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{option.time}</p>
                  <p className="font-semibold">{option.price === 0 ? 'FREE' : `$${option.price}`}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Secure Payment
              </div>
              <div className="flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                30-day Returns
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        {/* <Card className="mb-8">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium">{key}</span>
                  <span className="text-gray-600 dark:text-gray-400">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Customer Reviews</span>
              {/* <div className="flex items-center space-x-2">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating} out of 5 ({product.reviewCount} reviews)
                </span>
              </div> */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.user}</span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;