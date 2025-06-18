
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Download } from "lucide-react";
import { BudgetOverview } from "@/components/officials/BudgetOverview";

const BudgetPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Budget Management - BarangayMo Officials</title>
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
            <h1 className="text-2xl font-bold text-[#ea384c]">Budget Management</h1>
            <p className="text-gray-600">Manage and track barangay budget allocations</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-[#ea384c] hover:bg-[#d12d41]">
              <Plus className="h-4 w-4 mr-2" />
              New Allocation
            </Button>
          </div>
        </div>

        <BudgetOverview />
      </div>
    </Layout>
  );
};

export default BudgetPage;
