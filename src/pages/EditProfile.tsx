
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResidentProfile } from "@/hooks/use-resident-profile";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Calendar, Check, Instagram } from "lucide-react";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { toast } from "sonner";

// Animation variants
const pageVariants = {
  initial: { 
    opacity: 0,
    y: 20
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { 
      duration: 0.3 
    }
  }
};

const itemVariants = {
  initial: { 
    opacity: 0,
    y: 15 
  },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.2 }
  }
};

export default function EditProfile() {
  const navigate = useNavigate();
  const { profile, isLoading } = useResidentProfile();
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(profile.email || user?.email || '');
      // Type-safe access to nested properties with fallbacks
      setUsername(profile.settings?.username || user?.email?.split('@')[0] || '');
      setPhone(profile.settings?.phone_number || '');
      // Use a default date format for display
      setBirthdate('August 23, 2002');
    }
  }, [profile, user]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    toast.success("Profile changes saved successfully!");
    // Navigate back after saving
    setTimeout(() => navigate(-1), 1000);
  };

  // Display a loading state while profile data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Profile</title>
      </Helmet>
      
      <motion.div 
        className="min-h-screen pb-20 bg-gray-50"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {/* Header */}
        <div className="px-4 py-4 flex items-center justify-between border-b bg-white">
          <button onClick={handleBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Edit Profile</h1>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </div>

        <div className="px-4 py-6">
          {/* Profile Avatar */}
          <motion.div 
            className="flex flex-col items-center mb-8"
            custom={0}
            variants={itemVariants}
          >
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <img 
                  src="public/lovable-uploads/15ae0b1f-4953-4631-bb5f-5243dc03e289.png" 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-white">
                <Instagram className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Detail Information Section */}
          <motion.div 
            className="mb-6"
            custom={1}
            variants={itemVariants}
          >
            <h2 className="text-base font-medium mb-4">Detail Information</h2>
            
            <div className="space-y-4">
              <Input 
                value={`${firstName} ${lastName}`} 
                onChange={(e) => {
                  const [first, ...rest] = e.target.value.split(' ');
                  setFirstName(first || '');
                  setLastName(rest.join(' ') || '');
                }} 
                className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus-visible:ring-0"
              />
              
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="border-0 border-b border-gray-200 rounded-none px-0 py-2 focus-visible:ring-0"
              />
              
              <div className="flex items-center justify-between border-b border-gray-200 py-2">
                <Input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 rounded-none px-0 focus-visible:ring-0"
                />
                <span className="text-blue-500 text-sm">Verified</span>
              </div>
              
              <div className="flex items-center border-b border-gray-200 py-2">
                <div className="flex items-center gap-2 w-full">
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-4 bg-red-600"></div>
                    <span>+62</span>
                    <ArrowLeft className="w-4 h-4 rotate-270" />
                  </div>
                  <Input 
                    value="82275836284" 
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-0 rounded-none px-0 focus-visible:ring-0"
                  />
                </div>
                <span className="text-blue-500 text-sm">Verified</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-gray-200 py-2">
                <span>{birthdate}</span>
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </motion.div>

          {/* Document Details Section */}
          <motion.div 
            custom={2}
            variants={itemVariants}
          >
            <h2 className="text-base font-medium mb-4">Document Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
                whileHover="hover"
                whileTap="tap"
                variants={itemVariants}
                custom={3}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <span className="text-blue-600 text-sm font-medium">ID</span>
                </div>
                <span className="text-sm font-medium">NPWP</span>
                <span className="text-xs text-blue-600">Upload Now</span>
              </motion.div>
              
              <motion.div 
                className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
                whileHover="hover"
                whileTap="tap"
                variants={itemVariants}
                custom={4}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium">e-KTP</span>
                <span className="text-xs text-blue-600">Uploaded</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div 
            className="mt-10"
            custom={5}
            variants={itemVariants}
          >
            <Button 
              onClick={handleSave} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-full"
            >
              Saved Change
            </Button>
          </motion.div>
        </div>

        <MobileNavbar />
      </motion.div>
    </>
  );
}
