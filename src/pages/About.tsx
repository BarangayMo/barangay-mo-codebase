
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>About Us - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="About Barangay Mo"
          subtitle="Discover the heart of your community"
          breadcrumbs={[{ label: "About Us" }]}
        />
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600">
            Sa Barangay Mo, ang aming layunin ay ang pagbuo ng isang mas malakas at mas 
            magkakaugnay na komunidad. As the smallest unit of local government, 
            we believe that every resident has an important role in developing our barangay.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p>
            Barangay Mo is on a mission to empower communities through technology. We provide digital tools 
            that make governance more efficient, transparent, and accessible to all citizens.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Vision</h2>
          <p>
            We envision a Philippines where every barangay is digitally empowered, where residents can easily 
            access services, participate in community decisions, and contribute to local development.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Malasakit (Compassion)</strong> - We care deeply about the communities we serve</li>
            <li><strong>Transparency</strong> - We believe in open and honest communication</li>
            <li><strong>Innovation</strong> - We continuously improve our platform to meet evolving needs</li>
            <li><strong>Inclusivity</strong> - We ensure our solutions are accessible to all Filipinos</li>
            <li><strong>Excellence</strong> - We strive for the highest quality in all we do</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
          <p>
            Barangay Mo was founded by a team of Filipino technologists, local governance experts, and 
            community development specialists who share a passion for using technology to solve 
            local challenges. Salamat sa inyong patuloy na suporta!
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold text-blue-800">Join Our Community</h3>
            <p className="mt-2">
              Whether you're a barangay official, a resident, or a partner organization, we welcome you 
              to be part of the Barangay Mo community.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
