import { Document } from 'mongoose';

export interface IProducts {
  product_name: string;
  price: number;
  quantity?: number;
  description: string;
  product_image: string;
  slug: string;
}

export interface IProductsDocument extends Document, IProducts {}
