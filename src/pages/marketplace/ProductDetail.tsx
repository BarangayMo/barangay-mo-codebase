
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Heart, MessageSquare, Package, Star, Truck, Check, ShoppingCart, Store } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock product data
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
    description: "High quality rice, directly from local farmers. Perfect for everyday meals. No chemicals, 100% natural.",
    highlights: [
      "Premium quality rice",
      "Freshly milled",
      "Locally sourced",
      "No preservatives"
    ],
    specifications: {
      "Weight": "5 kg",
      "Type": "White Rice",
      "Origin": "Local",
      "Package": "Eco-friendly bag"
    },
    sellerInfo: {
      name: "Barangay Coop",
      rating: 4.8,
      followers: 1240,
      responseRate: 98,
      joinedDate: "2022",
      avatar: "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png"
    }
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
    description: "Fresh farm eggs from free-range chickens. Perfect for all your cooking and baking needs.",
    highlights: [
      "Fresh from the farm",
      "Free-range chickens",
      "Large size eggs",
      "Locally produced"
    ],
    specifications: {
      "Quantity": "30 pcs",
      "Size": "Large",
      "Type": "Chicken Eggs",
      "Package": "Egg tray"
    },
    sellerInfo: {
      name: "Manang Lorna",
      rating: 4.9,
      followers: 820,
      responseRate: 100,
      joinedDate: "2021",
      avatar: "/lovable-uploads/7a5fdb55-e1bf-49fb-956a-2ac513bdbcd5.png"
    }
  }
];

// Mock related products - just reuse the products array
const relatedProducts = products;

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  // Find the product based on the productId
  const product = products.find(p => p.id === parseInt(productId || "0")) || products[0];
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/marketplace/cart");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex items-center mb-4">
          <Link to="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Link>
        </div>
        
        <div className="bg-white rounded-lg border overflow-hidden mb-6">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full aspect-square object-contain bg-gray-50 rounded-lg"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                  <Package className="text-gray-400 w-16 h-16" />
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1">{product.rating}</span>
                  <span className="text-muted-foreground ml-1">({product.ratingCount} ratings)</span>
                </div>
                <div className="text-muted-foreground">
                  {product.sold} sold
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-red-500">₱{product.price.toFixed(2)}</div>
                  {product.discount > 0 && (
                    <>
                      <div className="line-through text-muted-foreground">₱{product.originalPrice.toFixed(2)}</div>
                      <Badge variant="destructive">-{product.discount}%</Badge>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground w-24">Seller:</div>
                  <div className="flex items-center">
                    {product.shopBadge && (
                      <Badge variant="secondary" className="mr-1">
                        {product.shopBadge}
                      </Badge>
                    )}
                    <span>{product.seller}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground w-24">Shipping:</div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-1 text-green-600" />
                    {product.freeShipping ? "Free Shipping" : "Standard Shipping"}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground w-24">Quantity:</div>
                  <div className="flex items-center">
                    <button 
                      className="w-8 h-8 flex items-center justify-center border rounded-l-md"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <div className="w-12 h-8 flex items-center justify-center border-t border-b">
                      {quantity}
                    </div>
                    <button
                      className="w-8 h-8 flex items-center justify-center border rounded-r-md"
                      onClick={() => setQuantity(prev => prev + 1)}
                    >
                      +
                    </button>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.available ? `${product.sold} sold` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.available}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleBuyNow}
                  disabled={!product.available}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border overflow-hidden mb-6">
              <Tabs defaultValue="description">
                <TabsList className="w-full justify-start border-b rounded-none px-6">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <p className="mb-6">{product.description}</p>
                  
                  <h4 className="font-medium mb-2">Highlights</h4>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    {product.highlights?.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="specifications" className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 py-2 border-b last:border-0">
                        <div className="text-muted-foreground">{key}</div>
                        <div className="col-span-2">{value}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-bold">{product.rating}</span>
                      <span className="text-muted-foreground ml-1">({product.ratingCount} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews yet for this product.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Similar Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map((item) => (
                    <Link 
                      key={item.id} 
                      to={`/marketplace/${item.id}`}
                      className="rounded border overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="w-full aspect-square bg-gray-50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Package className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="text-sm line-clamp-2 h-10">{item.name}</div>
                        <div className="text-red-500 font-bold">₱{item.price.toFixed(2)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg border overflow-hidden sticky top-20">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Shop Information</h3>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    {product.sellerInfo?.avatar ? (
                      <AvatarImage src={product.sellerInfo.avatar} />
                    ) : (
                      <AvatarFallback>
                        <Store className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">{product.sellerInfo?.name || product.seller}</div>
                    <div className="text-xs text-muted-foreground">Active since {product.sellerInfo?.joinedDate || "2022"}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{product.sellerInfo?.rating || 4.8}</div>
                    <div className="text-xs text-muted-foreground">Shop Rating</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{product.sellerInfo?.followers || 0}</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{product.sellerInfo?.responseRate || 95}%</div>
                    <div className="text-xs text-muted-foreground">Response Rate</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{product.sold}</div>
                    <div className="text-xs text-muted-foreground">Products Sold</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mb-2">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Seller
                </Button>
                
                <Button variant="secondary" className="w-full">
                  <Store className="mr-2 h-4 w-4" />
                  Visit Shop
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
