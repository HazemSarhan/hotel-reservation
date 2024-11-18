import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from '../controllers/reviews.controller';
import { authenticatedUser } from '../middleware/authentication';

const reviewRoutes = express.Router();

reviewRoutes
  .route('/')
  .post([authenticatedUser], createReview)
  .get([authenticatedUser], getAllReviews);

reviewRoutes
  .route('/:id')
  .get([authenticatedUser], getReviewById)
  .patch([authenticatedUser], updateReview)
  .delete([authenticatedUser], deleteReview);

export default reviewRoutes;
