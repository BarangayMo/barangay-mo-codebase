import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Mail, Phone, MapPin, Building, Calendar, ArrowLeft } from "lucide-react";
import { useBarangayOfficial } from "@/hooks/use-barangay-official";
import { useStartConversation } from "@/hooks/useStartConversation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function OfficialProfileView() {
  const { data: official, isLoading, error } = useBarangayOfficial();
  const { startConversation } = useStartConversation();
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMessageOfficial = async () => {
    if (!official?.id) {
      toast({
        title: "Unable to message official",
        description: "Official information not available",
        variant: "destructive"
      });
      return;
    }

    try {
      await startConversation(official.id);
      toast({
        title: "Starting conversation",
        description: `Opening chat with ${official.first_name} ${official.last_name}`,
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Failed to start conversation",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !official) {
    console.log('OfficialProfileView - Error or no official:', { 
      error, 
      official, 
      userBarangay: user?.barangay,
      userRole: userRole 
    });
    
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 -ml-3"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Approved Officials Available
              </h3>
              <p className="text-gray-600 mb-4">
                {error ? 
                  'Unable to load official information due to a technical error.' : 
                  `No approved officials for your barangay (${user?.barangay}) yet. Please check back later or contact your local barangay office.`
                }
              </p>
              {error && (
                <p className="text-sm text-red-600 mb-4">
                  Error details: {typeof error === 'string' ? error : error.message || 'Unknown error'}
                </p>
              )}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Once an official is approved for your barangay, you'll be able to view their profile and contact them through the messaging system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  console.log('OfficialProfileView - Rendering official profile:', {
    official,
    userBarangay: user?.barangay,
    officialBarangay: official.barangay
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {/* Official Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={official.avatar_url || ''} 
                  alt={`${official.first_name} ${official.last_name}`}
                />
                <AvatarFallback className="text-lg">
                  {official.first_name?.charAt(0)}{official.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {official.first_name} {official.last_name}
                  </h1>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-1">
                    Barangay Official
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{user?.barangay}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building size={14} />
                    <span>{user?.municipality}, {user?.province}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  onClick={handleMessageOfficial}
                  className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {official.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{official.email}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Messages</p>
                  <p className="text-gray-900">Available through platform messaging</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">About Your Barangay Official</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How to Contact</h4>
                <p className="text-blue-800 text-sm">
                  You can reach out to your barangay official through the messaging system for any 
                  concerns, inquiries, or assistance you may need. They are here to help serve the community.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Services Available</h4>
                <p className="text-green-800 text-sm">
                  Your barangay official can assist with various services including document requests, 
                  community concerns, emergency coordination, and general barangay-related inquiries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}