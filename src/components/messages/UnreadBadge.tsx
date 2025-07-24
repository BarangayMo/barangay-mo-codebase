
import { Badge } from '@/components/ui/badge';
import { useMessages } from '@/hooks/useMessages';

export function UnreadBadge() {
  const { getUnreadCount } = useMessages();
  const count = getUnreadCount();

  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
    >
      {count > 9 ? '9+' : count}
    </Badge>
  );
}
