-- First remove any duplicate draft forms keeping only the latest one
DELETE FROM public.rbi_draft_forms a
USING public.rbi_draft_forms b
WHERE a.user_id = b.user_id
  AND a.created_at < b.created_at;

-- Now create the unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS rbi_draft_forms_user_id_unique 
ON public.rbi_draft_forms (user_id);