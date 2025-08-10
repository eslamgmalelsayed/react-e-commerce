// Skeleton loader component
const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
};

// Card skeleton loader
const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48 mb-4" />

      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4 mb-2" />

      {/* Description skeleton */}
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-3" />

      {/* Price and rating skeleton */}
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

// Product interface
interface Product {
  id: string | number;
  title: string;
  description: string;
  price: number;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  category?: string;
}

// Card component props
interface CardProps {
  product?: Product;
  isLoading?: boolean;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const Card = ({
  product,
  isLoading = false,
  onAddToCart,
  onViewDetails,
}: CardProps) => {
  // Show skeleton if loading or no product
  if (isLoading || !product) {
    return <CardSkeleton />;
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-200">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 group">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback image on error
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />

        {/* Category badge */}
        {product.category && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Title */}
        <h3
          className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleViewDetails}
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Description */}
        <p
          className="text-gray-600 text-sm line-clamp-2"
          title={product.description}
        >
          {product.description}
        </p>

        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>

          {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating!.rate)
                        ? "fill-current"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.rate} ({product.rating.count})
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add to Cart
          </button>

          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

// Export skeleton for standalone use
export { CardSkeleton };

// Export types
export type { Product, CardProps };
