
import { useNavigate } from 'react-router-dom';
import { useMessages } from './useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useBarangayOfficial } from './use-barangay-official';
import { supabase } from '@/integrations/supabase/client';

export const useStartConversation = () => {
  const navigate = useNavigate();
  const { createOrFindConversation } = useMessages();
  const { isAuthenticated, user, userRole } = useAuth();
  const { data: barangayOfficial } = useBarangayOfficial();

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

    // Restrict residents to only message their barangay official
    if (userRole === 'resident') {
      if (!barangayOfficial) {
        throw new Error('No barangay official assigned to your area');
      }
      if (userId !== barangayOfficial.id) {
        throw new Error('Residents can only message their assigned barangay official');
      }
    }

    try {
      console.log('Starting conversation with user ID:', userId);
      
      // Check if conversation already exists
      const { data: existingConversation, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_one_id.eq.${user.id},participant_two_id.eq.${userId}),and(participant_one_id.eq.${userId},participant_two_id.eq.${user.id})`)
        .maybeSingle();

      if (searchError && searchError.code !== 'PGRST116') {
        console.error('Error searching for existing conversation:', searchError);
        throw new Error('Failed to search for existing conversation');
      }

      let conversationId;

      if (existingConversation) {
        conversationId = existingConversation.id;
        console.log('Found existing conversation:', conversationId);
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            participant_one_id: user.id,
            participant_two_id: userId,
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
          throw new Error('Failed to create conversation');
        }

        conversationId = newConversation.id;
        console.log('Created new conversation:', conversationId);
      }

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
