import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getRegionTable } from '@/utils/getRegionTable';

interface OfficialData {
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  phoneNumber: string;
  landlineNumber: string;
}

export function useRegionOfficialData(region: string, barangay: string, position: string) {
  const [officialData, setOfficialData] = useState<OfficialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!region || !barangay || !position) {
      setOfficialData(null);
      return;
    }

    const fetchOfficialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const regionTableName = getRegionTable(region);
        if (!regionTableName) {
          throw new Error('Invalid region');
        }

        // Use RPC function to query region table dynamically
        const { data, error } = await supabase.rpc('get_official_by_position_and_barangay', {
          region_name: region,
          barangay_name: barangay,
          position_name: position
        });

        if (error) {
          if (error.code === 'PGRST116' || !data) {
            // No data found
            setOfficialData(null);
            return;
          }
          throw error;
        }

        if (data) {
          setOfficialData({
            firstName: data.firstname || '',
            lastName: data.lastname || '',
            middleName: data.middlename || '',
            suffix: data.suffix || '',
            phoneNumber: '',
            landlineNumber: data.phone || ''
          });
        }
      } catch (err: any) {
        console.error('Error fetching official data:', err);
        setError(err.message || 'Failed to fetch official data');
        setOfficialData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficialData();
  }, [region, barangay, position]);

  return { officialData, loading, error };
}