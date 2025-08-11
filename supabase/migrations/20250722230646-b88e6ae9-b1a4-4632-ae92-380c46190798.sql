-- Add Mapbox API key to system_api_keys table (without description column)
INSERT INTO public.system_api_keys (key_name, key_value)
VALUES (
  'mapbox_api_key',
  'pk.eyJ1IjoiYmFyYW5nYXltbyIsImEiOiJjbWJxZHBzenAwMmdrMmtzZmloemphb284In0.U22j37ppYT1IMyC2lXVBzw'
)
ON CONFLICT (key_name) 
DO UPDATE SET 
  key_value = EXCLUDED.key_value,
  updated_at = NOW();