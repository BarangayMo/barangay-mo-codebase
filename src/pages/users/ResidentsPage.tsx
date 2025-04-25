
import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Filter, 
  PlusCircle, 
  Search, 
  UserPlus, 
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
  PenLine,
  Trash2,
  Mail,
  Phone
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const ResidentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data
  const residents = [
    { 
      id: 1, 
      name: "Sofia Lopez", 
      email: "sofia.lopez@example.com",
      phone: "0917-123-4567",
      address: "123 Main St, Ward 5",
      status: "active",
      dateRegistered: "Jan 15, 2025",
    },
    { 
      id: 2, 
      name: "Miguel Santos", 
      email: "miguel.santos@example.com",
      phone: "0918-234-5678",
      address: "456 Oak Ave, Ward 3",
      status: "active",
      dateRegistered: "Feb 22, 2025",
    },
    { 
      id: 3, 
      name: "Ana Garcia", 
      email: "ana.garcia@example.com",
      phone: "0919-345-6789",
      address: "789 Elm St, Ward 2",
      status: "pending",
      dateRegistered: "Mar 10, 2025",
    },
    { 
      id: 4, 
      name: "Juan Cruz", 
      email: "juan.cruz@example.com",
      phone: "0920-456-7890",
      address: "101 Pine Ave, Ward 1",
      status: "active",
      dateRegistered: "Apr 5, 2025",
    },
    { 
      id: 5, 
      name: "Maria Reyes", 
      email: "maria.reyes@example.com",
      phone: "0921-567-8901",
      address: "202 Cedar St, Ward 4",
      status: "inactive",
      dateRegistered: "May 18, 2025",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredResidents = residents.filter(resident => 
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Residents Management">
      <DashboardPageHeader
        title="Residents Management"
        description="Manage residents registered in the system"
        breadcrumbItems={[
          { label: "Dashboard", href: "/admin" },
          { label: "User Management", href: "/admin/users" },
          { label: "Residents" }
        ]}
        actionButton={{
          label: "Add Resident",
          onClick: () => console.log("Add resident"),
          icon: <UserPlus className="h-4 w-4" />
        }}
      />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">235</CardTitle>
            <CardDescription>Total Residents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span>192 Active</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">18</CardTitle>
            <CardDescription>Pending Verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-amber-600">
              <UserPlus className="h-4 w-4" />
              <span>Waiting for approval</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">25</CardTitle>
            <CardDescription>Inactive Accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-red-600">
              <UserX className="h-4 w-4" />
              <span>Requires attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Residents List</CardTitle>
            <CardDescription>View and manage all registered residents</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search residents..." 
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
                <TableHead>Resident</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResidents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{resident.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{resident.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3.5 w-3.5 text-gray-500" />
                        <span>{resident.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3.5 w-3.5 text-gray-500" />
                        <span>{resident.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{resident.address}</TableCell>
                  <TableCell>{getStatusBadge(resident.status)}</TableCell>
                  <TableCell>{resident.dateRegistered}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <PenLine className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                Showing {filteredResidents.length} of {residents.length} residents
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ResidentsPage;
