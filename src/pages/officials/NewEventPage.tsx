
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const NewEventPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>New Event - BarangayMo Officials</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/officials/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#ea384c]">Schedule New Event</h1>
            <p className="text-gray-600">Create a new community event</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input placeholder="Enter event title" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe the event details and agenda" rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Date</label>
                <Input type="datetime-local" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input placeholder="Event venue" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Capacity</label>
                <Input type="number" placeholder="Enter max attendees" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Registration Required</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button className="bg-[#ea384c] hover:bg-[#d12d41]">
                <Save className="h-4 w-4 mr-2" />
                Schedule Event
              </Button>
              <Button variant="outline" asChild>
                <Link to="/officials/events">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NewEventPage;
