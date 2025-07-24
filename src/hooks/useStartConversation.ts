
import { useNavigate } from 'react-router-dom';
import { useMessages } from './useMessages';
import { useAuth } from '@/contexts/AuthContext';

export const useStartConversation = () => {
  const navigate = useNavigate();
  const { createOrFindConversation } = useMessages();
  const { isAuthenticated } = useAuth();

  const startConversation = async (userId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const conversationId = await createOrFindConversation(userId);
    if (conversationId) {
      navigate(`/messages/${conversationId}`);
    }
  };

  return { startConversation };
};
