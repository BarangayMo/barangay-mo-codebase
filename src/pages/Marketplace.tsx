
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { RbiAccessCard } from "@/components/marketplace/RbiAccessCard";
import { MobileNavigation } from "@/components/marketplace/MobileNavigation";
import { FilterButton } from "@/components/marketplace/FilterButton";
import { MarketHero } from "@/components/marketplace/MarketHero";
import { ProductList } from "@/components/marketplace/ProductList";
import { ProductCardType } from "@/types/marketplace";
import { supabase } from "@/integrations/supabase/client";
import { useQueryWithDebug } from "@/hooks/use-query-with-debug";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRbiForms } from "@/hooks/use-rbi-forms";

// Define Category type based on Supabase schema
interface Category {
  id: string;
  name: string;
  image_url?: string | null;
}

// Fetch products with joined vendor and category names
const fetchProducts = async (): Promise<ProductCardType[]> => {
  console.log("🔄 Starting products fetch...");
  
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
      product_categories (name)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  console.log("📦 Products query completed:", { 
    success: !error, 
    dataCount: data?.length || 0, 
    error: error?.message 
  });
  
  if (error) {
    console.error("❌ Products fetch error:", error);
    throw error;
  }
  
  return data as ProductCardType[];
};

// Fetch categories
const fetchCategories = async (): Promise<Category[]> => {
  console.log("🔄 Starting categories fetch...");
  
  const { data, error } = await supabase
    .from("product_categories")
    .select("id, name, image_url")
    .order("name", { ascending: true });
    
  console.log("📂 Categories query completed:", { 
    success: !error, 
    dataCount: data?.length || 0, 
    error: error?.message 
  });
  
  if (error) {
    console.error("❌ Categories fetch error:", error);
    throw error;
  }
  
  return data || [];
};

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [filters, setFilters] = useState<{
    priceRange: [number, number];
    selectedRatings: string[];
  }>({
    priceRange: [0, 100000],
    selectedRatings: []
  });
  const { userRole } = useAuth();
  const { rbiForms } = useRbiForms();

  console.log("🏪 Marketplace component rendering...");

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQueryWithDebug(
    ['products'],
    fetchProducts
  );

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQueryWithDebug(
    ['categories'],
    fetchCategories
  );

  console.log("🏪 Marketplace state:", { 
    productsCount: products?.length || 0, 
    categoriesCount: categories?.length || 0, 
    isLoadingProducts, 
    isLoadingCategories,
    hasProductsError: !!productsError,
    hasCategoriesError: !!categoriesError
  });

  const displayCategories = [{ id: "all-cat", name: "All" }, ...(categories || [])];

  // Check RBI access for residents
  const latestForm = rbiForms?.[0];
  const isApproved = latestForm?.status === 'approved';
  const hasRbiAccess = userRole !== 'resident' || isApproved;

  return (
    <Layout>
      <SearchBar search={search} setSearch={setSearch} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 mb-20 md:mb-0">
        {/* Show RBI access card for residents without approval */}
        {!hasRbiAccess && (
          <div className="mb-6">
            <RbiAccessCard />
          </div>
        )}
        
        <MarketHero />
        
        <div className="mt-6 mb-8">
          {/* Mobile Filter Layout */}
          <div className="md:hidden mb-4">
            <FilterButton onFiltersChange={setFilters} />
          </div>
          
          {/* Category filters - responsive */}
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-none">
            {/* Desktop Filter Button */}
            <div className="hidden md:block flex-shrink-0">
              <FilterButton onFiltersChange={setFilters} />
            </div>
            
            {isLoadingCategories ? (
              Array.from({ length: 5 }).map((_, index) => 
                <Skeleton key={index} className="h-8 md:h-10 w-16 md:w-24 rounded-full flex-shrink-0" />
              )
            ) : categoriesError ? (
              <div className="text-center w-full">
                <p className="text-red-500 text-sm">Error loading categories.</p>
                <p className="text-xs text-gray-500">Error: {categoriesError.message}</p>
              </div>
            ) : (
              displayCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm whitespace-nowrap flex-shrink-0 transition-colors ${
                    activeFilter === cat.name
                      ? "bg-resident text-white font-medium"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveFilter(cat.name)}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : productsError ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-2">Error loading products: {productsError.message}</p>
            <details className="text-left bg-red-50 p-4 rounded">
              <summary className="cursor-pointer text-sm font-medium">Technical Details</summary>
              <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(productsError, null, 2)}</pre>
            </details>
          </div>
        ) : hasRbiAccess && products && products.length > 0 ? (
          <ProductList 
            products={products} 
            activeFilter={activeFilter}
            search={search}
            filters={filters}
          />
        ) : hasRbiAccess ? (
          <p className="text-center py-10 text-gray-500">No products available at the moment.</p>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Complete your RBI registration to access the marketplace.</p>
          </div>
        )}
      </div>

      <MobileNavigation />
    </Layout>
  );
}
