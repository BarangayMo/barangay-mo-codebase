import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Settings, Phone, Headphones, MessageSquare, Heart } from "lucide-react";
import { useBarangayData } from "@/hooks/use-barangay-data";
import { useAuth } from "@/contexts/AuthContext";
import { useRegionOfficials } from "@/hooks/useRegionOfficials";
import { Skeleton } from "@/components/ui/skeleton";
import { BarangayDetailsViewTab } from "@/components/resident/barangay-profile/BarangayDetailsViewTab";
import { BarangayAddressViewTab } from "@/components/resident/barangay-profile/BarangayAddressViewTab";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BarangayProfileView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { barangays, isLoading: barangaysLoading } = useBarangayData();
  const userBarangay = user?.barangay;
  const userRegion = user?.region;

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      name: "BPAT",
      icon: Phone,
      action: "Call",
      number: ""
    },
    {
      name: "Police",
      icon: Phone,
      action: "Call",
      number: ""
    },
    {
      name: "Fire Department",
      icon: Phone,
      action: "Call",
      number: ""
    },
    {
      name: "VAWC Hotline",
      icon: Phone,
      action: "Call",
      number: ""
    }
  ]);

  useEffect(() => {
    const fetchBarangayContacts = async () => {
      if (!user?.barangay) return;

      try {
        const { data, error } = await supabase
          .from('Barangays')
          .select(`
            "BPAT Phone",
            "Local Police Contact",
            "Fire Department Phone",
            "VAWC Hotline No"
          `)
          .eq('BARANGAY', user.barangay)
          .single();

        if (error) throw error;

        if (data) {
          setEmergencyContacts(contacts => contacts.map(contact => {
            let number = "";
            switch(contact.name) {
              case "BPAT":
                number = data["BPAT Phone"];
                break;
              case "Police":
                number = data["Local Police Contact"];
                break;
              case "Fire Department":
                number = data["Fire Department Phone"];
                break;
              case "VAWC Hotline":
                number = data["VAWC Hotline No"];
                break;
            }
            return { ...contact, number };
          }));
        }
      } catch (error) {
        console.error('Error fetching barangay contacts:', error);
        toast.error('Failed to load emergency contacts');
      }
    };

    fetchBarangayContacts();
  }, [user?.barangay]);

  const tabItems = [
    {
      value: "details",
      label: "Details",
      icon: <Settings className="w-4 h-4" />
    },
    {
      value: "address",
      label: "Address", 
      icon: <MapPin className="w-4 h-4" />
    },
    {
      value: "emergency",
      label: "Emergency",
      icon: <Phone className="w-4 h-4" />
    }
  ];

  const handleCall = (service: string) => {
    const contact = emergencyContacts.find(c => c.name === service);
    if (contact?.number) {
      window.location.href = `tel:${contact.number}`;
    } else {
      toast.error('No contact number available for this service');
    }
  };

  if (barangaysLoading) {
    return (
      <Layout>
        <div className="space-y-6 p-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center px-4">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-1"
            >
              ←
            </button>
            <h1 className="text-lg font-semibold">Barangay Profile</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center space-x-4 p-4">
              {tabItems.map((tab) => (
                <a
                  key={tab.value}
                  href={`#${tab.value}`}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          <div id="details" className="scroll-mt-20">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <BarangayDetailsViewTab />
            </div>
          </div>

          <div id="address" className="scroll-mt-20">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Address</h2>
              <BarangayAddressViewTab />
            </div>
          </div>

          <div id="emergency" className="scroll-mt-20">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <contact.icon className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium text-gray-800">{contact.name}</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                          onClick={() => handleCall(contact.name)}
                        >
                          {contact.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BarangayProfileView;
