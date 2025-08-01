export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  images: string[];
  colors?: { name: string; hex: string; }[];
}
