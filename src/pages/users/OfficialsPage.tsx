import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Plus,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Official {
  ID: number;
  FIRST_NAME: string;
  LAST_NAME: string;
  MIDDLE_NAME?: string;
  POSITION: string;
  TERM?: string;
  EMAIL?: string;
  PHONE?: string;
  ADDRESS?: string;
  PROFILE_PICTURE?: string;
  CREATED_AT: string;
  UPDATED_AT: string;
}

export default function OfficialsPage() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/officials');
      if (!response.ok) {
        throw new Error('Failed to fetch officials');
      }
      const data = await response.json();
      setOfficials(data);
    } catch (error) {
      console.error('Error fetching officials:', error);
      toast({
        title: "Error",
        description: "Failed to load officials data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOfficials = officials.filter(official => {
    const matchesSearch = 
      official.FIRST_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.LAST_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.POSITION.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && official.TERM && official.TERM.trim() !== '') ||
      (filterStatus === 'inactive' && (!official.TERM || official.TERM.trim() === ''));

    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      title: "Total Officials",
      value: officials.length.toString(),
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Officials", 
      value: officials.filter(official => official.TERM && official.TERM.trim() !== "").length.toString(),
      icon: UserCheck,
      color: "bg-green-500"
    },
    {
      title: "Inactive Officials",
      value: officials.filter(official => !official.TERM || official.TERM.trim() === "").length.toString(),
      icon: UserX,
      color: "bg-red-500"
    },
    {
      title: "Positions",
      value: Array.from(new Set(officials.map(official => official.POSITION).filter(Boolean))).length.toString(),
      icon: Briefcase,
      color: "bg-purple-500"
    }
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-official"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Officials Management</h1>
          <p className="text-gray-600 mt-1">Manage barangay officials and their information</p>
        </div>
        <Button className="bg-official hover:bg-official-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Official
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search officials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
                size="sm"
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Officials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfficials.map((official) => (
          <Card key={official.ID} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={official.PROFILE_PICTURE} />
                  <AvatarFallback>
                    {getInitials(official.FIRST_NAME, official.LAST_NAME)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {official.FIRST_NAME} {official.MIDDLE_NAME && `${official.MIDDLE_NAME.charAt(0)}.`} {official.LAST_NAME}
                    </h3>
                    <Badge variant={official.TERM && official.TERM.trim() !== '' ? 'default' : 'secondary'}>
                      {official.TERM && official.TERM.trim() !== '' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{official.POSITION}</p>
                  {official.TERM && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Term: {official.TERM}
                    </div>
                  )}
                  {official.EMAIL && (
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1" />
                      {official.EMAIL}
                    </div>
                  )}
                  {official.PHONE && (
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" />
                      {official.PHONE}
                    </div>
                  )}
                  {official.ADDRESS && (
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {official.ADDRESS}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Added: {formatDate(official.CREATED_AT)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOfficials.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No officials found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first official.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
