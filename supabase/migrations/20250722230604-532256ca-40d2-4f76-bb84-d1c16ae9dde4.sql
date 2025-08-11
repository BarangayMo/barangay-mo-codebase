-- Add Mapbox API key to system_api_keys table
INSERT INTO public.system_api_keys (key_name, key_value, description)
VALUES (
  'mapbox_api_key',
  'pk.eyJ1IjoiYmFyYW5nYXltbyIsImEiOiJjbWJxZHBzenAwMmdrMmtzZmloemphb284In0.U22j37ppYT1IMyC2lXVBzw',
  'Mapbox API key for location services and mapping functionality'
)
ON CONFLICT (key_name) 
DO UPDATE SET 
  key_value = EXCLUDED.key_value,
  description = EXCLUDED.description,
  updated_at = NOW();