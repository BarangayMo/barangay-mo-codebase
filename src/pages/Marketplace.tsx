import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ShoppingCart, 
  Box, 
  Truck, 
  Tag, 
  Star, 
  Store, 
  HeartIcon,
  Bell,
  Home,
  LayoutGrid,
  MessagesSquare,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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
    freeShipping: true
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
    freeShipping: true
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
    saleEvent: "SULIT SWELDO"
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
    justBought: true
  },
];

const categories = [
  { 
    name: "Food & Groceries", 
    icon: <Store className="w-6 h-6 text-green-500" />,
    bgColor: "bg-green-100" 
  },
  { 
    name: "Home & Living", 
    icon: <Home className="w-6 h-6 text-blue-500" />,
    bgColor: "bg-blue-100"
  },
  { 
    name: "Electronics", 
    icon: <Box className="w-6 h-6 text-purple-500" />,
    bgColor: "bg-purple-100"
  },
  { 
    name: "Flash Sale", 
    icon: <Tag className="w-6 h-6 text-red-500" />,
    bgColor: "bg-red-100"
  },
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
      {/* Mobile Header */}
      <div className="sticky top-16 z-40 bg-resident md:hidden">
        <div className="flex items-center gap-3 p-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/90 rounded-full"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
          <Link to="/marketplace/cart">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 md:hidden z-50">
        <div className="flex justify-around items-center">
          <Link to="/marketplace" className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-resident" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/marketplace/categories" className="flex flex-col items-center gap-1">
            <LayoutGrid className="w-6 h-6" />
            <span className="text-xs">Categories</span>
          </Link>
          <Link to="/marketplace/wishlist" className="flex flex-col items-center gap-1">
            <HeartIcon className="w-6 h-6" />
            <span className="text-xs">Wishlist</span>
          </Link>
          <Link to="/notifications" className="flex flex-col items-center gap-1">
            <Bell className="w-6 h-6" />
            <span className="text-xs">Notifications</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 mb-20 md:mb-0">
        {/* Categories */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/marketplace/category/${category.name.toLowerCase()}`}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl transition-transform hover:scale-105",
                  category.bgColor
                )}
              >
                {category.icon}
                <span className="text-sm font-medium mt-2 text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
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
      </div>
    </Layout>
  );
}
