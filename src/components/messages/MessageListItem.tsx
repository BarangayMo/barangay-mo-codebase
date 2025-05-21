
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageListItemProps {
  name: string;
  avatar: string;
  message: string;
  time: string;
  online?: boolean;
  unread?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function MessageListItem({ name, avatar, message, time, online, unread, isActive, onClick }: MessageListItemProps) {
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        isActive ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-100",
      )}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={cn("font-medium text-sm", isActive ? "text-blue-700" : "text-gray-800")}>{name}</h3>
          <span className={cn("text-xs", isActive ? "text-blue-600" : "text-gray-500")}>{time}</span>
        </div>
        <p className={cn("text-sm truncate", isActive ? "text-blue-600" : "text-gray-500")}>{message}</p>
      </div>
      {unread && unread > 0 && (
        <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
          {unread}
        </span>
      )}
    </div>
  );
}
