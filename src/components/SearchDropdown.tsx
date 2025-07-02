
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Smartphone, Laptop, Headphones, Camera, Watch, TrendingUp } from 'lucide-react';

interface SearchDropdownProps {
  placeholder?: string;
  className?: string;
}

export const SearchDropdown = ({ placeholder = "Search products, brands, or stores...", className }: SearchDropdownProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({
    products: [],
    brands: [],
    categories: [],
    trending: []
  });
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock data for suggestions
  const mockSuggestions = {
    products: [
      { id: 1, name: 'iPhone 15 Pro', category: 'Smartphones', price: 999, icon: Smartphone },
      { id: 2, name: 'MacBook Pro M3', category: 'Laptops', price: 1999, icon: Laptop },
      { id: 3, name: 'AirPods Pro', category: 'Audio', price: 249, icon: Headphones },
      { id: 4, name: 'Canon EOS R5', category: 'Cameras', price: 3899, icon: Camera },
      { id: 5, name: 'Apple Watch Series 9', category: 'Wearables', price: 399, icon: Watch }
    ],
    brands: [
      { name: 'Apple', count: 1234 },
      { name: 'Samsung', count: 987 },
      { name: 'Sony', count: 756 },
      { name: 'Nike', count: 543 },
      { name: 'Adidas', count: 432 }
    ],
    categories: [
      { name: 'Electronics', count: 15420 },
      { name: 'Fashion', count: 12800 },
      { name: 'Home & Garden', count: 9650 },
      { name: 'Sports & Outdoors', count: 7320 },
      { name: 'Books', count: 5890 }
    ],
    trending: [
      'wireless headphones',
      'smart watches',
      'gaming laptops',
      'wireless chargers',
      'bluetooth speakers'
    ]
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Filter suggestions based on query
      const filteredProducts = mockSuggestions.products.filter(
        product => product.name.toLowerCase().includes(query.toLowerCase())
      );
      const filteredBrands = mockSuggestions.brands.filter(
        brand => brand.name.toLowerCase().includes(query.toLowerCase())
      );
      const filteredCategories = mockSuggestions.categories.filter(
        category => category.name.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestions({
        products: filteredProducts.slice(0, 5),
        brands: filteredBrands.slice(0, 3),
        categories: filteredCategories.slice(0, 3),
        trending: mockSuggestions.trending.filter(
          trend => trend.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3)
      });
    } else {
      setSuggestions({
        products: mockSuggestions.products.slice(0, 5),
        brands: mockSuggestions.brands.slice(0, 3),
        categories: mockSuggestions.categories.slice(0, 3),
        trending: mockSuggestions.trending.slice(0, 5)
      });
    }
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    console.log('Searching for:', searchTerm);
    setQuery(searchTerm);
    setIsOpen(false);
  };

  const hasResults = suggestions.products.length > 0 || 
                   suggestions.brands.length > 0 || 
                   suggestions.categories.length > 0 || 
                   suggestions.trending.length > 0;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {!hasResults ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No results found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Products */}
                {suggestions.products.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Products</h4>
                    </div>
                    {suggestions.products.map((product) => {
                      const IconComponent = product.icon;
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSearch(product.name)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        >
                          <IconComponent className="w-5 h-5 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <span className="text-sm font-medium text-purple-600">${product.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Brands */}
                {suggestions.brands.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Brands</h4>
                    </div>
                    {suggestions.brands.map((brand, index) => (
                      <div
                        key={index}
                        onClick={() => handleSearch(brand.name)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <span className="font-medium text-sm">{brand.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {brand.count} products
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Categories */}
                {suggestions.categories.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Categories</h4>
                    </div>
                    {suggestions.categories.map((category, index) => (
                      <div
                        key={index}
                        onClick={() => handleSearch(category.name)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <span className="font-medium text-sm">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.count.toLocaleString()} items
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trending */}
                {suggestions.trending.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Trending Searches
                      </h4>
                    </div>
                    {suggestions.trending.map((trend, index) => (
                      <div
                        key={index}
                        onClick={() => handleSearch(trend)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">{trend}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
