import { GoogleMap } from "./google-map"

interface JobMapProps {
  location: string
  className?: string
}

export const JobMap = ({ location, className }: JobMapProps) => {
  // The conditional check for !location has been removed.
  // The GoogleMap component will now always be rendered,
  // and it will handle the 'location' prop, even if it's an empty string.
  return <GoogleMap location={location} className={className} height="256px" zoom={14} showInfoWindow={true} />
}
