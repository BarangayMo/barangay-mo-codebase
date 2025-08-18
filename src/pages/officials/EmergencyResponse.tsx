
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Phone, MapPin, Headphones, MessageSquare, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmergencyResponse = () => {
  const navigate = useNavigate();

  const emergencyContacts = [
    {
      name: "BPAT",
      icon: Phone,
      action: "Call"
    },
    {
      name: "Police",
      icon: Phone,
      action: "Call"
    },
    {
      name: "Fire Department",
      icon: Phone,
      action: "Call"
    },
    {
      name: "Ambulance",
      icon: Phone,
      action: "Call"
    }
  ];

  const quickActions = [
    {
      name: "Share Live Location",
      description: "Let responders know your current location",
      icon: MapPin
    },
    {
      name: "Emergency Hotlines",
      description: "Access a list of emergency hotlines",
      icon: Headphones
    },
    {
      name: "Message Barangay",
      description: "Send a message to your barangay",
      icon: MessageSquare
    }
  ];

  const handleCall = (service: string) => {
    // In a real app, this would initiate a phone call
    console.log(`Calling ${service}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-red-600">
        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-red-700 w-8 h-8"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Barangay Emergency</h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-50 min-h-screen rounded-t-lg px-4 py-6">
          {/* Emergency Contacts */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contacts</h2>
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
                        className="bg-red-600 hover:bg-red-700 text-white px-4"
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

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <action.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">{action.name}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Medical Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Medical Info</h2>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-800">How to perform CPR</span>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyResponse;
