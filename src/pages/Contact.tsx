
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <Helmet>
        <title>Contact Us - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Contact Us"
          subtitle="We'd love to hear from you"
          breadcrumbs={[{ label: "Contact" }]}
        />

        <div className="grid md:grid-cols-2 gap-12 mt-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-8">
              Kumusta, kabayan! Have questions or feedback about Barangay Mo? We're here to help. Fill out the form and our team will get back to you as soon as possible.
            </p>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <Input id="subject" placeholder="What is this regarding?" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <Textarea id="message" placeholder="Type your message here..." rows={5} />
              </div>
              
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Address</h3>
                  <p className="text-gray-600 mt-1">
                    123 Bonifacio Street, Makati City<br />
                    Metro Manila, Philippines 1234
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone Number</h3>
                  <p className="text-gray-600 mt-1">
                    +63 (2) 8123 4567<br />
                    +63 917 123 4567
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Address</h3>
                  <p className="text-gray-600 mt-1">
                    info@barangaymo.ph<br />
                    support@barangaymo.ph
                  </p>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 bg-gray-100 p-4 rounded">
                <p className="text-sm">
                  For urgent matters, please contact our 24/7 support line at +63 917 987 6543.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
