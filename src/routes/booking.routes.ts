import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getAllConfirmedBookings,
  updateBookingStatus,
} from '../controllers/booking.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const bookingRoutes = express.Router();

bookingRoutes
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createBooking)
  .get([authenticatedUser, authorizePermissions('ADMIN')], getAllBookings);

bookingRoutes
  .route('/confirmed')
  .get(
    [authenticatedUser, authorizePermissions('ADMIN')],
    getAllConfirmedBookings,
  );

bookingRoutes
  .route('/:id')
  .get([authenticatedUser, authorizePermissions('ADMIN')], getBookingById)
  .patch(
    [authenticatedUser, authorizePermissions('ADMIN')],
    updateBookingStatus,
  );

export default bookingRoutes;
