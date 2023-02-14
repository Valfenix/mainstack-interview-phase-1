import { Schema } from 'mongoose';

export const ProductsSchema: Schema = new Schema(
  {
    product_name: {
      type: String,
    },

    price: {
      type: 'Decimal128',
      default: '0.00',
    },

    quantity: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
    },

    product_image: {
      type: String,
    },

    slug: {
      type: String,
    },
  },
  { timestamps: true }
);
