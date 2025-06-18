
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Search, FileText, Download, Eye } from "lucide-react";

const DocumentsPage = () => {
  const documents = [
    {
      id: 1,
      title: "Barangay Ordinance 2024-05",
      type: "Ordinance",
      description: "Waste Management and Segregation Guidelines",
      date: "December 15, 2024",
      status: "Active",
      tags: ["Environment", "Waste Management"]
    },
    {
      id: 2,
      title: "Resolution No. 2024-12",
      type: "Resolution",
      description: "Approval of Annual Budget for 2025",
      date: "December 10, 2024",
      status: "Approved",
      tags: ["Budget", "Finance"]
    },
    {
      id: 3,
      title: "Health Protocol Guidelines",
      type: "Guidelines",
      description: "Updated health and safety protocols for community events",
      date: "December 5, 2024",
      status: "Active",
      tags: ["Health", "Safety"]
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Official Documents - BarangayMo Officials</title>
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
            <h1 className="text-2xl font-bold text-[#ea384c]">Official Documents</h1>
            <p className="text-gray-600">Manage ordinances, resolutions, and official documents</p>
          </div>
          <div className="ml-auto">
            <Button className="bg-[#ea384c] hover:bg-[#d12d41]">
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search documents..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#ea384c]/10 rounded-lg">
                        <FileText className="h-5 w-5 text-[#ea384c]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{doc.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.date}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={doc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                        {doc.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
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

export default DocumentsPage;
