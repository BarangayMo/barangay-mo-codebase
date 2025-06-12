
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Award, Mail, Phone, Shield, CheckCircle, Crown } from "lucide-react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PublicProfile() {
  const { userId } = useParams();
  const isMobile = useIsMobile();
  
  // Enhanced user data with barangay-specific context
  const user = {
    id: userId || "1",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    phone: "+63 912 345 6789",
    avatar: "/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png",
    role: "Barangay Councilor", // Official barangay role
    barangay: "Barangay San Jose",
    municipality: "Quezon City",
    joinedDate: "January 2024",
    bio: "Elected Barangay Councilor focused on youth development and environmental protection programs.",
    
    // Barangay role information
    officialPosition: {
      title: "Barangay Councilor",
      committee: "Committee on Youth and Sports Development",
      termStart: "2023",
      termEnd: "2026"
    },
    
    // Verification status
    verificationStatus: {
      isVerifiedResident: true,
      isVerifiedOfficial: true,
      isVerifiedVoter: true,
      verificationDate: "March 2024"
    },
    
    achievements: [
      { name: "Outstanding Councilor 2024", description: "Excellence in youth programs", category: "official" },
      { name: "Community Builder", description: "Led 5 community projects", category: "community" },
      { name: "Environmental Champion", description: "Organized 10 cleanup drives", category: "environment" }
    ],
    
    stats: {
      eventsOrganized: 15,
      ordinancesAuthored: 3,
      communityScore: 98,
      yearsOfService: 2
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes("Punong Barangay")) return <Crown className="w-4 h-4" />;
    if (role.includes("Councilor")) return <Shield className="w-4 h-4" />;
    return <Users className="w-4 h-4" />;
  };

  const getVerificationBadges = () => {
    const badges = [];
    if (user.verificationStatus.isVerifiedOfficial) {
      badges.push({ label: "Verified Official", color: "bg-blue-100 text-blue-800", icon: <Shield className="w-3 h-3" /> });
    }
    if (user.verificationStatus.isVerifiedResident) {
      badges.push({ label: "Verified Resident", color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> });
    }
    if (user.verificationStatus.isVerifiedVoter) {
      badges.push({ label: "Registered Voter", color: "bg-purple-100 text-purple-800", icon: <Users className="w-3 h-3" /> });
    }
    return badges;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isMobile && <Header />}
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Card with Role Indicators */}
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
                  
                  {/* Barangay Role Indicator */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    <Badge variant="default" className="flex items-center gap-1 bg-blue-600">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {user.barangay}
                    </Badge>
                  </div>

                  {/* Verification Badges */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    {getVerificationBadges().map((badge, index) => (
                      <Badge key={index} className={`flex items-center gap-1 ${badge.color} border-0`}>
                        {badge.icon}
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 max-w-md">{user.bio}</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.stats.communityScore}</div>
                  <div className="text-sm text-gray-500">Community Score</div>
                </div>
              </div>

              {/* Official Position Details */}
              {user.officialPosition && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-lg mb-2">Official Position</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Committee:</span> {user.officialPosition.committee}
                    </div>
                    <div>
                      <span className="font-medium">Term:</span> {user.officialPosition.termStart} - {user.officialPosition.termEnd}
                    </div>
                  </div>
                </div>
              )}
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
                  <span className="text-sm">In office since {user.joinedDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Official Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Official Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Events Organized</span>
                  <span className="font-semibold">{user.stats.eventsOrganized}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ordinances Authored</span>
                  <span className="font-semibold">{user.stats.ordinancesAuthored}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Years of Service</span>
                  <span className="font-semibold">{user.stats.yearsOfService}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance Rating</span>
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

            {/* Achievements & Recognition */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements & Recognition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {achievement.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {!isMobile && <Footer />}
    </div>
  );
}
