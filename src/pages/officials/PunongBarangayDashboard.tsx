
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  UserPlus,
  Calendar,
  Megaphone,
  FileText,
  Users,
  Settings,
  MapPin,
  Bell,
  Plus,
  UserCheck,
  Shield,
  Search,
  Eye,
  MessageCircle,
  UserMinus,
  MoreVertical,
  Edit,
  Lock,
  Globe,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useOfficials } from "@/hooks/use-officials-data";

const PunongBarangayDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Fetch officials data for council section
  const { data: officials = [] } = useOfficials();

  // Fetch residents data
  const { data: residents = [], isLoading: residentsLoading } = useQuery({
    queryKey: ['pb-residents', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get official's barangay first
      const { data: officialProfile } = await supabase
        .from('profiles')
        .select('barangay')
        .eq('id', user.id)
        .single();

      if (!officialProfile?.barangay) return [];

      // Get residents in the same barangay
      const { data: residents, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          barangay,
          role,
          created_at,
          last_login,
          status
        `)
        .eq('barangay', officialProfile.barangay)
        .eq('role', 'resident')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return residents || [];
    },
    enabled: !!user?.id && activeTab === 'residents'
  });

  const filteredResidents = residents.filter(resident => 
    `${resident.first_name} ${resident.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickActions = [
    {
      title: "Add Resident",
      description: "Add resident information",
      icon: UserPlus,
      action: () => console.log("Add resident"),
    },
    {
      title: "Schedule Event",
      description: "Schedule barangay event",
      icon: Calendar,
      action: () => console.log("Schedule event"),
    },
    {
      title: "Create Announcement",
      description: "Post important announcement",
      icon: Megaphone,
      action: () => console.log("Create announcement"),
    },
    {
      title: "Post an Advertisement",
      description: "Post important announcement",
      icon: FileText,
      action: () => console.log("Post advertisement"),
    },
  ];

  const upcomingEvents = [
    {
      title: "Tree Planting Day",
      category: "Environmental",
      date: "Nov 17 to Nov 17",
      type: "Announcements",
    },
    {
      title: "Year-End Celebration",
      category: "Civic Engagement &",
      date: "Dec 21 to Dec 21",
      type: "Outreach",
    },
  ];

  const galleryImages = [
    "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
  ];

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: MapPin,
    },
    {
      id: "residents",
      label: "Residents",
      icon: Users,
    },
    {
      id: "council",
      label: "Council",
      icon: Shield,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "residents":
        return (
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Residents Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search residents..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {residentsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredResidents.map((resident) => (
                      <div key={resident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm">
                              {resident.first_name?.[0]}{resident.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {resident.first_name} {resident.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined {format(new Date(resident.created_at), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={resident.status === 'online' ? 'default' : 'secondary'}
                            className={`text-xs ${resident.status === 'online' ? 'bg-green-100 text-green-700' : ''}`}
                          >
                            {resident.status || 'offline'}
                          </Badge>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <UserMinus className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                    
                    {filteredResidents.length === 0 && !residentsLoading && (
                      <div className="text-center py-8 text-gray-500">
                        {searchQuery ? 'No residents found matching your search' : 'No residents found'}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case "council":
        return (
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Barangay Council</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Current barangay officials and their positions.</p>
                <div className="space-y-3">
                  {officials.map((official) => (
                    <div key={official.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {official.position === 'Punong Barangay' && <UserCheck className="h-5 w-5 text-green-600" />}
                        {official.position === 'Barangay Secretary' && <Edit className="h-5 w-5 text-blue-600" />}
                        {official.position === 'Barangay Treasurer' && <Shield className="h-5 w-5 text-purple-600" />}
                        {official.position === 'Barangay Councilor' && <Users className="h-5 w-5 text-orange-600" />}
                        {official.position === 'SK Chairman' && <UserCheck className="h-5 w-5 text-indigo-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{official.position}</div>
                        <div className="text-xs text-gray-600">
                          {official.years_of_service} years of service • {official.status}
                        </div>
                        {official.contact_email && (
                          <div className="text-xs text-gray-500 mt-1">{official.contact_email}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={official.status === 'active' ? 'default' : 'secondary'}
                          className={`text-xs ${official.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {official.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {officials.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No officials found in the database
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Punong Barangay Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Edit className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Profile Settings</div>
                      <div className="text-xs text-gray-600">Update your personal information</div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Barangay Information</div>
                      <div className="text-xs text-gray-600">Update barangay details and contact info</div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Notification Preferences</div>
                      <div className="text-xs text-gray-600">Configure how you receive notifications</div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Lock className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Security Settings</div>
                      <div className="text-xs text-gray-600">Change password and security options</div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Palette className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">App Appearance</div>
                      <div className="text-xs text-gray-600">Customize the look and feel</div>
                    </div>
                    <Button variant="outline" size="sm">Customize</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="p-4 space-y-4">
            {/* Barangay Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Barangay Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Welcome to the Punong Barangay Dashboard. Here you can manage and oversee all operations within the barangay. This includes monitoring community activities, addressing resident concerns, and ensuring the overall well-being of the barangay.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Population Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Population Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">Unknown</div>
                    <div className="text-sm text-gray-600">Population</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">10</div>
                    <div className="text-sm text-gray-600">Active Residents</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={action.action}
                    >
                      <action.icon className="h-5 w-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-gray-600">{action.description}</div>
                      </div>
                      <div className="text-gray-400">›</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Events Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Events</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Calendar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <button>‹</button>
                    <span className="font-medium">April 2025</span>
                    <button>›</button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    <div className="p-2 text-center font-medium text-gray-600">Sun</div>
                    <div className="p-2 text-center font-medium text-gray-600">Mon</div>
                    <div className="p-2 text-center font-medium text-gray-600">Tue</div>
                    <div className="p-2 text-center font-medium text-gray-600">Wed</div>
                    <div className="p-2 text-center font-medium text-gray-600">Thu</div>
                    <div className="p-2 text-center font-medium text-gray-600">Fri</div>
                    <div className="p-2 text-center font-medium text-gray-600">Sat</div>
                    {renderCalendar()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Bell className="h-4 w-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-gray-600">{event.category}</div>
                        <div className="text-xs text-gray-600">{event.type}</div>
                        <div className="text-xs text-gray-500">{event.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className="p-2 text-center text-sm">
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-red-600 relative">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex items-center gap-3">
          <ArrowLeft 
            className="h-6 w-6 cursor-pointer" 
            onClick={() => navigate(-1)}
          />
          <h1 className="text-lg font-semibold">PB Dashboard</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b relative">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center gap-1 p-3 flex-1 relative ${
                activeTab === tab.id 
                  ? "text-red-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
              )}
            </button>
          ))}
        </div>
        {/* Fixed underline container */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
      </div>

      {/* Content with curved top */}
      <div className="bg-gray-50 min-h-screen rounded-t-lg pb-24">
        {renderTabContent()}
      </div>

      {/* Floating POST TO COMMUNITY Button - Mobile Only */}
      {isMobile && (
        <Button 
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg z-50"
          onClick={() => console.log("Post to community")}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default PunongBarangayDashboard;
