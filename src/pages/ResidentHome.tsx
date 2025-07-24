import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useRbiStatus } from "@/hooks/use-rbi-status";
import { 
  FileText, 
  Users, 
  Calendar, 
  MapPin, 
  Bell, 
  MessageCircle, 
  ShoppingCart,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ResidentHome() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { rbiStatus, isLoading: rbiLoading } = useRbiStatus();

  const firstName = profile?.first_name || 'Resident';

  const quickActions = [
    {
      title: "Barangay Services",
      description: "Access essential services",
      icon: FileText,
      href: "/services",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Community Forum",
      description: "Connect with neighbors",
      icon: Users,
      href: "/community",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Events Calendar",
      description: "Stay updated on events",
      icon: Calendar,
      href: "/events",
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Marketplace",
      description: "Buy and sell local products",
      icon: ShoppingCart,
      href: "/marketplace",
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Job Listings",
      description: "Find local job opportunities",
      icon: Briefcase,
      href: "/jobs",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Report Incident",
      description: "Report safety concerns",
      icon: AlertTriangle,
      href: "/report-incident",
      color: "bg-yellow-100 text-yellow-600"
    }
  ];

  const announcements = [
    {
      title: "Road Closure Notice",
      description: "Main street will be closed for repairs on July 15th.",
      date: "July 10, 2024"
    },
    {
      title: "Community Meeting",
      description: "Discuss upcoming barangay projects on July 20th.",
      date: "July 5, 2024"
    },
    {
      title: "Free Health Clinic",
      description: "Free check-ups available at the barangay hall on July 25th.",
      date: "June 30, 2024"
    }
  ];

  const upcomingEvents = [
    {
      title: "Barangay Fiesta",
      location: "Barangay Plaza",
      day: "15",
      month: "Jul",
      time: "6:00 PM"
    },
    {
      title: "Clean-Up Drive",
      location: "Riverside Area",
      day: "22",
      month: "Jul",
      time: "8:00 AM"
    },
    {
      title: "Sports Tournament",
      location: "Sports Complex",
      day: "29",
      month: "Jul",
      time: "2:00 PM"
    }
  ];

  const recentServices = [
    {
      title: "Barangay Clearance",
      description: "Requested on July 1, 2024",
      status: "Completed"
    },
    {
      title: "Business Permit",
      description: "Requested on June 25, 2024",
      status: "Pending"
    },
    {
      title: "Resident ID",
      description: "Requested on June 20, 2024",
      status: "Completed"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening in your barangay today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                <MapPin className="w-4 h-4 mr-1" />
                {profile?.barangay || 'Barangay'}
              </Badge>
            </div>
          </div>
        </div>

        {/* RBI Status Alert */}
        {!rbiLoading && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {rbiStatus?.status === 'approved' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : rbiStatus?.status === 'pending' ? (
                  <Clock className="w-5 h-5 text-yellow-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium">
                    {rbiStatus?.status === 'approved' ? 'RBI Form Approved' :
                     rbiStatus?.status === 'pending' ? 'RBI Form Under Review' :
                     'Complete Your RBI Form'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {rbiStatus?.status === 'approved' ? 'You have full access to all barangay services' :
                     rbiStatus?.status === 'pending' ? 'Your application is being reviewed by officials' :
                     'Complete your Resident Basic Information form to access all services'}
                  </p>
                </div>
              </div>
              {rbiStatus?.status !== 'approved' && (
                <Link to="/rbi-registration">
                  <Button size="sm">
                    {rbiStatus?.status === 'pending' ? 'View Status' : 'Complete RBI'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Latest Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <h4 className="font-medium text-sm">{announcement.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{announcement.description}</p>
                    <span className="text-xs text-gray-500">{announcement.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">{event.day}</div>
                      <div className="text-xs text-gray-600">{event.month}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600">{event.location}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{service.title}</h4>
                      <p className="text-xs text-gray-600">{service.description}</p>
                    </div>
                    <Badge variant={service.status === 'Completed' ? 'default' : 'secondary'}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
