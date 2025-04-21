
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Rice 5kg",
    price: "₱250.00",
    seller: "Barangay Coop",
    image: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png",
    available: true,
  },
  {
    id: 2,
    name: "Egg Tray",
    price: "₱150.00",
    seller: "Manang Lorna",
    image: "/lovable-uploads/7a5fdb55-e1bf-49fb-956a-2ac513bdbcd5.png",
    available: true,
  },
  {
    id: 3,
    name: "Gulay Bundle",
    price: "₱99.00",
    seller: "Urban Gardeners",
    image: "",
    available: false,
  },
];

export default function Marketplace() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.seller.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-lg mx-auto py-2 px-2 min-h-[calc(100vh-80px)]">
        <h1 className="text-2xl font-bold mb-2 mt-2">Marketplace</h1>
        {/* Search Bar */}
        <div className="mb-2">
          <Input
            className="w-full rounded-xl"
            placeholder="Search product or seller"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 pb-6">
          {filteredProducts.map((product) => (
            <Link
              to={`/marketplace/${product.id}`}
              key={product.id}
              className="block group"
            >
              <div className="rounded-xl p-3 bg-white/40 backdrop-blur-xl border shadow-lg flex flex-col items-center text-center hover:scale-105 transition">
                <div className="relative w-20 h-20 mb-1">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-xl w-20 h-20 object-cover border"
                    />
                  ) : (
                    <div className="rounded-xl w-20 h-20 bg-gray-100 flex items-center justify-center text-gray-400">
                      <ShoppingCart className="w-7 h-7" />
                    </div>
                  )}
                  {product.available ? (
                    <span className="absolute top-1 right-1 inline-flex w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  ) : (
                    <span className="absolute top-1 right-1 inline-flex w-3 h-3 bg-gray-300 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-base truncate">{product.name}</div>
                  <div className="text-xs text-gray-500 truncate">{product.seller}</div>
                  <div className="font-semibold text-primary mt-1">{product.price}</div>
                </div>
                {!product.available && (
                  <div className="mt-1 text-xs text-destructive font-medium">Out of stock</div>
                )}
              </div>
            </Link>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-2 py-12 text-center text-muted-foreground animate-fade-in">
              No products found.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
