
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[url('/lovable-uploads/cb76a9c2-601a-44e1-8e60-f06f33d0b261.png')] bg-cover bg-center">
      <div className="w-full min-h-screen bg-gradient-to-t from-black/80 via-black/50 to-black/60 flex flex-col items-center justify-between p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
            alt="Logo" 
            className="h-16 w-auto"
          />
        </motion.div>
        
        <motion.div 
          className="text-center space-y-6 px-4 py-6 rounded-xl bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            <span className="text-emerald-400">Barangay Mo</span><br />
            at your fingertips
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-sm mx-auto">
            your community services, events, and announcements in one place
          </p>
        </motion.div>

        <motion.div 
          className="w-full max-w-md mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Link to="/phone">
            <Button className="w-full h-14 text-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              Let's Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
