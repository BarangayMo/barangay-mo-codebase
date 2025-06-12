
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Award, Mail, Phone } from "lucide-react";
import { useParams } from "react-router-dom";

export default function PublicProfile() {
  const { userId } = useParams();
  
  // Mock user data - in real app, fetch based on userId
  const user = {
    id: userId || "1",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    phone: "+63 912 345 6789",
    avatar: "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png",
    role: "Resident",
    barangay: "Barangay San Jose",
    municipality: "Quezon City",
    joinedDate: "January 2024",
    bio: "Active community member passionate about local development and helping neighbors.",
    achievements: [
      { name: "Community Helper", description: "Assisted 10+ neighbors" },
      { name: "Event Organizer", description: "Organized community cleanup" }
    ],
    stats: {
      eventsAttended: 12,
      servicesUsed: 8,
      communityScore: 95
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                  <Badge variant="secondary">{user.role}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.barangay}
                  </Badge>
                </div>
                <p className="text-gray-600 max-w-md">{user.bio}</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.stats.communityScore}</div>
                <div className="text-sm text-gray-500">Community Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{user.municipality}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Joined {user.joinedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Events Attended</span>
                <span className="font-semibold">{user.stats.eventsAttended}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Services Used</span>
                <span className="font-semibold">{user.stats.servicesUsed}</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Community Engagement</span>
                  <span>{user.stats.communityScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${user.stats.communityScore}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{achievement.name}</div>
                    <div className="text-xs text-gray-500">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
