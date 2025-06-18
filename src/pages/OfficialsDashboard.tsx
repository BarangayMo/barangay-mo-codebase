
import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";
import { QuickAccessPanel } from "@/components/officials/QuickAccessPanel";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Plus, Search, Bell, Filter, Users, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const OfficialsDashboard = () => {
  return (
    <Layout>
      <Helmet>
        <title>Officials Dashboard - Barangay Management System</title>
      </Helmet>
      
      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="max-w-7xl mx-auto py-4 px-4">
          {/* Mobile Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-gray-600">Total Residents</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-gray-600">RBI Submissions</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <p className="text-2xl font-bold text-gray-900">14</p>
                </div>
                <p className="text-sm text-gray-600">Puroks</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-green-600">Active</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-sm text-gray-600">Services</p>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Quick Access Panel */}
          <QuickAccessPanel />

          {/* Mobile Community Section */}
          <Card className="mt-6 bg-white shadow-sm border border-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Recent Residents</h3>
                <Link to="/official/residents" className="text-red-500 text-sm font-medium">View All</Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Maria Santos", image: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" },
                  { name: "Juan Dela Cruz", image: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" }
                ].map((person, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mb-2">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={person.image} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-xs text-center text-gray-700">{person.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="min-h-screen bg-gray-50">
          {/* Desktop Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">Barangay Management</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Dashboard</span>
                  <span>/</span>
                  <span>Overview</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search residents, services..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" />
                  <AvatarFallback>BO</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Desktop Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-red-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🏛️</span>
                  </div>
                  <span className="font-semibold text-gray-900">Barangay Portal</span>
                </div>

                {/* Quick Actions Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Resident Management", icon: "👥", href: "/official/residents" },
                      { name: "Community Services", icon: "🏥", href: "/official/services" },
                      { name: "RBI Forms", icon: "📋", href: "/official/rbi-forms" },
                      { name: "Emergency Response", icon: "🚨", href: "/official/emergency-responder" }
                    ].map((item, index) => (
                      <Link key={index} to={item.href} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Main Menu Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Administration</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Dashboard", icon: "🏠", active: true },
                      { name: "Requests & Complaints", icon: "📝", href: "/official/requests" },
                      { name: "Messages", icon: "💬", href: "/messages" },
                      { name: "Reports", icon: "📊", href: "/official/reports" },
                      { name: "Documents", icon: "📁", href: "/official/documents" },
                      { name: "Settings", icon: "⚙️", href: "/settings" }
                    ].map((item, index) => (
                      <Link key={index} to={item.href || "/official-dashboard"} className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer ${
                        item.active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                      }`}>
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="bg-blue-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">📱</span>
                      </div>
                      <span className="text-sm font-medium text-blue-800">Mobile App Available</span>
                    </div>
                    <p className="text-xs text-blue-700 mb-2">Download for residents</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" />
                      <AvatarFallback>BO</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Barangay Official</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Main Content */}
            <div className="flex-1 p-6">
              {/* Community Overview Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Community Overview</h2>
                    <p className="text-lg text-blue-600 mt-2">Serving 1,247 residents across 14 puroks</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      This Month
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Community Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">New Registrations</p>
                        <p className="text-2xl font-bold text-gray-900">32</p>
                        <p className="text-sm text-green-600 flex items-center">
                          ↗ 12% <span className="text-gray-500 ml-1">from last month</span>
                        </p>
                      </div>
                      <div className="w-16 h-8 bg-gradient-to-r from-green-200 to-green-300 rounded"></div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Active Services</p>
                        <p className="text-2xl font-bold text-gray-900">23</p>
                        <p className="text-sm text-blue-600 flex items-center">
                          ↗ 3 new <span className="text-gray-500 ml-1">this month</span>
                        </p>
                      </div>
                      <div className="w-16 h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded"></div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Pending Requests</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                        <p className="text-sm text-orange-600 flex items-center">
                          ↓ 5 resolved <span className="text-gray-500 ml-1">this week</span>
                        </p>
                      </div>
                      <div className="w-16 h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded"></div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Recent Activities Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Activities</h3>
                  <Button variant="ghost" className="text-gray-600">View All</Button>
                </div>

                {/* Activity Status Tabs */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">New Requests</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Completed</span>
                    <Badge variant="secondary">45</Badge>
                  </div>
                </div>

                {/* Activity Cards */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Resident Services */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex -space-x-2">
                        <Avatar className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className="text-xs">M</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className="text-xs">J</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">New resident registrations and service requests this week</h4>
                    <p className="text-sm text-gray-500 mb-4">Status: Processing</p>
                    <p className="text-xs text-gray-400">Last updated: Today</p>
                  </Card>

                  {/* Community Programs */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">A</AvatarFallback>
                      </Avatar>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Medical assistance program: distribute health cards to qualified residents</h4>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Started: June 15, 2024</span>
                        <span>Target: July 15, 2024</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Last updated: 2 days ago</p>
                  </Card>

                  {/* Add New Service Card */}
                  <Card className="p-6 border-dashed border-2 border-gray-300 flex items-center justify-center">
                    <Link to="/official/services" className="flex items-center gap-2 text-gray-500">
                      <Plus className="h-4 w-4" />
                      Add new service
                    </Link>
                  </Card>
                </div>
              </div>
            </div>

            {/* Desktop Right Sidebar */}
            <div className="w-80 bg-white border-l border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Documents</h3>
              <div className="space-y-3">
                {[
                  { name: "Barangay Resolution 2024-15", time: "2 hours ago", color: "bg-yellow-100" },
                  { name: "Budget Allocation Report", time: "1 day ago", color: "bg-purple-100" },
                  { name: "Community Survey Results", time: "2 days ago", color: "bg-pink-100" },
                  { name: "Emergency Response Plan", time: "3 days ago", color: "bg-green-100" },
                  { name: "Monthly Activity Report", time: "1 week ago", color: "bg-orange-100" }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className={`w-8 h-8 ${doc.color} rounded`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">Updated {doc.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Barangay Staff</h3>
                <div className="space-y-3">
                  {[
                    { name: "Captain Rodriguez", role: "Barangay Captain", avatar: "CR" },
                    { name: "Secretary Santos", role: "Barangay Secretary", avatar: "SS" },
                    { name: "Kagawad Reyes", role: "Councilor", avatar: "KR" }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Urgent Alerts</h3>
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">Emergency Response</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">3 pending emergency requests</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-orange-800">RBI Forms</span>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">15 forms need review</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OfficialsDashboard;
