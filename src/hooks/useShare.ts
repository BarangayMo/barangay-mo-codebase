
// This hook is now deprecated in favor of the ShareButton component
// The ShareButton component provides a more comprehensive and reusable sharing experience
// Import and use ShareButton from '@/components/ui/share-button' instead

export const useShare = () => {
  const shareProduct = async (productId: string, productName: string) => {
    console.log('⚠️ useShare hook is deprecated. Use ShareButton component instead.');
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
      } catch (error) {
        console.error('❌ Error sharing via Web Share API:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        console.log('🔄 Web Share API not supported, copying to clipboard...');
        await navigator.clipboard.writeText(shareUrl);
        console.log('✅ Product link copied to clipboard');
      } catch (error) {
        console.error('❌ Error copying to clipboard:', error);
      }
    }
  };

  return { shareProduct };
};
