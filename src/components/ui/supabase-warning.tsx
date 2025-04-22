
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useSupabaseStatus } from "@/hooks/use-supabase-status";

export function SupabaseWarning() {
  const { isConnected, isLoading, error } = useSupabaseStatus();
  
  if (isLoading || isConnected) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="my-4 mx-auto max-w-lg">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Supabase Connection Issue</AlertTitle>
      <AlertDescription>
        {error || "There was an issue connecting to Supabase. Some features may not work correctly."}
      </AlertDescription>
    </Alert>
  );
}
