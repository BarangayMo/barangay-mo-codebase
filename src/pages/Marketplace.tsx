
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
// import { CategoryList } from "@/components/marketplace/CategoryList"; // We are mapping categories directly
import { SearchBar } from "@/components/marketplace/SearchBar";
import { MobileNavigation } from "@/components/marketplace/MobileNavigation";
import { FilterButton } from "@/components/marketplace/FilterButton"; // Keep if used for advanced filters
import { MarketHero } from "@/components/marketplace/MarketHero";
import { ProductList } from "@/components/marketplace/ProductList";
import { ProductCardType } from "@/components/marketplace/ProductCard"; // Import type
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Define Category type based on Supabase schema
interface Category {
  id: string;
  name: string;
  image_url?: string | null;
}

// Fetch products with joined vendor and category names
const fetchProducts = async (): Promise<ProductCardType[]> => {
  console.log("Fetching products...");
  try {
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
      .eq('is_active', true) // Only fetch active products
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Products fetch error:", error);
      throw error;
    }
    
    console.log("Fetched products successfully:", data?.length || 0, "products");
    return data as ProductCardType[]; // Cast needed because Supabase types might not perfectly match joined structure
  } catch (err) {
    console.error("Error in fetchProducts:", err);
    throw err;
  }
};

// Fetch categories
const fetchCategories = async (): Promise<Category[]> => {
  console.log("Fetching categories...");
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .select("id, name, image_url")
      .order("name", { ascending: true });
    
    if (error) {
      console.error("Categories fetch error:", error);
      throw error;
    }
    
    console.log("Fetched categories successfully:", data?.length || 0, "categories");
    return data || [];
  } catch (err) {
    console.error("Error in fetchCategories:", err);
    throw err;
  }
};

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All"); // This is category name

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery<ProductCardType[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const displayCategories = [{ id: "all-cat", name: "All" }, ...(categories || [])];

  return (
    <Layout>
      <SearchBar search={search} setSearch={setSearch} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 mb-20 md:mb-0">
        <MarketHero />
        
        <div className="mt-6 mb-8 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          <FilterButton /> {/* Keep if it's for more advanced filtering options */}
          {isLoadingCategories ? (
            Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-10 w-24 rounded-full" />)
          ) : categoriesError ? (
            <p className="text-red-500">Error loading categories.</p>
          ) : (
            displayCategories.map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  activeFilter === cat.name
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => setActiveFilter(cat.name)}
              >
                {cat.name}
              </button>
            ))
          )}
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
          <p className="text-red-500 text-center py-10">Error loading products: {productsError.message}</p>
        ) : products && products.length > 0 ? (
          <ProductList 
            products={products} 
            activeFilter={activeFilter}
            search={search}
          />
        ) : (
          <p className="text-center py-10 text-gray-500">No products available at the moment.</p>
        )}
      </div>

      <MobileNavigation />
    </Layout>
  );
}
