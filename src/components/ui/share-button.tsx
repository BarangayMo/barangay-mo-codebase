
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, MessageCircle, Mail, Phone, Facebook, Twitter, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
        return `${baseUrl}/jobs/${itemId}`;
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
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the share - don't show error toast
        setIsOpen(false);
        return true;
      }
      console.error('Native sharing failed:', error);
    }
    return false;
  };

  // Social media sharing functions
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleEmailShare = () => {
    const emailSubject = encodeURIComponent(title);
    const emailBody = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    const emailUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = emailUrl;
    setIsOpen(false);
  };

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
      // If native sharing fails or isn't available, show the modal
      setIsOpen(true);
    }
  };

  return (
    <>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Social Media Icons Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFacebookShare}
                  className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                  <Facebook className="h-6 w-6" />
                </Button>
                <span className="text-xs mt-1">Facebook</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleTwitterShare}
                  className="h-12 w-12 rounded-full bg-black hover:bg-gray-800 text-white border-0"
                >
                  <Twitter className="h-6 w-6" />
                </Button>
                <span className="text-xs mt-1">X</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLinkedInShare}
                  className="h-12 w-12 rounded-full bg-blue-700 hover:bg-blue-800 text-white border-0"
                >
                  <Linkedin className="h-6 w-6" />
                </Button>
                <span className="text-xs mt-1">LinkedIn</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWhatsAppShare}
                  className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white border-0"
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>
                <span className="text-xs mt-1">WhatsApp</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEmailShare}
                  className="h-12 w-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white border-0"
                >
                  <Mail className="h-6 w-6" />
                </Button>
                <span className="text-xs mt-1">Email</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSMSShare}
                  className="h-12 w-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white border-0"
                >
                  <Phone className="h-6 w-6" />
                </Button>
                <span className="text-xs mt-1">Messages</span>
              </div>
            </div>

            {/* Copy Link Section */}
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm border-none outline-none text-gray-700"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
