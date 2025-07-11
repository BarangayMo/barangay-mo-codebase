import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Building2, Users } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  role: string;
}

interface LocationData {
  region: string;
  province: string;
  municipality: string;
  barangay: string;
}

export default function LocationSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const isMobile = useMediaQuery("(max-width: 768px)"); 
  const { toast } = useToast();

  const [regions, setRegions] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [barangays, setBarangays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    region: "",
    province: "",
    municipality: "",
    barangay: ""
  });

  // Load regions on component mount
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const { data, error } = await supabase.rpc('get_regions');
        if (error) throw error;
        setRegions(data || []);
      } catch (error) {
        console.error('Error loading regions:', error);
        toast({
          title: "Error",
          description: "Failed to load regions. Please try again.",
          variant: "destructive"
        });
      }
    };
    loadRegions();
  }, [toast]);

  // Load provinces when region is selected
  useEffect(() => {
    if (selectedLocation.region) {
      const loadProvinces = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase.rpc('get_provinces', {
            region_name: selectedLocation.region
          });
          if (error) throw error;
          setProvinces(data || []);
          setSelectedLocation(prev => ({ ...prev, province: "", municipality: "", barangay: "" }));
        } catch (error) {
          console.error('Error loading provinces:', error);
          toast({
            title: "Error",
            description: "Failed to load provinces. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadProvinces();
    }
  }, [selectedLocation.region, toast]);

  // Load municipalities when province is selected
  useEffect(() => {
    if (selectedLocation.province && selectedLocation.region) {
      const loadMunicipalities = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase.rpc('get_municipalities', {
            region_name: selectedLocation.region,
            province_name: selectedLocation.province
          });
          if (error) throw error;
          setMunicipalities(data || []);
          setSelectedLocation(prev => ({ ...prev, municipality: "", barangay: "" }));
        } catch (error) {
          console.error('Error loading municipalities:', error);
          toast({
            title: "Error",
            description: "Failed to load municipalities. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadMunicipalities();
    }
  }, [selectedLocation.province, selectedLocation.region, toast]);

  // Load barangays when municipality is selected
  useEffect(() => {
    if (selectedLocation.municipality && selectedLocation.province && selectedLocation.region) {
      const loadBarangays = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase.rpc('get_barangays', {
            region_name: selectedLocation.region,
            province_name: selectedLocation.province,
            municipality_name: selectedLocation.municipality
          });
          if (error) throw error;
          setBarangays(data || []);
          setSelectedLocation(prev => ({ ...prev, barangay: "" }));
        } catch (error) {
          console.error('Error loading barangays:', error);
          toast({
            title: "Error",
            description: "Failed to load barangays. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      loadBarangays();
    }
  }, [selectedLocation.municipality, selectedLocation.province, selectedLocation.region, toast]);

  const handleNext = () => {
    if (locationState?.role === "official") {
      navigate("/register/officials", { 
        state: { 
          ...locationState,
          ...selectedLocation
        } 
      });
    } else {
      navigate("/register", { 
        state: { 
          ...locationState,
          ...selectedLocation
        } 
      });
    }
  };

  const isNextDisabled = !selectedLocation.region || !selectedLocation.province || 
                        !selectedLocation.municipality || !selectedLocation.barangay;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-2/4 ${locationState?.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
          <Link to="/register/role" className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Select Location</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-4 bg-white">
          <div className="space-y-6">
            <div className="text-center">
              <img 
                src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
                alt="eGov.PH Logo" 
                className="h-12 w-auto mx-auto mb-4" 
              />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Location</h2>
              <p className="text-gray-600 text-sm">Choose your region, province, municipality, and barangay</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Region
                </label>
                <select
                  value={selectedLocation.region}
                  onChange={(e) => setSelectedLocation(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="inline w-4 h-4 mr-1" />
                  Province
                </label>
                <select
                  value={selectedLocation.province}
                  onChange={(e) => setSelectedLocation(prev => ({ ...prev, province: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedLocation.region || isLoading}
                >
                  <option value="">Select Province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="inline w-4 h-4 mr-1" />
                  Municipality
                </label>
                <select
                  value={selectedLocation.municipality}
                  onChange={(e) => setSelectedLocation(prev => ({ ...prev, municipality: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedLocation.province || isLoading}
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((municipality) => (
                    <option key={municipality} value={municipality}>{municipality}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Barangay
                </label>
                <select
                  value={selectedLocation.barangay}
                  onChange={(e) => setSelectedLocation(prev => ({ ...prev, barangay: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedLocation.municipality || isLoading}
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((barangay) => (
                    <option key={barangay} value={barangay}>{barangay}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={isNextDisabled || isLoading}
            className={`w-full text-white py-3 h-12 text-base font-medium ${
              locationState?.role === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? "Loading..." : "Next"}
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div className={`h-1 w-2/4 ${locationState?.role === 'official' ? 'bg-red-600' : 'bg-blue-600'}`}></div>
        </div>

        <div className="p-8 bg-white">
          <Link to="/register/role" className="inline-flex items-center text-sm text-gray-500 mb-6 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
              alt="eGov.PH Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Select Your Location</h1>
            <p className="text-gray-600">Choose your region, province, municipality, and barangay</p>
          </div>
          
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Region
              </label>
              <select
                value={selectedLocation.region}
                onChange={(e) => setSelectedLocation(prev => ({ ...prev, region: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="inline w-4 h-4 mr-1" />
                Province
              </label>
              <select
                value={selectedLocation.province}
                onChange={(e) => setSelectedLocation(prev => ({ ...prev, province: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedLocation.region || isLoading}
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="inline w-4 h-4 mr-1" />
                Municipality
              </label>
              <select
                value={selectedLocation.municipality}
                onChange={(e) => setSelectedLocation(prev => ({ ...prev, municipality: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedLocation.province || isLoading}
              >
                <option value="">Select Municipality</option>
                {municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>{municipality}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline w-4 h-4 mr-1" />
                Barangay
              </label>
              <select
                value={selectedLocation.barangay}
                onChange={(e) => setSelectedLocation(prev => ({ ...prev, barangay: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedLocation.municipality || isLoading}
              >
                <option value="">Select Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay} value={barangay}>{barangay}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={isNextDisabled || isLoading}
            className={`w-full text-white py-3 text-base font-medium ${
              locationState?.role === 'official' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? "Loading..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
