
import { ArrowLeft, MoreHorizontal, ShoppingCart, Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileNavbar } from "@/components/layout/MobileNavbar";

export default function ResidentProfile() {
  const coverPhoto = "/lovable-uploads/c7d7f7a8-491d-49f1-910c-bb4dd5a85996.png";
  const avatarPhoto = "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=facearea&w=300&q=80";
  const name = "Kim Parkinson";
  const username = "theunderdog";
  const verified = true;
  const bio = "I will inspire 10 million people to do what they love the best they can!";
  const barangay = "New Cabalan, Olongapo City";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3eafc] via-[#f9fafc] to-[#fae5df] pb-20">
      {/* Header with Image */}
      <div className="relative rounded-b-[32px] overflow-hidden shadow-lg bg-white mb-0">
        <img src={coverPhoto} alt="Cover" className="w-full h-[210px] sm:h-[240px] object-cover" />
        
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-2 py-2">
          <Link to="/" className="bg-white/80 rounded-full p-[6px]">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </Link>
          <button className="bg-white/80 rounded-full p-[6px]">
            <MoreHorizontal className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        
        <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
          <div className="relative">
            <img src={avatarPhoto} alt="Avatar" className="w-32 h-32 rounded-full border-[5px] border-white object-cover shadow-xl" />
          </div>
        </div>
      </div>

      <main className="max-w-lg w-full mx-auto mt-20 p-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            {verified && (
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            )}
          </div>
          <p className="text-gray-500 mb-2">@{username}</p>
          <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            {barangay}
          </div>
          <p className="text-gray-700 mb-6">{bio}</p>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/marketplace">
              <Button variant="outline" className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Marketplace
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" className="w-full">
                <Briefcase className="w-4 h-4 mr-2" />
                Jobs
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <MobileNavbar />
    </div>
  );
}
