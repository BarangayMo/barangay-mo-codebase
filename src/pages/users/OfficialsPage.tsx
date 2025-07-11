import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Search,
  ShieldCheck,
  UserPlus,
  MoreHorizontal,
  Eye,
  PenLine,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Award,
  AlertCircle,
  Settings,
  UserCheck,
  Crown,
  Filter,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "@/components/layout/MobileNavbar";
import { useNavigate } from "react-router-dom";
import { useOfficials } from "@/hooks/use-officials-data";
import { format } from "date-fns";
import { OfficialDetailsModal } from "@/components/officials/OfficialDetailsModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch officials from the specific barangay
const fetchBarangayOfficials = async (barangayName: string, region: string) => {
  if (!barangayName || !region) {
    return [];
  }

  console.log(`Fetching officials for barangay: ${barangayName}, region: ${region}`);
  
  try {
    const { data, error } = await supabase
      .from(region as any)
      .select('*')
      .eq('BARANGAY', barangayName);
    
    if (error) {
      console.error(`Error fetching from ${region}:`, error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log(`No officials found for barangay ${barangayName} in region ${region}`);
      return [];
    }

    const transformedOfficials = data.map((official: any) => ({
      id: `${region}-${official.FIRSTNAME}-${official.LASTNAME}-${official.POSITION}`,
      user_id: null,
      position: official.POSITION || 'Unknown Position',
      barangay: official.BARANGAY || barangayName,
      term_start: null,
      term_end: null,
      status: 'active' as const,
      contact_phone: official['BARANGAY HALL TELNO'] || null,
      contact_email: null,
      years_of_service: 0,
      achievements: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      firstName: official.FIRSTNAME,
      lastName: official.LASTNAME,
      middleName: official.MIDDLENAME,
      suffix: official.SUFFIX,
      region: region,
      municipality: official['CITY/MUNICIPALITY'],
      province: official.PROVINCE
    }));
    
    console.log(`Found ${transformedOfficials.length} officials for ${barangayName}`);
    return transformedOfficials;
  } catch (error) {
    console.error(`Error fetching from ${region}:`, error);
    return [];
  }
};

const OfficialsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<any>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // For now, we'll use hardcoded values - in a real app, this would come from context/state
  // You should replace these with actual selected barangay data
  const selectedBarangay = "Barangay 1"; // This should come from user selection
  const selectedRegion = "REGION 3"; // This should come from user selection
  
  // Fetch officials data for the selected barangay
  const { data: officials = [], isLoading } = useQuery({
    queryKey: ['barangay-officials', selectedBarangay, selectedRegion],
    queryFn: () => fetchBarangayOfficials(selectedBarangay, selectedRegion),
    enabled: !!selectedBarangay && !!selectedRegion,
  });

  // Official roles with their corresponding icons and counts
  const officialRoles = [
    {
      title: "Punong Barangay",
      icon: ShieldCheck,
      count: officials.filter(o => o.position === "Punong Barangay").length,
      color: "bg-red-50 text-red-600 border-red-100",
      route: "/official/punong-barangay"
    },
    {
      title: "SK Chairman", 
      icon: Settings,
      count: officials.filter(o => o.position === "SK Chairman").length,
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      title: "Barangay Councilor",
      icon: Users,
      count: officials.filter(o => o.position?.includes("Sangguniang Barangay")).length,
      color: "bg-green-50 text-green-600 border-green-100"
    },
    {
      title: "Barangay Secretary",
      icon: PenLine,
      count: officials.filter(o => o.position === "Barangay Secretary").length,
      color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
      title: "Barangay Treasurer",
      icon: Award,
      count: officials.filter(o => o.position === "Barangay Treasurer").length,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRoleIcon = (position: string) => {
    if (position === "Punong Barangay") {
      return <ShieldCheck className="h-4 w-4 text-red-600" />;
    } else if (position === "Barangay Secretary") {
      return <PenLine className="h-4 w-4 text-green-600" />;
    } else if (position === "Barangay Treasurer") {
      return <Award className="h-4 w-4 text-purple-600" />;
    } else if (position === "SK Chairman") {
      return <Settings className="h-4 w-4 text-blue-600" />;
    } else {
      return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredOfficials = officials.filter((official) => {
    const matchesSearch = 
      official.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (official.firstName && official.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (official.lastName && official.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      official.barangay.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || official.status === statusFilter;
    const matchesPosition = positionFilter === "all" || official.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const uniquePositions = [...new Set(officials.map(official => official.position))];

  const handleOfficialClick = (official: any) => {
    if (official.position === "Punong Barangay") {
      navigate("/official/punong-barangay");
    }
    // Add other position-specific navigation here
  };

  const handleRoleClick = (role: any) => {
    if (role.route) {
      navigate(role.route);
    }
  };

  const handleAddOfficial = () => {
    setSelectedOfficial({
      position: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      isCompleted: false
    });
    setShowAddModal(true);
  };

  const handleSaveOfficial = (data: any) => {
    console.log('Saving new official:', data);
    // Here you would typically save to the database
    setShowAddModal(false);
    setSelectedOfficial(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading officials for {selectedBarangay}...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header - Mobile Only */}
        {isMobile && (
          <div className="bg-red-600 text-white p-4">
            <div className="flex items-center gap-3 mb-4">
              <ArrowLeft 
                className="h-6 w-6 cursor-pointer" 
                onClick={() => navigate(-1)}
              />
              <div className="flex-1">
                <h1 className="text-lg font-bold">Officials Management</h1>
                <p className="text-sm text-red-100 mt-1">Manage officials for {selectedBarangay}</p>
              </div>
            </div>
            <Button 
              className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 w-full"
              onClick={handleAddOfficial}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Official
            </Button>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div className="bg-white border-b p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Officials Management</h1>
                <p className="text-gray-600 mt-1">Manage officials for {selectedBarangay}, {selectedRegion}</p>
              </div>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleAddOfficial}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Official
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`p-4 ${isMobile ? 'pb-24' : 'pb-8'}`}>
          {/* Stats Cards */}
          <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{officials.length}</p>
                    <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Total Officials</p>
                  </div>
                  <div className={`bg-red-100 rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                    <Users className={`text-red-600 ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      {officials.filter(o => o.status === "active").length}
                    </p>
                    <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Active Officials</p>
                  </div>
                  <div className={`bg-green-100 rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                    <ShieldCheck className={`text-green-600 ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      {officials.length > 0 ? Math.round(officials.reduce((acc, o) => acc + o.years_of_service, 0) / officials.length) : 0}
                    </p>
                    <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Avg Years</p>
                  </div>
                  <div className={`bg-yellow-100 rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                    <Award className={`text-yellow-600 ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      {officials.filter(o => o.status === "inactive").length}
                    </p>
                    <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Inactive</p>
                  </div>
                  <div className={`bg-red-100 rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`}>
                    <AlertCircle className={`text-red-600 ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Official Positions */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Official Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
                {officialRoles.map((role, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${role.color} hover:shadow-md transition-all duration-200 cursor-pointer`}
                    onClick={() => handleRoleClick(role)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`rounded-full bg-white/50 flex items-center justify-center ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}>
                        <role.icon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                      </div>
                      <div>
                        <p className={`font-medium leading-tight ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {role.title}
                        </p>
                        <p className={`opacity-75 mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {role.count} {role.count === 1 ? 'Official' : 'Officials'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search officials..."
                    className="pl-10 h-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Filters Row */}
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      {uniquePositions.map(position => (
                        <SelectItem key={position} value={position}>{position}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" className="px-3 h-10">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Officials Table */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                {selectedBarangay} Officials
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {isMobile ? (
                  // Mobile Card Layout
                  <div className="space-y-3 p-4">
                    {filteredOfficials.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No officials found for {selectedBarangay}</p>
                        <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
                      </div>
                    ) : (
                      filteredOfficials.map((official) => (
                        <Card 
                          key={official.id} 
                          className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleOfficialClick(official)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-14 w-14 border-2 border-gray-200 flex-shrink-0">
                                <AvatarFallback className="bg-red-600 text-white font-semibold text-sm">
                                  {official.firstName ? official.firstName.substring(0, 1) : official.position.substring(0, 1)}
                                  {official.lastName ? official.lastName.substring(0, 1) : official.position.substring(1, 2)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                {/* Name and Status */}
                                <div className="flex items-start justify-between mb-3">
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-900 text-base mb-1">
                                      {official.firstName && official.lastName 
                                        ? `${official.firstName} ${official.lastName}`
                                        : official.position
                                      }
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                      {getRoleIcon(official.position)}
                                      <span className="text-sm text-gray-700 font-medium">{official.position}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    {getStatusBadge(official.status)}
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Eye className="h-4 w-4 mr-2" />
                                          View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <PenLine className="h-4 w-4 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Remove
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                
                                {/* Contact and Service Info */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{official.barangay}</span>
                                  </div>
                                  {official.contact_phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Phone className="h-4 w-4 flex-shrink-0" />
                                      <span>{official.contact_phone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>{official.region}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Award className="h-4 w-4 text-yellow-500" />
                                      <span>{official.years_of_service} years</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                ) : (
                  // Desktop Table Layout
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 py-4">Official</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Position</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Contact Info</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Location</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOfficials.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No officials found for {selectedBarangay}</p>
                            <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOfficials.map((official) => (
                          <TableRow key={official.id} className="hover:bg-gray-50">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-gray-200">
                                  <AvatarFallback className="bg-red-600 text-white font-semibold">
                                    {official.firstName ? official.firstName.substring(0, 1) : official.position.substring(0, 1)}
                                    {official.lastName ? official.lastName.substring(0, 1) : official.position.substring(1, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                  <p className="font-semibold text-gray-900">
                                    {official.firstName && official.lastName 
                                      ? `${official.firstName} ${official.lastName}`
                                      : 'N/A'
                                    }
                                  </p>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>{official.region}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                {getRoleIcon(official.position)}
                                <span className="text-gray-900">{official.position}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                {official.contact_phone && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="h-3.5 w-3.5" />
                                    <span>{official.contact_phone}</span>
                                  </div>
                                )}
                                {!official.contact_phone && (
                                  <span className="text-sm text-gray-400">No contact info</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-900">{official.barangay}</span>
                                </div>
                                {official.municipality && (
                                  <p className="text-xs text-gray-500">{official.municipality}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">{getStatusBadge(official.status)}</TableCell>
                            <TableCell className="py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" /> View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <PenLine className="mr-2 h-4 w-4" /> Edit Details
                                  </DropdownMenuItem>
                                  {official.contact_phone && (
                                    <DropdownMenuItem>
                                      <Phone className="mr-2 h-4 w-4" /> Call
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
              
              {/* Pagination Footer */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {filteredOfficials.length} of {officials.length} officials
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Mobile Navigation - Only show on mobile */}
      {isMobile && <MobileNavbar />}

      {/* Add Official Modal */}
      <OfficialDetailsModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedOfficial(null);
        }}
        official={selectedOfficial || {
          position: "",
          firstName: "",
          middleName: "",
          lastName: "",
          suffix: "",
          isCompleted: false
        }}
        onSave={handleSaveOfficial}
      />
    </>
  );
};

export default OfficialsPage;
