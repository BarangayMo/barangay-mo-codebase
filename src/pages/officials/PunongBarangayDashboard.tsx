import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const PunongBarangayDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");

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
    
    // Navigate to different pages based on tab
    switch (tabId) {
      case "residents":
        navigate("/official/residents");
        break;
      case "council":
        console.log("Navigate to council management");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        // Stay on dashboard
        break;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "residents":
        return (
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Residents Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Manage barangay residents and their information.</p>
                <Button onClick={() => navigate("/official/residents")} className="bg-red-600 hover:bg-red-700">
                  View All Residents
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case "council":
        return (
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Barangay Council</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Manage council members and their roles.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Council Members</div>
                      <div className="text-sm text-gray-600">View and manage council</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Configure barangay settings and preferences.</p>
                <Button onClick={() => navigate("/settings")} className="bg-red-600 hover:bg-red-700">
                  Open Settings
                </Button>
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
    <div className="min-h-screen bg-gray-50 relative">
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
      <div className="bg-white border-b">
        <div className="flex justify-around relative">
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

      {/* Content */}
      <div className="pb-24">
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
