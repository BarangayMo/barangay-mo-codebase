import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getRegionTable } from "@/utils/getRegionTable";

// Fetch officials from the user's region table for a barangay
export function useRegionOfficials(barangay: string | undefined, region: string | undefined) {
  return useQuery({
    queryKey: ["region-officials", barangay, region],
    queryFn: async () => {
      if (!barangay || !region) return [];
      const table = getRegionTable(region);
      if (!table) return [];
      const { data, error } = await (supabase as any)
        .from(table as any)
        .select("*")
        .eq("BARANGAY", barangay);
      if (error || !data) return [];
      // Map DB fields to UI fields
      return data.map((row: any) => ({
        id: row.id || `${row["BARANGAY"]}-${row["POSITION"]}-${row["LASTNAME"]}`,
        first_name: row["FIRSTNAME"] || "",
        middle_name: row["MIDDLENAME"] || "",
        last_name: row["LASTNAME"] || "",
        suffix: row["SUFFIX"] || "",
        position: row["POSITION"] || "",
        barangay: row["BARANGAY"] || "",
        municipality: row["CITY/MUNICIPALITY"] || "",
        province: row["PROVINCE"] || "",
        region: row["REGION"] || "",
        phone_number: row["BARANGAY HALL TELNO"] || "",
        // Add more mappings as needed
      }));
    },
    enabled: !!barangay && !!region,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Add official to the correct region table
type OfficialData = Record<string, any>;
export function useAddRegionOfficial(region: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OfficialData) => {
      const table = getRegionTable(region || "");
      if (!table) throw new Error("Region not found");
      const { error } = await (supabase as any).from(table as any).insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-officials"] });
    },
  });
}

// Update official in the correct region table
export function useUpdateRegionOfficial(region: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: any; data: OfficialData }) => {
      const table = getRegionTable(region || "");
      if (!table) throw new Error("Region not found");
      const { error } = await (supabase as any).from(table as any).update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-officials"] });
    },
  });
}

// Delete official from the correct region table
export function useDeleteRegionOfficial(region: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => {
      const table = getRegionTable(region || "");
      if (!table) throw new Error("Region not found");
      const { error } = await (supabase as any).from(table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-officials"] });
    },
  });
}
