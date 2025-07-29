
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Eye, 
  MessageCircle, 
  UserMinus,
  FileText,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const OfficialResidents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const { data: residents, isLoading } = useQuery({
    queryKey: ['official-residents', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get official's barangay first
      const { data: officialProfile } = await supabase
        .from('profiles')
        .select('barangay')
        .eq('id', user.id)
        .single();

      if (!officialProfile?.barangay) return [];

      // Get residents in the same barangay
      const { data: residents, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          barangay,
          role,
          created_at,
          last_login,
          status
        `)
        .eq('barangay', officialProfile.barangay)
        .eq('role', 'resident')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return residents || [];
    },
    enabled: !!user?.id
  });

  const filteredResidents = residents?.filter(resident => 
    `${resident.first_name} ${resident.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-official mb-2">Resident Management</h1>
          <p className="text-gray-600">Manage residents in your barangay</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search residents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredResidents.map((resident) => (
            <Card key={resident.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {resident.first_name?.[0]}{resident.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {resident.first_name} {resident.last_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Joined {format(new Date(resident.created_at), 'MMM dd, yyyy')}</span>
                        {resident.last_login && (
                          <span>• Last seen {format(new Date(resident.last_login), 'MMM dd')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Resident
                    </Badge>
                    <Badge 
                      variant={resident.status === 'online' ? 'default' : 'secondary'}
                      className={resident.status === 'online' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {resident.status || 'offline'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/users/${resident.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/messages/${conversationId}`}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message Resident
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View RBI Form
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove Resident
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredResidents.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No residents found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OfficialResidents;
