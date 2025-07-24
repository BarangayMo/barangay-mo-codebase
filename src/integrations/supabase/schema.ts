
// This file contains manually added type definitions for tables that are
// not yet included in the auto-generated types.ts file from Supabase

import { Json } from "./types";

export interface RbiDraftForm {
  id: string;
  user_id: string;
  form_data: Json;
  last_completed_step: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  read_at: string | null;
  metadata: Json;
}

export interface Conversation {
  id: string;
  participant_one_id: string;
  participant_two_id: string;
  last_message_id: string | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export type Tables = {
  rbi_draft_forms: {
    Row: RbiDraftForm;
    Insert: Omit<RbiDraftForm, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<RbiDraftForm, 'id' | 'created_at' | 'updated_at'>>;
  };
  messages: {
    Row: Message;
    Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Message, 'id' | 'created_at' | 'updated_at'>>;
  };
  conversations: {
    Row: Conversation;
    Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Conversation, 'id' | 'created_at' | 'updated_at'>>;
  };
};
