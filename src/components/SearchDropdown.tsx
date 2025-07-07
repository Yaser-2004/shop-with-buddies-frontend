import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Product } from '@/pages/Index'; // or wherever your type is
import { Link } from 'react-router-dom';

interface SearchDropdownProps {
  placeholder?: string;
  className?: string;
}

export const SearchDropdown = ({
  placeholder = "Search products or categories...",
  className = "",
}: SearchDropdownProps) => {
  const { products } = useAppContext() as { products: Product[] };
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<{
    products: Product[];
    categories: { name: string; count: number }[];
    trending: string[];
  }>({
    products: [],
    categories: [],
    trending: [],
  });

  const searchRef = useRef<HTMLDivElement>(null);

  const trendingSearches = [
    'wireless headphones',
    'smart watches',
    'gaming laptops',
    'eco-friendly bags',
    'budget smartphones',
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();

    const matchedProducts = products
      .filter((p) => p.title.toLowerCase().includes(lowerQuery))
      .slice(0, 5);

    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    const matchedCategories = uniqueCategories
      .filter((category) => category.toLowerCase().includes(lowerQuery))
      .map((category) => ({
        name: category,
        count: products.filter((p) => p.category === category).length,
      }))
      .slice(0, 3);

    const matchedTrending = trendingSearches
      .filter((trend) => trend.toLowerCase().includes(lowerQuery))
      .slice(0, 3);

    setFilteredResults({
      products: matchedProducts,
      categories: matchedCategories,
      trending: matchedTrending,
    });
  }, [query, products]);

  const handleSearch = (term: string) => {
    console.log('Searched for:', term);
    setQuery(term);
    setIsOpen(false);
  };

  const { products: prod, categories, trending } = filteredResults;
  const hasResults = prod.length > 0 || categories.length > 0 || trending.length > 0;

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
                {prod.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Products</h4>
                    </div>
                    {prod.map((product) => (
                      <Link to={`/product/${product._id}`} key={product._id}>
                        <div
                          key={product._id}
                          onClick={() => handleSearch(product.title)}
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <span className="text-sm">{product.title}</span>
                          <span className="text-sm text-purple-600">${product.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {categories.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Categories</h4>
                    </div>
                    {categories.map((category, i) => (
                      <div
                        key={i}
                        onClick={() => handleSearch(category.name)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.count.toLocaleString()} items
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {trending.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Trending Searches
                      </h4>
                    </div>
                    {trending.map((trend, i) => (
                      <div
                        key={i}
                        onClick={() => handleSearch(trend)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
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
