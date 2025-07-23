
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { MessageList } from "@/components/messages/MessageList";
import { MessageChat } from "@/components/messages/MessageChat";
import { Helmet } from "react-helmet";
import { useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, LogIn, ArrowLeft } from "lucide-react";
import { conversations as allConversations, UserConversation } from "@/data/conversations";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { isAuthenticated } = useAuth();
  const { id: activeConversationIdFromParams } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get('recipient');
  const navigate = useNavigate();

  const [selectedConversation, setSelectedConversation] = useState<UserConversation | null>(null);
  
  // For mobile: track if chat view is open when a conversation is selected
  const [isChatViewOpenMobile, setIsChatViewOpenMobile] = useState(false);

  useEffect(() => {
    if (activeConversationIdFromParams) {
      const conversation = allConversations.find(c => c.id === activeConversationIdFromParams) || null;
      setSelectedConversation(conversation);
      if (conversation) {
        setIsChatViewOpenMobile(true); // Open chat view on mobile if ID is in URL
      } else {
        // Optional: navigate to /messages if ID is invalid, or show a "not found" in chat area
        navigate("/messages", { replace: true }); 
      }
    } else if (recipientId) {
      // Handle new conversation with recipient
      // First, check if we already have a conversation with this user
      const existingConversation = allConversations.find(c => 
        c.id === recipientId || 
        c.name.toLowerCase().includes('job poster')
      );
      
      if (existingConversation) {
        // Navigate to existing conversation
        navigate(`/messages/${existingConversation.id}`, { replace: true });
      } else {
        // Create a temporary conversation for new message
        const newConversation: UserConversation = {
          id: `new-${recipientId}`,
          name: "Job Poster",
          avatar: "/placeholder.svg",
          message: "Start a conversation...",
          time: "now",
          online: true,
          unread: 0
        };
        
        setSelectedConversation(newConversation);
        setIsChatViewOpenMobile(true);
      }
    } else {
      setSelectedConversation(null);
      setIsChatViewOpenMobile(false); // Close chat view on mobile if no ID
    }
  }, [activeConversationIdFromParams, recipientId, navigate]);

  const handleConversationSelect = (id: string) => {
    navigate(`/messages/${id}`);
  };

  const handleMobileBackToList = () => {
    navigate("/messages"); // This will clear the ID, and useEffect will reset selectedConversation
    setIsChatViewOpenMobile(false);
  }

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
      hideMobileNavbar={!!activeConversationIdFromParams} // Hide mobile navbar if a conversation is selected
    >
      <Helmet>
        <title>Messages - Barangay Management System</title>
      </Helmet>
      {/* The main container for the messages UI, styled like the admin version */}
      <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] border md:m-0 bg-gray-100 md:rounded-lg shadow-sm overflow-hidden">
        {/* Desktop: Always show list and chat. Mobile: Toggle between list and chat */}
        
        {/* Message List Panel (Left or Full on Mobile if chat not open) */}
        <div className={cn(
          "w-full md:w-[320px] md:flex-shrink-0 border-r border-gray-200 flex flex-col",
          isChatViewOpenMobile && activeConversationIdFromParams ? "hidden md:flex" : "flex" // Hide list on mobile if chat is open
        )}>
          <MessageList 
            activeConversationId={selectedConversation?.id}
            onConversationSelect={handleConversationSelect}
          />
        </div>

        {/* Chat Panel (Right or Full on Mobile if chat is open) */}
        <div className={cn(
          "flex-1 flex flex-col",
          isChatViewOpenMobile && activeConversationIdFromParams ? "flex" : "hidden md:flex" // Show chat on mobile only if conversation selected
        )}>
          <MessageChat selectedConversation={selectedConversation} onBack={handleMobileBackToList} />
        </div>
      </div>
    </Layout>
  );
}
