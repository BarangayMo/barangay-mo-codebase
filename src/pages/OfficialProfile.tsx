import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit,
  Shield,
  Activity,
  Settings,
  Building,
  Phone
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function OfficialProfile() {
  const { user } = useAuth();
  const { profile, isLoading } = useUserProfile();
  const { toast } = useToast();
  
  if (isLoading) {
    return (
      <AdminLayout title="My Profile">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'official':
        return 'bg-blue-100 text-blue-800';
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'resident':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <AdminLayout title="My Profile">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <Link to="/edit-profile">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(profile?.first_name, profile?.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl">
                  {profile?.first_name} {profile?.last_name}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  <Badge className={getRoleColor(profile?.role)} variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                  </Badge>
                  {profile?.barangay && (
                    <div className="flex items-start gap-1 text-gray-600 min-w-0">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words leading-relaxed">
                        {profile.barangay}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                {profile?.phone_number && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{profile.phone_number}</span>
                  </div>
                )}
                {profile?.municipality && (
                  <div className="flex items-center text-gray-600">
                    <Building className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{profile.municipality}</span>
                  </div>
                )}
                {profile?.created_at && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">ID: {profile?.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Activity className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Status: Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/official/residents">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <User className="w-6 h-6" />
                  <span>Manage Residents</span>
                </Button>
              </Link>
              <Link to="/official/services">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Shield className="w-6 h-6" />
                  <span>Services</span>
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Settings className="w-6 h-6" />
                  <span>Account Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
