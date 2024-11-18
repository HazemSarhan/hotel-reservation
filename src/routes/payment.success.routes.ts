import express from 'express';
import { handleSuccess } from '../controllers/payment.controller';

const successRoutes = express.Router();

successRoutes.get('/success', handleSuccess);

export default successRoutes;
