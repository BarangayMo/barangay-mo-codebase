import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MessageListProps {
  activeConversationId?: string;
  onConversationSelect: (id: string) => void;
}

export function MessageList({ activeConversationId, onConversationSelect }: MessageListProps) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/messages');
  }, [navigate]);

  return null;
}
