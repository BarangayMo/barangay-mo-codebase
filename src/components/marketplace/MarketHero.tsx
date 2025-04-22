
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "Sulit Sweldo Sale",
    description: "Up to 50% off on selected items",
    buttonText: "Shop Now",
    bgColor: "bg-gradient-to-r from-red-500 to-orange-500",
    image: "/lovable-uploads/99aa953e-adc7-47d1-884a-8228b0ca6527.png",
  },
  {
    id: 2,
    title: "Barangay Local Products",
    description: "Support local businesses and artisans",
    buttonText: "Explore",
    bgColor: "bg-gradient-to-r from-green-500 to-teal-500",
    image: "/lovable-uploads/c7d7f7a8-491d-49f1-910c-bb4dd5a85996.png",
  },
  {
    id: 3,
    title: "Free Delivery",
    description: "On all orders above ₱500",
    buttonText: "Learn More",
    bgColor: "bg-gradient-to-r from-blue-500 to-indigo-500",
    image: "/lovable-uploads/c18ab531-de58-47d3-a486-6d9882bc2559.png",
  },
];

export function MarketHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 ${slides[currentSlide].bgColor} flex items-center justify-between p-6 md:p-10`}
        >
          <div className="text-white z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{slides[currentSlide].title}</h2>
            <p className="mb-4 text-sm md:text-base text-white/90">{slides[currentSlide].description}</p>
            <button className="px-4 py-2 bg-white text-gray-800 rounded-full text-sm font-medium">
              {slides[currentSlide].buttonText}
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2">
            {slides[currentSlide].image && (
              <img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title}
                className="h-full w-full object-cover object-left opacity-30 md:opacity-80"
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-4" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      <button
        onClick={handlePrevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 text-white rounded-full flex items-center justify-center z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
