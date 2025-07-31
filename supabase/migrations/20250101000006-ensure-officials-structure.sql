-- Ensure officials table has the correct structure
-- Add any missing columns if they don't exist

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Add password_hash column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN password_hash TEXT;
    END IF;
END $$;

-- Add original_password column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'original_password'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN original_password TEXT;
    END IF;
END $$;

-- Add approved_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN approved_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Add approved_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'approved_at'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add rejection_reason column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'rejection_reason'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN rejection_reason TEXT;
    END IF;
END $$;

-- Add submitted_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'submitted_at'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Ensure status column has the correct default and constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
    ELSE
        -- Update existing status column to have proper constraints
        ALTER TABLE public.officials ALTER COLUMN status SET DEFAULT 'pending';
        ALTER TABLE public.officials ADD CONSTRAINT officials_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Ensure is_approved column has the correct default
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'officials' 
        AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE public.officials ADD COLUMN is_approved BOOLEAN DEFAULT false;
    ELSE
        -- Update existing is_approved column to have proper default
        ALTER TABLE public.officials ALTER COLUMN is_approved SET DEFAULT false;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_officials_status ON public.officials(status);
CREATE INDEX IF NOT EXISTS idx_officials_is_approved ON public.officials(is_approved);
CREATE INDEX IF NOT EXISTS idx_officials_email ON public.officials(email);
CREATE INDEX IF NOT EXISTS idx_officials_user_id ON public.officials(user_id);
CREATE INDEX IF NOT EXISTS idx_officials_submitted_at ON public.officials(submitted_at);

-- Create a trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_officials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_officials_updated_at ON public.officials;

-- Create trigger
CREATE TRIGGER trigger_update_officials_updated_at
    BEFORE UPDATE ON public.officials
    FOR EACH ROW
    EXECUTE FUNCTION update_officials_updated_at(); 