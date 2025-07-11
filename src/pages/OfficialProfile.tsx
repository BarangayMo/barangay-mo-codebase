
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

  // Get official profile data
  const { data: officialProfile, isLoading } = useQuery({
    queryKey: ['official-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Barangay Profile</h1>
          <Link to="/edit-profile">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={officialProfile?.logo_url || barangayDetails?.Logo} />
                <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                  {barangayDetails?.Logo ? (
                    <img src={barangayDetails.Logo} alt="Barangay Logo" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(officialProfile?.first_name, officialProfile?.last_name)
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle className="text-2xl">
                  {officialProfile?.barangay || 'Unknown Barangay'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {officialProfile?.municipality}, {officialProfile?.province}
                </p>
                <Badge className="mt-2" variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="council">Council</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Barangay Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>{barangayDetails?.["Mobile Number"] || barangayDetails?.["Telephone No"] || "Not available"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Founded: {barangayDetails?.["Foundation Date"] || "Not specified"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3" />
                  <span>Population: {barangayDetails?.Population || "Not specified"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>Land Area: {barangayDetails?.["Land Area"] || "Not specified"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {barangayDetails?.["Ambulance Phone"] && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Ambulance</span>
                    <span className="font-medium">{barangayDetails["Ambulance Phone"]}</span>
                  </div>
                )}
                {barangayDetails?.["Fire Department Phone"] && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Fire Department</span>
                    <span className="font-medium">{barangayDetails["Fire Department Phone"]}</span>
                  </div>
                )}
                {barangayDetails?.["Local Police Contact"] && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Local Police</span>
                    <span className="font-medium">{barangayDetails["Local Police Contact"]}</span>
                  </div>
                )}
                {barangayDetails?.["VAWC Hotline No"] && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">VAWC Hotline</span>
                    <span className="font-medium">{barangayDetails["VAWC Hotline No"]}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Region</label>
                    <p className="text-gray-900">{barangayDetails?.REGION || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Province</label>
                    <p className="text-gray-900">{barangayDetails?.PROVINCE || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City/Municipality</label>
                    <p className="text-gray-900">{barangayDetails?.["CITY/MUNICIPALITY"] || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Barangay</label>
                    <p className="text-gray-900">{barangayDetails?.BARANGAY || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Street</label>
                    <p className="text-gray-900">{barangayDetails?.Street || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                    <p className="text-gray-900">{barangayDetails?.["ZIP Code"] || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="council" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Barangay Council</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {officialProfile?.officials_data ? (
                    <div className="grid gap-4">
                      {Object.entries(officialProfile.officials_data).map(([position, official]: [string, any]) => (
                        <div key={position} className="flex items-center justify-between py-3 border-b">
                          <div>
                            <p className="font-medium">{position}</p>
                            <p className="text-sm text-gray-600">
                              {official?.firstName} {official?.middleName} {official?.lastName} {official?.suffix}
                            </p>
                          </div>
                          <Badge variant="outline">{position}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No council information available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{user?.email}</span>
                </div>
                <Badge variant={isEmailConfirmed ? "default" : "secondary"} className="text-xs">
                  {isEmailConfirmed ? "Confirmed" : "Unconfirmed"}
                </Badge>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-3" />
                <span>ID: {officialProfile?.id.slice(0, 8)}...</span>
              </div>
              {user?.createdAt && (
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
