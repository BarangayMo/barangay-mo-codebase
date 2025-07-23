import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FilterButton } from "@/components/marketplace/FilterButton";
import { ProductCard, ProductCardType } from "@/components/marketplace/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useQueryWithDebug } from "@/hooks/use-query-with-debug";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fetch products for a specific category
const fetchCategoryProducts = async (categorySlug: string): Promise<ProductCardType[]> => {
  console.log("🔄 Starting category products fetch for:", categorySlug);
  
  // Convert slug back to category name
  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      original_price,
      stock_quantity,
      main_image_url,
      average_rating,
      rating_count,
      sold_count,
      is_active,
      tags,
      vendors (shop_name), 
      product_categories!inner (name)
    `)
    .eq('is_active', true)
    .eq('product_categories.name', categoryName)
    .order('created_at', { ascending: false });

  console.log("📦 Category products query completed:", { 
    success: !error, 
    dataCount: data?.length || 0, 
    error: error?.message 
  });
  
  if (error) {
    console.error("❌ Category products fetch error:", error);
    throw error;
  }
  
  return data as ProductCardType[];
};

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [search, setSearch] = useState("");
  
  const categoryName = categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

  const { data: products, isLoading, error } = useQueryWithDebug(
    ['category-products', categorySlug],
    () => fetchCategoryProducts(categorySlug || '')
  );

  const filteredProducts = products?.filter((p) => {
    const vendorName = p.vendors?.shop_name || "";
    const productName = p.name || "";
    
    return productName.toLowerCase().includes(search.toLowerCase()) || 
           vendorName.toLowerCase().includes(search.toLowerCase());
  }) || [];

  return (
    <Layout>
      <SearchBar search={search} setSearch={setSearch} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 mb-20 md:mb-0">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/marketplace" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? "Loading..." : `${filteredProducts.length} products found`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          <FilterButton />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-2">Error loading products: {error.message}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {search ? `No products found for "${search}" in ${categoryName}` : `No products found in ${categoryName}`}
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/marketplace">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}