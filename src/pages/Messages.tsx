
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { MessageList } from "@/components/messages/MessageList";
import { MessageChat } from "@/components/messages/MessageChat";
import { Helmet } from "react-helmet";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogIn } from "lucide-react";

export default function Messages() {
  const { isAuthenticated } = useAuth();

  // If user is not authenticated, show a login prompt
  if (!isAuthenticated) {
    return (
      <Layout>
        <Helmet>
          <title>Messages - Barangay Management System</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-blue-50 p-8 rounded-2xl mb-8 mx-auto w-16 h-16 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-gray-600 mb-8">
              Please login to view and send messages within your community.
            </p>
            <Button asChild>
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Login to Access Messages
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Messages - Barangay Management System</title>
      </Helmet>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 border-r overflow-y-auto">
          <MessageList />
        </div>
        <div className="hidden md:block md:w-2/3 lg:w-3/4">
          <MessageChat />
        </div>
      </div>
    </Layout>
  );
}
