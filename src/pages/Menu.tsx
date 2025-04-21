
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";

const Menu = () => {
  const { user, logout } = useAuth();
  const appVersion = "1.0.0"; // You can make this dynamic if needed

  return (
    <Layout>
      <div className="container max-w-lg mx-auto p-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt={user?.name} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                <p className="text-gray-500">{user?.email || "No email provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start text-base h-12" asChild>
            <a href="/settings">
              <Settings className="mr-3 h-5 w-5" /> Account Settings
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start text-base h-12" onClick={logout}>
            <LogOut className="mr-3 h-5 w-5" /> Log out
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Barangay Mo App v{appVersion}</p>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
