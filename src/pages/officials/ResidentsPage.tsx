
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Users, Plus, Eye, Mail, Phone } from "lucide-react";

const ResidentsPage = () => {
  const residents = [
    {
      id: 1,
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "+63 912 345 6789",
      address: "123 Main Street",
      status: "Active",
      registrationDate: "January 15, 2024",
      avatar: "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
    },
    {
      id: 2,
      name: "Juan Dela Cruz",
      email: "juan.delacruz@email.com",
      phone: "+63 917 456 7890",
      address: "456 Second Avenue",
      status: "Active",
      registrationDate: "February 20, 2024",
      avatar: "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
    },
    {
      id: 3,
      name: "Ana Rodriguez",
      email: "ana.rodriguez@email.com",
      phone: "+63 922 567 8901",
      address: "789 Third Street",
      status: "Pending",
      registrationDate: "March 10, 2024",
      avatar: "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Residents Management - BarangayMo Officials</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/official-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#ea384c]">Residents Management</h1>
            <p className="text-gray-600">View and manage resident information and registrations</p>
          </div>
          <div className="ml-auto">
            <Button className="bg-[#ea384c] hover:bg-[#d12d41]">
              <Plus className="h-4 w-4 mr-2" />
              Add Resident
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#ea384c]">2,847</div>
              <div className="text-sm text-gray-600">Total Residents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">2,523</div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">124</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">New This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search residents..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>
          </CardContent>
        </Card>

        {/* Residents List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Registered Residents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {residents.map((resident) => (
                <div key={resident.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={resident.avatar} alt={resident.name} />
                        <AvatarFallback>{resident.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{resident.name}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{resident.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{resident.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Address:</span>
                            <span>{resident.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Registered:</span>
                            <span>{resident.registrationDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={resident.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        {resident.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResidentsPage;
