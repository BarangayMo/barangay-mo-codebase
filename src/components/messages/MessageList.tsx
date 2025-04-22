import { Search } from "lucide-react";
import { MessageListItem } from "./MessageListItem";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const messages = [
  {
    id: 1,
    name: "Shane Martinez",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    message: "On my way home but I needed to stop by the book store to...",
    time: "5 min",
    online: true,
    unread: 1,
  },
  {
    id: 2,
    name: "Katie Keller",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    message: "I'm watching Friends. What are you doing?",
    time: "15 min",
    online: false,
  },
  {
    id: 3,
    name: "Stephen Mann",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    message: "I'm working now. I'm making a deposit for our company.",
    time: "1 hour",
    online: true,
  },
  {
    id: 4,
    name: "Shane Martinez",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    message: "I really find the subject very interesting. I'm enjoying all my...",
    time: "5 hour",
    online: false,
  },
  {
    id: 5,
    name: "Melvin Pratt",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    message: "Great seeing you. I have to go now. I'll talk to you later.",
    time: "5 hour",
    online: false,
  },
];

export function MessageList() {
  const navigate = useNavigate();

  const handleMessageClick = (id: number) => {
    navigate(`/messages/${id}`);
  };

  return (
    <Card className="w-full flex-shrink-0 p-4 shadow-lg border-0 md:rounded-none">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Search className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageListItem 
            key={message.id} 
            {...message} 
            onClick={() => handleMessageClick(message.id)}
          />
        ))}
      </div>

      <button className="fixed bottom-24 right-6 md:relative md:bottom-auto md:right-auto w-12 h-12 md:w-full md:h-12 bg-[#ea384c] text-white rounded-full md:rounded-lg flex items-center justify-center mt-4 shadow-lg hover:bg-[#c41c2e] transition-colors">
        <span className="text-2xl">+</span>
      </button>
    </Card>
  );
}
