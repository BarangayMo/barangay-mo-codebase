
import { useState } from "react";
import { Search, Send } from "lucide-react";
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

const USERS = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "john.doe@example.com",
    lastActive: "Online now",
    lastMessage: "Hi there! I'm interested in your services.",
    unread: 2,
    timestamp: "5 min ago",
    phone: "+1234567890",
    address: "123 Main St, Anytown"
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "jane.smith@example.com",
    lastActive: "1 hour ago",
    lastMessage: "Thanks for your help with my application.",
    unread: 0,
    timestamp: "1 hour ago",
    phone: "+1987654321",
    address: "456 Oak St, Othertown"
  },
  {
    id: "3",
    name: "Robert Johnson",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    email: "robert.johnson@example.com",
    lastActive: "2 days ago",
    lastMessage: "When will the next event be held?",
    unread: 0,
    timestamp: "Yesterday",
    phone: "+1122334455",
    address: "789 Pine St, Somewhere"
  }
];

const MESSAGES = [
  {
    id: "1",
    userId: "1",
    content: "Hi there! I'm interested in your services.",
    timestamp: "5 min ago",
    isOwn: false
  },
  {
    id: "2",
    userId: "1",
    content: "I was wondering if you could help me with my application.",
    timestamp: "5 min ago",
    isOwn: false
  },
  {
    id: "3",
    userId: "1",
    content: "We'd be happy to help! What specifically do you need assistance with?",
    timestamp: "4 min ago",
    isOwn: true
  },
  {
    id: "4",
    userId: "1",
    content: "I'm not sure how to fill out section B of the form.",
    timestamp: "3 min ago",
    isOwn: false
  }
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(USERS[0]);
  const [messageInput, setMessageInput] = useState("");
  const { toast } = useToast();
  
  // Filter users based on search query
  const filteredUsers = USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );
  
  // Get messages for selected user
  const userMessages = selectedUser 
    ? MESSAGES.filter(msg => msg.userId === selectedUser.id)
    : [];
  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;
    
    // In a real app, you would send this to your backend
    // For now we'll just show a toast
    toast({
      title: "Message sent",
      description: `Message sent to ${selectedUser.name}`
    });
    
    setMessageInput("");
  };
  
  return (
    <AdminLayout title="Messages">
      <DashboardPageHeader
        title="Messaging"
        description="Communicate with users directly"
        breadcrumbItems={[{ label: "Dashboard", href: "/admin" }, { label: "Messaging" }]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users List */}
        <Card className="p-4 md:col-span-1 h-[calc(100vh-220px)] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[calc(100vh-310px)]">
                <div className="space-y-2 pr-4">
                  {filteredUsers.length > 0 ? filteredUsers.map(user => (
                    <div 
                      key={user.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                        selectedUser?.id === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                          <span className="text-xs text-gray-500">{user.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-500 py-4">No users found</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="unread" className="m-0">
              <ScrollArea className="h-[calc(100vh-310px)]">
                <div className="space-y-2 pr-4">
                  {filteredUsers.filter(user => user.unread > 0).length > 0 ? 
                    filteredUsers.filter(user => user.unread > 0).map(user => (
                      <div 
                        key={user.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                          selectedUser?.id === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                            {user.unread}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">{user.name}</p>
                            <span className="text-xs text-gray-500">{user.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-gray-500 py-4">No unread messages</p>
                    )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
        
        {/* Chat Area */}
        <Card className="p-4 md:col-span-2 h-[calc(100vh-220px)] flex flex-col">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-3 pb-3 border-b">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{selectedUser.name}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${selectedUser.phone}`}>Call</a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${selectedUser.email}`}>Email</a>
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{selectedUser.lastActive}</p>
                </div>
              </div>
              
              <ScrollArea className="flex-1 py-4">
                <div className="space-y-4">
                  {userMessages.map(message => (
                    <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        message.isOwn 
                          ? 'bg-blue-500 text-white rounded-tr-none' 
                          : 'bg-gray-100 rounded-tl-none'
                      }`}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="pt-4 border-t mt-auto">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                    <span className="ml-2">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-gray-500">Select a user to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
