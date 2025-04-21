import { Layout } from "@/components/layout/Layout";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Check, Video, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const profile1 = "/lovable-uploads/2cc58007-fc42-44a8-80a5-ef6765602013.png";
const profile2 = "/lovable-uploads/99aa953e-adc7-47d1-884a-8228b0ca6527.png";
const profile3 = "/lovable-uploads/7a5fdb55-e1bf-49fb-956a-2ac513bdbcd5.png";
const profile4 = "/lovable-uploads/bf986c64-ee34-427c-90ad-0512f2e7f353.png";
const profile5 = "https://i.pravatar.cc/80?img=5";
const profile6 = "https://i.pravatar.cc/80?img=10";

export default function Notifications() {
  return (
    <Layout>
      <div className="w-full pb-36 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md p-4 flex items-center">
          <h1 className="text-2xl font-bold flex-1">Notifications</h1>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* New */}
        <div className="px-4 sm:px-6 pt-4">
          <div className="font-semibold text-lg mb-2">New</div>
          <div className="rounded-xl bg-blue-50">
            <NotificationItem
              avatar={profile1}
              name="Jonard Carpio"
              message={<>invited you to like <span className="font-semibold">Timeless Treasures</span>.</>}
              time="2h"
              badgeColor="bg-cyan-400"
              badgeIcon={<Check className="text-white w-4 h-4" />}
              showActions
              actions={
                <>
                  <Button size="sm" className="bg-blue-600 text-white font-semibold min-w-[90px] rounded-[10px] shadow">Accept</Button>
                  <Button size="sm" variant="outline" className="min-w-[90px] rounded-[10px] border-gray-300 font-semibold text-gray-700">Decline</Button>
                </>
              }
              bg="bg-blue-50"
            />
          </div>
        </div>

        {/* Earlier */}
        <div className="px-4 sm:px-6 pt-8">
          <div className="font-semibold text-lg mb-2">Earlier</div>
          <div className="rounded-xl overflow-hidden bg-blue-50 divide-y">
            <NotificationItem
              avatar={profile2}
              name="PTV"
              message={<>was live: <span className="font-medium">"PANOORIN: Balitang Pambansa | 7AM | April 1, 2025"</span></>}
              time="13h"
              badgeColor="bg-red-500"
              badgeIcon={<Video className="text-white w-4 h-4" />}
            />
            <NotificationItem
              avatar={profile3}
              name="Adesina Rasaq Kehinde"
              message={<>asked to join <span className="font-semibold">Wix Business Entrepreneurs</span>.</>}
              time="16h"
              badgeColor="bg-blue-500"
              badgeIcon={<User className="text-white w-4 h-4" />}
            />
            <NotificationItem
              avatar={profile4}
              name="How to DAD"
              message={<>recently shared 1 post.</>}
              time="1d"
              badgeColor="bg-blue-500"
              badgeIcon={<MessageSquare className="text-white w-4 h-4" />}
            />
            <NotificationItem
              avatar={profile5}
              name="Karishma Verma"
              message={<>invited you to like <span className="font-semibold">NEITH Natural Mineral water</span>.</>}
              time="3d"
              badgeColor="bg-cyan-400"
              badgeIcon={<Check className="text-white w-4 h-4" />}
              showActions
              actions={
                <>
                  <Button size="sm" className="bg-blue-600 text-white font-semibold min-w-[90px] rounded-[10px] shadow">Accept</Button>
                  <Button size="sm" variant="outline" className="min-w-[90px] rounded-[10px] border-gray-300 font-semibold text-gray-700">Decline</Button>
                </>
              }
            />
            <NotificationItem
              avatar={profile6}
              name="jaroslawkolubski"
              message={<>sent a message to <span className="font-bold">dlbcphilippines</span>: <span className="italic text-gray-700">"Hello. Do you pray with people on the..."</span></>}
              time="4d"
            />
            <NotificationItem
              avatar={profile2}
              name="Miguel Angel Bee Oyana"
              message={<>and 5 others have birthdays today. Let them know you're thinking about them!</>}
              time="5d"
              badgeColor="bg-pink-400"
              badgeIcon={<User className="text-white w-4 h-4" />}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
