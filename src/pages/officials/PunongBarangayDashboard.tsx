
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
  Image,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PunongBarangayDashboard = () => {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());

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
    <div className="min-h-screen bg-gray-50">
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
        <div className="flex justify-around p-2">
          <button className="flex flex-col items-center gap-1 p-2 border-b-2 border-red-600">
            <MapPin className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Residents</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Council</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="text-xs text-gray-600">Settings</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
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

            {/* POST TO COMMUNITY Button */}
            <Button className="w-full bg-red-600 hover:bg-red-700">
              + POST TO COMMUNITY
            </Button>
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
            <div className="grid grid-cols-2 gap-2 mb-4">
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
            <Button className="w-full bg-red-600 hover:bg-red-700">
              + POST TO COMMUNITY
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PunongBarangayDashboard;
