
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CategoryList } from "@/components/marketplace/CategoryList";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { MobileNavigation } from "@/components/marketplace/MobileNavigation";
import { FilterButton } from "@/components/marketplace/FilterButton";
import { MarketHero } from "@/components/marketplace/MarketHero";
import { ProductList } from "@/components/marketplace/ProductList";

// Move products data to a separate data file
import { products } from "@/data/marketplace/products";
import { categories } from "@/data/marketplace/categories";

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <Layout>
      <SearchBar search={search} setSearch={setSearch} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 mb-20 md:mb-0">
        <MarketHero />
        
        <div className="mt-6 mb-8 flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          <FilterButton />
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                activeFilter === cat 
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <ProductList 
          products={products} 
          activeFilter={activeFilter}
          search={search}
        />
      </div>

      <MobileNavigation />
    </Layout>
  );
}
