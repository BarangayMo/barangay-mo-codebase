
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, BarChart3, PieChart, TrendingUp, FileText } from "lucide-react";

const ReportsPage = () => {
  const reportTypes = [
    {
      title: "Budget Report",
      description: "Detailed analysis of budget allocation and spending",
      icon: PieChart,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Population Report",
      description: "Resident demographics and population statistics",
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Activity Report",
      description: "Community events and engagement metrics",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Monthly Summary",
      description: "Comprehensive monthly performance report",
      icon: FileText,
      color: "text-[#ea384c]",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Reports - BarangayMo Officials</title>
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
            <h1 className="text-2xl font-bold text-[#ea384c]">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and view detailed reports</p>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reportTypes.map((report, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${report.bgColor}`}>
                    <report.icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#ea384c] hover:bg-[#d12d41]">
                        Generate Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Monthly Budget Report - November 2024", date: "December 1, 2024", type: "Budget" },
                { name: "Population Demographics Q4 2024", date: "November 28, 2024", type: "Demographics" },
                { name: "Community Events Summary", date: "November 25, 2024", type: "Activities" }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-600">{report.type} • Generated on {report.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
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

export default ReportsPage;
