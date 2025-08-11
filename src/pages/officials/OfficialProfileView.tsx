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

        // Try REGION tables first using composite id: BARANGAY-POSITION-LASTNAME
        const parts = id.split("-");
        if (parts.length >= 3) {
          const lastName = parts.pop() as string;
          const position = parts.pop() as string;
          const barangay = parts.join("-");

          // Lookup region from Barangays table
          const { data: brgyInfo } = await supabase
            .from("Barangays")
            .select('REGION, "CITY/MUNICIPALITY", PROVINCE')
            .eq("BARANGAY", barangay)
            .maybeSingle();

          const regionStr = brgyInfo?.REGION || "";
          const regionTable = getRegionTable(regionStr || "");

          if (regionTable) {
            const { data: regionRow } = await (supabase as any)
              .from(regionTable)
              .select("*")
              .eq("BARANGAY", barangay)
              .eq("POSITION", position)
              .eq("LASTNAME", lastName)
              .maybeSingle();

            if (regionRow) {
              setOfficial({
                first_name: regionRow["FIRSTNAME"] || "",
                middle_name: regionRow["MIDDLENAME"] || "",
                last_name: regionRow["LASTNAME"] || "",
                suffix: regionRow["SUFFIX"] || "",
                position: regionRow["POSITION"] || "",
                barangay: regionRow["BARANGAY"] || "",
                municipality: regionRow["CITY/MUNICIPALITY"] || brgyInfo?.["CITY/MUNICIPALITY"] || "",
                province: regionRow["PROVINCE"] || brgyInfo?.PROVINCE || "",
                region: regionRow["REGION"] || brgyInfo?.REGION || "",
                phone_number: regionRow["BARANGAY HALL TELNO"] || "",
                email: "",
                status: "active",
              });
              setLoading(false);
              return;
            }
          }
        }

        // Fallback to existing tables
        const { data: officialsRow } = await supabase
          .from("officials")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (officialsRow) {
          setOfficial(officialsRow);
          setLoading(false);
          return;
        }

        const { data: councilRow } = await supabase
          .from("council_members")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (councilRow) {
          setOfficial(councilRow);
        } else {
          setError("Official not found.");
          setOfficial(null);
        }
      } catch (e: any) {
        setError("Official not found.");
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
