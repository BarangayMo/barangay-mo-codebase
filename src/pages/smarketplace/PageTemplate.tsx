
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

interface PageTemplateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, description, children }) => {
  return (
    <Layout>
      <Helmet>
        <title>{title} - Smarketplace Admin - Barangay Mo</title>
      </Helmet>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{title}</CardTitle>
              <Button>Add New</Button>
            </div>
          </CardHeader>
          <CardContent>
            {children || (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This {title} feature is currently in development and will be available soon.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PageTemplate;
