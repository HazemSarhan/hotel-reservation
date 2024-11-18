import express from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentById,
} from '../controllers/payment.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const paymentRoutes = express.Router();

paymentRoutes.route('/').post([authenticatedUser], createPayment);
paymentRoutes
  .route('/')
  .get([authenticatedUser, authorizePermissions('ADMIN')], getAllPayments);
paymentRoutes
  .route('/:id')
  .get([authenticatedUser, authorizePermissions('ADMIN')], getPaymentById);

export default paymentRoutes;
