
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { MessageInbox } from "@/components/messages/MessageInbox";
import { EnhancedMessageChat } from "@/components/messages/EnhancedMessageChat";
import { Helmet } from "react-helmet";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { isAuthenticated } = useAuth();
  const { id: activeConversationIdFromParams } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isChatViewOpenMobile, setIsChatViewOpenMobile] = useState(false);

  useEffect(() => {
    if (activeConversationIdFromParams) {
      setSelectedConversation(activeConversationIdFromParams);
      setIsChatViewOpenMobile(true);
    } else {
      setSelectedConversation(null);
      setIsChatViewOpenMobile(false);
    }
  }, [activeConversationIdFromParams]);

  const handleConversationSelect = (id: string) => {
    setSelectedConversation(id);
    setIsChatViewOpenMobile(true);
    navigate(`/messages/${id}`);
  };

  const handleMobileBackToList = () => {
    setSelectedConversation(null);
    setIsChatViewOpenMobile(false);
    navigate("/messages");
  };

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
    <Layout 
      hideHeader={false} 
      hideFooter={true} 
      hideMobileNavbar={!!activeConversationIdFromParams}
    >
      <Helmet>
        <title>Messages - Barangay Management System</title>
      </Helmet>
      
      <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] border md:m-0 bg-gray-100 md:rounded-lg shadow-sm overflow-hidden">
        {/* Message Inbox Panel */}
        <div className={cn(
          "w-full md:w-[400px] md:flex-shrink-0 border-r border-gray-200 flex flex-col",
          isChatViewOpenMobile && activeConversationIdFromParams ? "hidden md:flex" : "flex"
        )}>
          <MessageInbox 
            activeConversationId={selectedConversation || undefined}
            onConversationSelect={handleConversationSelect}
          />
        </div>

        {/* Chat Panel */}
        <div className={cn(
          "flex-1 flex flex-col",
          isChatViewOpenMobile && activeConversationIdFromParams ? "flex" : "hidden md:flex"
        )}>
          {selectedConversation ? (
            <EnhancedMessageChat 
              conversationId={selectedConversation}
              onBack={handleMobileBackToList}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 md:rounded-r-lg">
              <div className="text-center">
                <MessageSquare size={48} className="text-gray-300 mb-4 mx-auto" />
                <p className="text-gray-500">Select a conversation to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
