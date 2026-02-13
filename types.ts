export interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women';
  subCategory: string;
  price: number;
  image: string;
  images: string[]; // Support for multiple images
  description: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface UserDetails {
  name: string;
  address: string;
  phone: string;
  city: string;
}

export type ViewState = 'HOME' | 'WOMEN' | 'MEN' | 'PRODUCT' | 'CART' | 'CHECKOUT' | 'CONTACT';
