
import { ProductCard } from "./ProductCard";
import { FC } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  seller: string;
  image: string;
  available: boolean;
  rating: number;
  ratingCount: number;
  sold: number;
  freeShipping: boolean;
  shopBadge?: string;
  saleEvent?: string;
  category: string;
}

interface ProductListProps {
  products: Product[];
  activeFilter: string;
  search: string;
}

export const ProductList: FC<ProductListProps> = ({ products, activeFilter, search }) => {
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                        p.seller.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeFilter === "All" || p.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  // Group products by category to display sections
  const productCategories = [...new Set(products.map(p => p.category))];
  
  if (activeFilter !== "All") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <>
      {productCategories.map((category) => {
        const categoryProducts = products.filter(p => p.category === category);
        if (categoryProducts.length === 0) return null;

        return (
          <div key={category} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{category}</h2>
              <Link 
                to={`/marketplace/category/${category.toLowerCase()}`}
                className="text-sm flex items-center gap-1 text-gray-500"
              >
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {categoryProducts.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
