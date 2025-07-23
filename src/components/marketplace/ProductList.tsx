
import { ProductCard, ProductCardType } from "./ProductCard"; // Use the updated ProductCardType
import { FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ProductListProps {
  products: ProductCardType[];
  activeFilter: string; // This is category name or "All"
  search: string;
  filters?: {
    priceRange: [number, number];
    selectedRatings: string[];
  };
}

export const ProductList: FC<ProductListProps> = ({ products, activeFilter, search, filters }) => {
  const filteredProducts = products.filter((p) => {
    const vendorName = p.vendors?.shop_name || "";
    const productName = p.name || "";
    const categoryName = p.product_categories?.name || "";

    const matchesSearch = productName.toLowerCase().includes(search.toLowerCase()) || 
                        vendorName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeFilter === "All" || categoryName === activeFilter;
    
    // Apply price filter
    const matchesPrice = !filters || (p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    
    // Apply rating filter
    const matchesRating = !filters || !filters.selectedRatings.length || filters.selectedRatings.some(range => {
      const rating = p.average_rating || 0;
      if (range === "5") return rating === 5;
      const [min, max] = range.split('-').map(Number);
      return rating >= min && rating <= max;
    });
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  if (activeFilter !== "All") {
    if (filteredProducts.length === 0 && search) {
      return <div className="text-center py-10 text-gray-500">No products found for "{search}" in "{activeFilter}".</div>;
    }
    if (filteredProducts.length === 0) {
      return <div className="text-center py-10 text-gray-500">No products found in "{activeFilter}".</div>;
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  // Group products by category for "All" view
  const productsByCategory: { [categoryName: string]: ProductCardType[] } = {};
  products.forEach(p => {
    const categoryName = p.product_categories?.name || "Uncategorized";
    if (!productsByCategory[categoryName]) {
      productsByCategory[categoryName] = [];
    }
    // Apply search and filters for "All" view's individual sections
    const vendorName = p.vendors?.shop_name || "";
    const productName = p.name || "";
    const matchesSearch = productName.toLowerCase().includes(search.toLowerCase()) || vendorName.toLowerCase().includes(search.toLowerCase());
    
    // Apply price filter
    const matchesPrice = !filters || (p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    
    // Apply rating filter
    const matchesRating = !filters || !filters.selectedRatings.length || filters.selectedRatings.some(range => {
      const rating = p.average_rating || 0;
      if (range === "5") return rating === 5;
      const [min, max] = range.split('-').map(Number);
      return rating >= min && rating <= max;
    });
    
    if (matchesSearch && matchesPrice && matchesRating) {
      productsByCategory[categoryName].push(p);
    }
  });

  const displayedCategories = Object.keys(productsByCategory).filter(catName => productsByCategory[catName].length > 0);

  if (displayedCategories.length === 0) {
     return <div className="text-center py-10 text-gray-500">No products found{search ? ` for "${search}"` : ""}.</div>;
  }

  return (
    <>
      {displayedCategories.map((categoryName) => {
        const categoryProducts = productsByCategory[categoryName];
        if (categoryProducts.length === 0) return null;

        return (
          <div key={categoryName} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{categoryName}</h2>
              <Link 
                to={`/marketplace/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`} // Create a slug for URL
                className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary"
              >
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {categoryProducts.slice(0, 5).map((product) => ( // Show up to 5 products per category on "All" view
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
