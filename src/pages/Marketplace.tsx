
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Package, Truck, Tag, Star, Clock, Heart, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock product data with more properties
const products = [
  {
    id: 1,
    name: "Rice 5kg Premium Quality",
    price: 250.00,
    originalPrice: 280.00,
    discount: 11,
    seller: "Barangay Coop",
    shopBadge: "LazMall",
    image: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png",
    available: true,
    rating: 4.9,
    ratingCount: 128,
    sold: 456,
    freeShipping: true,
    coins: true,
  },
  {
    id: 2,
    name: "Egg Tray 30pcs Fresh Farm Eggs",
    price: 150.00,
    originalPrice: 170.00,
    discount: 12,
    seller: "Manang Lorna",
    shopBadge: "LazMall",
    image: "/lovable-uploads/7a5fdb55-e1bf-49fb-956a-2ac513bdbcd5.png",
    available: true,
    rating: 4.7,
    ratingCount: 92,
    sold: 328,
    freeShipping: true,
    coins: true,
  },
  {
    id: 3,
    name: "Stainless Steel Vegetable Grater",
    price: 288.53,
    originalPrice: 299.00,
    discount: 4,
    seller: "Metro Cookwares",
    shopBadge: "LazMall",
    image: "/lovable-uploads/f1fa3bc1-5d74-4b1d-99de-f56d89e4b510.png",
    available: true,
    rating: 5,
    ratingCount: 83,
    sold: 242,
    freeShipping: true,
    coins: true,
    saleEvent: "SULIT SWELDO"
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
    coins: true,
    saleEvent: "SULIT SWELDO"
  },
  {
    id: 5,
    name: "Vention Elf E07 Bluetooth 5.3 Earphone",
    price: 386.00,
    originalPrice: 450.00,
    discount: 14,
    seller: "Vention Official",
    shopBadge: "LazMall",
    image: "/lovable-uploads/ed25f4d6-4f46-45de-a775-62db112f1277.png",
    available: true,
    rating: 4.6,
    ratingCount: 125,
    sold: 7000,
    freeShipping: true,
    coins: true,
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
    freeShipping: true
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
    coins: true,
    justBought: true
  },
];

// Categories for quick navigation
const categories = [
  { name: "Food", icon: <Package className="w-5 h-5" /> },
  { name: "Home & Living", icon: <Truck className="w-5 h-5" /> },
  { name: "Flash Sale", icon: <Tag className="w-5 h-5" /> },
  { name: "Vouchers", icon: <Tag className="w-5 h-5" /> },
];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.seller.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (productId: number) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart",
    });
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto min-h-[calc(100vh-80px)] bg-gray-100 pb-20">
        {/* Search Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-pink-500 to-purple-500 p-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                className="pl-10 pr-4 py-2 rounded-full border-0 shadow-md"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <Link to="/marketplace/cart" className="relative">
              <div className="bg-white p-2 rounded-full shadow-md">
                <ShoppingCart className="text-gray-700 w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">3</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Banner */}
        <div className="relative overflow-hidden">
          <img 
            src="/placeholder.svg" 
            alt="Special Sale" 
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center flex-col bg-gradient-to-r from-pink-500/70 to-purple-500/70">
            <h2 className="font-outfit text-xl font-bold text-white">SULIT SWELDO SALE</h2>
            <p className="text-white text-sm">MAR 30 - APR 21</p>
          </div>
        </div>

        {/* Free shipping banner */}
        <div className="bg-white p-3 flex justify-around items-center text-xs border-b">
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-gray-700" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-700" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-gray-700" />
            <span>Free Returns</span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-3 grid grid-cols-4 gap-2 mb-2">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-1">
                {category.icon}
              </div>
              <span className="text-xs">{category.name}</span>
            </div>
          ))}
        </div>

        {/* Flash Sale */}
        <div className="bg-white p-3 mb-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-red-500" />
              <span className="font-outfit font-bold text-lg">Flash Sale</span>
            </div>
            <Link to="/marketplace/flash-sale" className="text-sm text-blue-500">See all</Link>
          </div>
          
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="min-w-[120px] max-w-[120px] bg-white border rounded-md overflow-hidden">
                <div className="relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  {product.discount > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <div className="text-red-500 font-bold">₱{product.price.toFixed(2)}</div>
                  <div className="line-through text-xs text-gray-400">₱{product.originalPrice.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4.4 Sale Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 p-3 mb-2 text-white flex justify-between items-center">
          <div className="text-2xl font-bold font-outfit">4.4 SALE</div>
          <div className="text-sm">UP TO ₱1,500 VOUCHER</div>
        </div>

        {/* Product Grid */}
        <div className="bg-gray-100 p-2">
          <div className="grid grid-cols-2 gap-2">
            {filteredProducts.map((product) => (
              <Link
                to={`/marketplace/${product.id}`}
                key={product.id}
                className="bg-white rounded-md overflow-hidden border shadow-sm"
              >
                <div className="relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-36 object-contain bg-white p-2"
                    />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {product.discount > 0 && (
                    <div className="absolute bottom-0 left-0 bg-red-500 text-white text-xs px-1 font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                  
                  {product.justBought && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <span>just bought</span>
                    </div>
                  )}
                  
                  {product.saleEvent && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-pink-500">SULIT SWELDO</Badge>
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <div className={cn("text-xs line-clamp-2 h-8", !product.available && "text-gray-400")}>
                    {product.name}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-red-500 font-bold text-base">₱{product.price.toFixed(2)}</div>
                    {product.discount > 0 && (
                      <div className="line-through text-xs text-gray-400">₱{product.originalPrice.toFixed(2)}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span>|</span>
                    <span>{product.sold} sold</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    {product.freeShipping && (
                      <div className="bg-teal-100 text-teal-600 text-[10px] px-1 rounded">
                        FREE SHIPPING
                      </div>
                    )}
                    {product.coins && (
                      <div className="bg-yellow-100 text-yellow-600 text-[10px] px-1 rounded">
                        COINS
                      </div>
                    )}
                  </div>
                  
                  {product.shopBadge && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="bg-red-500 text-white text-[10px] px-1 rounded">
                        {product.shopBadge}
                      </div>
                      <div className="text-xs truncate">{product.seller}</div>
                    </div>
                  )}
                  
                  {!product.available && (
                    <div className="mt-1 text-xs text-destructive font-medium">Out of stock</div>
                  )}
                </div>
                
                <div className="p-2 pt-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product.id);
                    }}
                    className={cn(
                      "w-full text-center py-1.5 rounded text-sm font-medium",
                      product.available ? "bg-red-500 text-white" : "bg-gray-200 text-gray-400"
                    )}
                    disabled={!product.available}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No products found.
            </div>
          )}
        </div>
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around pt-2 pb-6">
          <div className="flex flex-col items-center">
            <Heart className="w-6 h-6 text-gray-400" />
            <span className="text-xs">Wishlist</span>
          </div>
          <div className="flex flex-col items-center">
            <ShoppingCart className="w-6 h-6 text-gray-400" />
            <span className="text-xs">Cart</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageSquare className="w-6 h-6 text-gray-400" />
            <span className="text-xs">Chat</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
