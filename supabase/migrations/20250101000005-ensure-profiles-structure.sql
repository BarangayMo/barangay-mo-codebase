-- Ensure profiles table has the correct structure for officials
-- Add any missing columns if they don't exist

-- Add landline_number column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'landline_number'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN landline_number TEXT DEFAULT '';
    END IF;
END $$;

-- Add suffix column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'suffix'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN suffix TEXT DEFAULT '';
    END IF;
END $$;

-- Add middle_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'middle_name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN middle_name TEXT DEFAULT '';
    END IF;
END $$;

-- Add barangay column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'barangay'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN barangay TEXT DEFAULT '';
    END IF;
END $$;

-- Add municipality column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'municipality'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN municipality TEXT DEFAULT '';
    END IF;
END $$;

-- Add province column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'province'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN province TEXT DEFAULT '';
    END IF;
END $$;

-- Add region column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'region'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN region TEXT DEFAULT '';
    END IF;
END $$;

-- Add is_approved column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Ensure the role enum includes 'official'
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'user_role' 
        AND typarray::regtype::text LIKE '%official%'
    ) THEN
        -- Add 'official' to the enum if it doesn't exist
        ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'official';
    END IF;
END $$;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Create index on role for faster filtering
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Create index on is_approved for faster filtering
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON public.profiles(is_approved); 