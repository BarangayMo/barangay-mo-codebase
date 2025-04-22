
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Lock, MapPin, Phone } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function Register() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
        </div>

        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
            alt="Logo" 
            className="h-16 w-auto mx-auto" 
          />
          <h1 className="text-2xl font-bold mt-4">Create Account</h1>
          <p className="text-gray-600">Join your barangay's digital community</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-gray-700">Full Name</Label>
            <div className="relative">
              <Input
                id="fullname"
                type="text"
                placeholder="Juan Dela Cruz"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="juan.delacruz@example.com"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="+63 999 123 4567"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="barangay" className="text-gray-700">Barangay</Label>
            <div className="relative">
              <Input
                id="barangay"
                type="text"
                placeholder="Select your barangay"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="●●●●●●●●"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="terms" className="rounded border-gray-300" />
            <label htmlFor="terms" className="text-sm text-gray-600 font-inter">
              I agree to the <Link to="/terms" className="text-blue-600 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 font-medium">Privacy Policy</Link>
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 transition font-medium text-base"
          >
            Register Account
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm font-inter">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e4ecfc] via-[#fff] to-[#fbedda] px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to home
        </Link>
        
        <h1 className="font-outfit text-2xl md:text-3xl font-bold mb-2 text-gray-900">
          Create your account
        </h1>
        <p className="text-gray-500 mb-6">Join your barangay's digital community</p>
        
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullname-desktop" className="text-gray-700">Full Name</Label>
            <div className="relative">
              <Input
                id="fullname-desktop"
                type="text"
                placeholder="Juan Dela Cruz"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-desktop" className="text-gray-700">Email Address</Label>
            <div className="relative">
              <Input
                id="email-desktop"
                type="email"
                placeholder="juan.delacruz@example.com"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone-desktop" className="text-gray-700">Phone Number</Label>
            <div className="relative">
              <Input
                id="phone-desktop"
                type="tel"
                placeholder="+63 999 123 4567"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="barangay-desktop" className="text-gray-700">Barangay</Label>
            <div className="relative">
              <Input
                id="barangay-desktop"
                type="text"
                placeholder="Select your barangay"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password-desktop" className="text-gray-700">Password</Label>
            <div className="relative">
              <Input
                id="password-desktop"
                type="password"
                placeholder="●●●●●●●●"
                className="pl-10 font-inter border-gray-200 bg-gray-50 rounded-lg focus-visible:ring-blue-500"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input type="checkbox" id="terms-desktop" className="rounded border-gray-300" />
            <label htmlFor="terms-desktop" className="text-sm text-gray-600 font-inter">
              I agree to the <Link to="/terms" className="text-blue-600 font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 font-medium">Privacy Policy</Link>
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 font-inter text-white rounded-lg py-3 transition font-medium text-base"
          >
            Register Account
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm font-inter">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 transition">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
