
import { ArrowLeft, Play, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const messages = [
  {
    id: 1,
    text: "I'm meeting a friend here for dinner. How about you? 😊",
    time: "5:30 PM",
    sent: false,
  },
  {
    id: 2,
    audioUrl: "audio-message.mp3",
    duration: "02:30",
    time: "5:45 PM",
    sent: false,
  },
  {
    id: 3,
    text: "I'm doing my homework, but I really need to take a break.",
    time: "5:48 PM",
    sent: true,
  },
  {
    id: 4,
    text: "On my way home but I needed to stop by the book store to buy a text book. 😎",
    time: "5:58 PM",
    sent: false,
  },
];

export function MessageChat() {
  return (
    <Card className="flex-1 hidden md:flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar>
          <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" alt="Shane Martinez" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">Shane Martinez</h2>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <span className="w-5 h-5 block">ⓘ</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center">
          <span className="text-sm text-gray-500">Today</span>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.sent ? "items-end" : "items-start"}`}
          >
            {message.text ? (
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sent
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.text}
              </div>
            ) : message.audioUrl ? (
              <div className="bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-3">
                <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <Play className="w-4 h-4" />
                </button>
                <div className="w-32 h-8">
                  <div className="w-full h-2 bg-blue-200 rounded-full">
                    <div className="w-1/3 h-full bg-blue-500 rounded-full" />
                  </div>
                </div>
                <span className="text-sm text-gray-500">{message.duration}</span>
              </div>
            ) : null}
            <span className="text-xs text-gray-500 mt-1">{message.time}</span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Message..."
            className="flex-1"
          />
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Smile className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </Card>
  );
}
