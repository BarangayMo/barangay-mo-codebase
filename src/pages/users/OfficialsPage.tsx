
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Filter,
  Search,
  ShieldCheck,
  UserPlus,
  MoreHorizontal,
  Eye,
  PenLine,
  Trash2,
  Mail,
  Phone,
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

const OfficialsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
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
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-500">Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredOfficials = officials.filter(
    (official) =>
      official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.ward.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Officials Management">
      <DashboardPageHeader
        title="Officials Management"
        description="Manage barangay officials and their roles"
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "User Management", href: "/admin/users" },
          { label: "Officials" },
        ]}
        actionButton={{
          label: "Add Official",
          onClick: () => console.log("Add official"),
          icon: <UserPlus className="h-4 w-4" />,
        }}
      />

      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Barangay Officials</CardTitle>
              <CardDescription>View and manage all barangay officials</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search officials..."
                  className="pl-9 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Official</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficials.map((official) => (
                  <TableRow key={official.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          {official.photo ? (
                            <AvatarImage src={official.photo} alt={official.name} />
                          ) : null}
                          <AvatarFallback className="bg-primary text-white">
                            {official.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{official.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className={`h-4 w-4 ${official.role === "Barangay Captain" ? "text-blue-600" : "text-gray-500"}`} />
                        <span>{official.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3.5 w-3.5 text-gray-500" />
                          <span>{official.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3.5 w-3.5 text-gray-500" />
                          <span>{official.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{official.ward}</TableCell>
                    <TableCell>{getStatusBadge(official.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Profile
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
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

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ward Distribution</CardTitle>
            <CardDescription>Officials assigned per ward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Ward 1</span>
                <Badge variant="outline">3 Officials</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Ward 2</span>
                <Badge variant="outline">2 Officials</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Ward 3</span>
                <Badge variant="outline">3 Officials</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Ward 4</span>
                <Badge variant="outline">2 Officials</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Ward 5</span>
                <Badge variant="outline">3 Officials</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>All Wards</span>
                <Badge variant="outline">3 Officials</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>Officials by position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Barangay Captain</span>
                </span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Secretary</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Treasurer</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Ward Councilor</span>
                <Badge variant="outline">10</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>SK Chairman</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Committee Head</span>
                <Badge variant="outline">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OfficialsPage;
