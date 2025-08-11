-- Create function to generate unique SKU
CREATE OR REPLACE FUNCTION public.generate_product_sku()
RETURNS TEXT AS $$
DECLARE
    new_sku TEXT;
    current_year INTEGER;
    counter INTEGER;
BEGIN
    -- Get current year
    current_year := EXTRACT(YEAR FROM NOW());
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(RIGHT(sku, 6) AS INTEGER)), 0) + 1 
    INTO counter
    FROM public.products 
    WHERE sku LIKE 'SKU-' || current_year || '-%';
    
    -- Ensure counter is at least 1
    IF counter IS NULL OR counter < 1 THEN
        counter := 1;
    END IF;
    
    -- Generate SKU: SKU-YYYY-NNNNNN (6-digit counter)
    new_sku := 'SKU-' || current_year || '-' || LPAD(counter::TEXT, 6, '0');
    
    RETURN new_sku;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to set SKU automatically
CREATE OR REPLACE FUNCTION public.set_product_sku()
RETURNS TRIGGER AS $$
BEGIN
    -- Only set SKU if it's not provided or empty
    IF NEW.sku IS NULL OR NEW.sku = '' THEN
        NEW.sku := public.generate_product_sku();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add UNIQUE constraint to SKU column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_sku_key' 
        AND table_name = 'products'
    ) THEN
        ALTER TABLE public.products ADD CONSTRAINT products_sku_key UNIQUE (sku);
    END IF;
END $$;

-- Make SKU column NOT NULL with default
ALTER TABLE public.products 
ALTER COLUMN sku SET NOT NULL,
ALTER COLUMN sku SET DEFAULT public.generate_product_sku();

-- Create trigger to auto-generate SKU
DROP TRIGGER IF EXISTS trigger_set_product_sku ON public.products;
CREATE TRIGGER trigger_set_product_sku
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.set_product_sku();