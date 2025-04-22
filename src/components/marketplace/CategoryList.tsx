
import { Store, Home, Box, Tag, ShoppingBag, Heart, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    icon: <Smartphone className="w-6 h-6 text-purple-500" />,
    bgColor: "bg-purple-100"
  },
  { 
    name: "Personal Care", 
    icon: <Heart className="w-6 h-6 text-pink-500" />,
    bgColor: "bg-pink-100"
  },
  { 
    name: "Flash Sale", 
    icon: <Tag className="w-6 h-6 text-red-500" />,
    bgColor: "bg-red-100"
  },
  { 
    name: "Local Products", 
    icon: <ShoppingBag className="w-6 h-6 text-amber-500" />,
    bgColor: "bg-amber-100"
  },
];

export function CategoryList() {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/marketplace/category/${category.name.toLowerCase()}`}
            className={cn(
              "flex flex-col items-center p-4 rounded-xl transition-transform hover:scale-105 min-w-[120px]",
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
  );
}
