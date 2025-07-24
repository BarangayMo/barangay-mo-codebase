
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
        // Removed toast for instant experience
      } catch (error) {
        console.error('❌ Error sharing via Web Share API:', error);
        // Removed toast notifications for instant experience
      }
    } else {
      // Fallback to clipboard
      try {
        console.log('🔄 Web Share API not supported, copying to clipboard...');
        await navigator.clipboard.writeText(shareUrl);
        console.log('✅ Product link copied to clipboard');
        // Removed toast for instant experience
      } catch (error) {
        console.error('❌ Error copying to clipboard:', error);
        // Removed toast notifications for instant experience
      }
    }
  };

  return { shareProduct };
};
