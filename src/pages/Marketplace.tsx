
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { CategoryList } from "@/components/marketplace/CategoryList";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { MobileNavigation } from "@/components/marketplace/MobileNavigation";
import { FilterButton } from "@/components/marketplace/FilterButton";
import { MarketHero } from "@/components/marketplace/MarketHero";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Rice 5kg Premium Quality",
    price: 250.00,
    originalPrice: 280.00,
    discount: 11,
    seller: "Barangay Coop",
    image: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png",
    available: true,
    rating: 4.9,
    ratingCount: 128,
    sold: 456,
    freeShipping: true,
    shopBadge: "Official",
    category: "Food & Groceries"
  },
  {
    id: 2,
    name: "Egg Tray 30pcs Fresh Farm Eggs",
    price: 150.00,
    originalPrice: 170.00,
    discount: 12,
    seller: "Manang Lorna",
    image: "/lovable-uploads/7a5fdb55-e1bf-49fb-956a-2ac513bdbcd5.png",
    available: true,
    rating: 4.7,
    ratingCount: 92,
    sold: 328,
    freeShipping: true,
    shopBadge: "Popular",
    category: "Food & Groceries"
  },
  {
    id: 3,
    name: "Stainless Steel Vegetable Grater",
    price: 288.53,
    originalPrice: 299.00,
    discount: 4,
    seller: "Metro Cookwares",
    image: "/lovable-uploads/f1fa3bc1-5d74-4b1d-99de-f56d89e4b510.png",
    available: true,
    rating: 5,
    ratingCount: 83,
    sold: 242,
    freeShipping: true,
    saleEvent: "SULIT SWELDO",
    category: "Home & Living"
  },
  {
    id: 4,
    name: "2L Air Humidifier Essential Oil Diffuser",
    price: 124.65,
    originalPrice: 150.00,
    discount: 17,
    seller: "Home Essentials PH",
    image: "/lovable-uploads/9baec3ae-acff-40d2-b790-73061d9fa5b4.png",
    available: true,
    rating: 4.8,
    ratingCount: 210,
    sold: 867,
    freeShipping: true,
    saleEvent: "SULIT SWELDO",
    shopBadge: "Preferred",
    category: "Home & Living"
  },
  {
    id: 5,
    name: "Vention Elf E07 Bluetooth 5.3 Earphone",
    price: 386.00,
    originalPrice: 450.00,
    discount: 14,
    seller: "Vention Official",
    image: "/lovable-uploads/ed25f4d6-4f46-45de-a775-62db112f1277.png",
    available: true,
    rating: 4.6,
    ratingCount: 125,
    sold: 7000,
    freeShipping: true,
    shopBadge: "Official",
    category: "Electronics"
  },
  {
    id: 6,
    name: "Gulay Bundle Fresh from Farm",
    price: 99.00,
    originalPrice: 120.00,
    discount: 18,
    seller: "Urban Gardeners",
    image: "",
    available: false,
    rating: 4.5,
    ratingCount: 63,
    sold: 420,
    freeShipping: true,
    shopBadge: "Verified",
    category: "Food & Groceries"
  },
  {
    id: 7,
    name: "Shangri-La Bamboo Fresh Hotel Shampoo 500ml",
    price: 180.00,
    originalPrice: 200.00,
    discount: 10,
    seller: "Hotel Supplies PH",
    image: "/lovable-uploads/3ee20358-a5dd-4933-a21d-71d3f13d0047.png",
    available: true,
    rating: 4.9,
    ratingCount: 345,
    sold: 23200,
    freeShipping: true,
    justBought: true,
    shopBadge: "Official",
    category: "Personal Care"
  },
];

const categories = [
  "All",
  "Food & Groceries", 
  "Home & Living", 
  "Electronics", 
  "Personal Care",
  "Flash Sale"
];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { userRole } = useAuth();

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                        p.seller.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeFilter === "All" || p.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  // Group products by category to display sections
  const productCategories = [...new Set(products.map(p => p.category))];
  
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
                  ? userRole === "resident" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {activeFilter === "All" ? (
          // Show sections by category when no filter is applied
          productCategories.map((category) => {
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
          })
        ) : (
          // Show filtered products when a category is selected
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <MobileNavigation />
    </Layout>
  );
}
