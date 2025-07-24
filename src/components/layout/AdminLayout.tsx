
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { EnhancedSidebar } from "./EnhancedSidebar";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/toaster";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  return (
    <div className="flex h-screen bg-gray-50">
      <EnhancedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <div className="text-sm text-gray-600 mt-1">
                Welcome back, {profile?.first_name || 'Admin'}!
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
