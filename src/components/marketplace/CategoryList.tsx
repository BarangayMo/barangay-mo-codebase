
import { Store, Home, Box, Tag } from "lucide-react";
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
    icon: <Box className="w-6 h-6 text-purple-500" />,
    bgColor: "bg-purple-100"
  },
  { 
    name: "Flash Sale", 
    icon: <Tag className="w-6 h-6 text-red-500" />,
    bgColor: "bg-red-100"
  },
];

export function CategoryList() {
  return (
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
  );
}
