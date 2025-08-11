
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
  const [priceRange, setPriceRange] = useState([0, 5000]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-200 text-gray-800">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm">Filter</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full md:max-w-md">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Narrow down your search with specific criteria
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 px-2">
                  <Slider
                    defaultValue={[0, 5000]}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Minimum</p>
                      <p className="text-xl font-semibold">₱{priceRange[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Maximum</p>
                      <p className="text-xl font-semibold">₱{priceRange[1]}</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="rating">
              <AccordionTrigger>Rating</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={`rating-${rating}`} />
                      <label htmlFor={`rating-${rating}`} className="flex items-center text-sm font-medium">
                        {rating} stars & up
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
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">Reset</Button>
            <Button className="flex-1">Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
