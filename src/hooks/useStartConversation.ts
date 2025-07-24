
import { useNavigate } from 'react-router-dom';
import { useMessages } from './useMessages';
import { useAuth } from '@/contexts/AuthContext';

export const useStartConversation = () => {
  const navigate = useNavigate();
  const { createOrFindConversation } = useMessages();
  const { isAuthenticated, user } = useAuth();

  const startConversation = async (userId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    if (userId === user.id) {
      throw new Error('Cannot start conversation with yourself');
    }

    try {
      const conversationId = await createOrFindConversation(userId);
      if (conversationId) {
        navigate(`/messages/${conversationId}`);
      } else {
        throw new Error('Failed to create or find conversation');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  return { startConversation };
};
