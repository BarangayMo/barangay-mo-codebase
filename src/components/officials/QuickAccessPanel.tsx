
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Siren, 
  QrCode, 
  FileText, 
  Phone, 
  CreditCard, 
  BarChart3,
  ChevronRight
} from "lucide-react";

const quickAccessItems = [
  {
    title: "Responder",
    icon: Siren,
    href: "/official/emergency-responder",
    color: "bg-red-50 text-red-600"
  },
  {
    title: "QR ID",
    icon: QrCode,
    href: "/official/qr-verification", 
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "RBI",
    icon: FileText,
    href: "/official/rbi-forms",
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Police",
    icon: Phone,
    href: "/official/police-contact",
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Barangay Clearance",
    icon: CreditCard,
    href: "/official/clearance",
    color: "bg-orange-50 text-orange-600"
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/official/reports",
    color: "bg-indigo-50 text-indigo-600"
  }
];

export const QuickAccessPanel = () => {
  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 font-outfit">Serbilis Services</h3>
          <Link 
            to="/official/services" 
            className="text-red-500 text-sm font-medium flex items-center gap-1 hover:text-red-600 transition-colors"
          >
            View All
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {quickAccessItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="flex flex-col items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group active:scale-95"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 ${item.color} group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
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
