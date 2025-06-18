import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";
import { QuickAccessPanel } from "@/components/officials/QuickAccessPanel";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Plus, Search, Bell, Filter, Users, FileText, AlertTriangle, Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const OfficialsDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Get official profile
  const { data: officialProfile } = useQuery({
    queryKey: ['official-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Get barangay residents count
  const { data: residentsCount } = useQuery({
    queryKey: ['residents-count', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return 0;
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('barangay', officialProfile.barangay)
        .eq('role', 'resident');
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!officialProfile?.barangay
  });

  // Get RBI submissions count
  const { data: rbiCount } = useQuery({
    queryKey: ['rbi-count', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return 0;
      const { count, error } = await supabase
        .from('rbi_forms')
        .select('*', { count: 'exact', head: true })
        .eq('barangay_id', officialProfile.barangay);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!officialProfile?.barangay
  });

  // Get pending requests count
  const { data: pendingRequests } = useQuery({
    queryKey: ['pending-requests', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return 0;
      const { count, error } = await supabase
        .from('complaints_requests')
        .select('*', { count: 'exact', head: true })
        .eq('barangay_id', officialProfile.barangay)
        .eq('status', 'pending');
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!officialProfile?.barangay
  });

  // Get active services count
  const { data: servicesCount } = useQuery({
    queryKey: ['services-count', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return 0;
      const { count, error } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('barangay_id', officialProfile.barangay)
        .eq('is_active', true);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!officialProfile?.barangay
  });

  // Get recent residents
  const { data: recentResidents } = useQuery({
    queryKey: ['recent-residents', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('barangay', officialProfile.barangay)
        .eq('role', 'resident')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!officialProfile?.barangay
  });

  // Get recent activities (requests and services)
  const { data: recentActivities } = useQuery({
    queryKey: ['recent-activities', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return [];
      const { data, error } = await supabase
        .from('complaints_requests')
        .select('*')
        .eq('barangay_id', officialProfile.barangay)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!officialProfile?.barangay
  });

  // Search functionality
  const searchableItems = useMemo(() => {
    const items = [];
    
    // Add residents to search
    if (recentResidents) {
      recentResidents.forEach(resident => {
        items.push({
          type: 'resident',
          title: `${resident.first_name || ''} ${resident.last_name || ''}`.trim() || 'Unnamed Resident',
          description: 'Resident',
          href: `/official/residents`,
          data: resident
        });
      });
    }

    // Add activities to search
    if (recentActivities) {
      recentActivities.forEach(activity => {
        items.push({
          type: 'request',
          title: activity.title,
          description: activity.type,
          href: `/official/requests`,
          data: activity
        });
      });
    }

    // Add services to search
    items.push(
      { type: 'service', title: 'Resident Management', description: 'Manage residents', href: '/official/residents' },
      { type: 'service', title: 'Community Services', description: 'Manage services', href: '/official/services' },
      { type: 'service', title: 'RBI Forms', description: 'View RBI submissions', href: '/official/rbi-forms' },
      { type: 'service', title: 'Emergency Response', description: 'Emergency responder', href: '/official/emergency-responder' },
      { type: 'service', title: 'Requests & Complaints', description: 'Handle requests', href: '/official/requests' }
    );

    return items;
  }, [recentResidents, recentActivities]);

  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return searchableItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchableItems, searchQuery]);

  const ProfileCard = () => (
    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
      <Avatar className="h-12 w-12">
        <AvatarImage src={officialProfile?.avatar_url || "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png"} />
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {officialProfile?.first_name?.[0]}{officialProfile?.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium text-gray-900">
          {officialProfile?.first_name} {officialProfile?.last_name}
        </p>
        <p className="text-sm text-gray-600">Barangay Official</p>
        <p className="text-xs text-blue-600">{officialProfile?.barangay || 'Barangay'}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <Helmet>
        <title>Officials Dashboard - Barangay Management System</title>
      </Helmet>
      
      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header - Updated Design */}
          <div className="bg-white border-b border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu className="h-5 w-5 text-gray-700" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="h-[60vh]">
                    <div className="p-4 space-y-6 overflow-y-auto">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Administration</h3>
                        <div className="space-y-2">
                          {[
                            { name: "Dashboard", icon: "🏠", active: true },
                            { name: "Requests & Complaints", icon: "📝", href: "/official/requests" },
                            { name: "Messages", icon: "💬", href: "/messages" },
                            { name: "Reports", icon: "📊", href: "/official/reports" },
                            { name: "Documents", icon: "📁", href: "/official/documents" },
                            { name: "Settings", icon: "⚙️", href: "/settings" }
                          ].map((item, index) => (
                            <Link 
                              key={index} 
                              to={item.href || "/official-dashboard"} 
                              className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer ${
                                item.active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                              }`}
                              onClick={() => setIsMobileDrawerOpen(false)}
                            >
                              <span className="text-base">{item.icon}</span>
                              <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                          {[
                            { name: "Resident Management", icon: "👥", href: "/official/residents" },
                            { name: "Community Services", icon: "🏥", href: "/official/services" },
                            { name: "RBI Forms", icon: "📋", href: "/official/rbi-forms" },
                            { name: "Emergency Response", icon: "🚨", href: "/official/emergency-responder" }
                          ].map((item, index) => (
                            <Link 
                              key={index} 
                              to={item.href} 
                              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => setIsMobileDrawerOpen(false)}
                            >
                              <span className="text-base">{item.icon}</span>
                              <span className="text-sm font-medium text-gray-700">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
                
                <div className="text-center">
                  <h1 className="text-lg font-bold text-blue-600">BARANGAY</h1>
                  <div className="h-0.5 bg-blue-600 w-full"></div>
                  <h2 className="text-lg font-bold text-red-600">MO</h2>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          </div>

          <div className="py-4 px-4">
            {/* Mobile Profile Card */}
            <div className="mb-4">
              <ProfileCard />
            </div>

            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search residents, services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {filteredSearchResults.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
                  <CardContent className="p-2">
                    {filteredSearchResults.map((result, index) => (
                      <Link key={index} to={result.href} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">{result.title}</p>
                          <p className="text-xs text-gray-500">{result.description}</p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Mobile Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-gray-900">{residentsCount || 0}</p>
                  <p className="text-sm text-gray-600">Total Residents</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-gray-900">{rbiCount || 0}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{servicesCount || 0}</p>
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
                  {recentResidents?.slice(0, 2).map((resident, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mb-2">
                        <Avatar className="w-full h-full">
                          <AvatarImage src={resident.avatar_url || "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png"} />
                          <AvatarFallback>{resident.first_name?.[0]}{resident.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="text-xs text-center text-gray-700">
                        {resident.first_name} {resident.last_name}
                      </p>
                    </div>
                  )) || (
                    <div className="col-span-2 text-center text-gray-500 py-4">
                      <p className="text-sm">No residents found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {filteredSearchResults.length > 0 && (
                    <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
                      <CardContent className="p-2">
                        {filteredSearchResults.map((result, index) => (
                          <Link key={index} to={result.href} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">{result.title}</p>
                              <p className="text-xs text-gray-500">{result.description}</p>
                            </div>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={officialProfile?.avatar_url || "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png"} />
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

                {/* Desktop Profile Card */}
                <div className="mb-8">
                  <ProfileCard />
                </div>

                {/* Administration Section */}
                <div className="mb-8">
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

                {/* Quick Actions Section */}
                <div>
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
              </div>
            </div>

            {/* Desktop Main Content */}
            <div className="flex-1 p-6">
              {/* Community Overview Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Community Overview</h2>
                    <p className="text-lg text-blue-600 mt-2">
                      Serving {residentsCount || 0} residents across 14 puroks
                    </p>
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
                        <p className="text-2xl font-bold text-gray-900">{servicesCount || 0}</p>
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
                        <p className="text-2xl font-bold text-gray-900">{pendingRequests || 0}</p>
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
                    <Badge variant="secondary">{pendingRequests || 0}</Badge>
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
                        {recentResidents?.slice(0, 2).map((resident, index) => (
                          <Avatar key={index} className="w-6 h-6 border-2 border-white">
                            <AvatarImage src={resident.avatar_url} />
                            <AvatarFallback className="text-xs">{resident.first_name?.[0]}</AvatarFallback>
                          </Avatar>
                        ))}
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
                    <p className="text-xs text-orange-600 mt-1">{rbiCount || 0} forms need review</p>
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
