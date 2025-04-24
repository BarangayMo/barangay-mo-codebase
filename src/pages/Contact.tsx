
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented later
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact Us - Barangay Mo</title>
      </Helmet>
      
      <div className="min-h-screen relative">
        {/* Background Image with Mask */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50" />
          <img 
            src="https://images.unsplash.com/photo-1486718448742-163732cd1544" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Form Section */}
            <Card className="p-6 backdrop-blur-lg bg-white/10 border-white/20">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Get in Touch</h1>
                <p className="text-gray-200">
                  Reach out to your Barangay Officials for assistance, inquiries, or concerns.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">First name</Label>
                    <Input id="firstName" placeholder="First name" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Last name</Label>
                    <Input id="lastName" placeholder="Last name" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="(+63) XXX-XXX-XXXX" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us how we can help..." 
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Type of Concern</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Documents", "Assistance", "Complaints", "General Inquiry"].map((service) => (
                      <label key={service} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-white/20" />
                        <span className="text-white text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-white text-black hover:bg-white/90">
                  Submit
                </Button>
              </form>
            </Card>

            {/* Contact Information Section */}
            <div className="space-y-8">
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-white">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-300">New Cabalan, Olongapo City</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-white">
                    <Phone className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-300">+63 XXX XXX XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-white">
                    <Mail className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-300">contact@barangaymo.gov.ph</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Office Hours</h2>
                <div className="space-y-2 text-gray-200">
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 8:00 AM - 12:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="mt-4 text-sm">*For emergencies, our hotline is available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
