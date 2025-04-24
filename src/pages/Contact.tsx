
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact Us - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Contact Us"
          subtitle="Email, call, or complete the form to learn how we can help with your concern."
          breadcrumbs={[{ label: "Contact" }]}
        />

        <div className="grid lg:grid-cols-2 gap-12 mt-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm order-2 lg:order-1">
            <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
            <p className="text-gray-600 mb-6">You can reach us anytime</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
                <Input
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              
              <Input
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              
              <div className="flex gap-2">
                <span className="bg-gray-100 px-3 py-2 rounded-md text-gray-600">+63</span>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="flex-1"
                />
              </div>
              
              <Textarea
                placeholder="How can we help?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="min-h-[120px]"
              />
              
              <Button type="submit" className="w-full">Send Message</Button>
              
              <p className="text-xs text-gray-500 text-center">
                By contacting us, you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-semibold mb-4">Headquarters</h3>
              <address className="not-italic space-y-6">
                <div className="flex gap-4 items-start">
                  <div className={cn(
                    "rounded-full p-2",
                    "bg-gradient-to-r from-blue-50 to-blue-100"
                  )}>
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">
                      123 Bonifacio Street<br />
                      Makati City, Metro Manila<br />
                      Philippines 1234
                    </p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className={cn(
                    "rounded-full p-2",
                    "bg-gradient-to-r from-blue-50 to-blue-100"
                  )}>
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">+63 (2) 8123 4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri from 8am to 5pm</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className={cn(
                    "rounded-full p-2",
                    "bg-gradient-to-r from-blue-50 to-blue-100"
                  )}>
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">info@barangaymo.ph</p>
                    <p className="text-sm text-gray-500">Always here to help!</p>
                  </div>
                </div>
              </address>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-semibold mb-4">Customer Support</h3>
              <p className="text-gray-600">
                Our support team is available 24/7 to address any concerns or queries you may have.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-semibold mb-4">Media Inquiries</h3>
              <p className="text-gray-600">
                For media-related questions or press inquiries, please contact us at media@barangaymo.ph
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
