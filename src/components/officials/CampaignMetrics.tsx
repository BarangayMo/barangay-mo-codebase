
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Users, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export const CampaignMetrics = () => {
  const { data: campaigns } = useQuery({
    queryKey: ['active-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  // Mock data if no campaigns exist
  const mockCampaigns = [
    {
      id: '1',
      title: "Clean & Green Initiative",
      campaign_type: "community",
      status: "in_progress",
      budget: 50000,
      target_audience: "All Residents",
      created_at: "2024-12-01T00:00:00"
    },
    {
      id: '2',
      title: "Health Awareness Program",
      campaign_type: "health",
      status: "in_progress",
      budget: 25000,
      target_audience: "Senior Citizens",
      created_at: "2024-11-15T00:00:00"
    }
  ];

  const displayCampaigns = campaigns && campaigns.length > 0 ? campaigns : mockCampaigns;

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Campaign Metrics
          </CardTitle>
          <Button size="sm" asChild>
            <Link to="/officials/campaigns/new">
              <Plus className="h-4 w-4 mr-1" />
              New Campaign
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-[#ea384c]/10 rounded-lg">
            <div className="text-2xl font-bold text-[#ea384c]">{displayCampaigns.length}</div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">2.3K</div>
            <div className="text-sm text-gray-600">Total Reach</div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Active Campaigns</h4>
          {displayCampaigns.map((campaign) => (
            <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-sm">{campaign.title}</h5>
                <Badge className={getCampaignTypeColor(campaign.campaign_type)}>
                  {campaign.campaign_type}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Budget:</span>
                  <span className="font-medium">₱{Number(campaign.budget || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Target:</span>
                  <span className="font-medium">{campaign.target_audience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {campaign.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#ea384c] h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="text-xs flex-1">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" className="w-full text-sm text-[#ea384c] hover:text-[#d12d41]" asChild>
            <Link to="/officials/campaigns">
              View All Campaigns →
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
