import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  FileText, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Building,
  MapPin,
  Phone,
  Mail,
  Shield,
  Settings,
  BarChart3,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { QuickAccessPanel } from "@/components/officials/QuickAccessPanel";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";
import { Link } from "react-router-dom";

export default function OfficialsDashboard() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [selectedOfficial, setSelectedOfficial] = useState<any>(null);

  const mockOfficials = [
    { id: 1, name: "Juan Dela Cruz", position: "Barangay Captain", status: "Active" },
    { id: 2, name: "Maria Santos", position: "Barangay Secretary", status: "Active" },
    { id: 3, name: "Jose Rizal", position: "Treasurer", status: "Inactive" },
  ];

  const budgetData = [
    { name: "Infrastructure", value: 40000 },
    { name: "Health", value: 30000 },
    { name: "Education", value: 20000 },
    { name: "Social Services", value: 10000 },
  ];

  const recentActivities = [
    {
      title: "Document Approved",
      description: "New Barangay Resolution Approved",
      time: "2 hours ago",
      type: "document",
    },
    {
      title: "New Resident Registered",
      description: "A new resident has registered in Barangay",
      time: "5 hours ago",
      type: "resident",
    },
    {
      title: "Meeting Scheduled",
      description: "Meeting with the Barangay Council",
      time: "Yesterday",
      type: "meeting",
    },
    {
      title: "Complaint Filed",
      description: "A resident filed a complaint about garbage",
      time: "2 days ago",
      type: "complaint",
    },
  ];

  // Get actual location data from user profile
  const getLocationText = () => {
    if (profile?.municipality && profile?.province) {
      return `${profile.municipality}, ${profile.province}`;
    }
    if (profile?.barangay) {
      return profile.barangay;
    }
    return "Location not set";
  };

  // Get Punong Barangay name from officials data
  const getPunongBarangayName = () => {
    if (profile?.officials_data && Array.isArray(profile.officials_data)) {
      const punongBarangay = profile.officials_data.find(
        (official: any) => official.position === "Punong Barangay"
      );
      if (punongBarangay) {
        const firstName = punongBarangay.firstName || punongBarangay.FIRSTNAME;
        const lastName = punongBarangay.lastName || punongBarangay.LASTNAME;
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        }
      }
    }
    return "Punong Barangay";
  };

  // Get Barangay Secretary name from officials data
  const getBarangaySecretaryName = () => {
    if (profile?.officials_data && Array.isArray(profile.officials_data)) {
      const secretary = profile.officials_data.find(
        (official: any) => official.position === "Barangay Secretary"
      );
      if (secretary) {
        const firstName = secretary.firstName || secretary.FIRSTNAME;
        const lastName = secretary.lastName || secretary.LASTNAME;
        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        }
      }
    }
    return "Barangay Secretary";
  };

  // Get actual location data from user profile
  const getLocationData = () => {
    const municipality = profile?.municipality;
    const province = profile?.province;
    
    if (municipality && province) {
      return `${municipality}, ${province}`;
    }
    if (profile?.barangay) {
      return profile.barangay;
    }
    return "Location not set";
  };

  // Show logo if available, otherwise show initials
  const getLogoDisplay = () => {
    if (profile?.logo_url) {
      return (
        <img 
          src={profile.logo_url} 
          alt="Barangay Logo" 
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
        />
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-red-100 border-2 border-white shadow-lg flex items-center justify-center text-sm font-bold text-red-600">
        BO
      </div>
    );
  };

  return (
    <AdminLayout title="Officials Dashboard">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getLogoDisplay()}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-outfit">
                  {getPunongBarangayName()}
                </h1>
                <p className="text-red-600 font-medium">{getLocationData()}</p>
                <p className="text-sm text-gray-600">Barangay Officials Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/official/profile">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link to="/official/reports">
                <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Quick Access Panel */}
        <QuickAccessPanel />

        {/* Grid Layout for Charts and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Allocation Chart */}
          <BudgetAllocationChart />

          {/* Officials Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Barangay Officials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{getPunongBarangayName()}</p>
                      <p className="text-sm text-gray-600">Punong Barangay</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{getBarangaySecretaryName()}</p>
                      <p className="text-sm text-gray-600">Barangay Secretary</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'document' ? 'bg-blue-100' :
                      activity.type === 'resident' ? 'bg-green-100' :
                      activity.type === 'meeting' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      {activity.type === 'document' && <FileText className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'resident' && <UserPlus className="w-4 h-4 text-green-600" />}
                      {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'complaint' && <AlertCircle className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
