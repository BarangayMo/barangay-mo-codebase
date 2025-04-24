
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>Tungkol sa Amin - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Tungkol sa Amin"
          subtitle="Discover the heart of your community"
          breadcrumbs={[{ label: "Tungkol sa Amin" }]}
        />
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600">
            Sa Barangay Mo, ang aming layunin ay ang pagbuo ng isang mas malakas at mas 
            magkakaugnay na komunidad. Bilang pinakamaliit na unit ng lokal na pamahalaan, 
            naniniwala kami na ang bawat residente ay may mahalagang papel sa pagpapaunlad 
            ng ating barangay.
          </p>
          {/* Add more content as needed */}
        </div>
      </div>
    </Layout>
  );
}
