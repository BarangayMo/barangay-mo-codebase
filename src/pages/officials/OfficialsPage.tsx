
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Settings, 
  UserCheck, 
  Crown,
  Briefcase,
  FileText,
  Calculator,
  Clipboard
} from "lucide-react";

const officialRoles = [
  {
    title: "Punong Barangay",
    icon: Crown,
    description: "Barangay Captain"
  },
  {
    title: "SK Chairman", 
    icon: UserCheck,
    description: "Youth Council Chair"
  },
  {
    title: "Barangay Councilor",
    icon: Users,
    description: "Council Members"
  },
  {
    title: "SK Council",
    icon: Users,
    description: "Youth Council"
  },
  {
    title: "Brgy Secretary",
    icon: FileText,
    description: "Administrative Secretary"
  },
  {
    title: "Brgy Treasurer", 
    icon: Calculator,
    description: "Financial Officer"
  },
  {
    title: "SK Secretary",
    icon: Clipboard,
    description: "Youth Secretary"
  },
  {
    title: "SK Treasurer",
    icon: Briefcase,
    description: "Youth Treasurer"
  }
];

const OfficialsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Official Page</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {officialRoles.map((role, index) => (
            <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <role.icon className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1 leading-tight">
                  {role.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {role.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficialsPage;
