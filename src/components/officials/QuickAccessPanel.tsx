
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Shield, 
  QrCode, 
  FileText, 
  Phone, 
  UserCheck, 
  BarChart3,
  ChevronRight
} from "lucide-react";

const quickAccessItems = [
  {
    title: "Responder",
    icon: Shield,
    href: "/official/emergency-responder",
    color: "bg-red-100 text-red-600"
  },
  {
    title: "QR ID",
    icon: QrCode,
    href: "/official/qr-verification",
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "RBI",
    icon: FileText,
    href: "/official/rbi-forms",
    color: "bg-green-100 text-green-600"
  },
  {
    title: "Police",
    icon: Phone,
    href: "/official/police-contact",
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Barangay Clearance",
    icon: UserCheck,
    href: "/official/clearance",
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/official/reports",
    color: "bg-indigo-100 text-indigo-600"
  }
];

export const QuickAccessPanel = () => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold font-outfit">Serbilis Services</h3>
          <Link 
            to="/official/services" 
            className="text-red-500 text-sm font-medium flex items-center gap-1 hover:text-red-600"
          >
            View All
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickAccessItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${item.color} group-hover:scale-105 transition-transform`}>
                <item.icon className="h-6 w-6" />
              </div>
              <span className="text-xs text-center font-medium text-gray-700 leading-tight">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
