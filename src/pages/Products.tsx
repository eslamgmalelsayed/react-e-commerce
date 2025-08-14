import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid";
import { type Product } from "@/components/ProductCard";

// Mock products data
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 99.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: { rate: 4.5, count: 120 },
    category: "Electronics",
  },
  {
    id: 2,
    title: "Premium Coffee Beans",
    description:
      "Organic single-origin coffee beans from the mountains of Colombia.",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    rating: { rate: 4.8, count: 85 },
    category: "Food & Beverage",
  },
  {
    id: 3,
    title: "Minimalist Watch",
    description:
      "Elegant minimalist watch with leather strap and water resistance.",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    rating: { rate: 4.2, count: 67 },
    category: "Fashion",
  },
  {
    id: 4,
    title: "Yoga Mat",
    description:
      "Eco-friendly yoga mat with superior grip and cushioning for all yoga practices.",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    rating: { rate: 4.6, count: 203 },
    category: "Sports & Fitness",
  },
  {
    id: 5,
    title: "Smartphone Case",
    description:
      "Durable smartphone case with wireless charging compatibility and drop protection.",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop",
    rating: { rate: 4.3, count: 156 },
    category: "Electronics",
  },
  {
    id: 6,
    title: "Reading Glasses",
    description:
      "Stylish reading glasses with blue light protection for digital eye strain relief.",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop",
    rating: { rate: 4.1, count: 89 },
    category: "Health",
  },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API call with loading
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProducts(mockProducts);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product);
    // Here you would typically dispatch to cart state or call API
  };

  const handleViewDetails = (product: Product) => {
    console.log("View details:", product);
    // Here you would typically navigate to product detail page
  };

  const handleRefresh = () => {
    setProducts([]);
    setIsLoading(true);

    // Simulate refresh
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Discover our amazing collection of products
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        isLoading={isLoading}
        skeletonCount={6}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />

      {/* Load More Button (when not loading and has products) */}
      {!isLoading && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors duration-200">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
