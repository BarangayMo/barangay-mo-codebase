
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit,
  Shield,
  Phone,
  Building,
  Users,
  FileText,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function OfficialProfile() {
  const { user, session } = useAuth();

  // Get official profile data - fetch from officials table if user is an official
  const { data: officialProfile, isLoading } = useQuery({
    queryKey: ['official-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      // First try to get the official data from officials table
      const { data: officialData, error: officialError } = await supabase
        .from('officials')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();
      
      if (officialData) {
        console.log('Found official data:', officialData);
        return {
          id: user.id,
          first_name: officialData.first_name,
          last_name: officialData.last_name,
          middle_name: officialData.middle_name,
          suffix: officialData.suffix,
          phone_number: officialData.phone_number,
          landline_number: officialData.landline_number,
          email: officialData.email,
          barangay: officialData.barangay,
          municipality: officialData.municipality,
          province: officialData.province,
          region: officialData.region,
          position: officialData.position,
          // Add required fields that might be missing
          avatar_url: null,
          role: 'official' as any,
          is_approved: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          officials_data: null,
          logo_url: null
        };
      }
      
      // Fallback to profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return profile;
    },
    enabled: !!user?.id
  });

  // Get barangay details
  const { data: barangayDetails } = useQuery({
    queryKey: ['barangay-details', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return null;
      
      const { data, error } = await supabase
        .from('Barangays')
        .select('*')
        .eq('BARANGAY', officialProfile.barangay)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!officialProfile?.barangay
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Check email confirmation status
  const isEmailConfirmed = session?.user?.email_confirmed_at ? true : false;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Red Header Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Barangay Profile</h1>
            <Link to="/edit-profile">
              <Button variant="outline" className="flex items-center gap-2 bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-white/20">
              <AvatarImage src={(officialProfile as any)?.logo_url || barangayDetails?.Logo} />
              <AvatarFallback className="text-3xl font-semibold bg-white/20 text-white">
                {barangayDetails?.Logo ? (
                  <img src={barangayDetails.Logo} alt="Barangay Logo" className="w-full h-full object-cover" />
                ) : (
                  getInitials(officialProfile?.first_name, officialProfile?.last_name)
                )}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-4xl font-bold mb-2">
                {officialProfile?.barangay || 'Unknown Barangay'}
              </h2>
              <p className="text-xl text-red-100 mb-3">
                {officialProfile?.municipality}, {officialProfile?.province}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Badge>
                <Badge variant={isEmailConfirmed ? "default" : "secondary"} className="bg-white/20 text-white border-white/30">
                  <Mail className="w-3 h-3 mr-1" />
                  {isEmailConfirmed ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="council">Council</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-red-600" />
                  Barangay Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Number</p>
                      <p className="font-medium">{barangayDetails?.["Mobile Number"] || barangayDetails?.["Telephone No"] || "Not available"}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Founded</p>
                      <p className="font-medium">{barangayDetails?.["Foundation Date"] || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Population</p>
                      <p className="font-medium">{barangayDetails?.Population || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Land Area</p>
                      <p className="font-medium">{barangayDetails?.["Land Area"] || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Phone className="w-5 h-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {barangayDetails?.["Ambulance Phone"] && (
                  <div className="flex items-center justify-between py-3 border-b border-red-100">
                    <span className="text-gray-600 font-medium">Ambulance</span>
                    <span className="font-bold text-red-600">{barangayDetails["Ambulance Phone"]}</span>
                  </div>
                )}
                {barangayDetails?.["Fire Department Phone"] && (
                  <div className="flex items-center justify-between py-3 border-b border-red-100">
                    <span className="text-gray-600 font-medium">Fire Department</span>
                    <span className="font-bold text-red-600">{barangayDetails["Fire Department Phone"]}</span>
                  </div>
                )}
                {barangayDetails?.["Local Police Contact"] && (
                  <div className="flex items-center justify-between py-3 border-b border-red-100">
                    <span className="text-gray-600 font-medium">Local Police</span>
                    <span className="font-bold text-red-600">{barangayDetails["Local Police Contact"]}</span>
                  </div>
                )}
                {barangayDetails?.["VAWC Hotline No"] && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 font-medium">VAWC Hotline</span>
                    <span className="font-bold text-red-600">{barangayDetails["VAWC Hotline No"]}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Region</label>
                    <p className="text-gray-900 font-medium">{barangayDetails?.REGION || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Province</label>
                    <p className="text-gray-900 font-medium">{barangayDetails?.PROVINCE || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City/Municipality</label>
                    <p className="text-gray-900 font-medium">{barangayDetails?.["CITY/MUNICIPALITY"] || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barangay</label>
                    <p className="text-gray-900 font-medium">{barangayDetails?.BARANGAY || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Street</label>
                    <p className="text-gray-900 font-medium">{barangayDetails?.Street || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                    <p className="text-gray-900 font-medium">{barangayDetails?.["ZIP Code"] || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="council" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Users className="w-5 h-5" />
                  Barangay Council
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(officialProfile as any)?.officials_data ? (
                    <div className="grid gap-4">
                      {Object.entries((officialProfile as any).officials_data).map(([position, official]: [string, any]) => (
                        <div key={position} className="flex items-center justify-between py-4 border-b border-red-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {official?.firstName} {official?.middleName} {official?.lastName} {official?.suffix}
                              </p>
                              <p className="text-sm text-gray-600">{position}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-red-200 text-red-700">{position}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No council information available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <Badge variant={isEmailConfirmed ? "default" : "secondary"} className={isEmailConfirmed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                  {isEmailConfirmed ? "Confirmed" : "Unconfirmed"}
                </Badge>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-3 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Account ID</p>
                  <p className="font-medium">{officialProfile?.id.slice(0, 8)}...</p>
                </div>
              </div>
              {user?.createdAt && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
