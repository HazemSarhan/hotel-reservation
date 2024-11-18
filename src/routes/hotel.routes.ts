import express from 'express';
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from '../controllers/hotel.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const hotelRoutes = express.Router();

hotelRoutes.route('/').get(getAllHotels).post([authenticatedUser], createHotel);
hotelRoutes
  .route('/:id')
  .get(getHotelById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateHotel)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteHotel);

export default hotelRoutes;
