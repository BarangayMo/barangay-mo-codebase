import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MessageChatProps {
  selectedConversation: any;
  onBack?: () => void;
}

export function MessageChat({ selectedConversation, onBack }: MessageChatProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedConversation?.id) {
      navigate(`/messages/${selectedConversation.id}`);
    }
  }, [selectedConversation, navigate]);

  return null;
}
