
import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";
import { QuickAccessPanel } from "@/components/officials/QuickAccessPanel";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Plus, Search, Bell, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
                <p className="text-2xl font-bold text-gray-900">35000</p>
                <p className="text-sm text-gray-600">PSA Population 2024</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-gray-900">10</p>
                <p className="text-sm text-gray-600">RBI as of 2024</p>
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
                  <p className="text-sm text-green-600">45 Years</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">1980</p>
                <p className="text-sm text-gray-600">Founded Year</p>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Quick Access Panel */}
          <QuickAccessPanel />

          {/* Mobile Community Section */}
          <Card className="mt-6 bg-white shadow-sm border border-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Community</h3>
                <span className="text-red-500 text-sm font-medium">View All</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Lester Nadong", image: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" },
                  { name: "Bernadette Nad...", image: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" }
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
                <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Campaigns</span>
                  <span>/</span>
                  <span>Analytics</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" />
                  <AvatarFallback>BM</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Desktop Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">⚡</span>
                  </div>
                  <span className="font-semibold text-gray-900">Dashboard</span>
                </div>

                {/* Favorites Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Favorites</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Technical Docs", icon: "📄" },
                      { name: "Campaign Guidelines", icon: "📋" },
                      { name: "Important Rules", icon: "⚠️" },
                      { name: "Onboarding", icon: "👋" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Menu Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Main Menu</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Dashboard", icon: "🏠", active: true },
                      { name: "Campaigns", icon: "📊" },
                      { name: "Chat", icon: "💬" },
                      { name: "Support Center", icon: "🎧" },
                      { name: "Leads", icon: "👥" },
                      { name: "Archive", icon: "📁" }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer ${
                        item.active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                      }`}>
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="bg-green-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">⚡</span>
                      </div>
                      <span className="text-sm font-medium text-green-800">Get the extension</span>
                    </div>
                    <p className="text-xs text-green-700 mb-2">Install Now</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Amanda Davids</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Main Content */}
            <div className="flex-1 p-6">
              {/* Revenue Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Your total revenue</h2>
                    <p className="text-4xl font-bold text-purple-500 mt-2">$90,239.00</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Select Dates
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </div>
                </div>

                {/* Revenue Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">New subscriptions</p>
                        <p className="text-2xl font-bold text-gray-900">22</p>
                        <p className="text-sm text-green-600 flex items-center">
                          ↗ 15% <span className="text-gray-500 ml-1">compared to last week</span>
                        </p>
                      </div>
                      <div className="w-16 h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded"></div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">New orders</p>
                        <p className="text-2xl font-bold text-gray-900">320</p>
                        <p className="text-sm text-orange-600 flex items-center">
                          ↗ 4% <span className="text-gray-500 ml-1">compared to last week</span>
                        </p>
                      </div>
                      <div className="w-16 h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded"></div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Avg. order revenue</p>
                        <p className="text-2xl font-bold text-gray-900">$1,080</p>
                        <p className="text-sm text-green-600 flex items-center">
                          ↗ 8% <span className="text-gray-500 ml-1">compared to last week</span>
                        </p>
                      </div>
                      <div className="w-16 h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded"></div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Recent Campaigns Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent campaigns</h3>
                  <Button variant="ghost" className="text-gray-600">View All</Button>
                </div>

                {/* Campaign Status Tabs */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Draft</span>
                    <Badge variant="secondary">2</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <Badge variant="secondary">2</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Archived</span>
                    <Badge variant="secondary">1</Badge>
                  </div>
                </div>

                {/* Campaign Cards */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Facebook Campaign */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">f</span>
                      </div>
                      <div className="flex -space-x-2">
                        <Avatar className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className="text-xs">A</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className="text-xs">B</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">10 Simple steps to revolutionise workflows with our product</h4>
                    <p className="text-sm text-gray-500 mb-4">Start: Not Started</p>
                    <p className="text-xs text-gray-400">Last updated: Apr 10, 2023</p>
                  </Card>

                  {/* Google Campaign */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold">G</span>
                      </div>
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Boost your performance: start using our amazing product</h4>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Start: Jun 1, 2023</span>
                        <span>Ends: Aug 1, 2023</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Last updated: July 10, 2023</p>
                  </Card>

                  {/* Add Campaign Card */}
                  <Card className="p-6 border-dashed border-2 border-gray-300 flex items-center justify-center">
                    <Button variant="ghost" className="flex items-center gap-2 text-gray-500">
                      <Plus className="h-4 w-4" />
                      Add campaign
                    </Button>
                  </Card>
                </div>
              </div>
            </div>

            {/* Desktop Right Sidebar */}
            <div className="w-80 bg-white border-l border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Documents</h3>
              <div className="space-y-3">
                {[
                  { name: "Summer Campaign", time: "2 minutes ago", color: "bg-yellow-100" },
                  { name: "Inspiration Notes", time: "3 hours ago", color: "bg-purple-100" },
                  { name: "Campaign Moodboard", time: "5 hours ago", color: "bg-pink-100" },
                  { name: "Circular Inspiration", time: "8 hours ago", color: "bg-green-100" },
                  { name: "Luxury Campaign Steps", time: "8 hours ago", color: "bg-orange-100" }
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
                <h3 className="font-semibold text-gray-900 mb-4">Team Mates</h3>
                <div className="space-y-3">
                  {[
                    { name: "Ethan Anderson", role: "Product Manager", avatar: "EA" },
                    { name: "Simone Daniels", role: "Marketing Manager", avatar: "SD" },
                    { name: "Noah Martinez", role: "CRM Manager", avatar: "NM" }
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OfficialsDashboard;
