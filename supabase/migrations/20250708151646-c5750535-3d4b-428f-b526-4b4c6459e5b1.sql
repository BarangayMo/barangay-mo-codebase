
-- Check if RLS is enabled on the region tables and create policies for public read access
-- This will allow the location selection to work properly

-- NCR table
ALTER TABLE public."NCR" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to NCR" ON public."NCR" FOR SELECT USING (true);

-- REGION tables
ALTER TABLE public."REGION 1" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 1" ON public."REGION 1" FOR SELECT USING (true);

ALTER TABLE public."REGION 2" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 2" ON public."REGION 2" FOR SELECT USING (true);

ALTER TABLE public."REGION 3" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 3" ON public."REGION 3" FOR SELECT USING (true);

ALTER TABLE public."REGION 4A" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 4A" ON public."REGION 4A" FOR SELECT USING (true);

ALTER TABLE public."REGION 4B" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 4B" ON public."REGION 4B" FOR SELECT USING (true);

ALTER TABLE public."REGION 5" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 5" ON public."REGION 5" FOR SELECT USING (true);

ALTER TABLE public."REGION 6" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 6" ON public."REGION 6" FOR SELECT USING (true);

ALTER TABLE public."REGION 7" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 7" ON public."REGION 7" FOR SELECT USING (true);

ALTER TABLE public."REGION 8" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 8" ON public."REGION 8" FOR SELECT USING (true);

ALTER TABLE public."REGION 9" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 9" ON public."REGION 9" FOR SELECT USING (true);

ALTER TABLE public."REGION 10" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 10" ON public."REGION 10" FOR SELECT USING (true);

ALTER TABLE public."REGION 11" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 11" ON public."REGION 11" FOR SELECT USING (true);

ALTER TABLE public."REGION 12" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 12" ON public."REGION 12" FOR SELECT USING (true);

ALTER TABLE public."REGION 13" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to REGION 13" ON public."REGION 13" FOR SELECT USING (true);

-- CAR and BARMM tables
ALTER TABLE public."CAR" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to CAR" ON public."CAR" FOR SELECT USING (true);

ALTER TABLE public."BARMM" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to BARMM" ON public."BARMM" FOR SELECT USING (true);

-- Also ensure the main Barangays table has public read access
ALTER TABLE public."Barangays" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to Barangays" ON public."Barangays" FOR SELECT USING (true);
