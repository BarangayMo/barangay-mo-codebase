
import { useAuth } from "@/contexts/AuthContext";
import { useBarangayOfficial } from "@/hooks/use-barangay-official";
import { useStartConversation } from "@/hooks/useStartConversation";
import { Layout } from "@/components/layout/Layout";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { ChatInterface } from "@/components/messages/ChatInterface";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogIn } from "lucide-react";
import { useEffect } from "react";

export default function Messages() {
  const { isAuthenticated, userRole } = useAuth();
  const { data: barangayOfficial } = useBarangayOfficial();
  const { startConversation } = useStartConversation();
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Auto-redirect residents to their barangay official conversation
  useEffect(() => {
    if (isAuthenticated && userRole === 'resident' && !conversationId && barangayOfficial) {
      // Start conversation with barangay official automatically
      startConversation(barangayOfficial.id).catch(console.error);
    }
  }, [isAuthenticated, userRole, conversationId, barangayOfficial, startConversation]);

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
    <Layout hideHeader={false} hideFooter={true} hideMobileNavbar={!!conversationId}>
      <Helmet>
        <title>Messages - Barangay Management System</title>
      </Helmet>
      
      <div className="flex h-[calc(100vh-4rem)] border bg-gray-100 md:rounded-lg shadow-sm overflow-hidden">
        {/* Desktop: Always show list and chat. Mobile: Toggle between list and chat */}
        
        {/* Conversations List Panel */}
        <div className={`w-full md:w-[400px] md:flex-shrink-0 border-r border-gray-200 flex flex-col bg-white ${
          conversationId ? "hidden md:flex" : "flex"
        }`}>
          <ConversationsList />
        </div>

        {/* Chat Panel */}
        <div className={`flex-1 flex flex-col ${
          conversationId ? "flex" : "hidden md:flex"
        }`}>
          {conversationId ? (
            <ChatInterface />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-50">
              <MessageSquare size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
