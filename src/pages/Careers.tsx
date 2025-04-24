
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Helmet } from "react-helmet";

export default function Careers() {
  return (
    <Layout>
      <Helmet>
        <title>Careers - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Careers"
          subtitle="Join our team and make a difference in your community"
          breadcrumbs={[{ label: "Careers" }]}
        />
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600">
            Sumali sa aming team at maging bahagi ng pagbabago sa ating komunidad. 
            Kami ay palaging naghahanap ng mga magagaling at masisiglang indibidwal 
            na handang maglingkod sa ating barangay.
          </p>
          {/* Add more content as needed */}
        </div>
      </div>
    </Layout>
  );
}
