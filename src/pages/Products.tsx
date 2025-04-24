
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Helmet } from "react-helmet";

export default function Products() {
  return (
    <Layout>
      <Helmet>
        <title>Products - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Our Products"
          subtitle="Discover the tools and services we offer to make your barangay smarter"
          breadcrumbs={[{ label: "Products" }]}
        />
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600">
            Barangay Mo offers a comprehensive suite of digital tools designed to connect communities and streamline local governance.
          </p>
          <p className="text-lg text-gray-600">
            Mabuhay! Explore our products below to see how we can help your community thrive in the digital age.
          </p>
          {/* Add more content as needed */}
        </div>
      </div>
    </Layout>
  );
}
