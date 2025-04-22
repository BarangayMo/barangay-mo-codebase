
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[url('/lovable-uploads/2592488e-63cb-4ffe-be77-f7b647ab3214.png')] bg-cover bg-center">
      <div className="w-full min-h-screen bg-black/50 flex flex-col items-center justify-between p-6">
        <div /> {/* Spacer */}
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            <span className="text-emerald-400">Xplore</span> Your Next<br />
            Adventure!
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-sm mx-auto">
            your gateway to extraordinary quests around the globe
          </p>
        </div>

        <div className="w-full max-w-md mb-6">
          <Link to="/phone">
            <Button className="w-full h-14 text-lg font-medium bg-white hover:bg-white/90 text-gray-900 rounded-xl">
              Let's Start
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
