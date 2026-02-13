import { Product } from './types';

export const WHATSAPP_NUMBER = '94740716403'; // Updated to Sri Lanka country code

// Helper to generate a gallery based on the main image + some generic texture/lifestyle shots
const createGallery = (mainImage: string) => [
  mainImage,
  'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=1000&auto=format&fit=crop', // Texture 1
  'https://images.unsplash.com/photo-1550921477-d64e97669d67?q=80&w=1000&auto=format&fit=crop'  // Texture 2 / Folded
];

export const MOCK_PRODUCTS: Product[] = [
  // Women's Collection
  {
    id: 'w1',
    name: 'Breezy Soft Linen Pant',
    category: 'Women',
    subCategory: 'Soft Linen Pants',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
    images: createGallery('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop'),
    description: 'Experience ultimate comfort with our signature soft linen pants. Breathable, lightweight, and perfect for any casual outing.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'White', 'Black'],
  },
  {
    id: 'w2',
    name: 'Urban Cargo Linen',
    category: 'Women',
    subCategory: 'Cargo Linen Pants',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1584370848010-d7cc637703e6?q=80&w=1000&auto=format&fit=crop',
    images: createGallery('https://images.unsplash.com/photo-1584370848010-d7cc637703e6?q=80&w=1000&auto=format&fit=crop'),
    description: 'Utility meets style. These cargo linen pants feature functional pockets and a relaxed fit for the modern woman.',
    sizes: ['S', 'M', 'L'],
    colors: ['Olive', 'Khaki', 'Black'],
    isNew: true,
  },
  {
    id: 'w3',
    name: 'Elegant Focoat Linen',
    category: 'Women',
    subCategory: 'Focoat Linen Pants',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop',
    images: createGallery('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop'),
    description: 'Structured yet comfortable. The Focoat style offers a tailored look suitable for semi-formal events.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy', 'Charcoal', 'White'],
  },
  {
    id: 'w4',
    name: 'Summer Short Linen',
    category: 'Women',
    subCategory: 'Short Linen Pants',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop',
    images: createGallery('https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop'),
    description: 'Stay cool in our linen shorts. Designed for maximum breathability on the hottest days.',
    sizes: ['S', 'M', 'L'],
    colors: ['Sand', 'Rust', 'Cream'],
  },
  
  // Men's Collection
  {
    id: 'm1',
    name: 'Classic Soft Linen Trousers',
    category: 'Men',
    subCategory: 'Soft Linen Pants',
    price: 2700,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
    images: createGallery('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop'),
    description: 'Timeless style for men. These soft linen trousers provide a relaxed fit without compromising on elegance.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Gray', 'White', 'Navy'],
    isNew: true,
  },
  {
    id: 'm2',
    name: 'Rugged Cargo Linen',
    category: 'Men',
    subCategory: 'Cargo Linen Pants',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1517445312882-56e1b050f17f?q=80&w=1000&auto=format&fit=crop',
    images: createGallery('https://images.unsplash.com/photo-1517445312882-56e1b050f17f?q=80&w=1000&auto=format&fit=crop'),
    description: 'Durable and stylish. The men’s cargo linen pants are built for adventure and everyday wear.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Army Green', 'Black', 'Stone'],
  },
   {
    id: 'm3',
    name: 'Resort Drawstring Linen',
    category: 'Men',
    subCategory: 'Soft Linen Pants',
    price: 2600,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    images: createGallery('https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop'),
    description: 'Casual elegance with an adjustable drawstring waist. Perfect for beach weddings or lounging.',
    sizes: ['M', 'L', 'XL'],
    colors: ['White', 'Light Blue'],
  },
];