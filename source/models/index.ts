import { model } from 'mongoose';

// Products
import { ProductsSchema } from './products.model';
import { IProductsDocument } from '../interfaces/products.interface';

export const Products = model<IProductsDocument>('Products', ProductsSchema);
