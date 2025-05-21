
export interface UserConversation {
  id: string;
  name: string;
  avatar: string;
  message: string; // Last message snippet
  time: string;
  online?: boolean;
  unread?: number;
}

export interface ChatMessage {
  id: string;
  text?: string;
  audioUrl?: string;
  duration?: string;
  time: string;
  sent: boolean; // True if sent by the current user, false if received
}

export const conversations: UserConversation[] = [
  {
    id: "1",
    name: "Shane Martinez",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png",
    message: "On my way home but I needed to stop by the book store to...",
    time: "5 min",
    online: true,
    unread: 1,
  },
  {
    id: "2",
    name: "Katie Keller",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png", // Using same avatar for example
    message: "I'm watching Friends. What are you doing?",
    time: "15 min",
    online: false,
    unread: 0,
  },
  {
    id: "3",
    name: "Stephen Mann",
    avatar: "/lovable-uploads/5ae5e12e-93d2-4584-b279-4bff59ae4ed8.png", // Using same avatar for example
    message: "I'm working now. I'm making a deposit for our company.",
    time: "1 hour",
    online: true,
    unread: 0,
  },
];

export const chatHistory: { [key: string]: ChatMessage[] } = {
  "1": [ // Shane Martinez
    { id: "msg1-1", text: "I'm meeting a friend here for dinner. How about you? 😊", time: "5:30 PM", sent: false },
    { id: "msg1-2", audioUrl: "audio-message.mp3", duration: "02:30", time: "5:45 PM", sent: false },
    { id: "msg1-3", text: "I'm doing my homework, but I really need to take a break.", time: "5:48 PM", sent: true },
    { id: "msg1-4", text: "On my way home but I needed to stop by the book store to buy a text book. 😎", time: "5:58 PM", sent: false },
  ],
  "2": [ // Katie Keller
    { id: "msg2-1", text: "Hey! I'm watching Friends. What are you doing?", time: "5:00 PM", sent: false },
    { id: "msg2-2", text: "Just chilling, might grab some food later.", time: "5:02 PM", sent: true },
  ],
  "3": [ // Stephen Mann
    { id: "msg3-1", text: "I'm working now. I'm making a deposit for our company.", time: "4:30 PM", sent: false },
  ],
};

