
import { useState, useRef, useEffect } from "react";
import { Search, Send, Phone, MoreVertical, ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";

// Mock data for users
const USERS = [
  {
    id: "1",
    name: "Andre Silva",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "andre.silva@example.com",
    lastActive: "5m ago",
    lastMessage: "Great, can't wait!",
    unread: 1,
    timestamp: "5m",
    phone: "+1234567890",
    address: "123 Main St, Anytown",
    status: "Currently on page: Bioactive B-Complex - Vitamin B",
    order: "000000002"
  },
  {
    id: "2",
    name: "Gary Williams",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "gary.williams@example.com",
    lastActive: "23m ago",
    lastMessage: "Yes just got in, give us a few minutes to update stock on the platform!",
    unread: 0,
    timestamp: "23m",
    phone: "+1987654321",
    address: "456 Oak St, Othertown"
  },
  {
    id: "3",
    name: "Ivar Petter",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "ivar.petter@example.com",
    lastActive: "1d ago",
    lastMessage: "Hi Unatur, I have a proposal!",
    unread: 0,
    timestamp: "Yesterday",
    phone: "+1122334455",
    address: "789 Pine St, Somewhere"
  },
  {
    id: "4",
    name: "Keith Seona",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "keith.seona@example.com",
    lastActive: "Nov 11",
    lastMessage: "Hey I have a few questions",
    unread: 0,
    timestamp: "Nov 11",
    phone: "+1122334455",
    address: "789 Pine St, Somewhere"
  },
  {
    id: "5",
    name: "Wade Warren",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "wade.warren@example.com",
    lastActive: "Nov 10",
    lastMessage: "Deal! We'll prepare something soon.",
    unread: 0,
    timestamp: "Nov 10",
    phone: "+1122334455",
    address: "789 Pine St, Somewhere"
  }
];

// Mock data for messages with Andre
const MESSAGES = [
  {
    id: "1",
    userId: "1",
    senderId: "1", // Andre
    content: "Hello UNATUR, do you send out large quantities, let's say 100 items?",
    timestamp: "Nov 6, 2022",
    isOwn: false
  },
  {
    id: "2",
    userId: "1",
    senderId: "admin", // Admin/Self
    content: "Yes! We can send 100 items to you within 2 weeks.",
    timestamp: "Nov 6, 2022",
    isOwn: true
  },
  {
    id: "3",
    userId: "1",
    senderId: "1", // Andre
    content: "Sure, at first we'd be good with 200 items of Vitamin C",
    timestamp: "Nov 8, 2022",
    isOwn: false
  },
  {
    id: "4",
    userId: "1",
    senderId: "admin", // Admin/Self
    content: "Ok will follow up in a few days!",
    timestamp: "Nov 9, 2022",
    isOwn: true
  },
  {
    id: "5",
    userId: "1",
    senderId: "1", // Andre
    content: "Hey, have you got the stock now?",
    timestamp: "55m ago",
    isOwn: false
  },
  {
    id: "6",
    userId: "1",
    senderId: "admin", // Admin/Self
    content: "Great, can't wait!",
    timestamp: "1m ago",
    isOwn: true
  },
];

// Mock data for messages with Gary
const GARY_MESSAGES = [
  {
    id: "g1",
    userId: "2",
    senderId: "2", // Gary
    content: "Yes! We can send 100 items to you within 2 weeks.",
    timestamp: "Nov 7, 2022",
    isOwn: false
  },
  {
    id: "g2",
    userId: "2",
    senderId: "2", // Gary
    content: "Let us know the exact quantity and the products please!",
    timestamp: "Nov 7, 2022",
    isOwn: false
  },
  {
    id: "g3",
    userId: "2",
    senderId: "admin", // Admin/Self
    content: "Ok sounds doable, we'll add the stock by end of the week.",
    timestamp: "Nov 8, 2022",
    isOwn: true
  },
  {
    id: "g4",
    userId: "2",
    senderId: "2", // Gary
    content: "Yes just got in, give us a few minutes to update stock on the platform!",
    timestamp: "23m ago",
    isOwn: false
  },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(USERS[0]);
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [messages, setMessages] = useState<typeof MESSAGES>([]);
  const [showMobileList, setShowMobileList] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (selectedUser) {
      // Load the appropriate messages based on the selected user
      if (selectedUser.id === "1") {
        setMessages(MESSAGES);
      } else if (selectedUser.id === "2") {
        setMessages(GARY_MESSAGES);
      } else {
        // For other users, just show an empty message list for now
        setMessages([]);
      }
      
      // On mobile, switch to chat view when a user is selected
      if (window.innerWidth < 768) {
        setShowMobileList(false);
      }
    }
  }, [selectedUser]);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Filter users based on search query
  const filteredUsers = USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  );
  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;
    
    // Create a new message
    const newMessage = {
      id: `new-${Date.now()}`,
      userId: selectedUser.id,
      senderId: "admin", // Admin/Self
      content: messageInput,
      timestamp: "Just now",
      isOwn: true
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMessage]);
    
    // Show toast
    toast({
      title: "Message sent",
      description: `Message sent to ${selectedUser.name}`
    });
    
    // Clear input
    setMessageInput("");
  };
  
  const formatInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <AdminLayout title="Messages" fullWidth>
      <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row">
        {/* Users List - Hide on mobile when a chat is selected */}
        {showMobileList && (
          <div className="md:w-1/3 lg:w-1/4 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs defaultValue="all" className="mt-4" value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "unread")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <ScrollArea className="h-[calc(100vh-64px-113px)]">
              <div className="p-2">
                {activeTab === "all" ? (
                  filteredUsers.length > 0 ? filteredUsers.map(user => (
                    <div 
                      key={user.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                        selectedUser?.id === user.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{formatInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        {user.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                            {user.unread}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{user.name}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{user.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-muted-foreground py-4">No users found</p>
                  )
                ) : (
                  filteredUsers.filter(user => user.unread > 0).length > 0 ? 
                    filteredUsers.filter(user => user.unread > 0).map(user => (
                      <div 
                        key={user.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                          selectedUser?.id === user.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{formatInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                            {user.unread}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">{user.name}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{user.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground py-4">No unread messages</p>
                    )
                )}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!showMobileList ? 'block' : 'hidden md:flex md:flex-col'}`}>
          {/* User info header */}
          {selectedUser ? (
            <>
              <div className="flex items-center gap-3 p-4 border-b">
                {/* Back button on mobile */}
                {!showMobileList && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setShowMobileList(true)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{formatInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">{selectedUser.name}</h2>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedUser.status || selectedUser.lastActive}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full" asChild>
                        <a href={`tel:${selectedUser.phone}`}><Phone className="h-4 w-4" /></a>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setShowOrderDetails(!showOrderDetails)}>
                            {showOrderDetails ? "Hide order details" : "Show order details"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Export conversation</DropdownMenuItem>
                          <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order details panel - only shown if selectedUser has order info and showOrderDetails is true */}
              {showOrderDetails && selectedUser.order && (
                <div className="border-b p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex flex-col space-y-3">
                    <div>
                      <h3 className="text-sm font-medium">Order <span className="text-muted-foreground">({selectedUser.order})</span></h3>
                      {selectedUser.status && (
                        <p className="text-sm">{selectedUser.status}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">Fulfilled</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Order placed on</p>
                        <p>Jan 22, 2022</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Fulfilled on</p>
                        <p>Jan 22, 2022</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lead time</p>
                        <p>4d</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-fit">
                      Go to order details
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    // Check if this message is on a new day compared to the previous one
                    const showDateDivider = index === 0 || 
                      (messages[index-1]?.timestamp !== message.timestamp && 
                      !message.timestamp.includes('ago') && 
                      !messages[index-1]?.timestamp.includes('ago'));
                    
                    return (
                      <div key={message.id}>
                        {showDateDivider && (
                          <div className="text-center my-4">
                            <span className="bg-secondary text-muted-foreground text-xs px-2 py-1 rounded">{message.timestamp}</span>
                          </div>
                        )}
                        <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                          {!message.isOwn && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                              <AvatarFallback>{formatInitials(selectedUser.name)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                            message.isOwn 
                              ? 'bg-primary text-primary-foreground rounded-tr-none' 
                              : 'bg-secondary text-secondary-foreground rounded-tl-none'
                          }`}>
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {message.timestamp.includes("ago") || message.timestamp === "Just now" ? message.timestamp : ""}
                            </p>
                          </div>
                          {message.isOwn && (
                            <Avatar className="h-8 w-8 ml-2 mt-1">
                              <AvatarImage src="/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png" alt="You" />
                              <AvatarFallback>YO</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-muted-foreground">Select a user to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
