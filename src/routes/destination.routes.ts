import express from 'express';
import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from '../controllers/destination.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const destinationRoutes = express.Router();

destinationRoutes
  .route('/')
  .get(getAllDestinations)
  .post([authenticatedUser, authorizePermissions('ADMIN')], createDestination);
destinationRoutes
  .route('/:id')
  .get(getDestinationById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateDestination)
  .delete(
    [authenticatedUser, authorizePermissions('ADMIN')],
    deleteDestination,
  );

export default destinationRoutes;
