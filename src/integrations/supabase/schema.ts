
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

export type Tables = {
  rbi_draft_forms: {
    Row: RbiDraftForm;
    Insert: Omit<RbiDraftForm, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<RbiDraftForm, 'id' | 'created_at' | 'updated_at'>>;
  };
};
