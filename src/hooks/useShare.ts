import { toast } from 'sonner';

export const useShare = () => {
  const shareProduct = async (productId: string, productName: string) => {
    console.log('🔄 Sharing product:', { productId, productName });
    
    const shareUrl = `${window.location.origin}/marketplace/product/${productId}`;
    const shareData = {
      title: `Check out: ${productName}`,
      text: `I found this amazing product on BarangayMo Marketplace: ${productName}`,
      url: shareUrl,
    };

    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        console.log('🔄 Using Web Share API...');
        await navigator.share(shareData);
        console.log('✅ Product shared successfully via Web Share API');
        toast.success('Shared successfully! 📤');
      } catch (error) {
        console.error('❌ Error sharing via Web Share API:', error);
        // If user cancelled, don't show error toast
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share product');
        }
      }
    } else {
      // Fallback to clipboard
      try {
        console.log('🔄 Web Share API not supported, copying to clipboard...');
        await navigator.clipboard.writeText(shareUrl);
        console.log('✅ Product link copied to clipboard');
        toast.success('Link copied! 📋');
      } catch (error) {
        console.error('❌ Error copying to clipboard:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  return { shareProduct };
};