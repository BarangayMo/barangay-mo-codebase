
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Helmet } from "react-helmet";

export default function Features() {
  return (
    <Layout>
      <Helmet>
        <title>Mga Features - Barangay Mo</title>
      </Helmet>
      <div className="container max-w-7xl mx-auto px-4">
        <PageHeader
          title="Mga Features"
          subtitle="Discover what makes Barangay Mo special"
          breadcrumbs={[{ label: "Mga Features" }]}
        />
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600">
            Ang Barangay Mo ay may iba't ibang features na dinisenyo upang mapabuti 
            ang ating serbisyo sa komunidad at mapagaan ang buhay ng ating mga residente.
          </p>
          {/* Add more content as needed */}
        </div>
      </div>
    </Layout>
  );
}
