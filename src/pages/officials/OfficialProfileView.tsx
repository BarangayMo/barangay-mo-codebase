import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getRegionTable } from "@/utils/getRegionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";

export default function OfficialProfileView() {
  const { id } = useParams();
  const [official, setOfficial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOfficial() {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          setError("Invalid profile id.");
          setOfficial(null);
          setLoading(false);
          return;
        }

        const decodedId = decodeURIComponent(id).replace(/\+/g, ' ');
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(decodedId);

        // Try REGION tables first if composite id
        if (!isUuid && decodedId.includes('-')) {
          const parts = decodedId.split('-');
          if (parts.length >= 3) {
            const lastName = parts.pop() as string;
            const position = parts.pop() as string;
            const barangay = parts.join('-');

            // 1) Lookup region from Barangays table (case-insensitive)
            const { data: brgyInfo } = await supabase
              .from('Barangays')
              .select('REGION, "CITY/MUNICIPALITY", PROVINCE')
              .ilike('BARANGAY', barangay)
              .maybeSingle();

            let regionTable: string | null = null;
            if (brgyInfo?.REGION) {
              regionTable = getRegionTable(brgyInfo.REGION || '');
            }

            // 2) If region known, try that table (case-insensitive filters)
            if (regionTable) {
              const { data: regionRow } = await (supabase as any)
                .from(regionTable)
                .select('*')
                .ilike('BARANGAY', barangay)
                .ilike('POSITION', position)
                .ilike('LASTNAME', lastName)
                .maybeSingle();

              if (regionRow) {
                setOfficial({
                  first_name: regionRow['FIRSTNAME'] || '',
                  middle_name: regionRow['MIDDLENAME'] || '',
                  last_name: regionRow['LASTNAME'] || '',
                  suffix: regionRow['SUFFIX'] || '',
                  position: regionRow['POSITION'] || '',
                  barangay: regionRow['BARANGAY'] || '',
                  municipality: regionRow['CITY/MUNICIPALITY'] || brgyInfo?.['CITY/MUNICIPALITY'] || '',
                  province: regionRow['PROVINCE'] || brgyInfo?.PROVINCE || '',
                  region: regionRow['REGION'] || brgyInfo?.REGION || '',
                  phone_number: regionRow['BARANGAY HALL TELNO'] || '',
                  email: '',
                  status: 'active',
                });
                setLoading(false);
                return;
              }
            }

            // 3) As a fallback, scan common REGION tables if barangay lookup failed
            const regionTables = [
              'NCR','REGION 1','REGION 2','REGION 3','REGION 4A','REGION 4B','REGION 5','REGION 6','REGION 7','REGION 8','REGION 9','REGION 10','REGION 11','REGION 12','REGION 13','CAR','BARMM'
            ];

            for (const tbl of regionTables) {
              const { data: regionRow } = await (supabase as any)
                .from(tbl)
                .select('*')
                .ilike('BARANGAY', barangay)
                .ilike('POSITION', position)
                .ilike('LASTNAME', lastName)
                .maybeSingle();

              if (regionRow) {
                setOfficial({
                  first_name: regionRow['FIRSTNAME'] || '',
                  middle_name: regionRow['MIDDLENAME'] || '',
                  last_name: regionRow['LASTNAME'] || '',
                  suffix: regionRow['SUFFIX'] || '',
                  position: regionRow['POSITION'] || '',
                  barangay: regionRow['BARANGAY'] || '',
                  municipality: regionRow['CITY/MUNICIPALITY'] || '',
                  province: regionRow['PROVINCE'] || '',
                  region: regionRow['REGION'] || '',
                  phone_number: regionRow['BARANGAY HALL TELNO'] || '',
                  email: '',
                  status: 'active',
                });
                setLoading(false);
                return;
              }
            }
          }
        }

        // Only try UUID-based tables if id is a UUID
        if (isUuid) {
          const { data: officialsRow } = await supabase
            .from('officials')
            .select('*')
            .eq('id', decodedId)
            .maybeSingle();

          if (officialsRow) {
            setOfficial(officialsRow);
            setLoading(false);
            return;
          }

          const { data: councilRow } = await supabase
            .from('council_members')
            .select('*')
            .eq('id', decodedId)
            .maybeSingle();

          if (councilRow) {
            setOfficial(councilRow);
            setLoading(false);
            return;
          }
        }

        setError('Official not found.');
        setOfficial(null);
      } catch (e: any) {
        setError('Official not found.');
        setOfficial(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOfficial();
  }, [id]);

  if (loading) return <Layout><div className="p-8 text-center">Loading...</div></Layout>;
  if (error) return <Layout><div className="p-8 text-center text-red-500">{error}</div></Layout>;
  if (!official) return <Layout><div className="p-8 text-center">No official found.</div></Layout>;

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-red-600 text-white font-semibold">
                  {official.first_name?.[0]}{official.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">{official.first_name} {official.last_name}</CardTitle>
                <Badge className="mt-2">{official.position}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><strong>Email:</strong> {official.email}</div>
              <div><strong>Phone:</strong> {official.phone_number}</div>
              <div><strong>Barangay:</strong> {official.barangay}</div>
              <div><strong>Municipality:</strong> {official.municipality}</div>
              <div><strong>Province:</strong> {official.province}</div>
              <div><strong>Region:</strong> {official.region}</div>
              {official.status && <div><strong>Status:</strong> {official.status}</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
