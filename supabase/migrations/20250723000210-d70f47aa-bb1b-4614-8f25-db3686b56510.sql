-- Update Mapbox API key to the new token
UPDATE public.system_api_keys 
SET key_value = 'pk.eyJ1IjoiYmFyYW5nYXltbyIsImEiOiJjbWRmNzVjamEwOW1mMmxzZHVla3R6NnF3In0.e5CEdORPBd6Psm4BT5O7gw',
    updated_at = NOW()
WHERE key_name = 'mapbox_api_key';