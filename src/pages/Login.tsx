
import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileLoginView } from "@/components/auth/MobileLoginView";
import { DesktopLoginView } from "@/components/auth/DesktopLoginView";

export default function Login() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ? <MobileLoginView /> : <DesktopLoginView />;
}
