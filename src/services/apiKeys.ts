
import { supabase } from "@/integrations/supabase/client";

/**
 * Retrieves API keys securely from the database
 * @param keyName - The name of the API key to retrieve
 * @returns The API key value or null if not found
 */
export async function getApiKey(keyName: string): Promise<string | null> {
  try {
    // Only backend code should fetch API keys directly from the database
    const { data, error } = await supabase
      .from('system_api_keys')
      .select('key_value')
      .eq('key_name', keyName)
      .single();
      
    if (error || !data) {
      console.error(`Error retrieving API key ${keyName}:`, error);
      return null;
    }
    
    return data.key_value;
  } catch (error) {
    console.error(`Error retrieving API key ${keyName}:`, error);
    return null;
  }
}

/**
 * Retrieves the Google Maps API key for JavaScript
 * @returns The Google Maps JavaScript API key or null if not found
 */
export async function getGoogleMapsApiKey(): Promise<string | null> {
  return getApiKey('google_maps_javascript_api_key');
}

/**
 * Get multiple API keys in a single request
 * @param keyNames - Array of key names to retrieve
 * @returns Object with key names as keys and their values
 */
export async function getMultipleApiKeys(keyNames: string[]): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('system_api_keys')
      .select('key_name, key_value')
      .in('key_name', keyNames);
      
    if (error || !data) {
      console.error('Error retrieving API keys:', error);
      return {};
    }
    
    // Convert the array to an object
    const result: Record<string, string> = {};
    data.forEach(item => {
      result[item.key_name] = item.key_value;
    });
    
    return result;
  } catch (error) {
    console.error('Error retrieving API keys:', error);
    return {};
  }
}
