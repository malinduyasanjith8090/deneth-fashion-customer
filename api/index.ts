// Use environment variable with fallback for development
const API_BASE_URL = 'https://deneth-fashion-backend.vercel.app';
export interface Product {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  category: 'Men' | 'Women';
  subCategory: string;
  sizes: string[];
  colors: string[];
  images: string[];
  isNew: boolean;
  inStock: boolean;
  stock: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  image?: string;
}

// Helper to map backend product to frontend format
const mapProduct = (product: any): Product => ({
  ...product,
  id: product._id,
  image: product.images?.[0] || '',
  stock: product.stockQuantity || 0,
});

export const api = {
  // Get all products
  getProducts: async (): Promise<{ success: boolean; products: Product[] }> => {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/api/products`); // Debug log
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      
      if (data.success && data.products) {
        const mappedProducts = data.products.map(mapProduct);
        return { success: true, products: mappedProducts };
      }
      
      return { success: false, products: [] };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, products: [] };
    }
  },

  // Get product by ID
  getProduct: async (id: string): Promise<{ success: boolean; product: Product | null }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      const data = await response.json();
      
      if (data.success && data.product) {
        return { success: true, product: mapProduct(data.product) };
      }
      
      return { success: false, product: null };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { success: false, product: null };
    }
  },

  // Get active banners
  getBanners: async (): Promise<{ success: boolean; banners: any[] }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/banners/active`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching banners:', error);
      return { success: false, banners: [] };
    }
  },

  // Get settings
  getSettings: async (): Promise<{ success: boolean; settings: any }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/banners/settings`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { success: false, settings: null };
    }
  },

  // Create order
  createOrder: async (orderData: any): Promise<{ success: boolean; orderId?: string; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error: any) {
      console.error('Error creating order:', error);
      return { success: false, message: error.message || 'Failed to create order' };
    }
  }
};