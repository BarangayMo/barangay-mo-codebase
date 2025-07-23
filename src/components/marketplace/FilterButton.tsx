
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function FilterButton() {
  const [priceRange, setPriceRange] = useState([0, 100000]); // Updated to ₹1 Lakh max
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  const handleRatingChange = (ratingRange: string, checked: boolean) => {
    if (checked) {
      setSelectedRatings([...selectedRatings, ratingRange]);
    } else {
      setSelectedRatings(selectedRatings.filter(r => r !== ratingRange));
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
    }
    return `₹${value}`;
  };

  const ratingRanges = [
    { label: "5 stars", range: "5.0-5.99", stars: "⭐⭐⭐⭐⭐" },
    { label: "4 stars", range: "4.0-4.99", stars: "⭐⭐⭐⭐" },
    { label: "3 stars", range: "3.0-3.99", stars: "⭐⭐⭐" },
    { label: "2 stars", range: "2.0-2.99", stars: "⭐⭐" },
    { label: "1 star", range: "1.0-1.99", stars: "⭐" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm">Filter</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Narrow down your search with specific criteria
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 pb-20">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 px-2">
                  <Slider
                    defaultValue={[0, 100000]}
                    max={100000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Minimum</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(priceRange[0])}</p>
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600">to</div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Maximum</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(priceRange[1])}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="rating">
              <AccordionTrigger>Rating</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {ratingRanges.map(({ label, range, stars }) => (
                    <div key={range} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                      <Checkbox 
                        id={`rating-${range}`}
                        checked={selectedRatings.includes(range)}
                        onCheckedChange={(checked) => handleRatingChange(range, checked as boolean)}
                      />
                      <label htmlFor={`rating-${range}`} className="flex items-center text-sm font-medium cursor-pointer flex-1">
                        <span className="mr-2">{stars}</span>
                        <span>{label}</span>
                        <span className="ml-auto text-xs text-gray-500">{range.replace('-', ' - ')}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping Options</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="free-shipping" />
                    <label htmlFor="free-shipping" className="text-sm font-medium">Free Shipping</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="same-day" />
                    <label htmlFor="same-day" className="text-sm font-medium">Same Day Delivery</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="seller">
              <AccordionTrigger>Seller Type</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="official" />
                    <label htmlFor="official" className="text-sm font-medium">Official Store</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="preferred" />
                    <label htmlFor="preferred" className="text-sm font-medium">Preferred Seller</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="local" />
                    <label htmlFor="local" className="text-sm font-medium">Local Seller</label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t sm:absolute sm:bottom-0">
          <div className="flex gap-3 max-w-md mx-auto sm:max-w-none">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setPriceRange([0, 100000]);
                setSelectedRatings([]);
              }}
            >
              Reset
            </Button>
            <Button className="flex-1">Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
