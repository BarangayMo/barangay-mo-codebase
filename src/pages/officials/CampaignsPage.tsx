
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Target, Edit, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CampaignsPage = () => {
  const { data: campaigns } = useQuery({
    queryKey: ['all-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'health': return 'bg-green-100 text-green-700';
      case 'education': return 'bg-blue-100 text-blue-700';
      case 'infrastructure': return 'bg-orange-100 text-orange-700';
      case 'safety': return 'bg-red-100 text-red-700';
      case 'community': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Campaigns - BarangayMo Officials</title>
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
            <h1 className="text-2xl font-bold text-[#ea384c]">Campaign Management</h1>
            <p className="text-gray-600">Create and manage community campaigns</p>
          </div>
          <div className="ml-auto">
            <Button className="bg-[#ea384c] hover:bg-[#d12d41]" asChild>
              <Link to="/officials/campaigns/new">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Link>
            </Button>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{campaign.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getCampaignTypeColor(campaign.campaign_type)}>
                        {campaign.campaign_type}
                      </Badge>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Target className="h-5 w-5 text-[#ea384c]" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-medium">₱{Number(campaign.budget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target:</span>
                    <span className="font-medium">{campaign.target_audience}</span>
                  </div>
                  {campaign.start_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium">{new Date(campaign.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Campaign Card */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-[#ea384c] transition-colors cursor-pointer">
            <Link to="/officials/campaigns/new">
              <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-700 mb-2">Create New Campaign</h3>
                <p className="text-sm text-gray-500">Start a new community campaign</p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CampaignsPage;
