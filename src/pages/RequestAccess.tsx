
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function RequestAccess() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    barangay: "",
    position: "",
    message: ""
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request submitted!",
      description: "Salamat! We'll review your request and get back to you soon.",
    });
    setFormData({
      name: "",
      email: "",
      barangay: "",
      position: "",
      message: ""
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Request Access - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Request Access"
          subtitle="Join our growing community of digitally enabled barangays"
          breadcrumbs={[{ label: "Request Access" }]}
        />
        
        <div className="max-w-2xl mx-auto mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="barangay" className="block text-sm font-medium mb-2">Barangay Name</label>
              <Input 
                id="barangay" 
                name="barangay" 
                value={formData.barangay} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium mb-2">Your Position</label>
              <Input 
                id="position" 
                name="position" 
                value={formData.position} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Additional Information</label>
              <Textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                rows={4} 
              />
            </div>
            
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
