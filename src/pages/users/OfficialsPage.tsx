import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
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

const OfficialsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const isMobile = useIsMobile();

  // Official roles with their corresponding icons
  const officialRoles = [
    {
      title: "Punong Barangay",
      icon: ShieldCheck,
      count: 1,
      color: "bg-red-50 text-red-600 border-red-100"
    },
    {
      title: "SK Chairman", 
      icon: Settings,
      count: 1,
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      title: "Barangay Councilor",
      icon: Users,
      count: 7,
      color: "bg-green-50 text-green-600 border-green-100"
    },
    {
      title: "SK Council",
      icon: UserCheck,
      count: 7,
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      title: "Brgy Secretary",
      icon: PenLine,
      count: 1,
      color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
      title: "Brgy Treasurer",
      icon: Award,
      count: 1,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "SK Secretary",
      icon: Mail,
      count: 1,
      color: "bg-pink-50 text-pink-600 border-pink-100"
    },
    {
      title: "SK Treasurer",
      icon: Crown,
      count: 1,
      color: "bg-yellow-50 text-yellow-600 border-yellow-100"
    }
  ];

  // Enhanced sample data with more realistic information
  const officials = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      role: "Barangay Captain",
      email: "juandelacruz@example.com",
      phone: "0917-111-2222",
      ward: "All Wards",
      status: "active",
      photo: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
      dateAppointed: "Jan 1, 2025",
      termEnd: "Dec 31, 2027",
      achievements: ["Outstanding Leadership", "Community Development"],
      yearsOfService: 8,
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "Secretary",
      email: "maria.santos@example.com",
      phone: "0918-222-3333",
      ward: "All Wards",
      status: "active",
      photo: "",
      dateAppointed: "Jan 1, 2025",
      termEnd: "Dec 31, 2027",
      achievements: ["Excellent Record Keeping"],
      yearsOfService: 5,
    },
    {
      id: 3,
      name: "Pedro Reyes",
      role: "Treasurer",
      email: "pedro.reyes@example.com",
      phone: "0919-333-4444",
      ward: "All Wards",
      status: "active",
      photo: "",
      dateAppointed: "Jan 1, 2025",
      termEnd: "Dec 31, 2027",
      achievements: ["Financial Excellence"],
      yearsOfService: 6,
    },
    {
      id: 4,
      name: "Elena Garcia",
      role: "Ward Councilor",
      email: "elena.garcia@example.com",
      phone: "0920-444-5555",
      ward: "Ward 1",
      status: "active",
      photo: "",
      dateAppointed: "Jan 1, 2025",
      termEnd: "Dec 31, 2027",
      achievements: ["Community Engagement"],
      yearsOfService: 3,
    },
    {
      id: 5,
      name: "Carlos Lim",
      role: "Ward Councilor",
      email: "carlos.lim@example.com",
      phone: "0921-555-6666",
      ward: "Ward 2",
      status: "inactive",
      photo: "",
      dateAppointed: "Jan 1, 2025",
      termEnd: "Dec 31, 2027",
      achievements: [],
      yearsOfService: 1,
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Barangay Captain":
        return <ShieldCheck className="h-4 w-4 text-red-600" />;
      case "Secretary":
        return <PenLine className="h-4 w-4 text-green-600" />;
      case "Treasurer":
        return <Award className="h-4 w-4 text-purple-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredOfficials = officials.filter((official) => {
    const matchesSearch = 
      official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.ward.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || official.status === statusFilter;
    const matchesRole = roleFilter === "all" || official.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const uniqueRoles = [...new Set(officials.map(official => official.role))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Officials Management</h1>
            <p className="text-sm text-red-100 mt-1">Manage barangay officials and their roles</p>
          </div>
          <Button 
            className="bg-white text-red-600 hover:bg-red-50 px-4 py-2"
            onClick={() => console.log("Add official")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Official
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Stats Cards - Compact Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">{officials.length}</p>
                  <p className="text-xs text-gray-600">Total Officials</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {officials.filter(o => o.status === "active").length}
                  </p>
                  <p className="text-xs text-gray-600">Active Officials</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round(officials.reduce((acc, o) => acc + o.yearsOfService, 0) / officials.length)}
                  </p>
                  <p className="text-xs text-gray-600">Avg Years</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {officials.filter(o => o.status === "inactive").length}
                  </p>
                  <p className="text-xs text-gray-600">Inactive</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Official Positions - Professional Grid */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Official Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {officialRoles.map((role, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${role.color} hover:shadow-md transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
                      <role.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-xs leading-tight">
                        {role.title}
                      </p>
                      <p className="text-xs opacity-75 mt-1">
                        {role.count} {role.count === 1 ? 'Official' : 'Officials'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters - Mobile Optimized */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-3">
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
              <div className="flex gap-2">
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
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="flex-1 h-10">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {uniqueRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Barangay Officials</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {isMobile ? (
                // Mobile Card Layout
                <div className="space-y-3 p-4">
                  {filteredOfficials.map((official) => (
                    <Card key={official.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 border-2 border-gray-200 flex-shrink-0">
                            {official.photo ? (
                              <AvatarImage src={official.photo} alt={official.name} />
                            ) : null}
                            <AvatarFallback className="bg-red-600 text-white font-semibold text-sm">
                              {official.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            {/* Name and Status */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                  {official.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  {getRoleIcon(official.role)}
                                  <span className="text-xs text-gray-600">{official.role}</span>
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
                                      <Eye className="mr-2 h-4 w-4" /> View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <PenLine className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            
                            {/* Contact and Service Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{official.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span>{official.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span>{official.ward}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  <span>Since {official.dateAppointed}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="h-3 w-3 text-yellow-500" />
                                  <span>{official.yearsOfService} years</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Desktop Table Layout
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700 py-4">Official</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Role & Contact</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Assignment</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Service</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOfficials.map((official) => (
                      <TableRow key={official.id} className="hover:bg-gray-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-gray-200">
                              {official.photo ? (
                                <AvatarImage src={official.photo} alt={official.name} />
                              ) : null}
                              <AvatarFallback className="bg-red-600 text-white font-semibold">
                                {official.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-900">{official.name}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>Since {official.dateAppointed}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getRoleIcon(official.role)}
                              <span className="font-medium text-gray-900">{official.role}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-3.5 w-3.5" />
                                <span>{official.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-3.5 w-3.5" />
                                <span>{official.phone}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-900">{official.ward}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900">{official.yearsOfService} years</p>
                            <p className="text-xs text-gray-500">Until {official.termEnd}</p>
                            {official.achievements.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Award className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs text-gray-600">
                                  {official.achievements.length} achievement{official.achievements.length > 1 ? 's' : ''}
                                </span>
                              </div>
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
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" /> Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
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
  );
};

export default OfficialsPage;
