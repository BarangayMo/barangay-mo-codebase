
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
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
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useResidentProfile } from "@/hooks/use-resident-profile";
import { useLocation, Link } from "react-router-dom";
import RbiFormsSection from "@/components/users/profile/RbiFormsSection";
import RbiSubmissionSuccess from "@/components/rbi/RbiSubmissionSuccess";

export default function ResidentProfile() {
  const { user } = useAuth();
  const { profile, isLoading } = useResidentProfile();
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rbiNumber, setRbiNumber] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.showSuccess && location.state?.rbiNumber) {
      setRbiNumber(location.state.rbiNumber);
      setShowSuccessModal(true);
    }
  }, [location.state]);

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
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Success Modal */}
        {showSuccessModal && rbiNumber && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <RbiSubmissionSuccess 
                rbiNumber={rbiNumber}
                onClose={() => setShowSuccessModal(false)}
              />
            </div>
          </div>
        )}

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
                <AvatarImage src={profile?.settings?.avatar_url} />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(profile?.first_name, profile?.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">
                  {profile?.first_name} {profile?.last_name}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className={getRoleColor(user?.role)} variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </Badge>
                  {profile?.barangay && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{profile.barangay}</span>
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
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{profile?.email}</span>
                </div>
                {user?.createdAt && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-3" />
                  <span>ID: {profile?.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Activity className="w-5 h-5 mr-3" />
                  <span>Status: Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RBI Forms Section */}
        <RbiFormsSection />

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
              <Link to="/rbi-registration">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <User className="w-6 h-6" />
                  <span>Submit RBI Form</span>
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Shield className="w-6 h-6" />
                  <span>View Services</span>
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

        {/* Recent Activity */}
        {profile?.activities && profile.activities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <span className="text-gray-600">{activity.activity_type}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
