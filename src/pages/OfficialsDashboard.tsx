import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Plus,
  Search,
  Bell,
  Filter,
  Users,
  FileText,
  AlertTriangle,
  Home,
  MessageSquare,
  BarChart3,
  FolderOpen,
  Settings,
  UsersIcon,
  Hospital,
  ClipboardList,
  Siren,
  Briefcase,
  ShoppingCart
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
import { Layout } from "@/components/layout/Layout";
import { DashboardStats } from "@/components/officials/DashboardStats";
import { BudgetAllocationChart } from "@/components/officials/BudgetAllocationChart";
import { QuickAccessPanel } from "@/components/officials/QuickAccessPanel";
import { CommunitySlider } from "@/components/community/CommunitySlider";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const OfficialsDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

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

  // Get barangay data including logo and puroks
  const { data: barangayData } = useQuery({
    queryKey: ['barangay-data', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return null;
      const { data, error } = await supabase
        .from('Barangays')
        .select('*')
        .eq('BARANGAY', officialProfile.barangay)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!officialProfile?.barangay
  });

  // Get barangay officials from database using type-safe approach
  const { data: barangayOfficials } = useQuery({
    queryKey: ['barangay-officials', officialProfile?.barangay],
    queryFn: async () => {
      if (!officialProfile?.barangay) return [];
      
      // Query each region table individually to avoid TypeScript issues
      const officials = [];
      
      // Define region table names that exist in our schema
      const regionQueries = [
        { table: 'NCR' as const },
        { table: 'REGION 1' as const },
        { table: 'REGION 2' as const },
        { table: 'REGION 3' as const },
        { table: 'REGION 4A' as const },
        { table: 'REGION 4B' as const },
        { table: 'REGION 5' as const },
        { table: 'REGION 6' as const },
        { table: 'REGION 7' as const },
        { table: 'REGION 8' as const },
        { table: 'REGION 9' as const },
        { table: 'REGION 10' as const },
        { table: 'REGION 11' as const },
        { table: 'REGION 12' as const },
        { table: 'REGION 13' as const },
        { table: 'CAR' as const },
        { table: 'BARMM' as const }
      ];
      
      for (const { table } of regionQueries) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('BARANGAY', officialProfile.barangay);
          
          if (!error && data && data.length > 0) {
            officials.push(...data);
          }
        } catch (err) {
          console.log(`No data found in ${table} for barangay ${officialProfile.barangay}`);
        }
      }
      
      return officials;
    },
    enabled: !!officialProfile?.barangay
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

  // Get Punong Barangay name from officials data
  const getPunongBarangayName = () => {
    console.log('Getting Punong Barangay name from:', user?.officials_data);
    
    if (user?.officials_data && Array.isArray(user.officials_data)) {
      const punongBarangay = user.officials_data.find(
        (official: any) => official.position === "Punong Barangay" || 
                          official.POSITION === "Punong Barangay"
      );
      
      console.log('Found Punong Barangay:', punongBarangay);
      
      if (punongBarangay) {
        const firstName = punongBarangay.firstName || punongBarangay.FIRSTNAME || punongBarangay.first_name;
        const lastName = punongBarangay.lastName || punongBarangay.LASTNAME || punongBarangay.last_name;
        const middleName = punongBarangay.middleName || punongBarangay.MIDDLENAME || punongBarangay.middle_name;
        
        if (firstName && lastName) {
          const fullName = middleName 
            ? `${firstName} ${middleName} ${lastName}`
            : `${firstName} ${lastName}`;
          return fullName;
        }
      }
    }
    return "Unknown Official";
  };

  // Get Punong Barangay initials
  const getPunongBarangayInitials = () => {
    if (user?.officials_data && Array.isArray(user.officials_data)) {
      const punongBarangay = user.officials_data.find(
        (official: any) => official.position === "Punong Barangay" || 
                          official.POSITION === "Punong Barangay"
      );
      
      if (punongBarangay) {
        const firstName = punongBarangay.firstName || punongBarangay.FIRSTNAME || punongBarangay.first_name;
        const lastName = punongBarangay.lastName || punongBarangay.LASTNAME || punongBarangay.last_name;
        
        if (firstName && lastName) {
          return `${firstName[0]}${lastName[0]}`;
        }
      }
    }
    return "UO";
  };

  // Get actual location data from user profile
  const getLocationText = () => {
    const municipality = user?.municipality;
    const province = user?.province;
    
    console.log('Location data:', { municipality, province });
    
    if (municipality && province) {
      return `${municipality}, ${province}`;
    }
    if (user?.barangay) {
      return user.barangay;
    }
    return "Location not set";
  };

  // Show logo if available, otherwise show initials
  const getLogoDisplay = () => {
    if (user?.logo_url) {
      return (
        <img 
          src={user.logo_url} 
          alt="Barangay Logo" 
          className="w-12 h-12 rounded-full object-cover border border-red-200"
        />
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-sm font-medium text-red-600">
        {getPunongBarangayInitials()}
      </div>
    );
  };

  const ProfileCard = () => (
    <div className="relative overflow-hidden">
      {/* Red background shape for officials */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 rounded-lg"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full transform translate-x-8 -translate-y-8"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-100/40 rounded-full transform -translate-x-6 translate-y-6"></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-3 p-4 rounded-lg">
        {getLogoDisplay()}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 truncate font-outfit">
            {getPunongBarangayName()}
          </h3>
          <p className="text-sm text-red-600 truncate font-medium">{getLocationText()}</p>
          <p className="text-xs text-gray-500 truncate">BarangayMo Officials</p>
        </div>
      </div>
    </div>
  );

  // Parse puroks from barangay data
  const purokCount = useMemo(() => {
    if (!barangayData) return 14; // default fallback
    
    // Try to get puroks from various fields in the barangay data
    const divisions = barangayData['No of Divisions'] || barangayData['Division'];
    
    if (divisions) {
      const parsed = parseInt(divisions);
      if (!isNaN(parsed)) return parsed;
    }
    
    return 14; // default fallback
  }, [barangayData]);

  return (
    <Layout>
      <Helmet>
        <title>Officials Dashboard - Barangay Management System</title>
      </Helmet>
      
      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 pb-28">
          {/* Mobile Profile Card */}
          <div className="mb-4">
            <ProfileCard />
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
                  <p className="text-2xl font-bold text-gray-900">{purokCount}</p>
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

          {/* Barangay Officials Section */}
          {barangayOfficials && barangayOfficials.length > 0 && (
            <Card className="mt-6 bg-white shadow-sm border border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Barangay Officials</h3>
                  <Link to="admin/users/officials" className="text-red-500 text-sm font-medium">View All</Link>
                </div>
                <div className="space-y-3">
                  {barangayOfficials.slice(0, 3).map((official, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-red-100 text-red-600">
                          {official.FIRSTNAME?.[0]}{official.LASTNAME?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {official.FIRSTNAME} {official.LASTNAME}
                        </p>
                        <p className="text-xs text-gray-600">{official.POSITION}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Community Slider */}
          <CommunitySlider />
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
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
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
                  <AvatarImage src={user?.logo_url || "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png"} />
                  <AvatarFallback>BO</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <div className="w-64 flex-shrink-0 bg-white border-r border-red-100 min-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-red-400 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user?.logo_url ? (
                      <img 
                        src={user.logo_url} 
                        alt="Barangay Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold">🏛️</span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900 truncate">Barangay Portal</span>
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
                      { name: "Dashboard", icon: Home, active: true },
                      { name: "Requests & Complaints", icon: FileText, href: "/official/requests" },
                      { name: "Messages", icon: MessageSquare, href: "/messages" },
                      { name: "Reports", icon: BarChart3, href: "/official/reports" },
                      { name: "Documents", icon: FolderOpen, href: "/official/documents" },
                      { name: "Settings", icon: Settings, href: "/settings" }
                    ].map((item, index) => (
                      <Link key={index} to={item.href || "/official-dashboard"} className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        item.active ? 'bg-red-50 text-red-600 border-l-2 border-red-500' : 'hover:bg-red-50 hover:text-red-600 text-gray-700'
                      }`}>
                        <item.icon className={`h-4 w-4 flex-shrink-0 ${item.active ? 'text-red-600' : 'text-red-500'}`} />
                        <span className="text-sm truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Resident Management", icon: UsersIcon, href: "/official/residents" },
                      { name: "Community Services", icon: Hospital, href: "/official/services" },
                      { name: "RBI Forms", icon: ClipboardList, href: "/official/rbi-forms" },
      { name: "Job Management", icon: Briefcase, href: "/official/jobs" },
      { name: "Product Management", icon: ShoppingCart, href: "/official/products" },
                      { name: "Emergency Response", icon: Siren, href: "/official/emergency-responder" }
                    ].map((item, index) => (
                      <Link key={index} to={item.href} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 cursor-pointer transition-all duration-200">
                        <item.icon className="h-4 w-4 flex-shrink-0 text-red-500" />
                        <span className="text-sm text-gray-700 hover:text-red-600 truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Main Content */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="h-full overflow-y-auto p-6">
                {/* Community Overview Section */}
                <div className="mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                    <div className="min-w-0">
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">Community Overview</h2>
                      <p className="text-base lg:text-lg text-blue-600 mt-2">
                        Serving {residentsCount || 0} residents across {purokCount} puroks
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Button variant="outline" className="flex items-center gap-2 text-sm">
                        <CalendarDays className="h-4 w-4" />
                        <span className="hidden sm:inline">This Month</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 text-sm">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Filter</span>
                      </Button>
                    </div>
                  </div>

                  {/* Community Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    <Card className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-600 truncate">Total Residents</p>
                          <p className="text-xl lg:text-2xl font-bold text-gray-900">{residentsCount || 0}</p>
                          <p className="text-sm text-green-600 flex items-center">
                            ↗ 12% <span className="text-gray-500 ml-1 hidden sm:inline">from last month</span>
                          </p>
                        </div>
                        <div className="w-12 lg:w-16 h-6 lg:h-8 bg-gradient-to-r from-green-200 to-green-300 rounded flex-shrink-0"></div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-600 truncate">RBI Submissions</p>
                          <p className="text-xl lg:text-2xl font-bold text-gray-900">{rbiCount || 0}</p>
                          <p className="text-sm text-blue-600 flex items-center">
                            ↗ New <span className="text-gray-500 ml-1 hidden sm:inline">this month</span>
                          </p>
                        </div>
                        <div className="w-12 lg:w-16 h-6 lg:h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded flex-shrink-0"></div>
                      </div>
                    </Card>

                    <Card className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-600 truncate">Active Services</p>
                          <p className="text-xl lg:text-2xl font-bold text-gray-900">{servicesCount || 0}</p>
                          <p className="text-sm text-purple-600 flex items-center">
                            ↗ 3 new <span className="text-gray-500 ml-1 hidden sm:inline">this month</span>
                          </p>
                        </div>
                        <div className="w-12 lg:w-16 h-6 lg:h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded flex-shrink-0"></div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-600 truncate">Pending Requests</p>
                          <p className="text-xl lg:text-2xl font-bold text-gray-900">{pendingRequests || 0}</p>
                          <p className="text-sm text-orange-600 flex items-center">
                            ↓ 5 resolved <span className="text-gray-500 ml-1 hidden sm:inline">this week</span>
                          </p>
                        </div>
                        <div className="w-12 lg:w-16 h-6 lg:h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded flex-shrink-0"></div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Recent Residents Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Residents</h3>
                    <Link to="/official/residents" className="text-red-500 text-sm font-medium hover:underline flex-shrink-0">View All</Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {recentResidents?.slice(0, 4).map((resident, index) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="w-16 h-16 mb-3 flex-shrink-0">
                            <AvatarImage src={resident.avatar_url || "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png"} />
                            <AvatarFallback>{resident.first_name?.[0]}{resident.last_name?.[0]}</AvatarFallback>
                          </Avatar>
                          <h4 className="font-medium text-gray-900 mb-1 truncate w-full" title={`${resident.first_name} ${resident.last_name}`}>
                            {resident.first_name} {resident.last_name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2 truncate w-full">
                            Joined {format(new Date(resident.created_at), 'MMM dd, yyyy')}
                          </p>
                          <Badge variant="secondary" className="text-xs truncate">{resident.role}</Badge>
                        </div>
                      </Card>
                    )) || (
                      <div className="col-span-full text-center text-gray-500 py-8">
                        <p>No recent residents found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Barangay Officials Section */}
                {barangayOfficials && barangayOfficials.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Barangay Officials</h3>
                      <Link to="admin/users/officials" className="text-red-500 text-sm font-medium hover:underline flex-shrink-0">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {barangayOfficials.slice(0, 6).map((official, index) => (
                        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="w-12 h-12 flex-shrink-0">
                              <AvatarFallback className="bg-red-100 text-red-600">
                                {official.FIRSTNAME?.[0]}{official.LASTNAME?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate" title={`${official.FIRSTNAME} ${official.LASTNAME}`}>
                                {official.FIRSTNAME} {official.LASTNAME}
                              </h4>
                              <p className="text-sm text-gray-600 truncate" title={official.POSITION}>{official.POSITION}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Community Posts Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Community Posts</h3>
                    <Link to="/community" className="text-red-500 text-sm font-medium hover:underline flex-shrink-0">View All</Link>
                  </div>
                  <div className="w-full overflow-hidden">
                    <CommunitySlider />
                  </div>
                </div>

                {/* Recent Activities Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Activities</h3>
                    <Button variant="ghost" className="text-gray-600 flex-shrink-0">View All</Button>
                  </div>

                  {/* Activity Status Tabs */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {/* Resident Services */}
                    <Card className="p-4 lg:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">New resident registrations and service requests this week</h4>
                      <p className="text-sm text-gray-500 mb-4">Status: Processing</p>
                      <p className="text-xs text-gray-400">Last updated: Today</p>
                    </Card>

                    {/* Community Programs */}
                    <Card className="p-4 lg:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">A</AvatarFallback>
                        </Avatar>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">Medical assistance program: distribute health cards to qualified residents</h4>
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span className="truncate">Started: June 15, 2024</span>
                          <span className="truncate">Target: July 15, 2024</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">Last updated: 2 days ago</p>
                    </Card>

                    {/* Add New Service Card */}
                    <Card className="p-4 lg:p-6 border-dashed border-2 border-gray-300 flex items-center justify-center">
                      <Link to="/official/services" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        <span>Add new service</span>
                      </Link>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Right Sidebar */}
            <div className="w-72 xl:w-80 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
              <div className="p-4 lg:p-6">
                <h3 className="font-semibold text-gray-900 mb-4 truncate">Recent Documents</h3>
                <div className="space-y-3">
                  {[
                    { name: "Barangay Resolution 2024-15", time: "2 hours ago", color: "bg-yellow-100" },
                    { name: "Budget Allocation Report", time: "1 day ago", color: "bg-purple-100" },
                    { name: "Community Survey Results", time: "2 days ago", color: "bg-pink-100" },
                    { name: "Emergency Response Plan", time: "3 days ago", color: "bg-green-100" },
                    { name: "Monthly Activity Report", time: "1 week ago", color: "bg-orange-100" }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer min-w-0">
                      <div className={`w-8 h-8 ${doc.color} rounded flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={doc.name}>{doc.name}</p>
                        <p className="text-xs text-gray-500 truncate">Updated {doc.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4 truncate">Barangay Staff</h3>
                  <div className="space-y-3">
                    {barangayOfficials?.slice(0, 3).map((official, index) => (
                      <div key={index} className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {official.FIRSTNAME?.[0]}{official.LASTNAME?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate" title={`${official.FIRSTNAME} ${official.LASTNAME}`}>
                            {official.FIRSTNAME} {official.LASTNAME}
                          </p>
                          <p className="text-xs text-gray-500 truncate" title={official.POSITION}>{official.POSITION}</p>
                        </div>
                      </div>
                    )) || [
                      { name: "Captain Rodriguez", role: "Barangay Captain", avatar: "CR" },
                      { name: "Secretary Santos", role: "Barangay Secretary", avatar: "SS" },
                      { name: "Kagawad Reyes", role: "Councilor", avatar: "KR" }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate" title={member.name}>{member.name}</p>
                          <p className="text-xs text-gray-500 truncate" title={member.role}>{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4 truncate">Urgent Alerts</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-red-800 truncate">Emergency Response</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1 truncate">3 pending emergency requests</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-orange-800 truncate">RBI Forms</span>
                      </div>
                      <p className="text-xs text-orange-600 mt-1 truncate">{rbiCount || 0} forms need review</p>
                    </div>
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
