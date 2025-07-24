
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, MessageCircle, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  itemId?: string;
  itemType?: 'product' | 'job' | 'announcement' | 'post';
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  showLabel?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  description = '',
  url,
  itemId,
  itemType = 'product',
  className,
  variant = 'ghost',
  size = 'sm',
  showLabel = true,
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Generate the appropriate URL based on item type
  const getShareUrl = () => {
    if (url) return url;
    
    const baseUrl = window.location.origin;
    
    switch (itemType) {
      case 'product':
        return `${baseUrl}/marketplace/product/${itemId}`;
      case 'job':
        return `${baseUrl}/job/${itemId}`;
      case 'announcement':
        return `${baseUrl}/announcement/${itemId}`;
      case 'post':
        return `${baseUrl}/post/${itemId}`;
      default:
        return window.location.href;
    }
  };

  const shareUrl = getShareUrl();
  const shareText = description || `Check out: ${title}`;

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Copy failed",
        description: "Unable to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Native sharing (mobile)
  const handleNativeShare = async () => {
    const shareData = {
      title: title,
      text: shareText,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setIsOpen(false);
        return true;
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Native sharing failed:', error);
      }
    }
    return false;
  };

  // WhatsApp sharing
  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  // Email sharing
  const handleEmailShare = () => {
    const emailSubject = encodeURIComponent(title);
    const emailBody = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = emailUrl;
    setIsOpen(false);
  };

  // SMS sharing
  const handleSMSShare = () => {
    const smsText = encodeURIComponent(`${shareText} ${shareUrl}`);
    const smsUrl = `sms:?body=${smsText}`;
    window.location.href = smsUrl;
    setIsOpen(false);
  };

  // Main share handler
  const handleShare = async () => {
    // Try native sharing first on mobile
    const nativeShareSuccess = await handleNativeShare();
    if (!nativeShareSuccess) {
      // If native sharing fails or isn't available, show the dropdown menu
      setIsOpen(true);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={handleShare}
          className={cn(
            "flex items-center gap-2",
            className
          )}
        >
          <Share2 className="h-4 w-4" />
          {showLabel && size !== 'icon' && <span>Share</span>}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white border shadow-lg rounded-lg"
        sideOffset={4}
      >
        <DropdownMenuItem 
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <Copy className="h-4 w-4" />
          <span>Copy Link</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleEmailShare}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleSMSShare}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <Phone className="h-4 w-4" />
          <span>Messages (SMS)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
