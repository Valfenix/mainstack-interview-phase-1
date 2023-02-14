import { Request } from 'express';
import { Types } from 'mongoose';
import { IProductsDocument } from '../interfaces/products.interface';
import { Products } from '../models';
import { ExpressRequest } from '../server';
import { convertDate } from '../util';

class ProductsRepository {
  // Create Product
  public async create({
    product_name,
    price,
    quantity,
    description,
    product_image,
    slug,
  }: {
    product_name: string;
    price: number;
    quantity?: number;
    description?: string;
    product_image?: string;
    slug: string;
  }): Promise<IProductsDocument> {
    const product = {
      product_name,
      price,
      quantity,
      description,
      product_image,
      slug,
    };

    return await Products.create(product);
  }

  // Get Product by slug
  public async getByName({ slug }: { slug: string }): Promise<IProductsDocument | null> {
    return Products.findOne({ slug });
  }

  public async atomicUpdate(product_id: Types.ObjectId, record: any) {
    return Products.findOneAndUpdate({ _id: product_id }, { ...record }, { new: true });
  }

  // Paginated Find all
  public async find(req: ExpressRequest): Promise<IProductsDocument | null | any> {
    const { query } = req;
    const perpage = Number(query.perpage) || 10;
    const page = Number(query.page) || 1;
    const dateFrom: any = query.dateFrom || 'Jan 1 1970';
    const dateTo: any = query.dateTo || `${Date()}`;
    const myDateFrom = convertDate(dateFrom);
    const myDateTo = convertDate(dateTo);

    const filterQuery = {
      createdAt: { $gte: myDateFrom, $lte: myDateTo },
    };

    const product = await Products.find(filterQuery)
      .limit(perpage)
      .skip(page * perpage - perpage);

    const total = await Products.countDocuments(filterQuery);
    return Promise.resolve({
      data: product,
      pagination: {
        hasPrevious: page > 1,
        prevPage: page - 1,
        hasNext: page < Math.ceil(total / perpage),
        next: page + 1,
        currentPage: Number(page),
        total: total,
        pageSize: perpage,
        lastPage: Math.ceil(total / perpage),
      },
    });
  }

  // Get Product by ID
  public async getById(product_id: any): Promise<IProductsDocument | null> {
    return Products.findById(product_id);
  }

  // Delete by ID
  public async deleteById(product_id: any): Promise<IProductsDocument | null> {
    return Products.findByIdAndDelete(product_id);
  }
}

export default new ProductsRepository();
