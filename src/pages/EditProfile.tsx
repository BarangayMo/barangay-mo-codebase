
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useResidentProfile } from "@/hooks/use-resident-profile";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Calendar, Check, Camera, Mail, Phone, User, MapPin, Save } from "lucide-react";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { useProfileImage } from "@/hooks/use-profile-image";
import { supabase } from "@/integrations/supabase/client";

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
  const { profile, isLoading, mutate } = useResidentProfile();
  const { user, session } = useAuth();
  const { uploadProfileImage, uploading } = useProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const avatarPhoto = profile?.settings?.avatar_url || 
    `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}` || 
    "/lovable-uploads/15ae0b1f-4953-4631-bb5f-5243dc03e289.png";

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(profile.email || user?.email || '');
      setBio(profile.settings?.bio || 'I will inspire 10 million people to do what they love the best they can!');
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
      // Update will happen via the mutate function
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', session.user.id);
      
      if (profileError) throw profileError;
      
      // Update user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          username: username,
          phone_number: phone,
          bio: bio
        });
      
      if (settingsError) throw settingsError;
      
      toast.success("Profile changes saved successfully!");
      mutate(); // Refresh profile data
      
      // Navigate back after saving
      setTimeout(() => navigate('/resident-profile'), 1000);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Display a loading state while profile data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
          <button onClick={handleBack} className="flex items-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Edit Profile</h1>
          <div className="w-6"></div> {/* Empty div for spacing */}
        </div>

        <div className="px-5 py-6 max-w-lg mx-auto">
          {/* Profile Avatar */}
          <motion.div 
            className="flex flex-col items-center mb-8"
            custom={0}
            variants={itemVariants}
          >
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <img 
                  src={avatarPhoto} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div 
                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 border-2 border-white cursor-pointer"
                onClick={handleImageClick}
              >
                <Camera className="w-4 h-4 text-white" />
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
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">Tap to change profile picture</p>
          </motion.div>

          {/* Personal Information Card */}
          <motion.div 
            className="mb-6"
            custom={1}
            variants={itemVariants}
          >
            <Card className="mb-5">
              <CardContent className="p-0">
                <div className="bg-blue-50 p-4">
                  <h2 className="text-base font-medium text-blue-900">Personal Information</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-500 flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <Input 
                      value={`${firstName} ${lastName}`} 
                      onChange={(e) => {
                        const [first, ...rest] = e.target.value.split(' ');
                        setFirstName(first || '');
                        setLastName(rest.join(' ') || '');
                      }} 
                      className="border border-gray-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-500 flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      Username
                    </label>
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      className="border border-gray-200"
                      placeholder="Enter your username"
                      prefix="@"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="flex items-center justify-between border border-gray-200 rounded-md">
                      <Input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-0 focus-visible:ring-0"
                        readOnly
                        disabled
                      />
                      <span className="text-blue-500 text-xs font-medium pr-3">Verified</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <div className="flex items-center gap-1 px-3 bg-gray-50 border-r border-gray-200 rounded-l-md h-10">
                        <span className="text-sm">+63</span>
                      </div>
                      <Input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-0 rounded-l-none focus-visible:ring-0"
                        placeholder="9xxxxxxxxx"
                        type="tel"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Date of Birth
                    </label>
                    <div className="flex items-center justify-between border border-gray-200 rounded-md p-3">
                      <span>{birthdate}</span>
                      <Calendar className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm text-gray-500">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full border border-gray-200 rounded-md p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
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
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </div>

        <MobileNavbar />
      </motion.div>
    </>
  );
}
