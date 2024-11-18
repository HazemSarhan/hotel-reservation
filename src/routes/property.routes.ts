import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller";
import {
  authenticatedUser,
  authorizePermissions,
} from "../middleware/authentication";

const propertyRoutes = express.Router();

propertyRoutes
  .route("/")
  .get(getAllProperties)
  .post([authenticatedUser], createProperty);
propertyRoutes
  .route("/:id")
  .get(getPropertyById)
  .patch([authenticatedUser, authorizePermissions("ADMIN")], updateProperty)
  .delete([authenticatedUser, authorizePermissions("ADMIN")], deleteProperty);

export default propertyRoutes;
