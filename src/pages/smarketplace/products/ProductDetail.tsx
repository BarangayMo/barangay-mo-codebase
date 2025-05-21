
import { useState, useEffect } from "react";
import DetailPage from "../DetailPage";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const ProductDetailAdmin = () => {
  const { id } = useParams<{ id: string }>();
  // This helps simulate loading state briefly when navigating to the page
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("Admin Product Detail mounted with ID:", id);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  return (
    <>
      <Helmet>
        <title>Product Details - Smarketplace Admin</title>
      </Helmet>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-300 border-r-blue-300 animate-spin"></div>
        </div>
      ) : (
        <DetailPage type="product" />
      )}
    </>
  );
};

export default ProductDetailAdmin;
