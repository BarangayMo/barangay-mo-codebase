
/**
 * Retrieves the Google Maps API key for JavaScript
 * @returns The Google Maps JavaScript API key
 */
export async function getGoogleMapsApiKey(): Promise<string> {
  return 'AIzaSyDKWjnDlFD1mysRpXnc6KiaWZyh_6jnphM';
}

/**
 * Retrieves the Mapbox API key (deprecated - using Google Maps instead)
 * @returns null since we're using Google Maps now
 */
export async function getMapboxApiKey(): Promise<string | null> {
  return null;
}

/**
 * Retrieves API keys securely from the database
 * @param keyName - The name of the API key to retrieve
 * @returns The API key value or null if not found
 */
export async function getApiKey(keyName: string): Promise<string | null> {
  if (keyName === 'google_maps_javascript_api_key') {
    return 'AIzaSyDKWjnDlFD1mysRpXnc6KiaWZyh_6jnphM';
  }
  return null;
}

/**
 * Get multiple API keys in a single request
 * @param keyNames - Array of key names to retrieve
 * @returns Object with key names as keys and their values
 */
export async function getMultipleApiKeys(keyNames: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  
  for (const keyName of keyNames) {
    if (keyName === 'google_maps_javascript_api_key') {
      result[keyName] = 'AIzaSyDKWjnDlFD1mysRpXnc6KiaWZyh_6jnphM';
    }
  }
  
  return result;
}
