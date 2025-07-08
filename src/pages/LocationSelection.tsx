import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

// Hardcoded Philippine regions with their full names
const PHILIPPINE_REGIONS = [
  { code: "REGION 1", name: "Ilocos Region (Region I)" },
  { code: "REGION 2", name: "Cagayan Valley (Region II)" },
  { code: "REGION 3", name: "Central Luzon (Region III)" },
  { code: "REGION 4A", name: "CALABARZON (Region IV-A)" },
  { code: "REGION 4B", name: "MIMAROPA (Region IV-B)" },
  { code: "REGION 5", name: "Bicol Region (Region V)" },
  { code: "REGION 6", name: "Western Visayas (Region VI)" },
  { code: "REGION 7", name: "Central Visayas (Region VII)" },
  { code: "REGION 8", name: "Eastern Visayas (Region VIII)" },
  { code: "REGION 9", name: "Zamboanga Peninsula (Region IX)" },
  { code: "REGION 10", name: "Northern Mindanao (Region X)" },
  { code: "REGION 11", name: "Davao Region (Region XI)" },
  { code: "REGION 12", name: "SOCCSKSARGEN (Region XII)" },
  { code: "REGION 13", name: "Caraga (Region XIII)" },
  { code: "NCR", name: "National Capital Region (NCR)" },
  { code: "CAR", name: "Cordillera Administrative Region (CAR)" },
  { code: "BARMM", name: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" }
];

// Helper function to convert text to title case
const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

// Define types for database responses
type RegionDataRow = {
  PROVINCE?: string | null;
  "CITY/MUNICIPALITY"?: string | null;
  BARANGAY?: string | null;
};

export default function LocationSelection() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  
  const [provinces, setProvinces] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [barangays, setBarangays] = useState<string[]>([]);
  
  const [regionSearch, setRegionSearch] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [municipalitySearch, setMunicipalitySearch] = useState("");
  const [barangaySearch, setBarangaySearch] = useState("");
  
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false);
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Load provinces when region is selected
  useEffect(() => {
    if (selectedRegion) {
      loadProvinces();
      setSelectedProvince("");
      setSelectedMunicipality("");
      setSelectedBarangay("");
    }
  }, [selectedRegion]);

  // Load municipalities when province is selected
  useEffect(() => {
    if (selectedProvince) {
      loadMunicipalities();
      setSelectedMunicipality("");
      setSelectedBarangay("");
    }
  }, [selectedProvince]);

  // Load barangays when municipality is selected
  useEffect(() => {
    if (selectedMunicipality) {
      loadBarangays();
      setSelectedBarangay("");
    }
  }, [selectedMunicipality]);

  const loadProvinces = async () => {
    if (!selectedRegion) return;
    
    console.log('Loading provinces for region:', selectedRegion);
    setIsLoading(true);
    setProvinces([]);
    
    try {
      let data: RegionDataRow[] | null = null;
      let error: any = null;
      
      // Use specific queries for each region
      switch(selectedRegion) {
        case 'NCR':
          const ncrResult = await supabase
            .from('NCR')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = ncrResult.data;
          error = ncrResult.error;
          break;
        case 'REGION 1':
          const r1Result = await supabase
            .from('REGION 1')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r1Result.data;
          error = r1Result.error;
          break;
        case 'REGION 2':
          const r2Result = await supabase
            .from('REGION 2')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r2Result.data;
          error = r2Result.error;
          break;
        case 'REGION 3':
          const r3Result = await supabase
            .from('REGION 3')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r3Result.data;
          error = r3Result.error;
          break;
        case 'REGION 4A':
          const r4aResult = await supabase
            .from('REGION 4A')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r4aResult.data;
          error = r4aResult.error;
          break;
        case 'REGION 4B':
          const r4bResult = await supabase
            .from('REGION 4B')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r4bResult.data;
          error = r4bResult.error;
          break;
        case 'REGION 5':
          const r5Result = await supabase
            .from('REGION 5')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r5Result.data;
          error = r5Result.error;
          break;
        case 'REGION 6':
          const r6Result = await supabase
            .from('REGION 6')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r6Result.data;
          error = r6Result.error;
          break;
        case 'REGION 7':
          const r7Result = await supabase
            .from('REGION 7')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r7Result.data;
          error = r7Result.error;
          break;
        case 'REGION 8':
          const r8Result = await supabase
            .from('REGION 8')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r8Result.data;
          error = r8Result.error;
          break;
        case 'REGION 9':
          const r9Result = await supabase
            .from('REGION 9')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r9Result.data;
          error = r9Result.error;
          break;
        case 'REGION 10':
          const r10Result = await supabase
            .from('REGION 10')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r10Result.data;
          error = r10Result.error;
          break;
        case 'REGION 11':
          const r11Result = await supabase
            .from('REGION 11')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r11Result.data;
          error = r11Result.error;
          break;
        case 'REGION 12':
          const r12Result = await supabase
            .from('REGION 12')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r12Result.data;
          error = r12Result.error;
          break;
        case 'REGION 13':
          const r13Result = await supabase
            .from('REGION 13')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = r13Result.data;
          error = r13Result.error;
          break;
        case 'CAR':
          const carResult = await supabase
            .from('CAR')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = carResult.data;
          error = carResult.error;
          break;
        case 'BARMM':
          const barmmResult = await supabase
            .from('BARMM')
            .select('PROVINCE')
            .not('PROVINCE', 'is', null)
            .neq('PROVINCE', '');
          data = barmmResult.data;
          error = barmmResult.error;
          break;
        default:
          console.error('Unknown region:', selectedRegion);
          setIsLoading(false);
          return;
      }
      
      console.log('Query result:', { data, error });
      
      if (error) {
        console.error('Error loading provinces:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Extract provinces and ensure they are strings
        const provinceList = data
          .map((item: any) => item.PROVINCE)
          .filter((province: any) => province && typeof province === 'string' && province.trim() !== '');
        
        // Get unique provinces and sort alphabetically
        const uniqueProvinces = [...new Set(provinceList)] as string[];
        const sortedProvinces = uniqueProvinces.sort();
        
        console.log('Processed provinces:', sortedProvinces);
        setProvinces(sortedProvinces);
      } else {
        console.log('No province data found for region:', selectedRegion);
        setProvinces([]);
      }
    } catch (error) {
      console.error('Exception while loading provinces:', error);
      setProvinces([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMunicipalities = async () => {
    if (!selectedRegion || !selectedProvince) return;
    
    console.log('Loading municipalities for region:', selectedRegion, 'province:', selectedProvince);
    setIsLoading(true);
    setMunicipalities([]);
    
    try {
      let data: RegionDataRow[] | null = null;
      let error: any = null;
      
      // Use specific queries for each region with properly quoted column name
      switch(selectedRegion) {
        case 'NCR':
          const ncrResult = await supabase
            .from('NCR')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = ncrResult.data;
          error = ncrResult.error;
          break;
        case 'REGION 1':
          const r1Result = await supabase
            .from('REGION 1')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r1Result.data;
          error = r1Result.error;
          break;
        case 'REGION 2':
          const r2Result = await supabase
            .from('REGION 2')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r2Result.data;
          error = r2Result.error;
          break;
        case 'REGION 3':
          const r3Result = await supabase
            .from('REGION 3')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r3Result.data;
          error = r3Result.error;
          break;
        case 'REGION 4A':
          const r4aResult = await supabase
            .from('REGION 4A')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r4aResult.data;
          error = r4aResult.error;
          break;
        case 'REGION 4B':
          const r4bResult = await supabase
            .from('REGION 4B')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r4bResult.data;
          error = r4bResult.error;
          break;
        case 'REGION 5':
          const r5Result = await supabase
            .from('REGION 5')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r5Result.data;
          error = r5Result.error;
          break;
        case 'REGION 6':
          const r6Result = await supabase
            .from('REGION 6')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r6Result.data;
          error = r6Result.error;
          break;
        case 'REGION 7':
          const r7Result = await supabase
            .from('REGION 7')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r7Result.data;
          error = r7Result.error;
          break;
        case 'REGION 8':
          const r8Result = await supabase
            .from('REGION 8')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r8Result.data;
          error = r8Result.error;
          break;
        case 'REGION 9':
          const r9Result = await supabase
            .from('REGION 9')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r9Result.data;
          error = r9Result.error;
          break;
        case 'REGION 10':
          const r10Result = await supabase
            .from('REGION 10')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r10Result.data;
          error = r10Result.error;
          break;
        case 'REGION 11':
          const r11Result = await supabase
            .from('REGION 11')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r11Result.data;
          error = r11Result.error;
          break;
        case 'REGION 12':
          const r12Result = await supabase
            .from('REGION 12')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r12Result.data;
          error = r12Result.error;
          break;
        case 'REGION 13':
          const r13Result = await supabase
            .from('REGION 13')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = r13Result.data;
          error = r13Result.error;
          break;
        case 'CAR':
          const carResult = await supabase
            .from('CAR')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = carResult.data;
          error = carResult.error;
          break;
        case 'BARMM':
          const barmmResult = await supabase
            .from('BARMM')
            .select('"CITY/MUNICIPALITY"')
            .eq('PROVINCE', selectedProvince)
            .not('"CITY/MUNICIPALITY"', 'is', null)
            .neq('"CITY/MUNICIPALITY"', '');
          data = barmmResult.data;
          error = barmmResult.error;
          break;
        default:
          setIsLoading(false);
          return;
      }
      
      console.log('Municipalities query result:', { data, error });
      
      if (error) {
        console.error('Error loading municipalities:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const municipalityList = data
          .map((item: any) => item['CITY/MUNICIPALITY'])
          .filter((municipality: any) => municipality && typeof municipality === 'string' && municipality.trim() !== '');
        
        const uniqueMunicipalities = [...new Set(municipalityList)] as string[];
        console.log('Processed municipalities:', uniqueMunicipalities.sort());
        setMunicipalities(uniqueMunicipalities.sort());
      } else {
        console.log('No municipality data found for region:', selectedRegion, 'province:', selectedProvince);
        setMunicipalities([]);
      }
    } catch (error) {
      console.error('Error loading municipalities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBarangays = async () => {
    if (!selectedRegion || !selectedProvince || !selectedMunicipality) return;
    
    console.log('Loading barangays for region:', selectedRegion, 'province:', selectedProvince, 'municipality:', selectedMunicipality);
    setIsLoading(true);
    setBarangays([]);
    
    try {
      let data: RegionDataRow[] | null = null;
      let error: any = null;
      
      // Use specific queries for each region
      switch(selectedRegion) {
        case 'NCR':
          const ncrResult = await supabase
            .from('NCR')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = ncrResult.data;
          error = ncrResult.error;
          break;
        case 'REGION 1':
          const r1Result = await supabase
            .from('REGION 1')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r1Result.data;
          error = r1Result.error;
          break;
        case 'REGION 2':
          const r2Result = await supabase
            .from('REGION 2')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r2Result.data;
          error = r2Result.error;
          break;
        case 'REGION 3':
          const r3Result = await supabase
            .from('REGION 3')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r3Result.data;
          error = r3Result.error;
          break;
        case 'REGION 4A':
          const r4aResult = await supabase
            .from('REGION 4A')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r4aResult.data;
          error = r4aResult.error;
          break;
        case 'REGION 4B':
          const r4bResult = await supabase
            .from('REGION 4B')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r4bResult.data;
          error = r4bResult.error;
          break;
        case 'REGION 5':
          const r5Result = await supabase
            .from('REGION 5')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r5Result.data;
          error = r5Result.error;
          break;
        case 'REGION 6':
          const r6Result = await supabase
            .from('REGION 6')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r6Result.data;
          error = r6Result.error;
          break;
        case 'REGION 7':
          const r7Result = await supabase
            .from('REGION 7')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r7Result.data;
          error = r7Result.error;
          break;
        case 'REGION 8':
          const r8Result = await supabase
            .from('REGION 8')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r8Result.data;
          error = r8Result.error;
          break;
        case 'REGION 9':
          const r9Result = await supabase
            .from('REGION 9')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r9Result.data;
          error = r9Result.error;
          break;
        case 'REGION 10':
          const r10Result = await supabase
            .from('REGION 10')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r10Result.data;
          error = r10Result.error;
          break;
        case 'REGION 11':
          const r11Result = await supabase
            .from('REGION 11')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r11Result.data;
          error = r11Result.error;
          break;
        case 'REGION 12':
          const r12Result = await supabase
            .from('REGION 12')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r12Result.data;
          error = r12Result.error;
          break;
        case 'REGION 13':
          const r13Result = await supabase
            .from('REGION 13')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = r13Result.data;
          error = r13Result.error;
          break;
        case 'CAR':
          const carResult = await supabase
            .from('CAR')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = carResult.data;
          error = carResult.error;
          break;
        case 'BARMM':
          const barmmResult = await supabase
            .from('BARMM')
            .select('BARANGAY')
            .eq('PROVINCE', selectedProvince)
            .eq('"CITY/MUNICIPALITY"', selectedMunicipality)
            .not('BARANGAY', 'is', null)
            .neq('BARANGAY', '');
          data = barmmResult.data;
          error = barmmResult.error;
          break;
        default:
          setIsLoading(false);
          return;
      }
      
      console.log('Barangays query result:', { data, error });
      
      if (error) {
        console.error('Error loading barangays:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const barangayList = data
          .map((item: any) => item.BARANGAY)
          .filter((barangay: any) => barangay && typeof barangay === 'string' && barangay.trim() !== '');
        
        const uniqueBarangays = [...new Set(barangayList)] as string[];
        console.log('Processed barangays:', uniqueBarangays.sort());
        setBarangays(uniqueBarangays.sort());
      } else {
        console.log('No barangay data found');
        setBarangays([]);
      }
    } catch (error) {
      console.error('Error loading barangays:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay) {
      navigate("/register/officials", { 
        state: { 
          role: "official",
          region: selectedRegion,
          province: selectedProvince,
          municipality: selectedMunicipality,
          barangay: selectedBarangay
        } 
      });
    }
  };

  const handleBack = () => {
    navigate("/register/role");
  };

  const filteredRegions = PHILIPPINE_REGIONS.filter(region =>
    region.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
    region.code.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const filteredProvinces = provinces.filter(province =>
    province.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const filteredMunicipalities = municipalities.filter(municipality =>
    municipality.toLowerCase().includes(municipalitySearch.toLowerCase())
  );

  const filteredBarangays = barangays.filter(barangay =>
    barangay.toLowerCase().includes(barangaySearch.toLowerCase())
  );

  const isFormValid = selectedRegion && selectedProvince && selectedMunicipality && selectedBarangay;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header with red background */}
        <div className="flex items-center justify-between px-4 py-4 bg-red-600 text-white">
          <button onClick={handleBack} className="text-white hover:text-gray-200">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">Address</h1>
          <div className="w-6" />
        </div>

        {/* Clean Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
            <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Region Searchable Dropdown */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Region</Label>
            <div className="relative">
              <Input
                placeholder="Search and select region..."
                value={regionSearch}
                onChange={(e) => {
                  setRegionSearch(e.target.value);
                  setShowRegionDropdown(true);
                }}
                onFocus={() => setShowRegionDropdown(true)}
                className="h-12 pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {regionSearch && (
                  <button
                    onClick={() => {
                      setRegionSearch("");
                      setSelectedRegion("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {showRegionDropdown && filteredRegions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredRegions.map((region, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedRegion(region.code);
                      setRegionSearch(region.name);
                      setShowRegionDropdown(false);
                    }}
                    className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Province Searchable Dropdown */}
          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Province</Label>
            <div className="relative">
              <Input
                placeholder="Search and select province..."
                value={provinceSearch}
                onChange={(e) => {
                  setProvinceSearch(e.target.value);
                  setShowProvinceDropdown(true);
                }}
                onFocus={() => selectedRegion && setShowProvinceDropdown(true)}
                disabled={!selectedRegion}
                className={`h-12 pr-20 ${!selectedRegion ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {provinceSearch && (
                  <button
                    onClick={() => {
                      setProvinceSearch("");
                      setSelectedProvince("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showProvinceDropdown ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {showProvinceDropdown && selectedRegion && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading provinces...</div>
                ) : filteredProvinces.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {provinces.length === 0 ? 'No provinces found for this region' : 'No provinces match your search'}
                  </div>
                ) : (
                  filteredProvinces.map((province, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedProvince(province);
                        setProvinceSearch(toTitleCase(province));
                        setShowProvinceDropdown(false);
                      }}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {toTitleCase(province)}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select City/Municipality</Label>
            <div className="relative">
              <Input
                placeholder="Search and select city/municipality..."
                value={municipalitySearch}
                onChange={(e) => {
                  setMunicipalitySearch(e.target.value);
                  setShowMunicipalityDropdown(true);
                }}
                onFocus={() => selectedProvince && setShowMunicipalityDropdown(true)}
                disabled={!selectedProvince}
                className={`h-12 pr-20 ${!selectedProvince ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {municipalitySearch && (
                  <button
                    onClick={() => {
                      setMunicipalitySearch("");
                      setSelectedMunicipality("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showMunicipalityDropdown ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {showMunicipalityDropdown && selectedProvince && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading municipalities...</div>
                ) : filteredMunicipalities.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {municipalities.length === 0 ? 'No municipalities found for this province' : 'No municipalities match your search'}
                  </div>
                ) : (
                  filteredMunicipalities.map((municipality, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMunicipality(municipality);
                        setMunicipalitySearch(toTitleCase(municipality));
                        setShowMunicipalityDropdown(false);
                      }}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {toTitleCase(municipality)}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Barangay</Label>
            <div className="relative">
              <Input
                placeholder="Search and select barangay..."
                value={barangaySearch}
                onChange={(e) => {
                  setBarangaySearch(e.target.value);
                  setShowBarangayDropdown(true);
                }}
                onFocus={() => selectedMunicipality && setShowBarangayDropdown(true)}
                disabled={!selectedMunicipality}
                className={`h-12 pr-20 ${!selectedMunicipality ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {barangaySearch && (
                  <button
                    onClick={() => {
                      setBarangaySearch("");
                      setSelectedBarangay("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showBarangayDropdown ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {showBarangayDropdown && selectedMunicipality && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading barangays...</div>
                ) : filteredBarangays.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {barangays.length === 0 ? 'No barangays found for this municipality' : 'No barangays match your search'}
                  </div>
                ) : (
                  filteredBarangays.map((barangay, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedBarangay(barangay);
                        setBarangaySearch(toTitleCase(barangay));
                        setShowBarangayDropdown(false);
                      }}
                      className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{toTitleCase(barangay)}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Barangay Display */}
          {selectedBarangay && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <div className="font-semibold text-green-900 text-lg">{toTitleCase(selectedBarangay)}</div>
                <div className="text-sm text-green-600">Barangay Selected</div>
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="p-6 bg-white border-t">
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-12 text-base font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version with similar changes
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Clean Progress Bar */}
        <div className="px-8 py-6 border-b">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-gray-200 rounded-full mx-2"></div>
            <div className="flex-1 h-1 bg-gray-200 rounded-full"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Address</h2>
          </div>
        </div>

        <div className="p-8">
          <button onClick={handleBack} className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          <div className="space-y-6">
            {/* Desktop version with same searchable dropdowns */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Region</Label>
              <div className="relative">
                <Input
                  placeholder="Search and select region..."
                  value={regionSearch}
                  onChange={(e) => {
                    setRegionSearch(e.target.value);
                    setShowRegionDropdown(true);
                  }}
                  onFocus={() => setShowRegionDropdown(true)}
                  className="h-12 pr-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {regionSearch && (
                    <button
                      onClick={() => {
                        setRegionSearch("");
                        setSelectedRegion("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {showRegionDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredRegions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No regions found</div>
                  ) : (
                    filteredRegions.map((region, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedRegion(region.code);
                          setRegionSearch(region.name);
                          setShowRegionDropdown(false);
                        }}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {region.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Province Dropdown */}
            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Province</Label>
              <div className="relative">
                <Input
                  placeholder="Search and select province..."
                  value={provinceSearch}
                  onChange={(e) => {
                    setProvinceSearch(e.target.value);
                    setShowProvinceDropdown(true);
                  }}
                  onFocus={() => selectedRegion && setShowProvinceDropdown(true)}
                  disabled={!selectedRegion}
                  className={`h-12 pr-20 ${!selectedRegion ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {provinceSearch && (
                    <button
                      onClick={() => {
                        setProvinceSearch("");
                        setSelectedProvince("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showProvinceDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {showProvinceDropdown && selectedRegion && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading provinces...</div>
                  ) : filteredProvinces.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {provinces.length === 0 ? 'No provinces found for this region' : 'No provinces match your search'}
                    </div>
                  ) : (
                    filteredProvinces.map((province, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedProvince(province);
                          setProvinceSearch(toTitleCase(province));
                          setShowProvinceDropdown(false);
                        }}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {toTitleCase(province)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select City/Municipality</Label>
              <div className="relative">
                <Input
                  placeholder="Search and select city/municipality..."
                  value={municipalitySearch}
                  onChange={(e) => {
                    setMunicipalitySearch(e.target.value);
                    setShowMunicipalityDropdown(true);
                  }}
                  onFocus={() => selectedProvince && setShowMunicipalityDropdown(true)}
                  disabled={!selectedProvince}
                  className={`h-12 pr-20 ${!selectedProvince ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {municipalitySearch && (
                    <button
                      onClick={() => {
                        setMunicipalitySearch("");
                        setSelectedMunicipality("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showMunicipalityDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {showMunicipalityDropdown && selectedProvince && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading municipalities...</div>
                  ) : filteredMunicipalities.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {municipalities.length === 0 ? 'No municipalities found for this province' : 'No municipalities match your search'}
                    </div>
                  ) : (
                    filteredMunicipalities.map((municipality, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedMunicipality(municipality);
                          setMunicipalitySearch(toTitleCase(municipality));
                          setShowMunicipalityDropdown(false);
                        }}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {toTitleCase(municipality)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Barangay</Label>
              <div className="relative">
                <Input
                  placeholder="Search and select barangay..."
                  value={barangaySearch}
                  onChange={(e) => {
                    setBarangaySearch(e.target.value);
                    setShowBarangayDropdown(true);
                  }}
                  onFocus={() => selectedMunicipality && setShowBarangayDropdown(true)}
                  disabled={!selectedMunicipality}
                  className={`h-12 pr-20 ${!selectedMunicipality ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {barangaySearch && (
                    <button
                      onClick={() => {
                        setBarangaySearch("");
                        setSelectedBarangay("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showBarangayDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {showBarangayDropdown && selectedMunicipality && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading barangays...</div>
                  ) : filteredBarangays.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {barangays.length === 0 ? 'No barangays found for this municipality' : 'No barangays match your search'}
                    </div>
                  ) : (
                    filteredBarangays.map((barangay, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedBarangay(barangay);
                          setBarangaySearch(toTitleCase(barangay));
                          setShowBarangayDropdown(false);
                        }}
                        className="w-full text-left py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{toTitleCase(barangay)}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Barangay Display */}
            {selectedBarangay && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="font-semibold text-green-900 text-lg">{toTitleCase(selectedBarangay)}</div>
                  <div className="text-sm text-green-600">Barangay Selected</div>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 h-12 text-base font-medium rounded-lg mt-8 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
