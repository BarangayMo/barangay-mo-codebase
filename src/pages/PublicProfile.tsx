
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Package, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PublicProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  avatar_url: string | null;
  created_at: string | null;
  // Public bio and contact info
  bio?: string;
  location?: string;
  verified?: boolean;
  rating?: number;
  total_reviews?: number;
}

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPublicProfile();
  }, [id]);

  const loadPublicProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          role,
          avatar_url,
          created_at
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error loading profile",
        description: "Could not load user profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
            <p className="text-gray-600">The requested profile could not be found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous User';
  const joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{displayName}</h1>
                  {profile.role && (
                    <Badge variant="secondary" className="w-fit">
                      {profile.role}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{profile.rating || '0.0'} ({profile.total_reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            {profile.bio && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <h3 className="font-semibold">Marketplace Activity</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">No public marketplace activity to display.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-semibold">Community Contributions</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">No public contributions to display.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
