
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserActivity } from "./types";

interface UserActivityTabsProps {
  marketListings: Array<{
    id: string;
    title: string;
    date: string;
    status: string;
  }>;
  jobListings: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
  purchases: Array<{
    id: string;
    item: string;
    date: string;
    price: string;
  }>;
  activities?: UserActivity[];
}

export const UserActivityTabs = ({ marketListings, jobListings, purchases, activities }: UserActivityTabsProps) => {
  return (
    <Card className="p-6 col-span-1 md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">User Activity</h2>
      
      <Tabs defaultValue="market">
        <TabsList className="mb-4">
          <TabsTrigger value="market">Market Listings</TabsTrigger>
          <TabsTrigger value="jobs">Job Activities</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="system">System Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market">
          {marketListings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Listing Title</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {marketListings.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-2">{item.title}</td>
                      <td className="py-3 px-2">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No market listings found</p>
          )}
        </TabsContent>
        
        <TabsContent value="jobs">
          {jobListings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Job Title</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {jobListings.map(job => (
                    <tr key={job.id} className="border-b">
                      <td className="py-3 px-2">{job.title}</td>
                      <td className="py-3 px-2">{new Date(job.date).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No job activities found</p>
          )}
        </TabsContent>
        
        <TabsContent value="purchases">
          {purchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Item</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(purchase => (
                    <tr key={purchase.id} className="border-b">
                      <td className="py-3 px-2">{purchase.item}</td>
                      <td className="py-3 px-2">{new Date(purchase.date).toLocaleDateString()}</td>
                      <td className="py-3 px-2">{purchase.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No purchases found</p>
          )}
        </TabsContent>
        
        <TabsContent value="system">
          {activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-medium">{activity.activity_type.replace('_', ' ')}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {typeof activity.activity_data === 'object' 
                      ? JSON.stringify(activity.activity_data)
                      : String(activity.activity_data)
                    }
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No system activity found</p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
