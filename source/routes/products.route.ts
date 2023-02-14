import express from 'express';

import * as productsControllers from '../controllers/products.controller';
import * as productValidations from '../validations/product.validation';
import validateObjectId from '../validations/validateObjectId';

const router = express.Router();

router.post('/create', productValidations.validateCreateProduct, productsControllers.createProduct);
router.get(
  '/get/:product_id',
  validateObjectId.validateObjectId,
  productsControllers.getSingleProduct
);
router.get('/get-all', productsControllers.getAllProducts);

router.put(
  '/update/:product_id',
  validateObjectId.validateObjectId,
  productsControllers.updateProduct
);

router.delete(
  '/delete/:product_id',
  validateObjectId.validateObjectId,
  productsControllers.deleteProduct
);

export default router;
