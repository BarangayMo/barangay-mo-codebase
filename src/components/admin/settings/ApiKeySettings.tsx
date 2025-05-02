
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, CheckCircle2, EyeIcon, EyeOffIcon, KeyIcon, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ApiKey = {
  id: string;
  key_name: string;
  key_value: string;
  updated_at: string;
};

export function ApiKeySettings() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const { userRole } = useAuth();
  
  // Fetch API keys from database
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('system_api_keys')
        .select('*')
        .order('key_name');
        
      if (error) throw error;
      
      setApiKeys(data || []);
      
      // Initialize visibility state for each key
      const initialVisibility: Record<string, boolean> = {};
      data?.forEach(key => {
        initialVisibility[key.key_name] = false;
      });
      setShowValues(initialVisibility);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save API keys to database
  const saveApiKeys = async () => {
    if (userRole !== 'superadmin') {
      toast.error("Only superadmins can update API keys");
      return;
    }
    
    try {
      setIsSaving(true);
      
      for (const key of apiKeys) {
        const { error } = await supabase
          .from('system_api_keys')
          .update({ key_value: key.key_value })
          .eq('id', key.id);
          
        if (error) throw error;
      }
      
      setSaved(true);
      toast.success('API keys saved successfully');
      
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Failed to save API keys');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update a key value in the local state
  const updateKeyValue = (id: string, value: string) => {
    setApiKeys(prev => 
      prev.map(key => key.id === id ? { ...key, key_value: value } : key)
    );
  };
  
  // Toggle visibility of API key
  const toggleVisibility = (keyName: string) => {
    setShowValues(prev => ({
      ...prev,
      [keyName]: !prev[keyName]
    }));
  };
  
  // Format key name for display
  const formatKeyName = (keyName: string) => {
    return keyName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  useEffect(() => {
    fetchApiKeys();
  }, []);
  
  if (userRole !== 'superadmin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage system API keys and secrets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
            <div>
              <KeyIcon className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <h3 className="text-lg font-medium">Permission Denied</h3>
              <p className="mt-1">Only superadmins can access this section</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyIcon className="h-5 w-5" />
          API Keys & Secrets
        </CardTitle>
        <CardDescription>
          Manage API keys for various integrations. These values are stored securely and used on the server side.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Security Notice:</strong> API keys stored here are encrypted at rest in the database 
                and accessible only to superadmins. Never expose these keys in client-side code.
              </p>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-medium text-base">Google Maps API Keys</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Required for map-based location selection and geocoding features.
              </p>
              
              {apiKeys
                .filter(key => key.key_name.startsWith('google_maps'))
                .map(key => (
                  <div key={key.id} className="space-y-2">
                    <Label htmlFor={key.key_name}>{formatKeyName(key.key_name)}</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          id={key.key_name}
                          type={showValues[key.key_name] ? "text" : "password"}
                          value={key.key_value}
                          onChange={(e) => updateKeyValue(key.id, e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => toggleVisibility(key.key_name)}
                        >
                          {showValues[key.key_name] ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(key.updated_at).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={fetchApiKeys}
          disabled={isLoading || isSaving}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          onClick={saveApiKeys}
          disabled={isLoading || isSaving}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {saved ? "Saved Successfully" : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
