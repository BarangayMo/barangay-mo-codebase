
// Marketplace type definitions
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  vendor: string;
  rating: number;
  sold?: number;
  discount?: number;
  originalPrice?: number;
}

export interface ProductCardType {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  main_image_url: string;
  average_rating?: number;
  rating_count?: number;
  sold_count?: number;
  is_active: boolean;
  tags?: string[];
  vendors?: {
    shop_name: string;
  };
  product_categories?: {
    name: string;
  };
}

export interface ProductDetailType extends ProductCardType {
  description?: string;
  additional_images?: string[];
}
