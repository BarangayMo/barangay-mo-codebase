
import { useState } from "react";
import { Search, Send, MoreHorizontal, SlidersHorizontal, Star, MessageSquare } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast"; // Corrected import path
import { cn } from "@/lib/utils";

const USERS = [
  {
    id: "1",
    name: "Rucas Royal",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "rucas.royal@example.com",
    lastActive: "Online now",
    lastMessage: "Is this jacket waterproof and warm?",
    unread: 1,
    timestamp: "01:09 AM",
    location: "Surakarta Indonesia",
    rating: 5,
    transactions: 20,
  },
  {
    id: "2",
    name: "Leslie Alexander",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png", // Placeholder avatar
    email: "leslie.alexander@example.com",
    lastActive: "1 hour ago",
    lastMessage: "Do you have any new arrivals in medium size?",
    unread: 0,
    timestamp: "01:08 PM",
    location: "New York, USA",
    rating: 4,
    transactions: 15,
  },
  {
    id: "3",
    name: "Floyd Miles",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png", // Placeholder avatar
    email: "floyd.miles@example.com",
    lastActive: "Online now",
    lastMessage: "I need a pair of comfortable jeans.",
    unread: 0,
    timestamp: "06:32 PM",
    location: "London, UK",
    rating: 5,
    transactions: 30,
  },
];

const MESSAGES_DATA: { [key: string]: { id: string, userId: string, content: string | { type: 'product', name: string, brand: string, price: string, image: string }, timestamp: string, isOwn: boolean, date?: string }[] } = {
  "1": [
    { id: "d1", userId: "1", date: "29 July 2024", content: "", timestamp: "", isOwn: false }, // Placeholder for date
    {
      id: "m1",
      userId: "1",
      content: "Is this jacket waterproof and warm?",
      timestamp: "08:24 PM",
      isOwn: false
    },
    {
      id: "m2",
      userId: "1",
      content: { type: 'product', name: 'PISSED', brand: 'Catalystwist', price: 'Rp 439.000', image: '/lovable-uploads/02005d02-8f81-4c95-be8e-ba9d8eb3e0d1.jpg' }, // Example product
      timestamp: "08:24 PM",
      isOwn: false
    },
    {
      id: "m3",
      userId: "1",
      content: "Yes, it's both waterproof and warm.",
      timestamp: "08:27 PM",
      isOwn: true
    },
    {
      id: "m4",
      userId: "1",
      content: "That's great! What kind of insulation does it have?",
      timestamp: "08:25 PM", // Timestamp seems out of order in image, placing logically
      isOwn: false
    },
    {
      id: "m5",
      userId: "1",
      content: "The jacket is insulated with high-quality down, ensuring excellent warmth even in very cold conditions.",
      timestamp: "08:28 PM",
      isOwn: true
    },
    {
      id: "m6",
      userId: "1",
      content: "Nice! How about the breathability? I don't want to feel too hot if I'm active.",
      timestamp: "10:55 PM",
      isOwn: false
    }
  ],
  "2": [
    { id: "m7", userId: "2", content: "Do you have any new arrivals in medium size?", timestamp: "01:08 PM", isOwn: false },
    { id: "m8", userId: "2", content: "We just got a new shipment of summer wear!", timestamp: "01:09 PM", isOwn: true },
  ],
  "3": [
     { id: "m9", userId: "3", content: "I need a pair of comfortable jeans.", timestamp: "06:32 PM", isOwn: false },
  ]
};


export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(USERS[0]);
  const [messageInput, setMessageInput] = useState("");
  const { toast } = useToast();

  const filteredUsers = USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userMessages = selectedUser
    ? MESSAGES_DATA[selectedUser.id] || []
    : [];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;
    // This is a mock send. In a real app, update MESSAGES_DATA and call an API.
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: selectedUser.id,
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    if (MESSAGES_DATA[selectedUser.id]) {
      MESSAGES_DATA[selectedUser.id].push(newMessage);
    } else {
      MESSAGES_DATA[selectedUser.id] = [newMessage];
    }
    
    toast({
      title: "Message sent",
      description: `Message sent to ${selectedUser.name}`
    });
    setMessageInput("");
    // Force re-render by updating selectedUser state slightly (or manage messages in state)
    setSelectedUser(prev => prev ? {...prev} : null); 
  };

  return (
    <AdminLayout title="Messages" hidePageHeader={true}> {/* Assuming AdminLayout can hide its default header */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-white border rounded-lg shadow-sm overflow-hidden"> {/* Adjust 4rem based on actual header height */}
        {/* Users List Panel (Left) */}
        <div className="w-full md:w-[320px] border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Customer Message</h2>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon" className="text-gray-500">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100",
                    selectedUser?.id === user.id && "bg-blue-50 hover:bg-blue-100"
                  )}
                  onClick={() => setSelectedUser(user)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <span className="text-xs text-gray-400">{user.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 truncate">{user.lastMessage}</p>
                      {user.unread > 0 && (
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4 text-sm">No users found</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Panel (Right) */}
        <div className="flex-1 flex flex-col bg-gray-50 md:bg-white">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedUser.name}</h3>
                  <p className="text-xs text-gray-500">{selectedUser.location}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-3.5 h-3.5", i < selectedUser.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300")} />
                  ))}
                  <span className="ml-1">({selectedUser.rating}/5)</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <MessageSquare className="w-3.5 h-3.5 text-gray-500" /> {/* Using MessageSquare as placeholder for transaction icon */}
                  <span>{selectedUser.transactions} Transactions</span>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 space-y-4 bg-gray-50">
                {userMessages.map(message => (
                  message.date ? (
                    <div key={message.id} className="text-center my-4">
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">{message.date}</span>
                    </div>
                  ) : (
                  <div key={message.id} className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
                    {!message.isOwn && (
                      <Avatar className="w-8 h-8 mr-2 self-end">
                        <AvatarImage src={selectedUser.avatar} />
                        <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-[70%] p-3 rounded-xl text-sm",
                      message.isOwn ? "bg-blue-500 text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                    )}>
                      {typeof message.content === 'string' ? (
                        <p>{message.content}</p>
                      ) : message.content.type === 'product' ? (
                        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg text-gray-900">
                           <img src={message.content.image} alt={message.content.name} className="w-12 h-12 object-cover rounded"/>
                           <div>
                             <p className="font-semibold text-xs">{message.content.name}</p>
                             <p className="text-xs text-gray-600">{message.content.brand}</p>
                             <p className="font-bold text-xs">{message.content.price}</p>
                           </div>
                        </div>
                      ) : null }
                      <p className={cn("text-xs mt-1.5", message.isOwn ? "text-blue-100 text-right" : "text-gray-400 text-left")}>
                        {message.isOwn && selectedUser.name.split(' ')[0] + " • "} {message.timestamp}
                      </p>
                    </div>
                    {message.isOwn && (
                       <Avatar className="w-8 h-8 ml-2 self-end">
                         {/* Assuming admin avatar, replace with actual if available */}
                         <AvatarImage src="/lovable-uploads/c18ab531-de58-47d3-a486-6d9882bc2559.png" /> 
                         <AvatarFallback>A</AvatarFallback>
                       </Avatar>
                    )}
                  </div>
                  )
                ))}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                  />
                  <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-sm">Select a user from the left panel to view messages.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
