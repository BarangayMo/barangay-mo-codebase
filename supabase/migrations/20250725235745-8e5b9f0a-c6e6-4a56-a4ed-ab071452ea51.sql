-- Add password_hash column to officials table for storing securely hashed passwords
ALTER TABLE public.officials 
ADD COLUMN password_hash TEXT;