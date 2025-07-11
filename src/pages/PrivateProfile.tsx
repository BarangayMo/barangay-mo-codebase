
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Users, Award, Mail, Phone, Edit, Settings, Bell, Shield, AlertTriangle, FileText, MessageCircle, Vote, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PrivateProfile() {
  const { user, session } = useAuth();
  const isMobile = useIsMobile();
  
  // Check email confirmation status
  const isEmailConfirmed = session?.user?.email_confirmed_at ? true : false;
  
  // Enhanced user data with detailed activity and emergency access
  const userData = {
    id: user?.id || "1",
    name: user?.name || user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Juan Dela Cruz",
    email: user?.email || "juan.delacruz@example.com",
    phone: "+63 912 345 6789",
    avatar: "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png",
    role: "Barangay Councilor",
    barangay: "Barangay San Jose",
    municipality: "Quezon City",
    joinedDate: "January 2024",
    bio: "Elected Barangay Councilor focused on youth development and environmental protection programs.",
    
    achievements: [
      { name: "Outstanding Councilor 2024", description: "Excellence in youth programs", date: "March 2024" },
      { name: "Community Builder", description: "Led 5 community projects", date: "February 2024" }
    ],
    
    stats: {
      eventsAttended: 12,
      servicesUsed: 8,
      communityScore: 95,
      documentsRequested: 5,
      complaintsSubmitted: 2,
      rbiApplications: 1,
      meetingsAttended: 18
    },
    
    // Detailed Activity Feed with RBI updates, service requests, community participation
    detailedActivity: [
      { 
        id: 1,
        type: "rbi_update", 
        action: "RBI Application Status Updated", 
        detail: "Your Residential Business Information application has been approved",
        date: "1 hour ago",
        status: "approved",
        icon: <FileText className="w-4 h-4" />
      },
      { 
        id: 2,
        type: "service_request", 
        action: "Barangay Clearance Requested", 
        detail: "Application #BC-2024-001 submitted for processing",
        date: "2 days ago",
        status: "processing",
        icon: <FileText className="w-4 h-4" />
      },
      { 
        id: 3,
        type: "community_participation", 
        action: "Attended Barangay Assembly", 
        detail: "Monthly community meeting - discussed new ordinances",
        date: "1 week ago",
        status: "completed",
        icon: <Users className="w-4 h-4" />
      },
      { 
        id: 4,
        type: "service_request", 
        action: "Complaint Filed", 
        detail: "Noise complaint against neighbor - Case #NC-2024-015",
        date: "1 week ago",
        status: "investigating",
        icon: <MessageCircle className="w-4 h-4" />
      },
      { 
        id: 5,
        type: "community_participation", 
        action: "Voted on Ordinance", 
        detail: "Participated in community voting for new curfew ordinance",
        date: "2 weeks ago",
        status: "completed",
        icon: <Vote className="w-4 h-4" />
      },
      { 
        id: 6,
        type: "rbi_update", 
        action: "RBI Document Submitted", 
        detail: "Additional requirements uploaded for business permit",
        date: "3 weeks ago",
        status: "submitted",
        icon: <FileText className="w-4 h-4" />
      }
    ],
    
    // Emergency services based on role
    emergencyServices: [
      { name: "Barangay Emergency Hotline", number: "+63 912 BRGY-EMR", description: "24/7 barangay emergency response" },
      { name: "Police Station 5", number: "+63 912 POLICE-5", description: "Local police emergency line" },
      { name: "Fire Department", number: "+63 912 FIRE-911", description: "Fire emergency and rescue" },
      { name: "Medical Emergency", number: "+63 912 MED-HELP", description: "Barangay health emergency" },
      { name: "Disaster Response", number: "+63 912 DISASTER", description: "Natural disaster emergency response" }
    ],
    
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      communityUpdates: true,
      eventReminders: true
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-50";
      case "processing": return "text-blue-600 bg-blue-50";
      case "investigating": return "text-yellow-600 bg-yellow-50";
      case "completed": return "text-gray-600 bg-gray-50";
      case "submitted": return "text-purple-600 bg-purple-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const handleEmergencyCall = (number: string) => {
    if (confirm(`Are you sure you want to call ${number}? This will initiate an emergency call.`)) {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isMobile && <Header />}
      
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-2xl">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    <Badge variant="secondary">{userData.role}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {userData.barangay}
                    </Badge>
                  </div>
                  <p className="text-gray-600 max-w-md">{userData.bio}</p>
                </div>
                
                <div className="flex gap-2">
                  <Link to="/edit-profile">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{userData.email}</span>
                      </div>
                      <Badge variant={isEmailConfirmed ? "default" : "secondary"} className="text-xs">
                        {isEmailConfirmed ? "Confirmed" : "Unconfirmed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{userData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{userData.municipality}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Joined {userData.joinedDate}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Community Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Events Attended</span>
                      <span className="font-semibold">{userData.stats.eventsAttended}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Services Used</span>
                      <span className="font-semibold">{userData.stats.servicesUsed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Documents Requested</span>
                      <span className="font-semibold">{userData.stats.documentsRequested}</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Community Engagement</span>
                        <span>{userData.stats.communityScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${userData.stats.communityScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/services" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Request Services
                      </Button>
                    </Link>
                    <Link to="/edit-profile" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Link to="/notifications" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Enhanced Activity Tab with Detailed Feed */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Activity Feed</CardTitle>
                  <p className="text-sm text-gray-500">Your complete history of RBI updates, service requests, and community participation</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.detailedActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`p-2 rounded-full ${getActivityStatusColor(activity.status)}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{activity.action}</h4>
                            <Badge variant="outline" className={`text-xs ${getActivityStatusColor(activity.status)} border-0`}>
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{activity.detail}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emergency Services Tab */}
            <TabsContent value="emergency" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <CardTitle className="text-red-600">Emergency Services</CardTitle>
                  </div>
                  <p className="text-sm text-gray-500">Quick access to emergency contacts based on your role and location</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.emergencyServices.map((service, index) => (
                      <Card key={index} className="border-red-200 hover:border-red-300 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{service.name}</h4>
                            <PhoneCall className="w-4 h-4 text-red-500" />
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{service.description}</p>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleEmergencyCall(service.number)}
                          >
                            <PhoneCall className="w-3 h-3 mr-2" />
                            Call {service.number}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h4 className="font-semibold text-red-600">Emergency Guidelines</h4>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Only use emergency numbers for actual emergencies</li>
                      <li>• Provide clear location information when calling</li>
                      <li>• Stay calm and follow dispatcher instructions</li>
                      <li>• Keep this information readily available at all times</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                        <Award className="w-8 h-8 text-yellow-500 mt-1" />
                        <div>
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-gray-600 mb-1">{achievement.description}</div>
                          <div className="text-xs text-gray-500">Earned {achievement.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <Badge variant={userData.preferences.emailNotifications ? "default" : "secondary"}>
                      {userData.preferences.emailNotifications ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Notifications</span>
                    <Badge variant={userData.preferences.smsNotifications ? "default" : "secondary"}>
                      {userData.preferences.smsNotifications ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Community Updates</span>
                    <Badge variant={userData.preferences.communityUpdates ? "default" : "secondary"}>
                      {userData.preferences.communityUpdates ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Event Reminders</span>
                    <Badge variant={userData.preferences.eventReminders ? "default" : "secondary"}>
                      {userData.preferences.eventReminders ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {!isMobile && <Footer />}
    </div>
  );
}
