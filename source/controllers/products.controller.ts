import { Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { ExpressRequest } from '../server';
import ResponseHandler from '../util/response-handler';
import productsRepository from '../repositories/products.repository';
import UtilFunctions, { slugify } from '../util';
import ImageService from '../services/image.service';
import { IProductsDocument } from '../interfaces/products.interface';
import { Products } from '../models';
import { Types } from 'mongoose';

/**************************
 *
 * @route POST api/products/create
 * @desc Create  product - Endpoint to create a product
 * @access Public
 */

export async function createProduct(req: ExpressRequest, res: Response): Promise<Response | void> {
  try {
    const { product_name, price, quantity, description } = req.body;

    const slug: string = slugify(product_name);

    // Check if product already exists
    const product = await productsRepository.getByName({ slug });

    if (product) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: 409,
        error: `${product_name} already exists`,
      });
    }

    // Check if product image is in the form request

    let upload_product_image;

    if (req.files && req.files.product_image) {
      const product_image = req.files.product_image as UploadedFile;

      // validate image to upload
      const validateFileResult = await UtilFunctions.validateUploadedFile({ file: product_image });

      if (!validateFileResult.success) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: 400,
          error: validateFileResult.error as string,
        });
      }

      upload_product_image = await ImageService.uploadImageToS3(
        `product-${UtilFunctions.generateRandomString(7)}`,
        product_image,
        product_image.mimetype
      );
    }

    // Create Product
    const saved_product = await productsRepository.create({
      product_name,
      price,
      quantity,
      description,
      product_image: upload_product_image,
      slug,
    });

    if (saved_product) {
      return ResponseHandler.sendSuccessResponse({
        res,
        code: 201,
        message: `Successfully created product => ${product_name}`,
        data: saved_product,
      });
    }
  } catch (error: Error | unknown | any) {
    return ResponseHandler.sendErrorResponse({ res, code: 500, error: error.message });
  }
}

/**************************
 *
 * @route GET api/products/get-all
 * @desc Get all products - Endpoint to fetch all products
 * @access Public
 */

export async function getAllProducts(req: ExpressRequest, res: Response): Promise<Response | void> {
  try {
    const { data, pagination } = await productsRepository.find(req);

    return ResponseHandler.sendSuccessResponse({
      res,
      code: 200,
      message: 'Successfully fetched all products',
      data: { data, pagination },
    });
  } catch (error: Error | unknown | any) {
    return ResponseHandler.sendErrorResponse({ res, code: 500, error: error.message });
  }
}

/**************************
 *
 * @route GET api/products/get/:product_id
 * @desc Get single product - Endpoint to fetch a single product
 * @access Public
 */

export async function getSingleProduct(
  req: ExpressRequest,
  res: Response
): Promise<Response | void> {
  try {
    const getSingle = await productsRepository.getById(req.params.product_id);

    if (getSingle) {
      return ResponseHandler.sendSuccessResponse({
        res,
        code: 200,
        message: 'Successfully fetched',
        data: getSingle,
      });
    }
  } catch (error: Error | unknown | any) {
    return ResponseHandler.sendErrorResponse({ res, code: 500, error: error.message });
  }
}

/**************************
 *
 * @route PUT api/products/update/:product_id
 * @desc Update a product - Endpoint to update a  product
 * @access Public
 */
export async function updateProduct(req: ExpressRequest, res: Response): Promise<Response | void> {
  try {
    const { product_name, price, quantity, description } = req.body;
    const slug: string = slugify(product_name);

    const get = await productsRepository.getById(req.params.product_id);

    if (!get) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: 404,
        error: `Product does not exist`,
      });
    }

    // Check if product image is in the form request

    let upload_product_image;

    if (req.files && req.files.product_image) {
      const product_image = req.files.product_image as UploadedFile;

      // validate image to upload
      const validateFileResult = await UtilFunctions.validateUploadedFile({ file: product_image });

      if (!validateFileResult.success) {
        return ResponseHandler.sendErrorResponse({
          res,
          code: 400,
          error: validateFileResult.error as string,
        });
      }

      // Delete previous image from bucket

      await ImageService.deleteImageFromS3(get?.product_image);

      // Upload new image

      upload_product_image = await ImageService.uploadImageToS3(
        `product-${UtilFunctions.generateRandomString(7)}`,
        product_image,
        product_image.mimetype
      );
    } else {
      upload_product_image = get?.product_image;
    }

    const update = await productsRepository.atomicUpdate(
      new Types.ObjectId(req.params.product_id),
      {
        $set: {
          product_name: product_name ? product_name : get.product_name,
          product_image: upload_product_image,
          price: price ? price : get.price,
          quantity: quantity ? quantity : get.quantity,
          slug: product_name ? slug : get.slug,
          description: description ? description : get.description,
        },
      }
    );

    if (update) {
      return ResponseHandler.sendSuccessResponse({
        res,
        code: 201,
        message: 'Successfully updated product',
        data: update,
      });
    }
  } catch (error: Error | unknown | any) {
    return ResponseHandler.sendErrorResponse({ res, code: 500, error: error.message });
  }
}

/**************************
 *
 * @route DELETE api/products/delete/:product_id
 * @desc Delete a product - Endpoint to delete a  product
 * @access Public
 */

export async function deleteProduct(req: ExpressRequest, res: Response): Promise<Response | void> {
  try {
    const get = await productsRepository.getById(req.params.product_id);

    if (!get) {
      return ResponseHandler.sendErrorResponse({
        res,
        code: 404,
        error: `Product does not exist`,
      });
    }

    // Delete previous image from bucket

    await ImageService.deleteImageFromS3(get?.product_image);

    const delete_product = await productsRepository.deleteById(
      new Types.ObjectId(req.params.product_id)
    );

    if (delete_product) {
      return ResponseHandler.sendSuccessResponse({
        res,
        code: 201,
        message: 'Successfully deleted product',
      });
    }
  } catch (error: Error | unknown | any) {
    return ResponseHandler.sendErrorResponse({ res, code: 500, error: error.message });
  }
}
