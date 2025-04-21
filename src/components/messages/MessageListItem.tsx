
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageListItemProps {
  name: string;
  avatar: string;
  message: string;
  time: string;
  online?: boolean;
  unread?: number;
  onClick?: () => void;
}

export function MessageListItem({ name, avatar, message, time, online, unread, onClick }: MessageListItemProps) {
  return (
    <div 
      className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        {online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{name}</h3>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{message}</p>
      </div>
      {unread && (
        <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
          {unread}
        </span>
      )}
    </div>
  );
}
