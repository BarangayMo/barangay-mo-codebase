
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export const UpcomingEvents = () => {
  const { data: events } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_events')
        .select('*')
        .eq('status', 'planned')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  // Mock data if no events exist
  const mockEvents = [
    {
      id: '1',
      title: "Monthly Barangay Assembly",
      description: "Regular monthly meeting with all residents",
      event_date: "2024-12-20T19:00:00",
      location: "Barangay Hall",
      attendees_count: 150,
      max_capacity: 200,
      status: "planned"
    },
    {
      id: '2',
      title: "Community Health Fair",
      description: "Free medical checkup and health consultation",
      event_date: "2024-12-22T08:00:00",
      location: "Barangay Covered Court",
      attendees_count: 75,
      max_capacity: 300,
      status: "planned"
    },
    {
      id: '3',
      title: "Christmas Festival",
      description: "Annual Christmas celebration with games and prizes",
      event_date: "2024-12-24T16:00:00",
      location: "Barangay Plaza",
      attendees_count: 200,
      max_capacity: 500,
      status: "planned"
    }
  ];

  const displayEvents = events && events.length > 0 ? events : mockEvents;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-700';
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
          <Button size="sm" asChild>
            <Link to="/officials/events/new">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees_count} / {event.max_capacity} attendees</span>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Edit Event
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" className="w-full text-sm text-[#ea384c] hover:text-[#d12d41]" asChild>
            <Link to="/officials/events">
              View All Events →
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
