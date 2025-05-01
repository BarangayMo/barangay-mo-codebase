
import { ArrowLeft, MoreHorizontal, ShoppingCart, Briefcase, MapPin, Camera, Mail, Phone, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { Helmet } from "react-helmet";
import { useResidentProfile } from "@/hooks/use-resident-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useProfileImage } from "@/hooks/use-profile-image";

export default function ResidentProfile() {
  const { profile, isLoading, mutate } = useResidentProfile();
  const { user } = useAuth();
  const { uploadProfileImage, uploading } = useProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback values
  const coverPhoto = "/lovable-uploads/c7d7f7a8-491d-49f1-910c-bb4dd5a85996.png";
  // Now using the avatar_url from user_settings if available
  const avatarPhoto = profile?.settings?.avatar_url || 
    `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name || ''} ${profile?.last_name || ''}` || 
    "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png";
  
  const name = profile ? `${profile.first_name} ${profile.last_name}` : user?.name || "Resident";
  const username = profile?.settings?.username || user?.email?.split('@')[0] || "resident";
  const verified = profile?.settings?.is_verified || false;
  const bio = profile?.settings?.bio || "I will inspire 10 million people to do what they love the best they can!";
  const barangay = profile?.barangay || "New Cabalan, Olongapo City";
  const email = profile?.email || user?.email || "resident@example.com";
  const phone = profile?.settings?.phone_number || "Not provided";
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    const publicUrl = await uploadProfileImage(file);
    if (publicUrl) {
      // Update the profile with the new avatar URL
      mutate?.();
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <>
      <Helmet>
        <title>Profile - Barangay Management System</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-[#e3eafc] via-[#f9fafc] to-[#fae5df] pb-20">
        <div className="relative rounded-b-[32px] overflow-hidden shadow-lg bg-white mb-0">
          <div className="relative h-[210px] sm:h-[240px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] via-[#3b82f6] to-[#06b6d4] animate-gradient-x" />
            <img 
              src={coverPhoto} 
              alt="Cover" 
              className="w-full h-full object-cover mix-blend-overlay opacity-50" 
            />
          </div>
          
          <div className="absolute top-0 left-0 w-full flex items-center justify-between px-4 py-4">
            <Link to="/resident-home" className="bg-white/80 backdrop-blur-sm rounded-full p-[6px]">
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </Link>
            <Link to="/edit-profile" className="bg-white/80 backdrop-blur-sm rounded-full p-[6px]">
              <MoreHorizontal className="w-6 h-6 text-gray-800" />
            </Link>
          </div>
          
          <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
            <div className="relative">
              {isLoading ? (
                <Skeleton className="w-32 h-32 rounded-full" />
              ) : (
                <>
                  <img 
                    src={avatarPhoto} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-[5px] border-white object-cover shadow-lg" 
                  />
                  <div 
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 border-2 border-white cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <motion.main 
          className="max-w-lg mx-auto mt-20 p-5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                  {verified && (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </>
              )}
            </div>
            
            {isLoading ? (
              <Skeleton className="h-5 w-32 mx-auto mb-2" />
            ) : (
              <p className="text-gray-500 mb-2">@{username}</p>
            )}
            
            <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              {isLoading ? (
                <Skeleton className="h-5 w-40" />
              ) : (
                barangay
              )}
            </div>
            
            {isLoading ? (
              <Skeleton className="h-16 w-full max-w-lg mx-auto mb-6" />
            ) : (
              <p className="text-gray-700 mb-6 max-w-lg mx-auto">{bio}</p>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="mb-5 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-blue-50 p-4">
                  <h2 className="text-lg font-semibold text-blue-900">Personal Information</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-gray-900">{name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-0.5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-gray-900">{email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-gray-900">{phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-900">{barangay}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-0.5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                      <p className="text-gray-900">August 23, 2002</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/marketplace">
                <Button variant="outline" className="w-full shadow-sm border-gray-200">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Marketplace
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" className="w-full shadow-sm border-gray-200">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jobs
                </Button>
              </Link>
            </div>
            <div className="mt-4">
              <Link to="/edit-profile">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.main>

        <MobileNavbar />
      </div>
    </>
  );
}
