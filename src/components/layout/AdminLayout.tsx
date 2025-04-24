
import { ReactNode, useEffect } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  // Ensure we're always scrolled to the top when navigating
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <DesktopSidebar />
      <div className="flex flex-col min-h-screen w-full md:pl-64">
        <Helmet>
          <title>{title} - Smarketplace Admin</title>
        </Helmet>
        <main className="flex-grow">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
